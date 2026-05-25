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
  snippet?: string;
  direction?: "inbound" | "outbound";
  sentAt?: string;
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
  googleConnected?: boolean;
  googleEmail?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleTokenExpiry?: number;
};

export const pipelineStages: PipelineStageDefinition[] = [
  {
    id: "new-lead",
    name: "New lead",
    probability: 10,
    targetDays: 1,
    accent: "#2563eb",
  },
  {
    id: "info-gathering",
    name: "Info gathering",
    probability: 20,
    targetDays: 2,
    accent: "#0f7c82",
  },
  {
    id: "lender-outreach",
    name: "Lender outreach",
    probability: 35,
    targetDays: 3,
    accent: "#7c3aed",
  },
  {
    id: "options-presented",
    name: "Options presented",
    probability: 50,
    targetDays: 2,
    accent: "#c76a2b",
  },
  {
    id: "application",
    name: "Application",
    probability: 65,
    targetDays: 4,
    accent: "#ca8a04",
  },
  {
    id: "approved",
    name: "Approved",
    probability: 80,
    targetDays: 3,
    accent: "#059669",
  },
  {
    id: "due-diligence",
    name: "Due diligence",
    probability: 90,
    targetDays: 5,
    accent: "#4f46e5",
  },
  {
    id: "funded",
    name: "Funded",
    probability: 100,
    targetDays: 1,
    accent: "#16a34a",
  },
  {
    id: "lost",
    name: "Lost",
    probability: 0,
    targetDays: 1,
    accent: "#dc2626",
  },
];

export const contacts: ContactRecord[] = [
];

export const deals: DealRecord[] = [
];

export const activities: ActivityRecord[] = [
];

export const inboxThreads: InboxThread[] = [
];

export const calendarItems: CalendarItem[] = [
];

export const automations: AutomationItem[] = [
];

export const integrations: IntegrationItem[] = [
];

export const documentWorkflows: DocumentWorkflow[] = [
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
  googleConnected: false,
  googleEmail: "",
  googleAccessToken: "",
  googleRefreshToken: "",
  googleTokenExpiry: 0,
};

export const metrics = {
  openLeads: 0,
  activeLoans: 0,
  fundedThisMonth: 0,
  pipelineValue: 0,
  overdueTasks: 0,
  responseSla: "Not tracked",
};
