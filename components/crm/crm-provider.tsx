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
  type ActivityRecord,
  type AutomationItem,
  type CalendarItem,
  type ContactRecord,
  type DealRecord,
  type DocumentWorkflow,
  type EmailIntegrationSettings,
  type InboxThread,
  type IntegrationItem,
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
  metrics: {
    openLeads: number;
    activeLoans: number;
    fundedThisMonth: number;
    pipelineValue: number;
    overdueTasks: number;
    responseSla: string;
  };
  addContact: (contact: Omit<ContactRecord, "id" | "lastTouch">) => void;
  updateDealStage: (id: string, stage: string) => void;
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
    const metrics = {
      openLeads: state.contacts.length,
      activeLoans: state.deals.length,
      fundedThisMonth: initialMetrics.fundedThisMonth,
      pipelineValue: state.deals.reduce((sum, deal) => sum + deal.amount, 0),
      overdueTasks: state.calendarItems.length,
      responseSla: initialMetrics.responseSla,
    };

    return {
      ...state,
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
      updateDealStage(id, stage) {
        setState((current) => ({
          ...current,
          deals: current.deals.map((deal) =>
            deal.id === id ? { ...deal, stage } : deal
          ),
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
