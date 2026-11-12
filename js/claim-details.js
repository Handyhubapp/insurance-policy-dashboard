// Claim details: progress tracker, amounts, timeline, documents, adjuster.

document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || 'CLM-2026-0417';
  var claim = null;
  CLAIMS.forEach(function (c) { if (c.id === id) claim = c; });

  var container = document.getElementById('claimContent') || document.getElementById('detailContent') || document.body;

  if (!claim) {
    var fallback = document.getElementById('claimContent') || document.getElementById('detailContent');
    if (fallback) {
      fallback.innerHTML = '<div class="empty-state"><h2>Claim not found</h2><p>We could not find that claim.</p><p><a href="claims.html">Back to claims</a></p></div>';
    }
    return;
  }

  document.title = claim.id + ' — Meridian Insurance';

  fill('claimTitle', claim.title);
  fill('claimId', claim.id);
  fill('claimStatus', claim.status);
  fill('claimSummary', claim.summary);
  fill('claimAmount', fmtMoney(claim.claimed));
  fill('claimedAmount', fmtMoney(claim.claimed));
  fill('approvedAmount', claim.approved === null ? 'Pending' : fmtMoney(claim.approved));

  var statusEl = document.getElementById('claimStatusBadge');
  if (statusEl) statusEl.innerHTML = statusBadge(claim.status);

  var metaEl = document.getElementById('claimMeta');
  if (metaEl) {
    metaEl.innerHTML = '<dl class="kv-list">' +
      '<div><dt>Claim number</dt><dd>' + claim.id + '</dd></div>' +
      '<div><dt>Policy</dt><dd>' + claim.policyNumber + '</dd></div>' +
      '<div><dt>Date of loss</dt><dd>' + fmtDate(claim.dateOfLoss) + '</dd></div>' +
      '<div><dt>Filed</dt><dd>' + fmtDate(claim.filedDate) + '</dd></div>' +
      '<div><dt>Amount claimed</dt><dd>' + fmtMoney(claim.claimed) + '</dd></div>' +
      '<div><dt>Amount approved</dt><dd>' + (claim.approved === null ? 'Pending' : fmtMoney(claim.approved)) + '</dd></div></dl>';
  }

  renderTracker();
  renderTimeline();
  renderDocs();
  renderAdjuster();

  // If the page uses a single container, build the whole view there
  var single = document.getElementById('claimContent');
  if (single && !document.getElementById('claimTimeline') && !document.getElementById('claimTracker')) {
    single.innerHTML =
      '<p><a href="claims.html">Back to claims</a></p>' +
      '<div class="detail-hero"><div><p>' + claim.id + ' · ' + claim.type + '</p><h1>' + escHtml(claim.title) + '</h1></div>' + statusBadge(claim.status) + '</div>' +
      '<div id="claimTrackerBuilt"></div>' +
      '<section class="card"><h2>Summary</h2><p>' + escHtml(claim.summary) + '</p>' +
      '<dl class="kv-list"><div><dt>Amount claimed</dt><dd>' + fmtMoney(claim.claimed) + '</dd></div>' +
      '<div><dt>Amount approved</dt><dd>' + (claim.approved === null ? 'Pending' : fmtMoney(claim.approved)) + '</dd></div>' +
      '<div><dt>Date of loss</dt><dd>' + fmtDate(claim.dateOfLoss) + '</dd></div>' +
      '<div><dt>Filed</dt><dd>' + fmtDate(claim.filedDate) + '</dd></div></dl></section>' +
      '<section class="card"><h2>Timeline</h2>' + timelineHtml() + '</section>' +
      '<section class="card"><h2>Documents</h2>' + docsHtml() + '</section>' +
      '<section class="card"><h2>Your adjuster</h2>' + adjusterHtml() + '</section>';
    var built = document.getElementById('claimTrackerBuilt');
    if (built) built.innerHTML = trackerHtml();
  }

  function fill(elId, value) {
    var el = document.getElementById(elId);
    if (el) el.textContent = value;
  }

  function trackerSteps() {
    // Returns [{label, state}] where state is done | current | pending
    if (claim.status === 'In Review') {
      return [
        { label: 'Filed', state: 'done' },
        { label: 'In Review', state: 'current' },
        { label: 'Decision', state: 'pending' },
        { label: 'Payment', state: 'pending' }
      ];
    }
    if (claim.status === 'Approved') {
      return [
        { label: 'Filed', state: 'done' },
        { label: 'In Review', state: 'done' },
        { label: 'Decision', state: 'done' },
        { label: 'Payment', state: 'pending' }
      ];
    }
    if (claim.status === 'Paid') {
      return [
        { label: 'Filed', state: 'done' },
        { label: 'In Review', state: 'done' },
        { label: 'Decision', state: 'done' },
        { label: 'Paid', state: 'done' }
      ];
    }
    // Closed
    return [
      { label: 'Filed', state: 'done' },
      { label: 'In Review', state: 'done' },
      { label: 'Decision', state: 'done' },
      { label: 'Closed', state: 'done' }
    ];
  }

  function trackerHtml() {
    var steps = trackerSteps();
    return '<ol class="tracker">' + steps.map(function (s) {
      return '<li class="tracker__step is-' + s.state + '"><span class="tracker__dot"></span><span>' + s.label + '</span></li>';
    }).join('') + '</ol>';
  }

  function renderTracker() {
    var el = document.getElementById('claimTracker') || document.getElementById('tracker');
    if (el) el.innerHTML = trackerHtml();
  }

  function timelineHtml() {
    return '<ol class="timeline">' + claim.timeline.map(function (t) {
      return '<li><p><strong>' + escHtml(t.title) + '</strong> · ' + fmtDate(t.date) + '</p><p>' + escHtml(t.note) + '</p></li>';
    }).join('') + '</ol>';
  }

  function renderTimeline() {
    var el = document.getElementById('claimTimeline');
    if (el) el.innerHTML = timelineHtml();
  }

  function docsHtml() {
    return '<ul class="doc-list">' + claim.documents.map(function (d) {
      return '<li><strong>' + escHtml(d.name) + '</strong><br><small>' + escHtml(d.meta) + '</small></li>';
    }).join('') + '</ul>';
  }

  function renderDocs() {
    var el = document.getElementById('claimDocuments') || document.getElementById('claimDocs');
    if (el) el.innerHTML = docsHtml();
  }

  function adjusterHtml() {
    var a = claim.adjuster;
    return '<p><strong>' + escHtml(a.name) + '</strong></p><p>' + escHtml(a.phone) + '<br>' + escHtml(a.email) + '</p>';
  }

  function renderAdjuster() {
    var el = document.getElementById('adjusterCard');
    if (el) el.innerHTML = '<h3>Your adjuster</h3>' + adjusterHtml();
  }
});
