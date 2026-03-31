"use client";

import { useState } from "react";
import { api, MaturityResult } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Assessment {
  domain: string;
  sub_domain: string;
  current_score: number;
  target_score: number;
}

const defaultAssessments: Assessment[] = [
  { domain: "Strategy & Leadership", sub_domain: "AI Vision & Strategy", current_score: 2, target_score: 4 },
  { domain: "Strategy & Leadership", sub_domain: "Governance Structure", current_score: 1, target_score: 4 },
  { domain: "People & Culture", sub_domain: "Roles & Responsibilities", current_score: 2, target_score: 4 },
  { domain: "People & Culture", sub_domain: "AI Skills & Training", current_score: 3, target_score: 4 },
  { domain: "Process & Framework", sub_domain: "AI Development Lifecycle", current_score: 3, target_score: 5 },
  { domain: "Process & Framework", sub_domain: "Risk Management", current_score: 2, target_score: 4 },
  { domain: "Technology & Tools", sub_domain: "Model Management", current_score: 3, target_score: 4 },
  { domain: "Technology & Tools", sub_domain: "Monitoring & Observability", current_score: 2, target_score: 4 },
];

function maturityLevelStyle(level: string): { color: string; bg: string; border: string } {
  const l = level.toLowerCase();
  if (l.includes("optimized")) return { color: "var(--success)", bg: "color-mix(in srgb, var(--success) 10%, transparent)", border: "var(--success)" };
  if (l.includes("managed")) return { color: "#22d3ee", bg: "color-mix(in srgb, #22d3ee 10%, transparent)", border: "#22d3ee" };
  if (l.includes("defined")) return { color: "var(--accent-warm)", bg: "color-mix(in srgb, var(--accent-warm) 10%, transparent)", border: "var(--accent-warm)" };
  if (l.includes("developing")) return { color: "#f97316", bg: "color-mix(in srgb, #f97316 10%, transparent)", border: "#f97316" };
  return { color: "var(--danger)", bg: "color-mix(in srgb, var(--danger) 10%, transparent)", border: "var(--danger)" };
}

function gapColor(gap: number): string {
  if (gap > 2) return "var(--danger)";
  if (gap > 1) return "var(--accent-warm)";
  return "var(--success)";
}

