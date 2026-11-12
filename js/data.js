// Shared mock data for the dashboard. Loaded before app.js on every page.

const CUSTOMER = {
  name: 'Michael Thompson',
  firstName: 'Michael',
  memberSince: '2019',
  city: 'Chicago, IL',
  email: 'michael.thompson@example.com',
  phone: '(312) 555-0148'
};

const POLICIES = [
  {
    id: 'term-life',
    number: 'POL-LF-204518',
    type: 'Life',
    plan: 'Term Life — 20 Year',
    status: 'Active',
    coverage: 500000,
    coverageNote: '$500,000 death benefit',
    premium: 86.40,
    frequency: 'Monthly',
    startDate: '2023-03-01',
    renewalDate: '2027-03-01',
    nextDue: '2026-12-01',
    insured: 'Michael Thompson',
    beneficiaries: [
      { name: 'Sarah Thompson', relation: 'Spouse', share: 70 },
      { name: 'Emma Thompson', relation: 'Daughter', share: 30 }
    ],
    documents: [
      { name: 'Policy Schedule', meta: 'PDF · 4 pages · Updated Mar 2023' },
      { name: 'Beneficiary Designation Form', meta: 'PDF · 2 pages · Signed Mar 2023' },
      { name: 'Premium Notice — December', meta: 'PDF · 1 page · Nov 2026' }
    ]
  },
  {
    id: 'annuity',
    number: 'POL-AN-108842',
    type: 'Annuity',
    plan: 'Fixed Index Annuity — IncomeShield 10',
    status: 'Active',
    coverage: 184250,
    coverageNote: 'Account value as of Nov 1, 2026',
    premium: 1200,
    frequency: 'Quarterly',
    startDate: '2021-06-15',
    renewalDate: '2031-06-15',
    nextDue: '2026-12-15',
    insured: 'Michael Thompson',
    beneficiaries: [
      { name: 'Sarah Thompson', relation: 'Spouse', share: 100 }
    ],
    documents: [
      { name: 'Contract Summary', meta: 'PDF · 12 pages · Jun 2021' },
      { name: 'Quarterly Statement — Q3 2026', meta: 'PDF · 3 pages · Oct 2026' },
      { name: 'Index Allocation Notice', meta: 'PDF · 1 page · Jun 2026' }
    ]
  },
  {
    id: 'auto',
    number: 'POL-AU-773410',
    type: 'Auto',
    plan: 'Auto — 2022 Honda Accord',
    status: 'Premium Due',
    coverage: 300000,
    coverageNote: 'Bodily injury $250,000 / $500,000 · Property damage $100,000',
    premium: 412.75,
    frequency: 'Semi-Annual',
    startDate: '2022-05-20',
    renewalDate: '2027-05-20',
    nextDue: '2026-11-18',
    insured: 'Michael Thompson, Sarah Thompson',
    beneficiaries: [],
    documents: [
      { name: 'Declarations Page', meta: 'PDF · 3 pages · May 2026' },
      { name: 'Insurance ID Cards', meta: 'PDF · 1 page · May 2026' },
      { name: 'Premium Notice — November', meta: 'PDF · 1 page · Nov 2026' }
    ]
  },
  {
    id: 'home',
    number: 'POL-HO-552091',
    type: 'Home',
    plan: 'Homeowners — 1482 W Warner Ave, Chicago',
    status: 'Active',
    coverage: 465000,
    coverageNote: 'Dwelling $465,000 · Personal property $232,500',
    premium: 1185,
    frequency: 'Annual',
    startDate: '2020-02-01',
    renewalDate: '2027-02-01',
    nextDue: '2027-02-01',
    insured: 'Michael Thompson, Sarah Thompson',
    beneficiaries: [],
    documents: [
      { name: 'Policy Declarations', meta: 'PDF · 8 pages · Feb 2026' },
      { name: 'Home Inventory Worksheet', meta: 'PDF · 5 pages · Jan 2026' },
      { name: 'Renewal Notice — 2027', meta: 'PDF · 2 pages · Nov 2026' }
    ]
  },
  {
    id: 'health',
    number: 'POL-HL-309977',
    type: 'Health',
    plan: 'Health — Silver PPO Family',
    status: 'Grace Period',
    coverage: 1000000,
    coverageNote: 'Lifetime maximum $1,000,000 · Deductible $3,500 family',
    premium: 389,
    frequency: 'Monthly',
    startDate: '2024-01-01',
    renewalDate: '2027-01-01',
    nextDue: '2026-11-01',
    insured: 'Michael Thompson, Sarah Thompson, Emma Thompson',
    beneficiaries: [],
    documents: [
      { name: 'Summary of Benefits', meta: 'PDF · 6 pages · Jan 2026' },
      { name: 'Member ID Cards', meta: 'PDF · 1 page · Jan 2026' },
      { name: 'Grace Period Notice', meta: 'PDF · 1 page · Nov 2026' }
    ]
  },
  {
    id: 'whole-life',
    number: 'POL-LF-118730',
    type: 'Life',
    plan: 'Whole Life — Paid-Up',
    status: 'Paid-Up',
    coverage: 150000,
    coverageNote: '$150,000 death benefit · Cash value $41,280',
    premium: 0,
    frequency: 'Paid in full',
    startDate: '2012-09-10',
    renewalDate: null,
    nextDue: null,
    insured: 'Michael Thompson',
    beneficiaries: [
      { name: 'Sarah Thompson', relation: 'Spouse', share: 60 },
      { name: 'Emma Thompson', relation: 'Daughter', share: 40 }
    ],
    documents: [
      { name: 'Policy Schedule', meta: 'PDF · 5 pages · Sep 2012' },
      { name: 'Paid-Up Confirmation', meta: 'PDF · 1 page · Aug 2024' },
      { name: 'Annual Statement — 2026', meta: 'PDF · 2 pages · Sep 2026' }
    ]
  }
];

