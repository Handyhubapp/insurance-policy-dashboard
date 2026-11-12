// Policy details: reads ?id= and renders one policy in full.

document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('detailContent');
  if (!container) return;

  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || 'health';
  var policy = id ? policyById(id) : null;

  if (!policy) {
    container.innerHTML = '<div class="empty-state"><h2>Policy not found</h2>' +
      '<p>We could not find that policy. It may have been removed or the link is incomplete.</p>' +
      '<p><a href="policies.html">Back to policies</a></p></div>';
    return;
  }

  document.title = policy.plan + ' — Meridian Insurance';

  var schedule = PAYMENTS.filter(function (p) { return p.policyId === policy.id; })
    .sort(function (a, b) { return a.dueDate < b.dueDate ? -1 : 1; });

  var scheduleRows = schedule.length ? schedule.map(function (p) {
    return '<tr><td>' + fmtDate(p.dueDate) + '</td><td>' + fmtMoney(p.amount) + '</td><td>' + statusBadge(p.status) + '</td><td>' + (p.paidDate ? fmtDate(p.paidDate) : '—') + '</td></tr>';
  }).join('') : '<tr><td colspan="4">No premium schedule for this policy.</td></tr>';

  var beneficiaries = policy.beneficiaries && policy.beneficiaries.length
    ? '<ul class="doc-list">' + policy.beneficiaries.map(function (b) {
        return '<li><strong>' + escHtml(b.name) + '</strong> — ' + escHtml(b.relation) + ' · ' + b.share + '%</li>';
      }).join('') + '</ul>'
    : '<p>Beneficiaries do not apply to this policy. Insured: ' + escHtml(policy.insured) + '.</p>';

  var docs = policy.documents.map(function (d) {
    return '<li><strong>' + escHtml(d.name) + '</strong><br><small>' + escHtml(d.meta) + '</small></li>';
  }).join('');

  container.innerHTML =
    '<div class="detail-hero"><div><p class="detail-hero__type">' + policy.type + ' · ' + policy.number + '</p>' +
    '<h1>' + escHtml(policy.plan) + '</h1><p>Insured: ' + escHtml(policy.insured) + '</p></div>' + statusBadge(policy.status) + '</div>' +

    '<section class="card"><h2>Coverage details</h2><dl class="kv-list">' +
    kv('Policy number', policy.number) +
    kv('Coverage', fmtMoneyShort(policy.coverage) + (policy.coverageNote ? ' — ' + policy.coverageNote : '')) +
    kv('Premium', policy.premium > 0 ? fmtMoney(policy.premium) + ' · ' + policy.frequency : 'Paid in full') +
    kv('Start date', fmtDate(policy.startDate)) +
    kv('Renewal date', policy.renewalDate ? fmtDate(policy.renewalDate) : '—') +
    kv('Next payment due', policy.nextDue ? fmtDate(policy.nextDue) : 'None') +
    kv('Status', policy.status) +
    '</dl></section>' +

    '<section class="card"><h2>Premium schedule</h2><table class="table"><thead><tr><th>Due date</th><th>Amount</th><th>Status</th><th>Paid date</th></tr></thead><tbody>' +
    scheduleRows + '</tbody></table></section>' +

    '<section class="card"><h2>Beneficiaries</h2>' + beneficiaries + '</section>' +

    '<section class="card"><h2>Documents</h2><ul class="doc-list">' + docs + '</ul></section>' +

    '<p><a href="policies.html">Back to policies</a></p>';

  function kv(label, value) {
    return '<div class="kv-row"><dt>' + label + '</dt><dd>' + value + '</dd></div>';
  }
});
