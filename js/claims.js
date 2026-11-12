// Claims list with status filter chips.

document.addEventListener('DOMContentLoaded', function () {
  var listEl = document.getElementById('claimsList');
  if (!listEl) return;
  var chips = document.querySelectorAll('.filter-chips [data-status]');
  var activeStatus = 'All';

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      activeStatus = chip.getAttribute('data-status') || 'All';
      render();
    });
  });

  function render() {
    var list = CLAIMS.filter(function (c) {
      return activeStatus === 'All' || c.status === activeStatus;
    }).sort(function (a, b) { return a.filedDate < b.filedDate ? 1 : -1; });

    if (!list.length) {
      listEl.innerHTML = '<p class="empty-state">No claims with this status.</p>';
      return;
    }
    listEl.innerHTML = list.map(function (c) {
      var amountLine = c.approved !== null && c.approved !== undefined
        ? 'Claimed ' + fmtMoney(c.claimed) + ' · Approved ' + fmtMoney(c.approved)
        : 'Claimed ' + fmtMoney(c.claimed) + ' · Decision pending';
      return '<article class="claim-card" data-id="' + c.id + '" tabindex="0" role="link">' +
        '<div class="claim-card__top"><span>' + c.id + ' · ' + c.type + '</span>' + statusBadge(c.status) + '</div>' +
        '<h3>' + escHtml(c.title) + '</h3>' +
        '<p><small>Policy ' + c.policyNumber + ' · Loss ' + fmtDate(c.dateOfLoss) + ' · Filed ' + fmtDate(c.filedDate) + '</small></p>' +
        '<p>' + amountLine + '</p>' +
        '<span class="claim-card__link">View claim</span></article>';
    }).join('');

    listEl.querySelectorAll('.claim-card').forEach(function (card) {
      function go() { window.location.href = 'claim-details.html?id=' + encodeURIComponent(card.getAttribute('data-id')); }
      card.addEventListener('click', go);
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    });
  }

  render();
});