const PAYMENTS = [
  { id: 'pay-01', policyId: 'health', dueDate: '2026-08-01', amount: 389, status: 'Paid', paidDate: '2026-07-30', method: 'Visa •• 4421' },
  { id: 'pay-02', policyId: 'term-life', dueDate: '2026-09-01', amount: 86.40, status: 'Paid', paidDate: '2026-08-29', method: 'Visa •• 4421' },
  { id: 'pay-03', policyId: 'health', dueDate: '2026-09-01', amount: 389, status: 'Paid', paidDate: '2026-08-31', method: 'Visa •• 4421' },
  { id: 'pay-04', policyId: 'annuity', dueDate: '2026-09-15', amount: 1200, status: 'Paid', paidDate: '2026-09-12', method: 'Bank transfer •• 8810' },
  { id: 'pay-05', policyId: 'term-life', dueDate: '2026-10-01', amount: 86.40, status: 'Paid', paidDate: '2026-09-29', method: 'Visa •• 4421' },
  { id: 'pay-06', policyId: 'health', dueDate: '2026-10-01', amount: 389, status: 'Paid', paidDate: '2026-10-01', method: 'Visa •• 4421' },
  { id: 'pay-07', policyId: 'auto', dueDate: '2026-05-18', amount: 412.75, status: 'Paid', paidDate: '2026-05-15', method: 'Visa •• 4421' },
  { id: 'pay-08', policyId: 'term-life', dueDate: '2026-11-01', amount: 86.40, status: 'Paid', paidDate: '2026-10-30', method: 'Visa •• 4421' },
  { id: 'pay-09', policyId: 'home', dueDate: '2026-02-01', amount: 1185, status: 'Paid', paidDate: '2026-01-28', method: 'Bank transfer •• 8810' },
  { id: 'pay-10', policyId: 'health', dueDate: '2026-11-01', amount: 389, status: 'Overdue', paidDate: null, method: null },
  { id: 'pay-11', policyId: 'auto', dueDate: '2026-11-18', amount: 412.75, status: 'Due', paidDate: null, method: null },
  { id: 'pay-12', policyId: 'term-life', dueDate: '2026-12-01', amount: 86.40, status: 'Due', paidDate: null, method: null },
  { id: 'pay-13', policyId: 'annuity', dueDate: '2026-12-15', amount: 1200, status: 'Due', paidDate: null, method: null },
  { id: 'pay-14', policyId: 'health', dueDate: '2026-12-01', amount: 389, status: 'Due', paidDate: null, method: null }
];

