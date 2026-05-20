export type ContactRecord = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: string;
  score: number;
  source: string;
  owner: string;
  lastTouch: string;
  nextStep: string;
};

export type DealRecord = {
  id: string;
  borrower: string;
  property: string;
  program: string;
  stage: string;
  amount: number;
  lenderFit: string;
  owner: string;
  risk: "Low" | "Medium" | "High";
};

export type ActivityRecord = {
  id: string;
  title: string;
  detail: string;
  owner: string;
  time: string;
};

export type InboxThread = {
  id: string;
  sender: string;
  subject: string;
  summary: string;
  status: "Needs Reply" | "Waiting" | "Escalated";
  age: string;
};

export type CalendarItem = {
  id: string;
  title: string;
  type: "Call" | "Follow-up" | "Closing" | "Review";
  date: string;
  owner: string;
};

export type AutomationItem = {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: "Live" | "Draft" | "Paused";
};

export type IntegrationItem = {
  id: string;
  name: string;
  purpose: string;
  status: "Connected" | "Planned" | "Needs Setup";
};

export const contacts: ContactRecord[] = [
  {
    id: "c1",
    name: "Michael Torres",
    company: "Atlas Buy & Hold",
    email: "michael@atlasbuyhold.com",
    phone: "(214) 555-0198",
    stage: "Options Presented",
    score: 92,
    source: "Website",
    owner: "YL",
    lastTouch: "2h ago",
    nextStep: "Review DSCR term sheet",
  },
  {
    id: "c2",
    name: "Sarah Mitchell",
    company: "Mitchell Capital Homes",
    email: "sarah@mitchellcapital.com",
    phone: "(512) 555-0144",
    stage: "Application",
    score: 88,
    source: "Referral",
    owner: "Ari",
    lastTouch: "5h ago",
    nextStep: "Collect insurance binder",
  },
  {
    id: "c3",
    name: "Jason Cole",
    company: "Cole Urban Revive",
    email: "jason@coleurban.com",
    phone: "(310) 555-0151",
    stage: "Due Diligence",
    score: 84,
    source: "Instagram",
    owner: "YL",
    lastTouch: "1d ago",
    nextStep: "Title follow-up",
  },
  {
    id: "c4",
    name: "Nina Patel",
    company: "Patel Property Group",
    email: "nina@ppg.com",
    phone: "(917) 555-0122",
    stage: "New Lead",
    score: 76,
    source: "Compare Page",
    owner: "David",
    lastTouch: "3h ago",
    nextStep: "Initial qualification call",
  },
  {
    id: "c5",
    name: "Robert Fields",
    company: "Fields Bridge Ventures",
    email: "robert@fieldsbridge.com",
    phone: "(404) 555-0137",
    stage: "Lender Outreach",
    score: 80,
    source: "Partner",
    owner: "Ari",
    lastTouch: "7h ago",
    nextStep: "Send lender box",
  },
];

export const deals: DealRecord[] = [
  {
    id: "d1",
    borrower: "Michael Torres",
    property: "312 Rosemont Ave, Dallas, TX",
    program: "DSCR Rental",
    stage: "Underwriting",
    amount: 845000,
    lenderFit: "CoreVest / Kiavi / Lima One",
    owner: "YL",
    risk: "Low",
  },
  {
    id: "d2",
    borrower: "Sarah Mitchell",
    property: "812 Canyon Ridge, Austin, TX",
    program: "Fix & Flip",
    stage: "Conditional Approval",
    amount: 1260000,
    lenderFit: "RCN / Constructive / Civic",
    owner: "Ari",
    risk: "Medium",
  },
  {
    id: "d3",
    borrower: "Jason Cole",
    property: "4411 Wilshire Blvd, Los Angeles, CA",
    program: "Bridge",
    stage: "Lender Review",
    amount: 2100000,
    lenderFit: "Anchor / Genesis / RCN",
    owner: "YL",
    risk: "High",
  },
  {
    id: "d4",
    borrower: "Nina Patel",
    property: "22 Greene St, Jersey City, NJ",
    program: "Ground Up",
    stage: "Sizing",
    amount: 3100000,
    lenderFit: "Acra / Builders Capital / Lima One",
    owner: "David",
    risk: "Medium",
  },
];

