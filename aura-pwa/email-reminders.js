/**
 * AURA NAILS — Email Reminders (24h before appointment)
 * Firebase Cloud Function
 * 
 * Deployed as: `sendEmailReminder` (HTTP trigger or Scheduled)
 * Runs daily, sends reminders 24h before appointments
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase (if not already done)
admin.initializeApp();
const db = admin.firestore();

// Configure email (using SendGrid or Gmail SMTP)
// Replace with your actual email provider credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // or SendGrid
  auth: {
    user: process.env.EMAIL_USER, // Set in Firebase Console → Environment variables
    pass: process.env.EMAIL_PASSWORD, // App-specific password for Gmail
  },
});

/**
 * Send 24h reminder emails
 * Runs daily via Cloud Scheduler
 */
exports.sendEmailReminder = functions
  .region('europe-west1') // Closer to Slovakia
  .pubsub.schedule('0 8 * * *') // Every day at 8:00 AM
  .timeZone('Europe/Bratislava')
  .onRun(async (context) => {
    try {
      const tomorrow = getTomorrowDate();
      console.log(`[Reminders] Looking for appointments on ${tomorrow}`);

      // Find all appointments for tomorrow
      const snap = await db
        .collection('appointments')
        .where('date', '==', tomorrow)
        .get();

      if (snap.empty) {
        console.log('[Reminders] No appointments found for tomorrow.');
        return;
      }

      console.log(`[Reminders] Found ${snap.size} appointment(s).`);

      // Send email for each appointment
      for (const doc of snap.docs) {
        const appt = { id: doc.id, ...doc.data() };
        await sendReminderEmail(appt);
      }

      console.log('[Reminders] All emails sent successfully.');
    } catch (error) {
      console.error('[Reminders] Error:', error);
      throw error;
    }
  });

/**
 * HTTP endpoint to manually trigger reminders (for testing)
 */
