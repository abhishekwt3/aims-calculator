"use client";

import { useState } from "react";
import { api, CriticalityResult } from "@/lib/api";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const factorConfig = [
  { key: "Business_Impact", label: "Business Impact", weight: "30%" },
  { key: "Data_Sensitivity", label: "Data Sensitivity", weight: "25%" },
  { key: "Regulatory_Requirements", label: "Regulatory Requirements", weight: "20%" },
  { key: "User_Base", label: "User Base", weight: "15%" },
  { key: "System_Complexity", label: "System Complexity", weight: "10%" },
];

const defaultValues: Record<string, number> = {
  Business_Impact: 4,
  Data_Sensitivity: 5,
  Regulatory_Requirements: 3,
  User_Base: 2,
  System_Complexity: 4,
};

function levelBorderColor(level: string): string {
  const l = level.toLowerCase();
  if (l.includes("critical")) return "var(--danger)";
  if (l.includes("high")) return "var(--accent-warm)";
  if (l.includes("medium") || l.includes("moderate")) return "var(--accent-warm)";
  if (l.includes("low")) return "var(--success)";
  return "var(--accent)";
}

export default function CriticalityAssessorPage() {
  const [factors, setFactors] = useState<Record<string, number>>({ ...defaultValues });
  const [result, setResult] = useState<CriticalityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateFactor(key: string, value: number) {
    setFactors((prev) => ({ ...prev, [key]: value }));
  }

  async function calculate() {
    setLoading(true);
    setError("");
    try {
      const res = await api.criticality({ factors });
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const radarData = factorConfig.map((f) => ({
    factor: f.label,
    value: factors[f.key],
    fullMark: 5,
  }));

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "var(--surface)", color: "var(--text)" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            System Criticality Assessor
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Evaluate system criticality across five weighted dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN — Inputs + Weights */}
          <div className="space-y-6">
            <div
              className="p-5 space-y-5"
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
              }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Rate each factor (1–5 scale)
              </h2>

              <div className="space-y-4">
                {factorConfig.map((f) => (
                  <div key={f.key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium">{f.label}</label>
                      <span
                        className="text-sm font-bold px-2 py-0.5"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--accent)",
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderRadius: "2px",
                        }}
                      >
                        {factors[f.key]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={factors[f.key]}
                      onChange={(e) => updateFactor(f.key, Number(e.target.value))}
                      className="w-full"
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <div
                      className="flex justify-between text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span>1</span>
                      <span>5</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={calculate}
                disabled={loading}
                className="w-full py-2.5 text-sm font-semibold uppercase tracking-wider transition-opacity disabled:opacity-50"
                style={{
                  background: "var(--accent)",
                  color: "var(--surface)",
                  border: "none",
                  borderRadius: "2px",
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                {loading ? "Calculating..." : "Calculate Criticality"}
              </button>

              {error && (
                <p className="text-sm" style={{ color: "var(--danger)" }}>
                  {error}
                </p>
              )}
            </div>

            {/* Factor Weights Table */}
            <div
              className="p-5"
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
              }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                Factor Weights
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th className="text-left py-2 font-medium" style={{ color: "var(--text-muted)" }}>
                      Factor
                    </th>
                    <th className="text-right py-2 font-medium" style={{ color: "var(--text-muted)" }}>
                      Weight %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {factorConfig.map((f) => (
                    <tr key={f.key} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td className="py-2">{f.label}</td>
                      <td
                        className="py-2 text-right font-bold"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
                      >
                        {f.weight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN — Results + Radar */}
          <div className="space-y-6">
            {!result ? (
              <div
                className="flex items-center justify-center p-12"
                style={{
                  background: "var(--surface-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  minHeight: "200px",
                }}
              >
                <p
                  className="text-sm text-center"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                >
                  Adjust factors and calculate to view results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Score Card */}
                <div
                  className="p-5 text-center"
                  style={{
                    background: "var(--surface-alt)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                  }}
                >
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                    Criticality Score
                  </p>
                  <p
                    className="text-4xl font-bold"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}
                  >
                    {result.score.toFixed(2)}
                  </p>
                </div>

                {/* Level Card */}
                <div
                  className="p-5 text-center"
                  style={{
                    background: "var(--surface-alt)",
                    border: `2px solid ${levelBorderColor(result.level)}`,
                    borderRadius: "4px",
                  }}
                >
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                    Criticality Level
                  </p>
                  <p
                    className="text-4xl font-bold"
                    style={{ color: levelBorderColor(result.level) }}
                  >
                    {result.level}
                  </p>
                </div>
              </div>
            )}

            {/* Radar Chart */}
            <div
              className="p-5"
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
              }}
            >
              <h2
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Factor Overview
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" gridType="polygon" />
                  <PolarAngleAxis
                    dataKey="factor"
                    tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 5]}
                    tickCount={6}
                    tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
