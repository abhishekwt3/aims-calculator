"use client";

import { useState } from "react";
import { api, PECVResult } from "@/lib/api";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const defaultMetrics = {
  performance: { accuracy: 8, latency: 7, availability: 9, scalability: 6 },
  ethics: { fairness: 5, transparency: 4, privacy: 6, explainability: 3 },
  compliance: { regulatory: 5, documentation: 6, auditability: 4, standards: 7 },
  value: { roi: 9, efficiency: 8, strategic: 7, innovation: 6 },
};

const metricLabels: Record<string, string> = {
  accuracy: "Accuracy",
  latency: "Latency/Response Time",
  availability: "Availability",
  scalability: "Scalability",
  fairness: "Fairness/Bias",
  transparency: "Transparency",
  privacy: "Privacy Protection",
  explainability: "Explainability",
  regulatory: "Regulatory Compliance",
  documentation: "Documentation",
  auditability: "Auditability",
  standards: "Adherence to Standards",
  roi: "ROI/Business Value",
  efficiency: "Efficiency Gains",
  strategic: "Strategic Alignment",
  innovation: "Innovation Potential",
};

const defaultWeights = {
  performance: 0.25,
  ethics: 0.3,
  compliance: 0.25,
  value: 0.2,
};

const dimensionBorders: Record<string, string> = {
  performance: "var(--accent)",
  ethics: "var(--accent-warm)",
  compliance: "var(--danger)",
  value: "var(--success)",
};

const dimensionLabels: Record<string, string> = {
  performance: "Performance",
  ethics: "Ethics",
  compliance: "Compliance",
  value: "Value",
};

function levelBorderColor(level: string): string {
  const l = level.toLowerCase();
  if (l.includes("critical") || l.includes("high")) return "var(--danger)";
  if (l.includes("medium") || l.includes("moderate")) return "var(--accent-warm)";
  if (l.includes("low") || l.includes("minimal")) return "var(--success)";
  return "var(--accent)";
}