exports.sendEmailReminderManual = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    // Security: Check auth or API key
    const apiKey = req.headers['authorization'];
    if (apiKey !== `Bearer ${process.env.MANUAL_TRIGGER_KEY}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const tomorrow = getTomorrowDate();
      const snap = await db
        .collection('appointments')
        .where('date', '==', tomorrow)
        .get();

      const sent = [];
      for (const doc of snap.docs) {
        const appt = { id: doc.id, ...doc.data() };
        await sendReminderEmail(appt);
        sent.push(appt.name);
      }

      res.json({
        success: true,
        count: sent.length,
        sent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

/**
 * Send individual reminder email
 */
async function sendReminderEmail(appointment) {
  try {
    // Get client details from appointments or clients collection
    const clientSnap = await db
      .collection('clients')
      .where('name', '==', appointment.name)
      .limit(1)
      .get();

    const client = clientSnap.docs[0]?.data() || {};
    const email = client.email || '';

    // If no email, try SMS or in-app notification instead
    if (!email) {
      console.log(`[Email] No email for ${appointment.name} — skipping.`);
      // TODO: Send SMS or in-app notification
      return;
    }

    const html = buildReminderEmailHTML(appointment);

    await transporter.sendMail({
      from: 'Aura Nails <noreply@auranails.sk>',
      to: email,
      subject: `Reminder: Termín zajtra o ${appointment.time}`,
      html,
    });

    // Log in Firestore for auditing
    await db.collection('email_logs').add({
      type: 'reminder',
      recipient: email,
      appointmentId: appointment.id,
      appointmentName: appointment.name,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'sent',
    });

    console.log(`[Email] Sent reminder to ${email} for ${appointment.name}`);
  } catch (error) {
    console.error(`[Email] Failed for ${appointment.name}:`, error);
    // Log failure
    await db.collection('email_logs').add({
      type: 'reminder',
      recipient: appointment.name,
      error: error.message,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed',
    });
  }
}

/**
 * Build HTML email template
 */
function buildReminderEmailHTML(appointment) {
  const formatTime = (time) => time || '—';
  const appointmentDate = formatDate(appointment.date);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Jost', -apple-system, sans-serif;
            background: #faf8f6;
            color: #2c2c2a;
            line-height: 1.6;
          }
          .wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(61, 61, 61, 0.12);
          }
          .header {
            background: linear-gradient(135deg, #7a6b5e 0%, #9d8b7e 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            font-family: 'Cormorant Garamond', serif;
            font-size: 28px;
            font-weight: 300;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          .eyebrow {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.8;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            color: #3d3d3d;
            margin-bottom: 20px;
            font-weight: 500;
          }
          .intro {
            font-size: 14px;
            color: #6e5b55;
            margin-bottom: 30px;
            line-height: 1.7;
          }
          .appointment-card {
            background: #faf8f6;
            border: 1px solid #e8e6e1;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
          }
          .appointment-title {
            font-size: 12px;
            text-transform: uppercase;
            color: #9d8b7e;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          .appointment-service {
            font-family: 'Cormorant Garamond', serif;
            font-size: 20px;
            color: #3d3d3d;
            font-weight: 500;
            margin-bottom: 12px;
          }
          .appointment-details {
            display: flex;
            justify-content: space-around;
            margin-top: 16px;
          }
          .detail {
            flex: 1;
          }
          .detail-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #9d8b7e;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .detail-value {
            font-size: 16px;
            color: #3d3d3d;
            font-weight: 600;
          }
          .location {
            background: rgba(157, 139, 126, 0.05);
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .location-label {
            font-size: 12px;
            text-transform: uppercase;
            color: #9d8b7e;
            font-weight: 500;
            margin-bottom: 8px;
          }
          .location-value {
            font-size: 14px;
            color: #3d3d3d;
            font-weight: 500;
          }
          .cta-button {
            display: inline-block;
            background: #3d3d3d;
            color: white;
            padding: 14px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            margin: 20px 0;
            transition: background 0.3s;
          }
          .cta-button:hover {
            background: #5a5a5a;
          }
          .secondary {
            font-size: 12px;
            color: #9d8b7e;
            margin-top: 20px;
          }
          .secondary a {
            color: #7a6b5e;
            text-decoration: none;
            border-bottom: 1px solid;
          }
          .divider {
            height: 1px;
            background: #e8e6e1;
            margin: 30px 0;
          }
          .footer {
            background: #f9f7f4;
            padding: 30px;
            border-top: 1px solid #e8e6e1;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
          .footer a {
            color: #9d8b7e;
            text-decoration: none;
            margin: 0 10px;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <div class="logo">AURA NAILS</div>
            <div class="eyebrow">Reminder</div>
          </div>

          <div class="content">
            <div class="greeting">Ahoj ${appointment.name.split(' ')[0]}! 💅</div>

            <div class="intro">
              Pripomíname ti, že máš zajtra objednaný termín v našom salóne. 
              Ak si potrebuješ zmeniť čas, stihneš to bez problémov!
            </div>

            <div class="appointment-card">
              <div class="appointment-title">Tvoj termín</div>
              <div class="appointment-service">${appointment.service}</div>
              
              <div class="appointment-details">
                <div class="detail">
                  <div class="detail-label">Dátum & Čas</div>
                  <div class="detail-value">${formatTime(appointment.time)}</div>
                  <div style="font-size: 12px; color: #9d8b7e; margin-top: 4px;">${appointmentDate}</div>
                </div>
                <div class="detail">
                  <div class="detail-label">Trvanie</div>
                  <div class="detail-value">${appointment.duration || 1}h</div>
                  <div style="font-size: 12px; color: #9d8b7e; margin-top: 4px;">Približne</div>
                </div>
              </div>
            </div>

            <div class="location">
              <div class="location-label">📍 Miesto</div>
              <div class="location-value">AURA NAILS Salon</div>
              <div style="font-size: 12px; color: #6e5b55; margin-top: 4px;">Ulica Pod Kostolom 15, Handlová</div>
            </div>

            <div style="text-align: center;">
              <a href="https://www.auranails.sk/app/" class="cta-button">Otvoriť aplikáciu</a>
              <div class="secondary">
                Nemôžeš prísť? <a href="https://www.auranails.sk/app/">Změň čas alebo zruš</a>
              </div>
            </div>

            <div class="divider"></div>

            <div style="font-size: 12px; color: #6e5b55; line-height: 1.8;">
              <strong>💡 Tip:</strong> Ak si chceš termín poznačiť do kalendára, 
              môžeš si ju stiahnuť priamo z aplikácie.
            </div>
          </div>

          <div class="footer">
            <div style="margin-bottom: 16px;">
              © 2026 Aura Nails · Všetky práva vyhradené
            </div>
            <div>
              <a href="https://www.auranails.sk">Webstránka</a> •
              <a href="https://www.auranails.sk/app/">Aplikácia</a> •
              <a href="#">Odsúhlasiť notifications</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Helper: Get tomorrow's date in ISO format
 */
function getTomorrowDate() {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Helper: Format date in Slovak
 */
function formatDate(iso) {
  const SK_DOW = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
  const SK_MON = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];
  
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dow = SK_DOW[date.getDay()];
  const mon = SK_MON[m - 1];
  
  return `${dow} ${d}. ${mon}`;
}
