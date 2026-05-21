"use client";

import { useMemo, useState } from "react";
import { CirclePlus, Filter, Goal, MoveRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";
import { formatCompact, formatCurrency } from "@/lib/utils";

export function PipelineClient() {
  const { addDeal, deals, moveDealToStage, pipelineStages, updateDealStatus } = useCrm();
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"Open" | "Won" | "Lost" | "All">("Open");
  const [activeStage, setActiveStage] = useState("All");
  const [showComposer, setShowComposer] = useState(false);
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
    source: "Website",
    nextStep: "",
    expectedClose: "",
    tags: "",
  });

  const owners = useMemo(
    () => ["All", ...Array.from(new Set(deals.map((deal) => deal.owner)))],
    [deals]
  );

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const searchStack = [
        deal.borrower,
        deal.company,
        deal.property,
        deal.program,
        deal.source,
        ...deal.tags,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchStack.includes(search.toLowerCase());
      const matchesOwner = ownerFilter === "All" || deal.owner === ownerFilter;
      const matchesStatus = statusFilter === "All" || deal.status === statusFilter;
      const matchesStage = activeStage === "All" || deal.stageId === activeStage;

      return matchesSearch && matchesOwner && matchesStatus && matchesStage;
    });
  }, [activeStage, deals, ownerFilter, search, statusFilter]);

  const openDeals = filteredDeals.filter((deal) => deal.status === "Open");
  const wonDeals = filteredDeals.filter((deal) => deal.status === "Won");
  const lostDeals = filteredDeals.filter((deal) => deal.status === "Lost");

  const weightedValue = openDeals.reduce((sum, deal) => {
    const stage = pipelineStages.find((item) => item.id === deal.stageId);
    return sum + deal.amount * ((stage?.probability ?? 0) / 100);
  }, 0);

  const averageDealSize = openDeals.length
    ? Math.round(openDeals.reduce((sum, deal) => sum + deal.amount, 0) / openDeals.length)
    : 0;

  function stageName(stageId: string) {
    return pipelineStages.find((stage) => stage.id === stageId)?.name ?? stageId;
  }

  function submitDeal() {
    if (!form.borrower || !form.property || !form.amount) return;

    addDeal({
      borrower: form.borrower,
      company: form.company || form.borrower,
      property: form.property,
      program: form.program,
      stageId: form.stageId,
      amount: Number(form.amount),
      lenderFit: form.lenderFit || "Needs lender routing",
      owner: form.owner,
      risk: form.risk,
      status: form.status,
      source: form.source,
      nextStep: form.nextStep || "Schedule borrower follow-up.",
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
      source: "Website",
      nextStep: "",
      expectedClose: "",
      tags: "",
    });
    setShowComposer(false);
  }

  return (
    <div className="opps-shell">
      <Card className="opps-toolbar-card">
        <div className="opps-toolbar-top">
          <div>
            <span className="eyebrow">Opportunity pipeline</span>
            <h3 className="opps-title">Operator board for borrower deals, lender routing, and close visibility</h3>
            <p className="opps-subtitle">
              Built to behave like a real opportunities workspace: filter first, scan fast, move cards, and keep won/lost outcomes tracked.
            </p>
          </div>
          <div className="opps-toolbar-actions">
            <button type="button" className="secondary-button opps-action-button">
              <SlidersHorizontal size={16} />
              Board settings
            </button>
            <button
              type="button"
              className="primary-button opps-action-button"
              onClick={() => setShowComposer(true)}
            >
              <CirclePlus size={16} />
              New opportunity
            </button>
          </div>
        </div>

        <div className="opps-filter-row">
          <label className="opps-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contact, company, property, source, tag, or program"
            />
          </label>
          <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner === "All" ? "All owners" : owner}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "Open" | "Won" | "Lost" | "All")
            }
          >
            <option value="Open">Open opportunities</option>
            <option value="All">All statuses</option>
            <option value="Won">Won only</option>
            <option value="Lost">Lost only</option>
          </select>
          <button type="button" className="secondary-button opps-action-button">
            <Filter size={16} />
            Advanced filters
          </button>
        </div>

        <div className="opps-stage-strip">
          <button
            type="button"
            className={activeStage === "All" ? "opps-stage-chip active" : "opps-stage-chip"}
            onClick={() => setActiveStage("All")}
          >
            All stages
          </button>
          {pipelineStages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              className={activeStage === stage.id ? "opps-stage-chip active" : "opps-stage-chip"}
              onClick={() => setActiveStage(stage.id)}
            >
              {stage.name}
            </button>
          ))}
        </div>
      </Card>

      <div className="opps-summary-grid">
        <Card className="opps-summary-card">
          <span>Open value</span>
          <strong>{formatCurrency(openDeals.reduce((sum, deal) => sum + deal.amount, 0))}</strong>
          <p>{openDeals.length} active opportunities</p>
        </Card>
        <Card className="opps-summary-card">
          <span>Weighted forecast</span>
          <strong>{formatCurrency(Math.round(weightedValue))}</strong>
          <p>Probability adjusted pipeline</p>
        </Card>
        <Card className="opps-summary-card">
          <span>Average size</span>
          <strong>{formatCurrency(averageDealSize)}</strong>
          <p>Average open opportunity amount</p>
        </Card>
        <Card className="opps-summary-card">
          <span>Outcomes</span>
          <strong>{wonDeals.length} won / {lostDeals.length} lost</strong>
          <p>Closed-loop pipeline tracking</p>
        </Card>
      </div>

      <div className="opps-board">
        {pipelineStages.map((stage) => {
          const stageDeals = openDeals.filter((deal) => deal.stageId === stage.id);

          return (
            <div key={stage.id} className="opps-column">
              <div className="opps-column-head" style={{ borderTopColor: stage.accent }}>
                <div>
                  <span className="opps-column-label">{stage.name}</span>
                  <strong>{stageDeals.length} opportunities</strong>
                </div>
                <Badge>{formatCompact(stageDeals.reduce((sum, deal) => sum + deal.amount, 0))}</Badge>
              </div>

              <div className="opps-column-stack">
                {stageDeals.length === 0 ? (
                  <div className="opps-empty-column">
                    <Goal size={16} />
                    <span>No opportunities</span>
                  </div>
                ) : null}

                {stageDeals.map((deal) => {
                  const stageIndex = pipelineStages.findIndex((item) => item.id === deal.stageId);
                  const previousStage = pipelineStages[stageIndex - 1];
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

                      <div className="pill-row">
                        <Badge>{deal.program}</Badge>
                        <Badge>{deal.owner}</Badge>
                        <Badge>{deal.source}</Badge>
                      </div>

                      <div className="opps-card-meta">
                        <div>
                          <span>Next action</span>
                          <strong>{deal.nextStep}</strong>
                        </div>
                        <div>
                          <span>Expected close</span>
                          <strong>{deal.expectedClose}</strong>
                        </div>
                      </div>

                      <div className="opps-card-meta">
                        <div>
                          <span>Lender fit</span>
                          <strong>{deal.lenderFit}</strong>
                        </div>
                        <div>
                          <span>Risk</span>
                          <strong className={`risk-${deal.risk.toLowerCase()}`}>{deal.risk}</strong>
                        </div>
                      </div>

                      <div className="opps-tag-row">
                        {deal.tags.map((tag) => (
                          <span key={tag} className="opps-tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="opps-card-footer">
                        <span>{deal.lastActivity}</span>
                        <div className="opps-card-actions">
                          {previousStage ? (
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => moveDealToStage(deal.id, previousStage.id)}
                            >
                              Back
                            </button>
                          ) : null}
                          {nextStage ? (
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => moveDealToStage(deal.id, nextStage.id)}
                            >
                              <MoveRight size={14} />
                              Move
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => updateDealStatus(deal.id, "Won")}
                          >
                            Won
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
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-grid two">
        <Card>
          <SectionHeader
            eyebrow="Won opportunities"
            title="Closed and converted"
            description="Keep funded deals visible instead of dropping them out of the workflow."
          />
          <div className="mini-list">
            {wonDeals.map((deal) => (
              <div key={deal.id} className="mini-row">
                <div>
                  <strong>{deal.borrower}</strong>
                  <p>{deal.property}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>{formatCurrency(deal.amount)}</strong>
                  <p>{stageName(deal.stageId)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            eyebrow="Lost opportunities"
            title="Recovery queue"
            description="Lost files stay searchable and can be reopened into the board."
          />
          <div className="mini-list">
            {lostDeals.map((deal) => (
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
            ))}
          </div>
        </Card>
      </div>

      {showComposer ? (
        <div className="opps-modal-backdrop" onClick={() => setShowComposer(false)}>
          <div className="opps-modal" onClick={(event) => event.stopPropagation()}>
            <div className="opps-modal-head">
              <div>
                <span className="eyebrow">New opportunity</span>
                <h3>Add a borrower file to the pipeline</h3>
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
              <select
                value={form.owner}
                onChange={(event) => setForm((current) => ({ ...current, owner: event.target.value }))}
              >
                {owners
                  .filter((owner) => owner !== "All")
                  .map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
              </select>
              <input
                value={form.source}
                onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))}
                placeholder="Lead source"
              />
              <input
                value={form.nextStep}
                onChange={(event) => setForm((current) => ({ ...current, nextStep: event.target.value }))}
                placeholder="Next action"
              />
              <input
                value={form.expectedClose}
                onChange={(event) => setForm((current) => ({ ...current, expectedClose: event.target.value }))}
                placeholder="Expected close"
              />
              <input
                value={form.lenderFit}
                onChange={(event) => setForm((current) => ({ ...current, lenderFit: event.target.value }))}
                placeholder="Lender fit"
              />
              <input
                value={form.tags}
                onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                placeholder="Tags separated by commas"
              />
            </div>

            <div className="opps-modal-actions">
              <button type="button" className="secondary-button" onClick={() => setShowComposer(false)}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={submitDeal}>
                Create opportunity
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
