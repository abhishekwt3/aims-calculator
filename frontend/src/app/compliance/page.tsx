"use client";

import { useState } from "react";
import { api, ComplianceResult } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Requirement {
  requirement: string;
  assessment_score: number;
  weight: number;
}

const defaultRequirements: Requirement[] = [
  { requirement: "AI Policy & Objectives", assessment_score: 2, weight: 0.2 },
  { requirement: "Risk Management Process", assessment_score: 3, weight: 0.2 },
  { requirement: "Documentation Standards", assessment_score: 1, weight: 0.2 },
  { requirement: "Data Governance", assessment_score: 2, weight: 0.2 },
  { requirement: "Human Oversight", assessment_score: 3, weight: 0.2 },
];

function statusColor(score: number): string {
  if (score >= 4) return "var(--success)";
  if (score >= 3) return "var(--accent-warm)";
  if (score >= 2) return "#f97316";
  return "var(--danger)";
}

function statusLabel(score: number): string {
  if (score >= 4) return "Compliant";
  if (score >= 3) return "Developing";
  if (score >= 2) return "Partial";
  return "Non-Compliant";
}

function complianceLevelBorderColor(level: string): string {
  const l = level.toLowerCase();
  if (l.includes("full")) return "var(--success)";
  if (l.includes("substantial")) return "var(--accent)";
  if (l.includes("partial")) return "#f97316";
  return "var(--danger)";
}

