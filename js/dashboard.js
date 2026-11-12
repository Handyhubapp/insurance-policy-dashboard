// Dashboard home: stats, due alert, coverage chart, recent claims, upcoming payments.

document.addEventListener('DOMContentLoaded', function () {
  var TODAY = '2026-11-11';

  renderStats();
  renderDueAlert();
  renderCoverageChart();
  renderRecentClaims();
  renderUpcomingPayments();

  function renderStats() {
    var el = document.getElementById('statsGrid');
    if (!el) return;

    var totalCoverage = POLICIES.reduce(function (sum, p) { return sum + (p.coverage || 0); }, 0);
    var activeCount = POLICIES.filter(function (p) { return p.status === 'Active'; }).length;

    var unpaid = PAYMENTS.filter(function (p) { return p.status === 'Due' || p.status === 'Overdue'; })
      .sort(function (a, b) { return a.dueDate < b.dueDate ? -1 : 1; });
    var nextDue = unpaid[0];

    var claimsOpen = CLAIMS.filter(function (c) {
      return c.status === 'In Review' || c.status === 'Approved';
    }).length;

    var nextDueValue = nextDue ? fmtMoney(nextDue.amount) : '—';
    var nextDueLabel = nextDue ? fmtDate(nextDue.dueDate) + ' · ' + (policyById(nextDue.policyId) ? policyById(nextDue.policyId).type : '') : 'Nothing due';

    var stats = [
      { label: 'Total coverage', value: fmtMoneyShort(totalCoverage), note: 'Across ' + POLICIES.length + ' policies' },
      { label: 'Active policies', value: String(activeCount), note: POLICIES.length + ' total policies' },
      { label: 'Next premium due', value: nextDueValue, note: nextDueLabel },
      { label: 'Claims in progress', value: String(claimsOpen), note: CLAIMS.length + ' claims on file' }
    ];

    el.innerHTML = stats.map(function (s) {
      return '<div class="stat-card"><p class="stat-card__label">' + s.label + '</p>' +
        '<p class="stat-card__value">' + s.value + '</p>' +
        '<p class="stat-card__note">' + s.note + '</p></div>';
    }).join('');
  }

  function renderDueAlert() {
    var el = document.getElementById('dueAlert');
    if (!el) return;

    var today = new Date(TODAY + 'T00:00:00');
    var flagged = PAYMENTS.filter(function (p) {
      if (p.status === 'Overdue') return true;
      if (p.status !== 'Due') return false;
      var due = new Date(p.dueDate + 'T00:00:00');
      var days = Math.round((due - today) / 86400000);
      return days >= 0 && days <= 30;
    }).sort(function (a, b) { return a.dueDate < b.dueDate ? -1 : 1; });

    if (!flagged.length) { el.style.display = 'none'; return; }

    // Lead with the soonest non-overdue item (auto, Nov 18) and mention overdue separately
    var parts = flagged.map(function (p) {
      var pol = policyById(p.policyId);
      var name = pol ? pol.plan : p.policyId;
      if (p.status === 'Overdue') return name + ' premium of ' + fmtMoney(p.amount) + ' was due ' + fmtDate(p.dueDate) + ' and is overdue';
      return name + ' premium of ' + fmtMoney(p.amount) + ' is due ' + fmtDate(p.dueDate);
    });

    el.innerHTML = '<strong>Payment reminder:</strong> ' + parts.join('. ') + '. ' +
      '<a href="payments.html">Review payments</a>';
    el.style.display = '';
  }

  function renderCoverageChart() {
    var el = document.getElementById('coverageChart');
    if (!el) return;

    // Group coverage by type
    var byType = {};
    POLICIES.forEach(function (p) { byType[p.type] = (byType[p.type] || 0) + (p.coverage || 0); });
    var entries = Object.keys(byType).map(function (k) { return { type: k, value: byType[k] }; })
      .sort(function (a, b) { return b.value - a.value; });
    var total = entries.reduce(function (s, e) { return s + e.value; }, 0);
    if (!total) { el.innerHTML = '<p>No coverage data.</p>'; return; }

    var colors = ['#0F4C81', '#0E7C7B', '#B7791F', '#5A6B7B', '#8296A8'];
    var size = 180, cx = size / 2, cy = size / 2, r = 70, inner = 44;
    var startAngle = -Math.PI / 2;
    var paths = '';

    function point(angle, radius) {
      return (cx + radius * Math.cos(angle)).toFixed(2) + ' ' + (cy + radius * Math.sin(angle)).toFixed(2);
    }

    entries.forEach(function (e, i) {
      var angle = (e.value / total) * Math.PI * 2;
      var endAngle = startAngle + angle;
      var large = angle > Math.PI ? 1 : 0;
      // donut segment using arcs
      paths += '<path d="M ' + point(startAngle, r) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + point(endAngle, r) +
        ' L ' + point(endAngle, inner) + ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + point(startAngle, inner) +
        ' Z" fill="' + colors[i % colors.length] + '"></path>';
      startAngle = endAngle;
    });

    var legend = entries.map(function (e, i) {
      var pct = Math.round((e.value / total) * 100);
      return '<li><span class="chart-dot" style="background:' + colors[i % colors.length] + '"></span>' +
        e.type + ' — ' + fmtMoneyShort(e.value) + ' (' + pct + '%)</li>';
    }).join('');

    el.innerHTML = '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" role="img" aria-label="Coverage by policy type">' +
      paths +
      '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="15" font-weight="700">' + fmtMoneyShort(total) + '</text>' +
      '<text x="' + cx + '" y="' + (cy + 14) + '" text-anchor="middle" font-size="10" fill="#64748b">total coverage</text></svg>' +
      '<ul class="chart-legend">' + legend + '</ul>';
  }

  function renderRecentClaims() {
    var el = document.getElementById('recentClaims');
    if (!el) return;
    var latest = CLAIMS.slice().sort(function (a, b) { return a.filedDate < b.filedDate ? 1 : -1; }).slice(0, 3);
    if (!latest.length) { el.innerHTML = '<p>No claims yet.</p>'; return; }
    el.innerHTML = latest.map(function (c) {
      return '<a class="list-row" href="claim-details.html?id=' + encodeURIComponent(c.id) + '">' +
        '<span class="list-row__main"><strong>' + escHtml(c.title) + '</strong><br><small>' + c.id + ' · Filed ' + fmtDate(c.filedDate) + '</small></span>' +
        '<span class="list-row__side">' + fmtMoney(c.claimed) + ' ' + statusBadge(c.status) + '</span></a>';
    }).join('');
  }

  function renderUpcomingPayments() {
    var el = document.getElementById('upcomingPayments');
    if (!el) return;
    var upcoming = PAYMENTS.filter(function (p) { return p.status === 'Due' || p.status === 'Overdue'; })
      .sort(function (a, b) { return a.dueDate < b.dueDate ? -1 : 1; }).slice(0, 4);
    if (!upcoming.length) { el.innerHTML = '<p>No upcoming payments.</p>'; return; }
    el.innerHTML = upcoming.map(function (p) {
      var pol = policyById(p.policyId);
      return '<a class="list-row" href="payments.html">' +
        '<span class="list-row__main"><strong>' + (pol ? escHtml(pol.plan) : p.policyId) + '</strong><br><small>Due ' + fmtDate(p.dueDate) + '</small></span>' +
        '<span class="list-row__side">' + fmtMoney(p.amount) + ' ' + statusBadge(p.status) + '</span></a>';
    }).join('');
  }
});
