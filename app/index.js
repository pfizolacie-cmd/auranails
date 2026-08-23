/**
 * AURA NAILS — Email Reminders Cloud Function
 * Firebase Cloud Function for sending 24h reminder emails
 * 
 * Deploy: firebase deploy --only functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Initialize Firebase
admin.initializeApp();
const db = admin.firestore();

// Get config from Firebase
const config = functions.config();
const EMAIL_USER = config.gmail?.user || process.env.EMAIL_USER;
const EMAIL_PASSWORD = config.gmail?.password || process.env.EMAIL_PASSWORD;

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

/**
 * Send 24h reminder emails via Cloud Scheduler (Pub/Sub)
 * Runs daily at 8:00 AM Central Europe Time
 */
exports.sendEmailReminder = functions
  .region("europe-west1")
  .pubsub.schedule("0 8 * * *")
  .timeZone("Europe/Bratislava")
  .onRun(async (context) => {
    console.log("[Reminders] Starting email reminder check...");
    
    try {
      const tomorrow = getTomorrowDate();
      console.log(`[Reminders] Looking for appointments on ${tomorrow}`);

      // Find all appointments for tomorrow
      const snap = await db
        .collection("appointments")
        .where("date", "==", tomorrow)
        .get();

      if (snap.empty) {
        console.log("[Reminders] No appointments found for tomorrow.");
        return;
      }

      console.log(`[Reminders] Found ${snap.size} appointment(s).`);

      // Send email for each appointment
      let sent = 0;
      for (const doc of snap.docs) {
        const appt = { id: doc.id, ...doc.data() };
        try {
          await sendReminderEmail(appt);
          sent++;
        } catch (err) {
          console.error(`[Reminders] Error sending to ${appt.name}:`, err);
        }
      }

      console.log(`[Reminders] Sent ${sent}/${snap.size} emails successfully.`);
      return { success: true, sent, total: snap.size };
    } catch (error) {
      console.error("[Reminders] Critical error:", error);
      throw error;
    }
  });

/**
 * HTTP endpoint to manually trigger reminders (for testing)
 * Usage: curl -H "Authorization: Bearer YOUR_SECRET" https://...
 */
