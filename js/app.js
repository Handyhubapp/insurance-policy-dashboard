// Shared helpers and chrome behaviour. Loaded on every page after data.js.

function fmtMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtMoneyShort(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (n >= 1000) return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
  return fmtMoney(n);
}

function fmtDate(iso) {
  if (!iso) return '—';
  var d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusBadge(status) {
  var map = {
    'Active': 'success',
    'Paid': 'success',
    'Approved': 'success',
    'Premium Due': 'info',
    'Due': 'warning',
    'Grace Period': 'warning',
    'In Review': 'warning',
    'Overdue': 'danger',
    'Denied': 'danger',
    'Paid-Up': 'neutral',
    'Closed': 'neutral'
  };
  var kind = map[status] || 'neutral';
  return '<span class="badge badge--' + kind + '">' + status + '</span>';
}

function policyById(id) {
  for (var i = 0; i < POLICIES.length; i++) {
    if (POLICIES[i].id === id) return POLICIES[i];
  }
  return null;
}

function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', function () {
  // Highlight the current page in the sidebar
  var page = window.location.pathname.split('/').pop() || 'index.html';
  if (!page) page = 'index.html';
  var links = document.querySelectorAll('.sidebar a, .sidebar__nav a, .nav-link');
  links.forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop().split('?')[0];
    if (href && href === page) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
    // Detail pages highlight their parent list page in the nav
    if (page === 'policy-details.html' && href === 'policies.html') {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
    if (page === 'claim-details.html' && href === 'claims.html') {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
    // Dashboard lives in index.html on some builds
    if ((page === 'index.html' || page === '') && (href === 'dashboard.html')) {
      a.classList.add('is-active');
    }
  });

  // Mobile sidebar toggle
  var menuBtn = document.querySelector('.topbar__menu-btn');
  var sidebar = document.querySelector('.sidebar');
  if (menuBtn && sidebar) {
    var backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }
    menuBtn.addEventListener('click', function () {
      var open = sidebar.classList.toggle('is-open');
      backdrop.classList.toggle('is-visible', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    backdrop.addEventListener('click', function () {
      sidebar.classList.remove('is-open');
      backdrop.classList.remove('is-visible');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Current year in any footer slot
  document.querySelectorAll('.js-year, #currentYear').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Greeting / customer name fill
  if (typeof CUSTOMER !== 'undefined') {
    document.querySelectorAll('.js-customer-name').forEach(function (el) {
      el.textContent = CUSTOMER.name;
    });
    document.querySelectorAll('.js-customer-first').forEach(function (el) {
      el.textContent = CUSTOMER.firstName || CUSTOMER.name.split(' ')[0];
    });
    var greeting = document.getElementById('greetingName');
    if (greeting) greeting.textContent = CUSTOMER.firstName || CUSTOMER.name.split(' ')[0];
    var member = document.getElementById('memberSince');
    if (member) member.textContent = CUSTOMER.memberSince;
  }
});