export const activities: ActivityRecord[] = [
  {
    id: "a1",
    title: "Borrower package uploaded",
    detail: "Sarah Mitchell uploaded rehab budget, insurance quote, and LLC docs.",
    owner: "Ari",
    time: "14 minutes ago",
  },
  {
    id: "a2",
    title: "Lender response received",
    detail: "RCN requested updated rent roll for Michael Torres scenario.",
    owner: "YL",
    time: "38 minutes ago",
  },
  {
    id: "a3",
    title: "Overdue task detected",
    detail: "Title follow-up for Jason Cole is overdue by 1 day.",
    owner: "System",
    time: "1 hour ago",
  },
  {
    id: "a4",
    title: "New inbound lead",
    detail: "Nina Patel entered from New Jersey lending page with a ground-up request.",
    owner: "System",
    time: "2 hours ago",
  },
];

export const inboxThreads: InboxThread[] = [
  {
    id: "i1",
    sender: "Michael Torres",
    subject: "Need updated DSCR terms before LOI expires",
    summary: "Borrower needs revised leverage and cash-out guidance today.",
    status: "Needs Reply",
    age: "27m",
  },
  {
    id: "i2",
    sender: "RCN Capital",
    subject: "Conditions for 812 Canyon Ridge",
    summary: "Lender kicked back appraisal reserve and insurance questions.",
    status: "Escalated",
    age: "1h",
  },
  {
    id: "i3",
    sender: "Nina Patel",
    subject: "Can you do 90% LTC on this new build?",
    summary: "Fresh lead asking about leverage and experience threshold.",
    status: "Needs Reply",
    age: "2h",
  },
];

export const calendarItems: CalendarItem[] = [
  {
    id: "cal1",
    title: "Michael Torres rate review",
    type: "Call",
    date: "Today · 2:30 PM",
    owner: "YL",
  },
  {
    id: "cal2",
    title: "Sarah Mitchell closing checklist",
    type: "Review",
    date: "Today · 4:00 PM",
    owner: "Ari",
  },
  {
    id: "cal3",
    title: "Jason Cole title escalation",
    type: "Follow-up",
    date: "Tomorrow · 9:00 AM",
    owner: "YL",
  },
  {
    id: "cal4",
    title: "Austin flip closing target",
    type: "Closing",
    date: "Friday · 11:00 AM",
    owner: "Ari",
  },
];

export const automations: AutomationItem[] = [
  {
    id: "auto1",
    name: "New lead speed-to-contact",
    trigger: "Form submitted",
    action: "Assign owner, create follow-up, send intro email",
    status: "Live",
  },
  {
    id: "auto2",
    name: "Missing borrower package reminder",
    trigger: "Package incomplete after 24h",
    action: "Email checklist and open task",
    status: "Live",
  },
  {
    id: "auto3",
    name: "Lender quote comparison sequence",
    trigger: "Two lender quotes saved",
    action: "Generate borrower comparison summary",
    status: "Draft",
  },
];

export const integrations: IntegrationItem[] = [
  {
    id: "int1",
    name: "Google Workspace",
    purpose: "Inbox sync, calendar sync, team auth",
    status: "Planned",
  },
  {
    id: "int2",
    name: "Twilio",
    purpose: "SMS notifications and borrower reminders",
    status: "Planned",
  },
  {
    id: "int3",
    name: "DocuSeal",
    purpose: "Borrower package signing and document routing",
    status: "Needs Setup",
  },
  {
    id: "int4",
    name: "Resend",
    purpose: "Outbound system email and follow-up delivery",
    status: "Planned",
  },
];

export const metrics = {
  openLeads: 148,
  activeLoans: 36,
  fundedThisMonth: 18,
  pipelineValue: 14250000,
  overdueTasks: 9,
  responseSla: "41m",
};