export default function PECVCalculatorPage() {
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [weights, setWeights] = useState(defaultWeights);
  const [result, setResult] = useState<PECVResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateMetric(dimension: string, key: string, value: number) {
    setMetrics((prev) => ({
      ...prev,
      [dimension]: { ...prev[dimension as keyof typeof prev], [key]: value },
    }));
    setResult(null);
  }

  function updateWeight(dimension: string, value: number) {
    setWeights((prev) => ({ ...prev, [dimension]: value }));
    setResult(null);
  }

  async function calculate() {
    setLoading(true);
    setError("");
    try {
      const res = await api.pecv({
        performance_metrics: {
          Accuracy: metrics.performance.accuracy,
          Latency: metrics.performance.latency,
          Availability: metrics.performance.availability,
          Scalability: metrics.performance.scalability,
        },
        ethics_metrics: {
          Fairness: metrics.ethics.fairness,
          Transparency: metrics.ethics.transparency,
          Privacy: metrics.ethics.privacy,
          Explainability: metrics.ethics.explainability,
        },
        compliance_metrics: {
          Regulatory: metrics.compliance.regulatory,
          Documentation: metrics.compliance.documentation,
          Auditability: metrics.compliance.auditability,
          Standards: metrics.compliance.standards,
        },
        value_metrics: {
          ROI: metrics.value.roi,
          Efficiency: metrics.value.efficiency,
          Strategic: metrics.value.strategic,
          Innovation: metrics.value.innovation,
        },
        weights: {
          Performance: weights.performance,
          Ethics: weights.ethics,
          Compliance: weights.compliance,
          Value: weights.value,
        },
      });
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Calculation failed");
    } finally {
      setLoading(false);
    }
  }

  // Live radar from current inputs (always available)
  const liveRadarData = Object.entries(dimensionLabels).map(([dim, label]) => {
    const vals = Object.values(metrics[dim as keyof typeof metrics]);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return { dimension: label, score: Number(avg.toFixed(2)), max: 10 };
  });

  // Use calculated result if available, otherwise live preview
  const radarData = result
    ? Object.entries(result.dimension_scores).map(([key, value]) => ({
        dimension: key,
        score: Number(value.toFixed(2)),
        max: 10,
      }))
    : liveRadarData;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-4">
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}
        >
          PECV Score Calculator
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Performance, Ethics, Compliance &amp; Value composite scoring
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT COLUMN — Inputs */}
        <div className="flex flex-col gap-3">
          {/* 2x2 Dimension Cards */}
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(dimensionLabels) as string[]).map((dim) => (
              <div
                key={dim}
                className="p-3 rounded"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${dimensionBorders[dim]}`,
                }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: dimensionBorders[dim] }}
                >
                  {dimensionLabels[dim]}
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(metrics[dim as keyof typeof metrics]).map(
                    ([key, val]) => (
                      <div key={key}>
                        <label
                          className="block text-xs mb-0.5 truncate"
                          style={{ color: "var(--text-muted)", fontSize: "10px" }}
                          title={metricLabels[key] ?? key}
                        >
                          {metricLabels[key] ?? key}
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={val}
                          onChange={(e) =>
                            updateMetric(dim, key, parseFloat(e.target.value) || 0)
                          }
                          className="w-full rounded px-2 py-1 text-xs focus:outline-none"
                          style={{
                            background: "var(--surface-alt)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            fontFamily: "var(--font-mono)",
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Weight Config — single row */}
          <div
            className="p-3 rounded"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Weights
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {(Object.keys(dimensionLabels) as string[]).map((dim) => (
                <div key={dim}>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      className="text-xs"
                      style={{ color: dimensionBorders[dim], fontSize: "10px" }}
                    >
                      {dimensionLabels[dim]}
                    </label>
                    <span
                      className="text-xs"
                      style={{
                        color: "var(--text)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                      }}
                    >
                      {weights[dim as keyof typeof weights].toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={weights[dim as keyof typeof weights]}
                    onChange={(e) => updateWeight(dim, parseFloat(e.target.value))}
                    className="w-full h-1"
                    style={{ accentColor: dimensionBorders[dim] }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={calculate}
              disabled={loading}
              className="px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider disabled:opacity-50 transition-opacity"
              style={{
                background: "var(--accent)",
                color: "var(--surface)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {loading ? "Calculating..." : "Calculate PECV Score"}
            </button>
            {error && (
              <p className="text-xs" style={{ color: "var(--danger)" }}>
                {error}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN — Results */}
        <div className="flex flex-col gap-3">
          {/* Radar Chart — always visible as live preview */}
          <div
            className="p-3 rounded"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Dimension Scores
              </h3>
              {!result && (
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    color: "var(--accent)",
                    background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                  }}
                >
                  LIVE PREVIEW
                </span>
              )}
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 10]}
                  tick={{ fontSize: 9, fill: "var(--text-muted)" }}
                  tickCount={6}
                />
                <Radar
                  name="Max"
                  dataKey="max"
                  stroke="#1e293b"
                  fill="#1e293b"
                  fillOpacity={0.05}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.2}
                  isAnimationActive={true}
                  animationDuration={300}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {!result ? (
            <div
              className="flex items-center justify-center rounded py-6"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs"
                style={{
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Click Calculate to see detailed results
              </p>
            </div>
          ) : (
            <>
              {/* Stat Cards — top row */}
              <div className="grid grid-cols-4 gap-2">
                {/* Overall Score */}
                <div
                  className="p-3 rounded"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderLeft: "3px solid var(--accent)",
                  }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: "var(--text-muted)", fontSize: "10px" }}
                  >
                    Overall Score
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      color: "var(--text)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {result.overall_score.toFixed(2)}
                  </p>
                </div>

                {/* Priority */}
                <div
                  className="p-3 rounded"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderLeft: `3px solid ${levelBorderColor(result.priority)}`,
                  }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: "var(--text-muted)", fontSize: "10px" }}
                  >
                    Priority
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: levelBorderColor(result.priority),
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {result.priority}
                  </p>
                </div>

                {/* Risk Level */}
                <div
                  className="p-3 rounded"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderLeft: `3px solid ${levelBorderColor(result.risk_level)}`,
                  }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: "var(--text-muted)", fontSize: "10px" }}
                  >
                    Risk Level
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: levelBorderColor(result.risk_level),
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {result.risk_level}
                  </p>
                </div>

                {/* Impact Level */}
                <div
                  className="p-3 rounded"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderLeft: `3px solid ${levelBorderColor(result.impact_level)}`,
                  }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: "var(--text-muted)", fontSize: "10px" }}
                  >
                    Impact Level
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{
                      color: levelBorderColor(result.impact_level),
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {result.impact_level}
                  </p>
                </div>
              </div>

              {/* Score Details Table */}
              <div
                className="p-3 rounded"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Score Details
                </h3>
                <table className="w-full text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--border)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <th className="pb-1.5 text-left font-medium">Dimension</th>
                      <th className="pb-1.5 text-right font-medium">Raw</th>
                      <th className="pb-1.5 text-right font-medium">Weight</th>
                      <th className="pb-1.5 text-right font-medium">Weighted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.dimension_scores).map(([dim, raw]) => (
                      <tr
                        key={dim}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td
                          className="py-1.5 capitalize font-medium"
                          style={{ color: dimensionBorders[dim.toLowerCase()] || "var(--text)" }}
                        >
                          {dim}
                        </td>
                        <td className="py-1.5 text-right" style={{ color: "var(--text)" }}>
                          {raw.toFixed(2)}
                        </td>
                        <td className="py-1.5 text-right" style={{ color: "var(--text-muted)" }}>
                          {(result.weights[dim] ?? 0).toFixed(2)}
                        </td>
                        <td className="py-1.5 text-right" style={{ color: "var(--text)" }}>
                          {(result.weighted_scores[dim] ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
