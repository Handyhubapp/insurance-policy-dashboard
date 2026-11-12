// Payments: due list, history, summary totals and the pay modal.
// Paying updates the in-memory PAYMENTS array and re-renders in place.

document.addEventListener('DOMContentLoaded', function () {
  var dueList = document.getElementById('dueList');
  var historyTable = document.getElementById('historyTable');
  var summary = document.getElementById('paySummary');
  var modal = document.getElementById('payModal');
  var currentPaymentId = null;

  render();

  function render() {
    renderSummary();
    renderDue();
    renderHistory();
    bindPayButtons();
  }

  function renderSummary() {
    if (!summary) return;
    var unpaid = PAYMENTS.filter(function (p) { return p.status === 'Due' || p.status === 'Overdue'; });
    var totalDue = unpaid.reduce(function (s, p) { return s + p.amount; }, 0);
    var overdue = PAYMENTS.filter(function (p) { return p.status === 'Overdue'; })
      .reduce(function (s, p) { return s + p.amount; }, 0);
    var paidYtd = PAYMENTS.filter(function (p) {
      return p.status === 'Paid' && p.paidDate && p.paidDate.indexOf('2026') === 0;
    }).reduce(function (s, p) { return s + p.amount; }, 0);

    summary.innerHTML =
      '<div class="pay-summary__cell"><p class="pay-summary__label">Total due</p><p class="pay-summary__value">' + fmtMoney(totalDue) + '</p></div>' +
      '<div class="pay-summary__cell"><p class="pay-summary__label">Overdue</p><p class="pay-summary__value">' + fmtMoney(overdue) + '</p></div>' +
      '<div class="pay-summary__cell"><p class="pay-summary__label">Paid in 2026</p><p class="pay-summary__value">' + fmtMoney(paidYtd) + '</p></div>';
  }

  function renderDue() {
    if (!dueList) return;
    var unpaid = PAYMENTS.filter(function (p) { return p.status === 'Due' || p.status === 'Overdue'; })
      .sort(function (a, b) { return a.dueDate < b.dueDate ? -1 : 1; });
    if (!unpaid.length) {
      dueList.innerHTML = '<p class="empty-state">You are all caught up. No payments due.</p>';
      return;
    }
    dueList.innerHTML = unpaid.map(function (p) {
      var pol = policyById(p.policyId);
      return '<div class="payment-row"><div><strong>' + (pol ? escHtml(pol.plan) : p.policyId) + '</strong><br>' +
        '<small>' + (pol ? pol.number : '') + ' · Due ' + fmtDate(p.dueDate) + '</small></div>' +
        '<div>' + fmtMoney(p.amount) + ' ' + statusBadge(p.status) +
        ' <button type="button" class="btn btn--primary pay-now-btn" data-id="' + p.id + '">Pay Now</button></div></div>';
    }).join('');
  }

  function renderHistory() {
    if (!historyTable) return;
    var paid = PAYMENTS.filter(function (p) { return p.status === 'Paid'; })
      .sort(function (a, b) { return (b.paidDate || '') < (a.paidDate || '') ? -1 : 1; });
    var rows = paid.map(function (p) {
      var pol = policyById(p.policyId);
      return '<tr><td>' + fmtDate(p.paidDate) + '</td><td>' + (pol ? escHtml(pol.plan) : p.policyId) + '</td>' +
        '<td class="table__num">' + fmtMoney(p.amount) + '</td><td>' + (p.method || '—') + '</td><td>' + statusBadge(p.status) + '</td></tr>';
    }).join('');
    var tbody = historyTable.tagName === 'TBODY' ? historyTable : historyTable.querySelector('tbody');
    if (tbody) tbody.innerHTML = rows;
  }

  function bindPayButtons() {
    document.querySelectorAll('.pay-now-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { openPayModal(btn.getAttribute('data-id')); });
    });
  }

  function openPayModal(paymentId) {
    var payment = null;
    PAYMENTS.forEach(function (p) { if (p.id === paymentId) payment = p; });
    if (!payment) return;
    currentPaymentId = paymentId;
    var pol = policyById(payment.policyId);
    var amtEl = document.getElementById('payAmount');
    var polEl = document.getElementById('payPolicy');
    if (amtEl) amtEl.textContent = fmtMoney(payment.amount);
    if (polEl) polEl.textContent = pol ? pol.plan + ' (' + pol.number + ')' : payment.policyId;
    var dueEl = document.getElementById('payDue');
    if (dueEl) dueEl.textContent = fmtDate(payment.dueDate);
    // Also support inputs with those ids
    if (amtEl && amtEl.tagName === 'INPUT') amtEl.value = payment.amount.toFixed(2);
    if (!modal) return;
    modal.hidden = false;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closePayModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    currentPaymentId = null;
  }

  var confirmBtn = document.getElementById('confirmPay');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      if (!currentPaymentId) return;
      PAYMENTS.forEach(function (p) {
        if (p.id === currentPaymentId) {
          p.status = 'Paid';
          p.paidDate = '2026-11-11';
          p.method = 'Visa •• 4421';
        }
      });
      closePayModal();
      render();
    });
  }

  if (modal) {
    modal.querySelectorAll('[data-close], .modal__close, .pay-modal-close').forEach(function (btn) {
      btn.addEventListener('click', closePayModal);
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) closePayModal(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePayModal(); });

  // Expose for inline handlers if the HTML uses them
  window.openPayModal = openPayModal;
  window.closePayModal = closePayModal;
});
