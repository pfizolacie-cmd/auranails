/**
 * Aura Nails — Admin Statistics Dashboard
 * Displays comprehensive analytics with Recharts
 *
 * Props:
 *   appointments: Array of all appointments
 *   clients: Array of all clients
 *   settings: Settings with pricing info
 *   selectedDate: Currently selected date (ISO format)
 */

function StatisticsPanel({ appointments = [], clients = [], settings = {}, selectedDate = '' }) {
  const {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line,
    ScatterChart, Scatter,
  } = window.Recharts || {};

  // ──────────────────────────────────────────────────────────────
  // DATA CALCULATIONS
  // ──────────────────────────────────────────────────────────────

  // 1. SERVICE POPULARITY (Pie Chart)
  const getServiceStats = () => {
    const counts = {};
    appointments.forEach(apt => {
      counts[apt.service] = (counts[apt.service] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value);
  };

  // 2. WEEKLY TRENDS (Line Chart)
  const getWeeklyTrends = () => {
    const today = new Date();
    const weekData = {};

    for (let i = -6; i <= 0; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const day = SK_DOW[d.getDay()];
      weekData[day] = 0;
    }

    appointments.forEach(apt => {
      const d = new Date(apt.date);
      const day = SK_DOW[d.getDay()];
      if (day in weekData) weekData[day]++;
    });

    return Object.entries(weekData).map(([day, count]) => ({ day, count }));
  };

  // 3. HOURLY HEATMAP DATA
  const getHourlyDistribution = () => {
    const hours = {};
    for (let h = 8; h < 18; h++) {
      hours[`${h}:00`] = 0;
    }

    appointments.forEach(apt => {
      const hour = apt.time?.split(':')[0];
      if (hour) {
        const key = `${hour}:00`;
        if (key in hours) hours[key]++;
      }
    });

    return Object.entries(hours).map(([time, count]) => ({ time, count }));
  };

  // 4. RATINGS DISTRIBUTION
  const getRatingsStats = () => {
    const ratingCounts = { '5★': 0, '4★': 0, '3★': 0, '2★': 0, '1★': 0 };

    appointments.forEach(apt => {
      if (apt.rating) {
        const key = `${apt.rating}★`;
        if (key in ratingCounts) ratingCounts[key]++;
      }
    });

    return Object.entries(ratingCounts)
      .map(([rating, count]) => ({ rating, count }))
      .filter(d => d.count > 0);
  };

  // 5. REVENUE BY SERVICE
  const getRevenueByService = () => {
    const pricing = settings.pricing || {};
    const revenue = {};

    appointments.forEach(apt => {
      const price = parseFloat(pricing[apt.service] || 0);
      if (price > 0) {
        revenue[apt.service] = (revenue[apt.service] || 0) + price;
      }
    });

    return Object.entries(revenue)
      .map(([service, total]) => ({ service, revenue: total }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5
  };

  // 6. CLIENT LOYALTY (Visits per client)
  const getClientLoyalty = () => {
    const loyaltyMap = {};

    clients.forEach(client => {
      const visits = client.visits || 0;
      const bucket =
        visits === 0 ? '0 visits' :
        visits === 1 ? '1 visit' :
        visits <= 3 ? '2-3 visits' :
        visits <= 5 ? '4-5 visits' : '6+ visits';

      loyaltyMap[bucket] = (loyaltyMap[bucket] || 0) + 1;
    });

    return Object.entries(loyaltyMap).map(([category, count]) => ({
      category,
      count
    }));
  };

  // 7. KEY METRICS
  const metrics = {
    totalAppointments: appointments.length,
    totalClients: clients.length,
    avgVisitsPerClient: clients.length > 0
      ? (appointments.length / clients.length).toFixed(1)
      : 0,
    avgRating: appointments.length > 0
      ? (appointments.reduce((sum, a) => sum + (a.rating || 0), 0) / appointments.filter(a => a.rating).length || 0).toFixed(1)
      : 0,
    mostPopularService: getServiceStats()[0]?.name || '—',
    totalRevenue: getRevenueByService().reduce((sum, s) => sum + s.revenue, 0),
  };

  // ──────────────────────────────────────────────────────────────
  // COLORS (Aura Nails brand palette)
  // ──────────────────────────────────────────────────────────────
  const COLORS = ['#7a6b5e', '#9d8b7e', '#8c6e62', '#a89a8f', '#c4b5aa'];

  // ──────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '4px 20px 100px', overflowY: 'auto' }}>
      {/* ─── Key Metrics ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--ink)' }}>
            {metrics.totalAppointments}
          </div>
          <div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>
            Termínov spolu
          </div>
        </div>
        <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--ink)' }}>
            {metrics.totalClients}
          </div>
          <div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>
            Klientok
          </div>
        </div>
        <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--mocha)' }}>
            {metrics.avgVisitsPerClient}
          </div>
          <div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>
            Priemer návštev
          </div>
        </div>
        <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line)')}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', color: 'var(--mocha)' }}>
            {metrics.avgRating}★
          </div>
          <div style={{ fontSize: '.68rem', color: 'var(--ink-3)', letterSpacing: '.06em' }}>
            Priemer hodnotenia
          </div>
        </div>
      </div>

      {/* ─── Charts Grid ─── */}
      <div style={{ marginBottom: 30 }}>
        <h3 style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin-bottom:16px')}>
          📊 Popularita služieb
        </h3>
        <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line);min-height:300px')}>
          {PieChart && getServiceStats().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getServiceStats()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name.slice(0, 12)}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getServiceStats().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--ink-3)' }}>
              Žiadne údaje
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin-bottom:16px')}>
          📈 Trendy termínov (7 dní)
        </h3>
        <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line);min-height:300px')}>
          {LineChart && getWeeklyTrends().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getWeeklyTrends()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke={COLORS[0]} dot={{ fill: COLORS[0] }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--ink-3)' }}>
              Žiadne údaje
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin-bottom:16px')}>
          🔥 Zaneprázdnené časy
        </h3>
        <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line);min-height:300px')}>
          {BarChart && getHourlyDistribution().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getHourlyDistribution()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--ink-3)' }}>
              Žiadne údaje
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin-bottom:16px')}>
          ⭐ Hodnotenia klientov
        </h3>
        <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line);min-height:300px')}>
          {BarChart && getRatingsStats().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getRatingsStats()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--ink-3)' }}>
              Žiadne hodnotenia
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin-bottom:16px')}>
          💰 Top služby podľa príjmov
        </h3>
        <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line);min-height:300px')}>
          {BarChart && getRevenueByService().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getRevenueByService()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(2)}€`} />
                <Bar dataKey="revenue" fill={COLORS[3]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--ink-3)' }}>
              Žiadne údaje
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3 style={st('font-family:var(--font-display);font-size:1.15rem;color:var(--ink);margin-bottom:16px')}>
          🎯 Lojálnosť klientov
        </h3>
        <div style={st('border-radius:16px;padding:16px;background:var(--white);border:1px solid var(--line);min-height:300px')}>
          {BarChart && getClientLoyalty().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getClientLoyalty()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS[4]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: 'var(--ink-3)' }}>
              Žiadni klienti
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
