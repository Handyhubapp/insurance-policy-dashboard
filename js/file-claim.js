// File a claim: policy select, validation and success panel.

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('claimForm') || document.querySelector('form');
  var policySelect = document.getElementById('claimPolicy');
  var successPanel = document.getElementById('successPanel');

  // Only policies that can take a new claim
  var eligible = POLICIES.filter(function (p) {
    return p.status === 'Active' || p.status === 'Premium Due' || p.status === 'Grace Period';
  });

  if (policySelect) {
    var current = policySelect.value;
    policySelect.innerHTML = '<option value="">Select a policy</option>' + eligible.map(function (p) {
      return '<option value="' + p.id + '">' + escHtml(p.plan) + ' (' + p.number + ')</option>';
    }).join('');
    if (current) policySelect.value = current;
  }

  // Optional live character count for the description
  var desc = fieldEl(['claimDesc', 'claimDescription', 'description', 'lossDescription']);
  var counter = document.getElementById('descCount') || document.getElementById('charCount');
  if (desc && counter) {
    desc.addEventListener('input', function () { counter.textContent = desc.value.length + ' characters'; });
  }

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var policyEl = policySelect || fieldEl(['claimPolicy']);
    var typeEl = fieldEl(['claimType', 'lossType', 'claimLossType']);
    var dateEl = fieldEl(['lossDate', 'dateOfLoss', 'claimDate']);
    var amountEl = fieldEl(['claimAmount', 'lossAmount', 'amount']);
    var descEl = desc;

    var valid = true;

    if (!policyEl || !policyEl.value) { setError('policy', 'Please select a policy.'); setError('claimPolicy', 'Please select a policy.'); valid = false; }
    if (!typeEl || !typeEl.value) { setError('type', 'Please select a loss type.'); setError('lossType', 'Please select a loss type.'); setError('claimType', 'Please select a loss type.'); valid = false; }

    var dateVal = dateEl ? dateEl.value : '';
    if (!dateVal) {
      setError('date', 'Please enter the date of loss.'); setError('lossDate', 'Please enter the date of loss.'); setError('dateOfLoss', 'Please enter the date of loss.');
      valid = false;
    } else if (dateVal > '2026-11-11') {
      // Future check against today; also reject anything after the real today
      var d = new Date(dateVal + 'T00:00:00');
      var now = new Date(); now.setHours(23, 59, 59, 999);
      if (d > now) {
        setError('date', 'Date of loss cannot be in the future.'); setError('lossDate', 'Date of loss cannot be in the future.'); setError('dateOfLoss', 'Date of loss cannot be in the future.');
        valid = false;
      }
    }

    var amount = amountEl ? parseFloat(amountEl.value) : NaN;
    if (!amountEl || isNaN(amount) || amount <= 0) {
      setError('amount', 'Enter an estimated amount greater than $0.'); setError('claimAmount', 'Enter an estimated amount greater than $0.');
      valid = false;
    }

    var descVal = descEl ? descEl.value.trim() : '';
    if (descVal.length < 20) {
      setError('description', 'Please describe what happened (at least 20 characters).');
      setError('claimDescription', 'Please describe what happened (at least 20 characters).');
      valid = false;
    }

    if (!valid) return;

    var ref = 'CLM-2026-' + String(Math.floor(1000 + Math.random() * 9000));
    var policy = policyById(policyEl.value);
    var summaryText = 'Your claim for ' + (policy ? policy.plan : 'your policy') +
      ' was received. Reference: ' + ref + '. Estimated amount: ' + fmtMoney(amount) +
      '. An adjuster will contact you within 2 business days.';

    form.style.display = 'none';
    if (successPanel) {
      successPanel.style.display = 'block';
      successPanel.classList.add('is-visible');
      var refEl = successPanel.querySelector('.claim-ref') || document.getElementById('claimRef');
      if (refEl) refEl.textContent = ref;
      var sumEl = document.getElementById('successSummary') || successPanel.querySelector('p');
      if (sumEl) sumEl.textContent = summaryText;
      successPanel.setAttribute('data-ref', ref);
    } else {
      var div = document.createElement('div');
      div.className = 'success-panel';
      div.innerHTML = '<h2>Claim submitted</h2><p>' + summaryText + '</p>';
      form.parentNode.appendChild(div);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function fieldEl(ids) {
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) return el;
    }
    return null;
  }

  function setError(field, msg) {
    var el = document.getElementById('err-' + field);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
    });
  }
});