export default function CompliancePage() {
  const [requirements, setRequirements] = useState<Requirement[]>(defaultRequirements);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateRow(index: number, field: keyof Requirement, value: string | number) {
    setRequirements((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  }

  function addRow() {
    setRequirements((prev) => [
      ...prev,
      { requirement: `New Requirement ${prev.length + 1}`, assessment_score: 0, weight: 0.2 },
    ]);
  }

  function removeRow(index: number) {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  }

  async function calculate() {
    setLoading(true);
    setError("");
    try {
      const res = await api.compliance({ requirements });
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const chartData = result
    ? result.gaps.map((g) => ({
        name: g.requirement,
        score: g.score,
        fill: statusColor(g.score),
      }))
    : requirements.map((r) => ({
        name: r.requirement,
        score: r.assessment_score,
        fill: statusColor(r.assessment_score),
      }));

  const criticalGaps = result
    ? result.gaps.filter(
        (g) =>
          g.severity.toLowerCase().includes("critical") ||
          g.severity.toLowerCase().includes("high")
      ).length
    : 0;

  const gaps = result?.gaps ?? [];

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: "var(--surface)" }}>
      <div className="w-full space-y-6">
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
          }}
        >
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}
          >
            Framework Compliance Calculator
          </h1>
        </div>

        {/* Requirements Table */}
        <div
          className="p-5 space-y-4"
          style={{
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th
                    className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Requirement
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider w-40"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Score (0-5)
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider w-32"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Weight (0-1)
                  </th>
                  <th
                    className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider w-32"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Status
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((r, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={r.requirement}
                        onChange={(e) => updateRow(i, "requirement", e.target.value)}
                        placeholder="Requirement name..."
                        className="w-full px-3 py-1.5 text-sm"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          fontFamily: "var(--font-mono)",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={0}
                        max={5}
                        step={1}
                        value={r.assessment_score}
                        onChange={(e) =>
                          updateRow(
                            i,
                            "assessment_score",
                            Math.min(5, Math.max(0, Number(e.target.value)))
                          )
                        }
                        className="w-full px-3 py-1.5 text-sm"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          fontFamily: "var(--font-mono)",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.05}
                        value={r.weight}
                        onChange={(e) =>
                          updateRow(
                            i,
                            "weight",
                            Math.min(1, Math.max(0, Number(e.target.value)))
                          )
                        }
                        className="w-full px-3 py-1.5 text-sm"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          fontFamily: "var(--font-mono)",
                          outline: "none",
                        }}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className="inline-block text-xs font-bold px-2.5 py-1 uppercase tracking-wide"
                        style={{
                          background: statusColor(r.assessment_score),
                          color: "var(--surface)",
                        }}
                      >
                        {statusLabel(r.assessment_score)}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => removeRow(i)}
                        className="text-lg font-bold"
                        style={{ color: "var(--danger)", opacity: 0.7 }}
                        title="Remove"
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action row */}
          <div className="flex gap-3 items-center">
            <button
              onClick={addRow}
              className="px-4 py-2 text-sm font-semibold"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              + Add Requirement
            </button>
            <button
              onClick={calculate}
              disabled={loading}
              className="px-6 py-2 text-sm font-bold uppercase tracking-wider"
              style={{
                background: "var(--accent)",
                color: "var(--surface)",
                border: "none",
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.6 : 1,
                fontFamily: "var(--font-mono)",
              }}
            >
              {loading ? "Calculating..." : "Calculate Compliance"}
            </button>
          </div>

          {error && (
            <p className="text-sm font-semibold" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
        </div>

        {/* Results Cards */}
        {result && (
          <div className="grid grid-cols-3 gap-4">
            {/* Compliance Score */}
            <div
              className="p-5"
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Compliance Score
              </p>
              <p
                className="text-4xl font-bold"
                style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}
              >
                {result.compliance_score.toFixed(1)}
                <span
                  className="text-base font-normal ml-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  / 5.0
                </span>
              </p>
            </div>

            {/* Compliance Level */}
            <div
              className="p-5"
              style={{
                background: "var(--surface-alt)",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: complianceLevelBorderColor(result.compliance_level),
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Compliance Level
              </p>
              <p
                className="text-3xl font-bold"
                style={{
                  color: complianceLevelBorderColor(result.compliance_level),
                  fontFamily: "var(--font-mono)",
                }}
              >
                {result.compliance_level}
              </p>
            </div>

            {/* Critical Gaps */}
            <div
              className="p-5"
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                Critical Gaps
              </p>
              <p
                className="text-4xl font-bold"
                style={{
                  color: criticalGaps > 0 ? "var(--danger)" : "var(--success)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {criticalGaps}
              </p>
            </div>
          </div>
        )}

        {/* Chart + Gap Analysis */}
        <div className="grid grid-cols-1 gap-4" style={gaps.length > 0 ? { gridTemplateColumns: "1fr 1fr" } : undefined}>
          {/* Bar Chart */}
          <div
            className="p-5"
            style={{
              background: "var(--surface-alt)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Requirement Scores
            </p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  stroke="var(--border)"
                />
                <YAxis
                  domain={[0, 5]}
                  tick={{ fontSize: 12, fill: "var(--text-muted)" }}
                  stroke="var(--border)"
                />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(1), "Score"]}
                  contentStyle={{
                    background: "#1a1a2e",
                    border: "1px solid var(--border)",
                    color: "#e0e0e0",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                  }}
                  labelStyle={{ color: "#e0e0e0" }}
                  itemStyle={{ color: "#e0e0e0" }}
                />
                <ReferenceLine
                  y={5}
                  stroke="var(--text-muted)"
                  strokeDasharray="4 4"
                  label={{
                    value: "Max (5)",
                    position: "right",
                    fontSize: 11,
                    fill: "var(--text-muted)",
                  }}
                />
                <Bar dataKey="score" radius={[2, 2, 0, 0]} barSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gap Analysis */}
          {gaps.length > 0 && (
            <div
              className="p-5"
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Gap Analysis
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th
                        className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Requirement
                      </th>
                      <th
                        className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Score
                      </th>
                      <th
                        className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Severity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gaps.map((g, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td className="py-2 px-3" style={{ color: "var(--text)" }}>
                          {g.requirement}
                        </td>
                        <td className="py-2 px-3" style={{ color: "var(--text)" }}>
                          {g.score}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className="inline-block text-xs font-bold px-2.5 py-1 uppercase tracking-wide"
                            style={{
                              background: statusColor(g.score),
                              color: "var(--surface)",
                            }}
                          >
                            {g.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