const CLAIMS = [
  {
    id: 'CLM-2026-0417',
    policyId: 'auto',
    policyNumber: 'POL-AU-773410',
    type: 'Auto',
    title: 'Collision — rear-end accident on Lake Shore Drive',
    status: 'In Review',
    dateOfLoss: '2026-10-26',
    filedDate: '2026-10-27',
    claimed: 6850,
    approved: null,
    adjuster: { name: 'Dana Whitfield', phone: '(800) 555-0162', email: 'd.whitfield@example.com' },
    summary: 'Rear-end collision at low speed. Rear bumper, trunk lid and sensor damage. No injuries reported. Estimate from body shop is being reviewed against policy coverage.',
    timeline: [
      { date: '2026-10-27', title: 'Claim filed', note: 'Claim submitted online with photos and police report number.' },
      { date: '2026-10-29', title: 'Adjuster assigned', note: 'Dana Whitfield assigned and initial call completed.' },
      { date: '2026-11-04', title: 'Estimate received', note: 'Body shop estimate received. Review in progress.' }
    ],
    documents: [
      { name: 'Police Report', meta: 'PDF · 2 pages · Oct 2026' },
      { name: 'Damage Photos (6)', meta: 'JPG · Oct 2026' },
      { name: 'Repair Estimate', meta: 'PDF · 3 pages · Nov 2026' }
    ]
  },
  {
    id: 'CLM-2026-0352',
    policyId: 'home',
    policyNumber: 'POL-HO-552091',
    type: 'Home',
    title: 'Water damage — burst pipe in kitchen',
    status: 'Approved',
    dateOfLoss: '2026-09-08',
    filedDate: '2026-09-09',
    claimed: 9400,
    approved: 8750,
    adjuster: { name: 'Marcus Bell', phone: '(800) 555-0147', email: 'm.bell@example.com' },
    summary: 'Burst supply line under the kitchen sink damaged cabinets and flooring. Mitigation completed the same week. Approved amount reflects deductible and depreciation on flooring.',
    timeline: [
      { date: '2026-09-09', title: 'Claim filed', note: 'Claim filed by phone, photos uploaded same day.' },
      { date: '2026-09-12', title: 'Inspection completed', note: 'Adjuster inspected damage and confirmed cause of loss.' },
      { date: '2026-09-24', title: 'Decision — Approved', note: 'Approved $8,750. Payment is being processed.' }
    ],
    documents: [
      { name: 'Damage Photos (12)', meta: 'JPG · Sep 2026' },
      { name: 'Plumber Invoice', meta: 'PDF · 1 page · Sep 2026' },
      { name: 'Approval Letter', meta: 'PDF · 2 pages · Sep 2026' }
    ]
  },
  {
    id: 'CLM-2026-0289',
    policyId: 'health',
    policyNumber: 'POL-HL-309977',
    type: 'Health',
    title: 'Surgery — outpatient knee procedure',
    status: 'Paid',
    dateOfLoss: '2026-07-19',
    filedDate: '2026-07-24',
    claimed: 12400,
    approved: 10230,
    adjuster: { name: 'Priya Nair', phone: '(800) 555-0193', email: 'p.nair@example.com' },
    summary: 'Outpatient arthroscopic knee surgery at an in-network facility. Plan paid $10,230 after deductible and 20% coinsurance. Patient responsibility was billed separately by the provider.',
    timeline: [
      { date: '2026-07-24', title: 'Claim filed', note: 'Provider submitted claim with procedure codes.' },
      { date: '2026-08-02', title: 'Review completed', note: 'Medical review confirmed coverage for the procedure.' },
      { date: '2026-08-14', title: 'Payment sent', note: 'Payment of $10,230 sent to provider.' }
    ],
    documents: [
      { name: 'Explanation of Benefits', meta: 'PDF · 3 pages · Aug 2026' },
      { name: 'Provider Bill', meta: 'PDF · 2 pages · Jul 2026' }
    ]
  },
  {
    id: 'CLM-2026-0113',
    policyId: 'home',
    policyNumber: 'POL-HO-552091',
    type: 'Home',
    title: 'Hail damage — roof shingles',
    status: 'Closed',
    dateOfLoss: '2026-04-11',
    filedDate: '2026-04-14',
    claimed: 15200,
    approved: 0,
    adjuster: { name: 'Marcus Bell', phone: '(800) 555-0147', email: 'm.bell@example.com' },
    summary: 'Roof inspection following spring hail found cosmetic shingle damage only, with no functional damage or leaks. Claim closed under the cosmetic damage exclusion in the policy.',
    timeline: [
      { date: '2026-04-14', title: 'Claim filed', note: 'Claim filed online after spring hail storm.' },
      { date: '2026-04-21', title: 'Roof inspection', note: 'Inspector found cosmetic damage only, no functional loss.' },
      { date: '2026-04-29', title: 'Decision — Closed', note: 'Closed with $0 payment. Cosmetic damage exclusion applies.' }
    ],
    documents: [
      { name: 'Inspection Report', meta: 'PDF · 4 pages · Apr 2026' },
      { name: 'Closure Letter', meta: 'PDF · 2 pages · Apr 2026' }
    ]
  }
];
