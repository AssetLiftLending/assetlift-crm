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
  company: string;
  property: string;
  program: string;
  stageId: string;
  amount: number;
  lenderFit: string;
  owner: string;
  risk: "Low" | "Medium" | "High";
  status: "Open" | "Won" | "Lost";
  source: string;
  nextStep: string;
  lastActivity: string;
  expectedClose: string;
  tags: string[];
};

export type PipelineStageDefinition = {
  id: string;
  name: string;
  probability: number;
  targetDays: number;
  accent: string;
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

export type DocumentWorkflow = {
  id: string;
  name: string;
  detail: string;
  status: "Active" | "Template" | "Blocked";
  completed: number;
  total: number;
};

export type EmailIntegrationSettings = {
  providerLabel: string;
  smtpHost: string;
  smtpPort: string;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  fromName: string;
  imapHost: string;
  imapPort: string;
  imapUser: string;
  imapPass: string;
};

export const pipelineStages: PipelineStageDefinition[] = [
  {
    id: "new-lead",
    name: "New lead",
    probability: 10,
    targetDays: 1,
    accent: "#6d7a88",
  },
  {
    id: "qualified",
    name: "Qualified",
    probability: 25,
    targetDays: 2,
    accent: "#0f7c82",
  },
  {
    id: "consult-set",
    name: "Consult set",
    probability: 40,
    targetDays: 3,
    accent: "#4f74b8",
  },
  {
    id: "application",
    name: "Application",
    probability: 55,
    targetDays: 4,
    accent: "#8d63b8",
  },
  {
    id: "lender-review",
    name: "Lender review",
    probability: 68,
    targetDays: 5,
    accent: "#c76a2b",
  },
  {
    id: "conditional-approval",
    name: "Conditional approval",
    probability: 80,
    targetDays: 5,
    accent: "#bf7b1c",
  },
  {
    id: "underwriting",
    name: "Underwriting",
    probability: 88,
    targetDays: 7,
    accent: "#9e4a32",
  },
  {
    id: "closing",
    name: "Closing",
    probability: 96,
    targetDays: 4,
    accent: "#1f6d44",
  },
];

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
    company: "Atlas Buy & Hold",
    property: "312 Rosemont Ave, Dallas, TX",
    program: "DSCR Rental",
    stageId: "underwriting",
    amount: 845000,
    lenderFit: "CoreVest / Kiavi / Lima One",
    owner: "YL",
    risk: "Low",
    status: "Open",
    source: "Website",
    nextStep: "Collect final entity docs and updated appraisal.",
    lastActivity: "12 minutes ago",
    expectedClose: "May 29",
    tags: ["Refi", "DSCR", "Texas"],
  },
  {
    id: "d2",
    borrower: "Sarah Mitchell",
    company: "Mitchell Capital Homes",
    property: "812 Canyon Ridge, Austin, TX",
    program: "Fix & Flip",
    stageId: "conditional-approval",
    amount: 1260000,
    lenderFit: "RCN / Constructive / Civic",
    owner: "Ari",
    risk: "Medium",
    status: "Open",
    source: "Referral",
    nextStep: "Clear reserve and insurance conditions with lender.",
    lastActivity: "38 minutes ago",
    expectedClose: "June 3",
    tags: ["Flip", "Austin", "Urgent"],
  },
  {
    id: "d3",
    borrower: "Jason Cole",
    company: "Cole Urban Revive",
    property: "4411 Wilshire Blvd, Los Angeles, CA",
    program: "Bridge",
    stageId: "lender-review",
    amount: 2100000,
    lenderFit: "Anchor / Genesis / RCN",
    owner: "YL",
    risk: "High",
    status: "Open",
    source: "Instagram",
    nextStep: "Update title and exit strategy notes for lender box.",
    lastActivity: "1 hour ago",
    expectedClose: "June 11",
    tags: ["Bridge", "California"],
  },
  {
    id: "d4",
    borrower: "Nina Patel",
    company: "Patel Property Group",
    property: "22 Greene St, Jersey City, NJ",
    program: "Ground Up",
    stageId: "qualified",
    amount: 3100000,
    lenderFit: "Acra / Builders Capital / Lima One",
    owner: "David",
    risk: "Medium",
    status: "Open",
    source: "Compare Page",
    nextStep: "Book full consult and gather experience schedule.",
    lastActivity: "2 hours ago",
    expectedClose: "June 20",
    tags: ["Ground Up", "New Jersey"],
  },
  {
    id: "d5",
    borrower: "Robert Fields",
    company: "Fields Bridge Ventures",
    property: "1700 Howell Mill Rd, Atlanta, GA",
    program: "Bridge",
    stageId: "consult-set",
    amount: 1650000,
    lenderFit: "Anchor / RCN / Park Place",
    owner: "Ari",
    risk: "Medium",
    status: "Open",
    source: "Partner",
    nextStep: "Run lender matrix after consult.",
    lastActivity: "3 hours ago",
    expectedClose: "June 8",
    tags: ["Bridge", "Georgia"],
  },
  {
    id: "d6",
    borrower: "Olivia Green",
    company: "OG Capital",
    property: "54 Water St, Tampa, FL",
    program: "DSCR Rental",
    stageId: "closing",
    amount: 920000,
    lenderFit: "Kiavi / CoreVest",
    owner: "YL",
    risk: "Low",
    status: "Open",
    source: "Outbound",
    nextStep: "Confirm insurance and wire instructions.",
    lastActivity: "9 minutes ago",
    expectedClose: "May 24",
    tags: ["Closing", "Florida", "DSCR"],
  },
  {
    id: "d7",
    borrower: "Brian Lewis",
    company: "Lewis Redevelopment",
    property: "88 N Clark St, Chicago, IL",
    program: "Fix & Flip",
    stageId: "closing",
    amount: 1480000,
    lenderFit: "Civic / RCN",
    owner: "David",
    risk: "Low",
    status: "Won",
    source: "Referral",
    nextStep: "Funded - archive to servicing handoff.",
    lastActivity: "Yesterday",
    expectedClose: "Closed",
    tags: ["Funded", "Illinois"],
  },
  {
    id: "d8",
    borrower: "Emily Foster",
    company: "Foster Family Investments",
    property: "91 Pearl St, Boston, MA",
    program: "Bridge",
    stageId: "qualified",
    amount: 740000,
    lenderFit: "Genesis / Lima One",
    owner: "Ari",
    risk: "High",
    status: "Lost",
    source: "Website",
    nextStep: "Lost to pricing - keep on nurture track.",
    lastActivity: "2 days ago",
    expectedClose: "Lost",
    tags: ["Lost", "Pricing"],
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
    date: "Today - 2:30 PM",
    owner: "YL",
  },
  {
    id: "cal2",
    title: "Sarah Mitchell closing checklist",
    type: "Review",
    date: "Today - 4:00 PM",
    owner: "Ari",
  },
  {
    id: "cal3",
    title: "Jason Cole title escalation",
    type: "Follow-up",
    date: "Tomorrow - 9:00 AM",
    owner: "YL",
  },
  {
    id: "cal4",
    title: "Austin flip closing target",
    type: "Closing",
    date: "Friday - 11:00 AM",
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

export const documentWorkflows: DocumentWorkflow[] = [
  {
    id: "doc1",
    name: "Borrower intake pack",
    detail: "LLC docs, operating agreement, purchase contract, rehab scope, bank statements",
    status: "Active",
    completed: 4,
    total: 6,
  },
  {
    id: "doc2",
    name: "Lender submission pack",
    detail: "Executive summary, borrower profile, property analysis, exit plan, rent support",
    status: "Template",
    completed: 5,
    total: 5,
  },
  {
    id: "doc3",
    name: "Closing checklist",
    detail: "Insurance, title, payoff, vesting, wire instructions, note package",
    status: "Blocked",
    completed: 5,
    total: 7,
  },
];

export const defaultEmailIntegrationSettings: EmailIntegrationSettings = {
  providerLabel: "Google Workspace",
  smtpHost: "smtp.gmail.com",
  smtpPort: "587",
  smtpSecure: false,
  smtpUser: "",
  smtpPass: "",
  fromEmail: "",
  fromName: "AssetLift Lending",
  imapHost: "imap.gmail.com",
  imapPort: "993",
  imapUser: "",
  imapPass: "",
};

export const metrics = {
  openLeads: 148,
  activeLoans: 36,
  fundedThisMonth: 18,
  pipelineValue: 14250000,
  overdueTasks: 9,
  responseSla: "41m",
};
