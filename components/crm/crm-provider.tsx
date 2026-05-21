"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  activities as initialActivities,
  automations as initialAutomations,
  calendarItems as initialCalendarItems,
  contacts as initialContacts,
  deals as initialDeals,
  defaultEmailIntegrationSettings,
  documentWorkflows as initialDocumentWorkflows,
  inboxThreads as initialInboxThreads,
  integrations as initialIntegrations,
  metrics as initialMetrics,
  pipelineStages as initialPipelineStages,
  type ActivityRecord,
  type AutomationItem,
  type CalendarItem,
  type ContactRecord,
  type DealRecord,
  type DocumentWorkflow,
  type EmailIntegrationSettings,
  type InboxThread,
  type IntegrationItem,
  type PipelineStageDefinition,
} from "@/lib/mock-data";

type CrmState = {
  contacts: ContactRecord[];
  deals: DealRecord[];
  activities: ActivityRecord[];
  inboxThreads: InboxThread[];
  calendarItems: CalendarItem[];
  automations: AutomationItem[];
  integrations: IntegrationItem[];
  documentWorkflows: DocumentWorkflow[];
  emailSettings: EmailIntegrationSettings;
};

type CrmContextValue = CrmState & {
  pipelineStages: PipelineStageDefinition[];
  metrics: {
    openLeads: number;
    activeLoans: number;
    fundedThisMonth: number;
    pipelineValue: number;
    overdueTasks: number;
    responseSla: string;
  };
  addContact: (contact: Omit<ContactRecord, "id" | "lastTouch">) => void;
  addDeal: (deal: Omit<DealRecord, "id" | "lastActivity">) => void;
  moveDealToStage: (id: string, stageId: string) => void;
  updateDealStatus: (id: string, status: DealRecord["status"]) => void;
  addInboxThread: (thread: Omit<InboxThread, "id" | "age">) => void;
  addCalendarItem: (item: Omit<CalendarItem, "id">) => void;
  updateAutomationStatus: (id: string, status: AutomationItem["status"]) => void;
  updateIntegrationStatus: (id: string, status: IntegrationItem["status"]) => void;
  advanceDocumentWorkflow: (id: string) => void;
  saveEmailSettings: (settings: EmailIntegrationSettings) => void;
};

const STORAGE_KEY = "assetlift-crm-state-v1";

const defaultState: CrmState = {
  contacts: initialContacts,
  deals: initialDeals,
  activities: initialActivities,
  inboxThreads: initialInboxThreads,
  calendarItems: initialCalendarItems,
  automations: initialAutomations,
  integrations: initialIntegrations,
  documentWorkflows: initialDocumentWorkflows,
  emailSettings: defaultEmailIntegrationSettings,
};

const CrmContext = createContext<CrmContextValue | null>(null);

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CrmState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState({ ...defaultState, ...JSON.parse(raw) });
      }
    } catch {
      // Ignore malformed local storage payloads.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const value = useMemo<CrmContextValue>(() => {
    const openDeals = state.deals.filter((deal) => deal.status === "Open");
    const fundedDeals = state.deals.filter((deal) => deal.status === "Won");
    const metrics = {
      openLeads: state.contacts.length,
      activeLoans: openDeals.length,
      fundedThisMonth: fundedDeals.length || initialMetrics.fundedThisMonth,
      pipelineValue: openDeals.reduce((sum, deal) => sum + deal.amount, 0),
      overdueTasks: state.calendarItems.length,
      responseSla: initialMetrics.responseSla,
    };

    return {
      ...state,
      pipelineStages: initialPipelineStages,
      metrics,
      addContact(contact) {
        setState((current) => ({
          ...current,
          contacts: [
            {
              ...contact,
              id: createId("contact"),
              lastTouch: "Just now",
            },
            ...current.contacts,
          ],
          activities: [
            {
              id: createId("activity"),
              title: "Contact created",
              detail: `${contact.name} was added to the CRM.`,
              owner: contact.owner,
              time: "Just now",
            },
            ...current.activities,
          ],
        }));
      },
      addDeal(deal) {
        setState((current) => ({
          ...current,
          deals: [
            {
              ...deal,
              id: createId("deal"),
              lastActivity: "Just now",
            },
            ...current.deals,
          ],
          activities: [
            {
              id: createId("activity"),
              title: "Opportunity created",
              detail: `${deal.borrower} was added to the pipeline in ${deal.program}.`,
              owner: deal.owner,
              time: "Just now",
            },
            ...current.activities,
          ],
        }));
      },
      moveDealToStage(id, stageId) {
        setState((current) => ({
          ...current,
          deals: current.deals.map((deal) =>
            deal.id === id ? { ...deal, stageId, lastActivity: "Just now" } : deal
          ),
          activities: [
            {
              id: createId("activity"),
              title: "Pipeline stage updated",
              detail: "A deal moved to a new pipeline stage.",
              owner: current.deals.find((deal) => deal.id === id)?.owner ?? "System",
              time: "Just now",
            },
            ...current.activities,
          ],
        }));
      },
      updateDealStatus(id, status) {
        setState((current) => ({
          ...current,
          deals: current.deals.map((deal) =>
            deal.id === id
              ? {
                  ...deal,
                  status,
                  lastActivity: "Just now",
                  expectedClose:
                    status === "Won" ? "Closed" : status === "Lost" ? "Lost" : deal.expectedClose,
                }
              : deal
          ),
          activities: [
            {
              id: createId("activity"),
              title:
                status === "Won"
                  ? "Deal marked won"
                  : status === "Lost"
                    ? "Deal marked lost"
                    : "Deal reopened",
              detail: `Pipeline status changed to ${status}.`,
              owner: current.deals.find((deal) => deal.id === id)?.owner ?? "System",
              time: "Just now",
            },
            ...current.activities,
          ],
        }));
      },
      addInboxThread(thread) {
        setState((current) => ({
          ...current,
          inboxThreads: [
            {
              ...thread,
              id: createId("thread"),
              age: "Just now",
            },
            ...current.inboxThreads,
          ],
        }));
      },
      addCalendarItem(item) {
        setState((current) => ({
          ...current,
          calendarItems: [
            {
              ...item,
              id: createId("calendar"),
            },
            ...current.calendarItems,
          ],
        }));
      },
      updateAutomationStatus(id, status) {
        setState((current) => ({
          ...current,
          automations: current.automations.map((item) =>
            item.id === id ? { ...item, status } : item
          ),
        }));
      },
      updateIntegrationStatus(id, status) {
        setState((current) => ({
          ...current,
          integrations: current.integrations.map((item) =>
            item.id === id ? { ...item, status } : item
          ),
        }));
      },
      advanceDocumentWorkflow(id) {
        setState((current) => ({
          ...current,
          documentWorkflows: current.documentWorkflows.map((item) => {
            if (item.id !== id) return item;
            const completed = Math.min(item.completed + 1, item.total);
            return {
              ...item,
              completed,
              status: completed >= item.total ? "Template" : "Active",
            };
          }),
        }));
      },
      saveEmailSettings(settings) {
        setState((current) => ({
          ...current,
          emailSettings: settings,
        }));
      },
    };
  }, [state]);

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error("useCrm must be used inside CrmProvider");
  }
  return context;
}
