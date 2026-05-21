"use client";

import { useMemo, useState } from "react";
import { useCrm } from "@/components/crm/crm-provider";
import { Badge, Card, SectionHeader } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";

export function PipelineClient() {
  const { addDeal, deals, moveDealToStage, pipelineStages, updateDealStatus } = useCrm();
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Open" | "Won" | "Lost">("Open");
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
      const haystack = [
        deal.borrower,
        deal.company,
        deal.property,
        deal.program,
        deal.source,
        ...deal.tags,
      ]
        .join(" ")
        .toLowerCase();

      const searchMatch = haystack.includes(search.toLowerCase());
      const ownerMatch = ownerFilter === "All" || deal.owner === ownerFilter;
      const statusMatch = statusFilter === "All" || deal.status === statusFilter;

      return searchMatch && ownerMatch && statusMatch;
    });
  }, [deals, ownerFilter, search, statusFilter]);

  const openDeals = filteredDeals.filter((deal) => deal.status === "Open");
  const wonDeals = filteredDeals.filter((deal) => deal.status === "Won");
  const lostDeals = filteredDeals.filter((deal) => deal.status === "Lost");

  const weightedValue = openDeals.reduce((sum, deal) => {
    const stage = pipelineStages.find((item) => item.id === deal.stageId);
    return sum + deal.amount * ((stage?.probability ?? 0) / 100);
  }, 0);

  const closeReadyCount = openDeals.filter((deal) => {
    const stage = pipelineStages.find((item) => item.id === deal.stageId);
    return (stage?.probability ?? 0) >= 80;
  }).length;

  function submitDeal() {
    if (!form.borrower || !form.property || !form.amount) return;

    addDeal({
      borrower: form.borrower,
      company: form.company || form.borrower,
      property: form.property,
      program: form.program,
      stageId: form.stageId,
      amount: Number(form.amount),
      lenderFit: form.lenderFit || "Needs lender matching",
      owner: form.owner,
      risk: form.risk,
      status: form.status,
      source: form.source,
      nextStep: form.nextStep || "Set next borrower follow-up.",
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
  }

  return (
    <div className="pipeline-shell">
      <Card>
        <SectionHeader
          eyebrow="Pipeline controls"
          title="Opportunity board modeled for lending workflow"
          description="Search, filter, add opportunities, and move files through a real stage-based pipeline."
        />
        <div className="pipeline-controls">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search borrower, company, property, source, or tags"
          />
          <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "All" | "Open" | "Won" | "Lost")
            }
          >
            <option value="Open">Open</option>
            <option value="All">All statuses</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <div className="pipeline-form-grid">
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
          <input
            value={form.nextStep}
            onChange={(event) => setForm((current) => ({ ...current, nextStep: event.target.value }))}
            placeholder="Next step"
          />
          <input
            value={form.tags}
            onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
            placeholder="Tags separated by commas"
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
          <button type="button" className="primary-button" onClick={submitDeal}>
            Add opportunity
          </button>
        </div>
      </Card>

      <div className="metric-grid">
        <Card className="metric-card">
          <div className="metric-head">
            <span>Open pipeline</span>
            <span>{openDeals.length} files</span>
          </div>
          <strong>{formatCurrency(openDeals.reduce((sum, deal) => sum + deal.amount, 0))}</strong>
        </Card>
        <Card className="metric-card">
          <div className="metric-head">
            <span>Weighted forecast</span>
            <span>Stage weighted</span>
          </div>
          <strong>{formatCurrency(Math.round(weightedValue))}</strong>
        </Card>
        <Card className="metric-card">
          <div className="metric-head">
            <span>Close-ready</span>
            <span>80%+ probability</span>
          </div>
          <strong>{closeReadyCount}</strong>
        </Card>
        <Card className="metric-card">
          <div className="metric-head">
            <span>Outcomes</span>
            <span>Won / Lost</span>
          </div>
          <strong>
            {wonDeals.length} / {lostDeals.length}
          </strong>
        </Card>
      </div>

      <div className="pipeline-board">
        {pipelineStages.map((stage, index) => {
          const stageDeals = openDeals.filter((deal) => deal.stageId === stage.id);
          return (
            <Card key={stage.id} className="pipeline-column">
              <div className="pipeline-column-head">
                <div>
                  <span className="eyebrow">Stage {index + 1}</span>
                  <h3>{stage.name}</h3>
                  <p>
                    {stage.probability}% probability • {stage.targetDays} day target
                  </p>
                </div>
                <Badge>{stageDeals.length}</Badge>
              </div>
              <div className="pipeline-column-total">
                {formatCurrency(stageDeals.reduce((sum, deal) => sum + deal.amount, 0))}
              </div>
              <div className="stack">
                {stageDeals.map((deal) => {
                  const stageIndex = pipelineStages.findIndex((item) => item.id === deal.stageId);

                  return (
                    <Card key={deal.id} className="pipeline-deal-card">
                      <div className="pipeline-deal-top">
                        <div>
                          <strong>{deal.borrower}</strong>
                          <p>{deal.company}</p>
                        </div>
                        <Badge className={`risk-${deal.risk.toLowerCase()}`}>{deal.risk}</Badge>
                      </div>
                      <p>{deal.property}</p>
                      <div className="pill-row">
                        <Badge>{deal.program}</Badge>
                        <Badge>{deal.owner}</Badge>
                        <Badge>{deal.source}</Badge>
                      </div>
                      <div className="pipeline-amount-row">
                        <strong>{formatCurrency(deal.amount)}</strong>
                        <span>{deal.expectedClose}</span>
                      </div>
                      <p>
                        <strong>Next:</strong> {deal.nextStep}
                      </p>
                      <p>
                        <strong>Lenders:</strong> {deal.lenderFit}
                      </p>
                      <div className="pill-row">
                        {deal.tags.map((tag) => (
                          <span key={tag} className="pill">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="pipeline-card-actions">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => {
                            if (stageIndex > 0) {
                              moveDealToStage(deal.id, pipelineStages[stageIndex - 1].id);
                            }
                          }}
                          disabled={stageIndex === 0}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => {
                            if (stageIndex < pipelineStages.length - 1) {
                              moveDealToStage(deal.id, pipelineStages[stageIndex + 1].id);
                            }
                          }}
                          disabled={stageIndex === pipelineStages.length - 1}
                        >
                          Advance
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => updateDealStatus(deal.id, "Won")}
                        >
                          Mark won
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => updateDealStatus(deal.id, "Lost")}
                        >
                          Mark lost
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="section-grid two">
        <Card>
          <SectionHeader eyebrow="Won deals" title="Closed and handed off" />
          <div className="mini-list">
            {wonDeals.map((deal) => (
              <div key={deal.id} className="mini-row">
                <div>
                  <strong>{deal.borrower}</strong>
                  <p>
                    {deal.program} • {deal.property}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>{formatCurrency(deal.amount)}</strong>
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

        <Card>
          <SectionHeader eyebrow="Lost deals" title="Recovery and nurture queue" />
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
    </div>
  );
}
