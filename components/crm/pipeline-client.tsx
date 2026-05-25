"use client";

import { useMemo, useState } from "react";
import { CirclePlus, MoveRight, Sparkles, X } from "lucide-react";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";

type LenderMatchResult = {
  summary: string;
  disclaimer: string;
  matches: Array<{
    profile: string;
    fit: "High" | "Medium" | "Low";
    reason: string;
    watchouts: string[];
  }>;
  nextQuestions: string[];
};

export function PipelineClient() {
  const { addDeal, deals, moveDealToStage, pipelineStages, updateDealStatus } = useCrm();
  const [showComposer, setShowComposer] = useState(false);
  const [search, setSearch] = useState("");
  const [activeAiDealId, setActiveAiDealId] = useState<string | null>(null);
  const [aiLoadingDealId, setAiLoadingDealId] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string>("");
  const [aiMatches, setAiMatches] = useState<Record<string, LenderMatchResult>>({});
  const [form, setForm] = useState({
    borrower: "",
    company: "",
    property: "",
    program: "Bridge",
    stageId: pipelineStages[0]?.id ?? "new-lead",
    amount: "",
    lenderFit: "",
    owner: "YL",
    risk: "Medium" as "Low" | "Medium" | "High",
    status: "Open" as "Open" | "Won" | "Lost",
    source: "Manual",
    nextStep: "",
    expectedClose: "",
    tags: "",
  });

  const filteredDeals = useMemo(() => {
    const normalized = search.toLowerCase();
    return deals.filter((deal) =>
      [deal.borrower, deal.company, deal.property, deal.program, deal.nextStep]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [deals, search]);

  const openDeals = filteredDeals.filter((deal) => deal.status === "Open");
  const wonDeals = filteredDeals.filter((deal) => deal.status === "Won");
  const lostDeals = filteredDeals.filter((deal) => deal.status === "Lost");

  function submitDeal() {
    if (!form.borrower || !form.property || !form.amount) return;

    addDeal({
      borrower: form.borrower,
      company: form.company || form.borrower,
      property: form.property,
      program: form.program,
      stageId: form.stageId,
      amount: Number(form.amount),
      lenderFit: form.lenderFit,
      owner: form.owner,
      risk: form.risk,
      status: form.status,
      source: form.source,
      nextStep: form.nextStep || "Review and schedule follow-up",
      expectedClose: form.expectedClose || "TBD",
      tags: form.tags
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    });

    setForm({
      borrower: "",
      company: "",
      property: "",
      program: "Bridge",
      stageId: pipelineStages[0]?.id ?? "new-lead",
      amount: "",
      lenderFit: "",
      owner: "YL",
      risk: "Medium",
      status: "Open",
      source: "Manual",
      nextStep: "",
      expectedClose: "",
      tags: "",
    });
    setShowComposer(false);
  }

  async function runAiMatch(deal: (typeof deals)[number]) {
    setAiLoadingDealId(deal.id);
    setAiError("");
    setActiveAiDealId(deal.id);

    try {
      const response = await fetch("/api/ai/lender-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          borrower: deal.borrower,
          company: deal.company,
          property: deal.property,
          program: deal.program,
          amount: deal.amount,
          stage: pipelineStages.find((item) => item.id === deal.stageId)?.name ?? deal.stageId,
          risk: deal.risk,
          nextStep: deal.nextStep,
          expectedClose: deal.expectedClose,
          lenderFit: deal.lenderFit,
          source: deal.source,
          tags: deal.tags,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "AI lender match failed");
      }

      setAiMatches((current) => ({
        ...current,
        [deal.id]: payload,
      }));
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "AI lender match failed");
    } finally {
      setAiLoadingDealId(null);
    }
  }

  return (
    <div className="opps-shell">
      <Card className="opps-toolbar-card">
        <div className="opps-toolbar-top">
          <div>
            <span className="eyebrow">Step 2</span>
            <h3 className="opps-title">Deals</h3>
            <p className="opps-subtitle">
              Only add real opportunities. Keep each file small: borrower, property, amount, and next step.
            </p>
          </div>
          <div className="opps-toolbar-actions">
            <button
              type="button"
              className="primary-button opps-action-button"
              onClick={() => setShowComposer(true)}
            >
              <CirclePlus size={16} />
              Add deal
            </button>
          </div>
        </div>

        <div className="opps-filter-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search borrower, property, or next step"
          />
        </div>
      </Card>

      <div className="opps-summary-grid">
        <Card className="opps-summary-card">
          <span>Open deals</span>
          <strong>{openDeals.length}</strong>
          <p>{formatCurrency(openDeals.reduce((sum, deal) => sum + deal.amount, 0))}</p>
        </Card>
        <Card className="opps-summary-card">
          <span>Won</span>
          <strong>{wonDeals.length}</strong>
          <p>Closed deals</p>
        </Card>
        <Card className="opps-summary-card">
          <span>Lost</span>
          <strong>{lostDeals.length}</strong>
          <p>Archived deals</p>
        </Card>
      </div>

      {!deals.length ? (
        <Card className="empty-panel">
          <strong>No deals yet</strong>
          <p>Process: add a contact, create the deal here, log the inbox thread, then schedule the follow-up.</p>
        </Card>
      ) : (
        <div className="opps-board">
          {pipelineStages.map((stage) => {
            const stageDeals = openDeals.filter((deal) => deal.stageId === stage.id);

            return (
              <div key={stage.id} className="opps-column">
                <div className="opps-column-head" style={{ borderTopColor: stage.accent }}>
                  <div>
                    <span className="opps-column-label">{stage.name}</span>
                    <strong>{stageDeals.length} deals</strong>
                  </div>
                  <Badge>{formatCurrency(stageDeals.reduce((sum, deal) => sum + deal.amount, 0))}</Badge>
                </div>

                <div className="opps-column-stack">
                  {stageDeals.length ? (
                    stageDeals.map((deal) => {
                      const stageIndex = pipelineStages.findIndex((item) => item.id === deal.stageId);
                      const nextStage = pipelineStages[stageIndex + 1];

                      return (
                        <Card key={deal.id} className="opps-card">
                          <div className="opps-card-head">
                            <div>
                              <strong>{deal.borrower}</strong>
                              <p>{deal.company}</p>
                            </div>
                            <strong>{formatCurrency(deal.amount)}</strong>
                          </div>

                          <p className="opps-card-property">{deal.property}</p>

                          <div className="opps-card-meta">
                            <div>
                              <span>Program</span>
                              <strong>{deal.program}</strong>
                            </div>
                            <div>
                              <span>Stage</span>
                              <select
                                value={deal.stageId}
                                className="deal-stage-select"
                                onChange={(event) => moveDealToStage(deal.id, event.target.value)}
                              >
                                {pipelineStages.map((stageOption) => (
                                  <option key={stageOption.id} value={stageOption.id}>
                                    {stageOption.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="opps-card-meta">
                            <div>
                              <span>Next step</span>
                              <strong>{deal.nextStep || "Not set"}</strong>
                            </div>
                            <div>
                              <span>Status</span>
                              <strong>{deal.status}</strong>
                            </div>
                          </div>

                          <div className="opps-card-footer">
                            <span>{deal.expectedClose}</span>
                            <div className="opps-card-actions">
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => runAiMatch(deal)}
                                disabled={aiLoadingDealId === deal.id}
                              >
                                <Sparkles size={14} />
                                {aiLoadingDealId === deal.id ? "Matching..." : "AI lender match"}
                              </button>
                              {nextStage ? (
                                <button
                                  type="button"
                                  className="secondary-button"
                                  onClick={() => moveDealToStage(deal.id, nextStage.id)}
                                >
                                  <MoveRight size={14} />
                                  Next stage
                                </button>
                              ) : null}
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => updateDealStatus(deal.id, "Won")}
                              >
                                Funded
                              </button>
                              <button
                                type="button"
                                className="secondary-button"
                                onClick={() => updateDealStatus(deal.id, "Lost")}
                              >
                                Lost
                              </button>
                            </div>
                          </div>

                          {activeAiDealId === deal.id ? (
                            aiMatches[deal.id] ? (
                              <div className="ai-match-panel">
                                <strong>AI lender match</strong>
                                <p>{aiMatches[deal.id].summary}</p>
                                <div className="ai-match-list">
                                  {aiMatches[deal.id].matches.map((match) => (
                                    <div key={`${deal.id}-${match.profile}`} className="ai-match-item">
                                      <div className="ai-match-head">
                                        <strong>{match.profile}</strong>
                                        <Badge>{match.fit} fit</Badge>
                                      </div>
                                      <p>{match.reason}</p>
                                      {match.watchouts.length ? (
                                        <p>Watchouts: {match.watchouts.join(", ")}</p>
                                      ) : null}
                                    </div>
                                  ))}
                                </div>
                                {aiMatches[deal.id].nextQuestions.length ? (
                                  <div className="ai-match-questions">
                                    <strong>What to confirm next</strong>
                                    <ul>
                                      {aiMatches[deal.id].nextQuestions.map((question) => (
                                        <li key={question}>{question}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}
                                <p className="ai-match-disclaimer">{aiMatches[deal.id].disclaimer}</p>
                              </div>
                            ) : aiError ? (
                              <div className="empty-panel">
                                <strong>AI match unavailable</strong>
                                <p>{aiError}</p>
                              </div>
                            ) : null
                          ) : null}
                        </Card>
                      );
                    })
                  ) : (
                    <div className="opps-empty-column">
                      <span>No deals</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(wonDeals.length || lostDeals.length) ? (
        <div className="section-grid two">
          <Card>
            <SectionHeader eyebrow="Closed" title="Won deals" description="Deals you marked as won." />
            <div className="mini-list">
              {wonDeals.length ? (
                wonDeals.map((deal) => (
                  <div key={deal.id} className="mini-row">
                    <div>
                      <strong>{deal.borrower}</strong>
                      <p>{deal.property}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong>{formatCurrency(deal.amount)}</strong>
                      <p>{deal.expectedClose}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-panel">
                  <strong>No won deals yet</strong>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <SectionHeader eyebrow="Archive" title="Lost deals" description="Deals you marked as lost." />
            <div className="mini-list">
              {lostDeals.length ? (
                lostDeals.map((deal) => (
                  <div key={deal.id} className="mini-row">
                    <div>
                      <strong>{deal.borrower}</strong>
                      <p>{deal.nextStep}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong>{deal.source}</strong>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => updateDealStatus(deal.id, "Open")}
                      >
                        Reopen
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-panel">
                  <strong>No lost deals yet</strong>
                </div>
              )}
            </div>
          </Card>
        </div>
      ) : null}

      {showComposer ? (
        <div className="opps-modal-backdrop" onClick={() => setShowComposer(false)}>
          <div className="opps-modal" onClick={(event) => event.stopPropagation()}>
            <div className="opps-modal-head">
              <div>
                <span className="eyebrow">New deal</span>
                <h3>Add a real opportunity</h3>
              </div>
              <button type="button" className="icon-button" onClick={() => setShowComposer(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="opps-modal-grid">
              <input
                value={form.borrower}
                onChange={(event) => setForm((current) => ({ ...current, borrower: event.target.value }))}
                placeholder="Borrower"
              />
              <input
                value={form.company}
                onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                placeholder="Company"
              />
              <input
                value={form.property}
                onChange={(event) => setForm((current) => ({ ...current, property: event.target.value }))}
                placeholder="Property"
              />
              <input
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                placeholder="Loan amount"
              />
              <select
                value={form.program}
                onChange={(event) => setForm((current) => ({ ...current, program: event.target.value }))}
              >
                <option>Bridge</option>
                <option>DSCR Rental</option>
                <option>Fix & Flip</option>
                <option>Ground Up</option>
              </select>
              <select
                value={form.stageId}
                onChange={(event) => setForm((current) => ({ ...current, stageId: event.target.value }))}
              >
                {pipelineStages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
              <input
                value={form.nextStep}
                onChange={(event) => setForm((current) => ({ ...current, nextStep: event.target.value }))}
                placeholder="Next step"
              />
              <input
                value={form.expectedClose}
                onChange={(event) => setForm((current) => ({ ...current, expectedClose: event.target.value }))}
                placeholder="Expected close"
              />
            </div>

            <div className="opps-modal-actions">
              <button type="button" className="secondary-button" onClick={() => setShowComposer(false)}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={submitDeal}>
                Save deal
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