export default function MaturityPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(defaultAssessments);
  const [result, setResult] = useState<MaturityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateRow(index: number, field: keyof Assessment, value: string | number) {
    setAssessments((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  }

  function addRow() {
    setAssessments((prev) => [
      ...prev,
      { domain: "", sub_domain: "", current_score: 1, target_score: 4 },
    ]);
  }

  function removeRow(index: number) {
    setAssessments((prev) => prev.filter((_, i) => i !== index));
  }

  async function calculate() {
    setLoading(true);
    setError("");
    try {
      const res = await api.maturity({ assessments });
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const domainScoresList = result
    ? Object.entries(result.domain_scores).map(([domain, d]) => ({
        domain,
        ...d,
      }))
    : null;

  const chartData = domainScoresList
    ? domainScoresList.map((d) => ({
        domain: d.domain,
        Current: d.current_avg,
        Target: d.target_avg,
      }))
    : (() => {
        const domains = [...new Set(assessments.map((a) => a.domain))];
        return domains.map((d) => {
          const items = assessments.filter((a) => a.domain === d);
          return {
            domain: d,
            Current: items.reduce((s, a) => s + a.current_score, 0) / items.length,
            Target: items.reduce((s, a) => s + a.target_score, 0) / items.length,
          };
        });
      })();

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--surface)" }}>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
            Governance Maturity Assessor
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            Evaluate AI governance maturity across domains and identify improvement areas.
          </p>
        </div>

        {/* Assessments Table */}
        <div
          className="rounded-lg p-6 space-y-4"
          style={{ background: "var(--surface-alt)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
            Maturity Assessments
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left py-2 px-2 font-medium" style={{ color: "var(--text-muted)" }}>Domain</th>
                  <th className="text-left py-2 px-2 font-medium" style={{ color: "var(--text-muted)" }}>Sub Domain</th>
                  <th className="text-left py-2 px-2 font-medium w-32" style={{ color: "var(--text-muted)" }}>Current (1-5)</th>
                  <th className="text-left py-2 px-2 font-medium w-32" style={{ color: "var(--text-muted)" }}>Target (1-5)</th>
                  <th className="text-left py-2 px-2 font-medium w-16" style={{ color: "var(--text-muted)" }}>Gap</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((a, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={a.domain}
                        onChange={(e) => updateRow(i, "domain", e.target.value)}
                        className="w-full rounded px-3 py-1.5 text-sm focus:outline-none"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          fontFamily: "var(--font-mono)",
                        }}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={a.sub_domain}
                        onChange={(e) => updateRow(i, "sub_domain", e.target.value)}
                        className="w-full rounded px-3 py-1.5 text-sm focus:outline-none"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          fontFamily: "var(--font-mono)",
                        }}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={a.current_score}
                        onChange={(e) =>
                          updateRow(i, "current_score", Math.min(5, Math.max(1, Number(e.target.value))))
                        }
                        className="w-full rounded px-3 py-1.5 text-sm focus:outline-none"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          fontFamily: "var(--font-mono)",
                        }}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={a.target_score}
                        onChange={(e) =>
                          updateRow(i, "target_score", Math.min(5, Math.max(1, Number(e.target.value))))
                        }
                        className="w-full rounded px-3 py-1.5 text-sm focus:outline-none"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          fontFamily: "var(--font-mono)",
                        }}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className="font-semibold"
                        style={{ color: gapColor(a.target_score - a.current_score) }}
                      >
                        {a.target_score - a.current_score}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <button
                        onClick={() => removeRow(i)}
                        className="text-lg transition-opacity opacity-50 hover:opacity-100"
                        style={{ color: "var(--danger)" }}
                        title="Remove"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button
              onClick={addRow}
              className="px-4 py-2 rounded text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text)",
                background: "var(--surface)",
              }}
            >
              + Add Assessment
            </button>
            <button
              onClick={calculate}
              disabled={loading}
              className="px-6 py-2 rounded text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{
                background: "var(--accent)",
                color: "var(--surface)",
              }}
            >
              {loading ? "Calculating..." : "Calculate Maturity"}
            </button>
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--danger)" }}>{error}</p>
          )}
        </div>

        {/* Results: 3 stat cards */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="rounded-lg p-6 text-center"
              style={{ background: "var(--surface-alt)", border: "1px solid var(--border)" }}
            >
              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>Current Maturity</p>
              <p className="text-4xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
                {result.overall_current.toFixed(1)}
                <span className="text-lg font-normal" style={{ color: "var(--text-muted)" }}> / 5.0</span>
              </p>
            </div>
            <div
              className="rounded-lg p-6 text-center"
              style={{ background: "var(--surface-alt)", border: "1px solid var(--border)" }}
            >
              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>Target Maturity</p>
              <p className="text-4xl font-bold" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                {result.overall_target.toFixed(1)}
                <span className="text-lg font-normal" style={{ color: "var(--text-muted)" }}> / 5.0</span>
              </p>
            </div>
            {(() => {
              const lvl = maturityLevelStyle(result.overall_maturity);
              return (
                <div
                  className="rounded-lg p-6 text-center"
                  style={{
                    background: lvl.bg,
                    border: `2px solid ${lvl.border}`,
                  }}
                >
                  <p className="text-sm mb-1" style={{ color: lvl.color, opacity: 0.7 }}>Maturity Gap</p>
                  <p className="text-4xl font-bold" style={{ color: lvl.color, fontFamily: "var(--font-mono)" }}>
                    {result.overall_gap.toFixed(1)}
                  </p>
                  <p className="text-sm mt-1" style={{ color: lvl.color, opacity: 0.8 }}>
                    {result.overall_maturity}
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Two-column: Chart LEFT, Domain Breakdown RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grouped Bar Chart */}
          <div
            className="rounded-lg p-6"
            style={{ background: "var(--surface-alt)", border: "1px solid var(--border)" }}
          >
            <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text)" }}>
              Domain Maturity Comparison
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Current vs Target scores by domain
            </p>

            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="domain"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "6px",
                    fontSize: "13px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "13px" }} />
                <Bar dataKey="Current" fill="#1f77b4" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="Target" fill="#ff7f0e" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Domain Breakdown Table */}
          {result && (
            <div
              className="rounded-lg p-6"
              style={{ background: "var(--surface-alt)", border: "1px solid var(--border)" }}
            >
              <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--text)" }}>
                Domain Breakdown
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <th className="text-left py-2 px-2 font-medium" style={{ color: "var(--text-muted)" }}>Domain</th>
                      <th className="text-left py-2 px-2 font-medium" style={{ color: "var(--text-muted)" }}>Current Avg</th>
                      <th className="text-left py-2 px-2 font-medium" style={{ color: "var(--text-muted)" }}>Target Avg</th>
                      <th className="text-left py-2 px-2 font-medium" style={{ color: "var(--text-muted)" }}>Gap</th>
                      <th className="text-left py-2 px-2 font-medium" style={{ color: "var(--text-muted)" }}>Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.domain_scores).map(([domain, d], i) => {
                      const lvl = maturityLevelStyle(d.maturity_level);
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td className="py-2 px-2 font-medium" style={{ color: "var(--text)" }}>{domain}</td>
                          <td className="py-2 px-2" style={{ color: "var(--text)" }}>{d.current_avg.toFixed(1)}</td>
                          <td className="py-2 px-2" style={{ color: "var(--text)" }}>{d.target_avg.toFixed(1)}</td>
                          <td className="py-2 px-2">
                            <span className="font-semibold" style={{ color: gapColor(d.gap) }}>
                              {d.gap.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-2 px-2">
                            <span
                              className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{
                                color: lvl.color,
                                background: lvl.bg,
                                border: `1px solid ${lvl.border}`,
                              }}
                            >
                              {d.maturity_level}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
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
