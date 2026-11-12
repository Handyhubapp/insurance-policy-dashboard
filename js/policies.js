// Policies list: search, status chips and type filter.

document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('policyGrid');
  var countEl = document.getElementById('resultCount');
  var searchEl = document.getElementById('policySearch');
  var typeEl = document.getElementById('typeFilter');
  var chips = document.querySelectorAll('.filter-chips [data-status]');
  var activeStatus = 'All';

  if (!grid) return;

  // Build type options from data if the select only has the placeholder
  if (typeEl) {
    var types = [];
    POLICIES.forEach(function (p) { if (types.indexOf(p.type) === -1) types.push(p.type); });
    var hasOptions = typeEl.options.length > 1;
    if (!hasOptions) {
      typeEl.innerHTML = '<option value="">All types</option>' + types.map(function (t) {
        return '<option value="' + t + '">' + t + '</option>';
      }).join('');
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      activeStatus = chip.getAttribute('data-status') || 'All';
      render();
    });
  });
  if (searchEl) searchEl.addEventListener('input', render);
  if (typeEl) typeEl.addEventListener('change', render);

  function matches(p) {
    var q = searchEl ? searchEl.value.trim().toLowerCase() : '';
    var typeVal = typeEl ? typeEl.value : '';
    if (activeStatus !== 'All' && p.status !== activeStatus) return false;
    if (typeVal && p.type !== typeVal) return false;
    if (q) {
      var hay = (p.number + ' ' + p.plan + ' ' + p.type).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  function render() {
    var list = POLICIES.filter(matches);
    if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' policy' : ' policies');
    if (!list.length) {
      grid.innerHTML = '<p class="empty-state">No policies match your filters.</p>';
      return;
    }
    grid.innerHTML = list.map(function (p) {
      var premium = p.premium > 0 ? fmtMoney(p.premium) + ' / ' + p.frequency.toLowerCase() : 'Paid in full';
      var due = p.nextDue ? 'Next due ' + fmtDate(p.nextDue) : 'No payment due';
      return '<article class="policy-card" data-id="' + p.id + '" tabindex="0" role="link" aria-label="View ' + escHtml(p.plan) + '">' +
        '<div class="policy-card__top"><span class="policy-card__type">' + p.type + '</span>' + statusBadge(p.status) + '</div>' +
        '<h3>' + escHtml(p.plan) + '</h3>' +
        '<p class="policy-card__number">' + p.number + '</p>' +
        '<dl class="policy-card__meta"><div class="meta-row"><dt>Coverage</dt><dd>' + fmtMoneyShort(p.coverage) + '</dd></div>' +
        '<div class="meta-row"><dt>Premium</dt><dd>' + premium + '</dd></div>' +
        '<div class="meta-row"><dt>' + due + '</dt><dd></dd></div></dl>' +
        '<span class="policy-card__link">View details</span></article>';
    }).join('');

    grid.querySelectorAll('.policy-card').forEach(function (card) {
      function go() { window.location.href = 'policy-details.html?id=' + encodeURIComponent(card.getAttribute('data-id')); }
      card.addEventListener('click', go);
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
    });
  }

  render();
});