exports.sendEmailReminderManual = functions
  .region("europe-west1")
  .https.onRequest(async (req, res) => {
    // Security check
    const apiKey = req.headers["authorization"];
    const secretKey = config.manual?.trigger?.key || "default-secret-key";
    
    if (apiKey !== `Bearer ${secretKey}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const tomorrow = getTomorrowDate();
      const snap = await db
        .collection("appointments")
        .where("date", "==", tomorrow)
        .get();

      const sent = [];
      for (const doc of snap.docs) {
        const appt = { id: doc.id, ...doc.data() };
        try {
          await sendReminderEmail(appt);
          sent.push(appt.name);
        } catch (err) {
          console.error(`[Manual] Error for ${appt.name}:`, err);
        }
      }

      res.json({
        success: true,
        count: sent.length,
        sent,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Manual] Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

/**
 * Send individual reminder email
 */
async function sendReminderEmail(appointment) {
  try {
    // Get client email
    const clientSnap = await db
      .collection("clients")
      .where("name", "==", appointment.name)
      .limit(1)
      .get();

    const client = clientSnap.docs[0]?.data() || {};
    const email = client.email || "";

    if (!email) {
      console.log(`[Email] No email found for ${appointment.name} — skipping`);
      return;
    }

    const html = buildReminderEmailHTML(appointment);
    const result = await transporter.sendMail({
      from: "Aura Nails <" + EMAIL_USER + ">",
      to: email,
      subject: `Reminder: Termín zajtra o ${appointment.time}`,
      html,
      replyTo: EMAIL_USER,
    });

    // Log success
    await db.collection("email_logs").add({
      type: "reminder",
      recipient: email,
      clientName: appointment.name,
      appointmentId: appointment.id,
      service: appointment.service,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "sent",
      messageId: result.messageId,
    });

    console.log(`[Email] ✓ Sent to ${email}`);
  } catch (error) {
    console.error(`[Email] Failed for ${appointment.name}:`, error);
    
    await db.collection("email_logs").add({
      type: "reminder",
      clientName: appointment.name,
      error: error.message,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "failed",
    });

    throw error;
  }
}

/**
 * Build HTML email template
 */
function buildReminderEmailHTML(appointment) {
  const appointmentDate = formatDate(appointment.date);
  const appointmentTime = appointment.time || "—";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Jost', -apple-system, sans-serif; background: #faf8f6; color: #2c2c2a; }
          .wrapper { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(61,61,61,0.12); }
          .header { background: linear-gradient(135deg, #7a6b5e 0%, #9d8b7e 100%); color: white; padding: 40px 30px; text-align: center; }
          .logo { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; letter-spacing: 2px; margin-bottom: 8px; }
          .eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
          .content { padding: 40px 30px; }
          .appointment-card { background: #faf8f6; border: 1px solid #e8e6e1; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
          .appointment-service { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #3d3d3d; font-weight: 500; margin: 12px 0; }
          .detail-label { font-size: 10px; text-transform: uppercase; color: #9d8b7e; letter-spacing: 0.5px; }
          .detail-value { font-size: 16px; color: #3d3d3d; font-weight: 600; }
          .cta-button { display: inline-block; background: #3d3d3d; color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin: 20px 0; }
          .footer { background: #f9f7f4; padding: 30px; border-top: 1px solid #e8e6e1; font-size: 12px; color: #999; text-align: center; }
          .footer a { color: #9d8b7e; text-decoration: none; margin: 0 10px; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <div class="logo">AURA NAILS</div>
            <div class="eyebrow">Reminder</div>
          </div>

          <div class="content">
            <div style="font-size: 18px; color: #3d3d3d; margin-bottom: 20px; font-weight: 500;">
              Ahoj ${appointment.name.split(" ")[0]}! 💅
            </div>

            <p style="font-size: 14px; color: #6e5b55; margin-bottom: 30px; line-height: 1.7;">
              Pripomíname ti, že máš zajtra objednaný termín v našom salóne.
            </p>

            <div class="appointment-card">
              <div class="detail-label">Tvoj termín</div>
              <div class="appointment-service">${appointment.service}</div>
              
              <div style="margin-top: 16px;">
                <div class="detail-label">Dátum & Čas</div>
                <div class="detail-value">${appointmentTime}</div>
                <div style="font-size: 12px; color: #9d8b7e; margin-top: 4px;">${appointmentDate}</div>
              </div>
              
              ${appointment.duration ? `
              <div style="margin-top: 16px;">
                <div class="detail-label">Trvanie</div>
                <div class="detail-value">${appointment.duration}h</div>
                <div style="font-size: 12px; color: #9d8b7e; margin-top: 4px;">Približne</div>
              </div>
              ` : ''}
            </div>

            <div style="text-align: center;">
              <a href="https://www.auranails.sk/app/" class="cta-button">Otvoriť aplikáciu</a>
              <div style="font-size: 12px; color: #9d8b7e; margin-top: 20px;">
                Nemôžeš prísť? <a href="https://www.auranails.sk/app/" style="color: #7a6b5e; text-decoration: none; border-bottom: 1px solid;">Změň čas alebo zruš</a>
              </div>
            </div>
          </div>

          <div class="footer">
            <div style="margin-bottom: 16px;">
              © 2026 Aura Nails · Všetky práva vyhradené
            </div>
            <div>
              <a href="https://www.auranails.sk">Web</a> •
              <a href="https://www.auranails.sk/app/">App</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Helper: Get tomorrow's date in ISO format (YYYY-MM-DD)
 */
function getTomorrowDate() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split("T")[0];
}

/**
 * Helper: Format date in Slovak (e.g., "Po 24. aug")
 */
function formatDate(iso) {
  const SK_DOW = ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"];
  const SK_MON = [
    "jan", "feb", "mar", "apr", "máj", "jún",
    "júl", "aug", "sep", "okt", "nov", "dec"
  ];

  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dow = SK_DOW[date.getDay()];
  const mon = SK_MON[m - 1];

  return `${dow} ${d}. ${mon}`;
}
