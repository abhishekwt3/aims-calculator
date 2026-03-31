"use client";

import { useState } from "react";
import { api, RiskResult } from "@/lib/api";

const riskTypes = [
  "Data & Privacy",
  "Model",
  "Cybersecurity",
  "Compliance",
  "Operational",
  "Business",
];

const likelihoodLabels = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
const impactLabels = ["Negligible", "Minor", "Moderate", "Major", "Catastrophic"];

function cellColor(value: number): string {
  if (value <= 4) return "var(--success)";
  if (value <= 8) return "var(--accent-warm)";
  if (value <= 12) return "#f97316";
  return "var(--danger)";
}

function levelBorderColor(level: string): string {
  const l = level.toLowerCase();
  if (l.includes("critical")) return "var(--danger)";
  if (l.includes("high")) return "#f97316";
  if (l.includes("medium") || l.includes("moderate")) return "var(--accent-warm)";
  if (l.includes("low")) return "var(--success)";
  return "var(--accent)";
}

export default function RiskAssessmentPage() {
  const [riskType, setRiskType] = useState(riskTypes[0]);
  const [riskDescription, setRiskDescription] = useState(
    "Training data contains PII without proper anonymization"
  );
  const [likelihood, setLikelihood] = useState(4);
  const [impact, setImpact] = useState(5);
  const [controlEffectiveness, setControlEffectiveness] = useState(50);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function calculate() {
    setLoading(true);
    setError("");
    try {
      const res = await api.risk({
        likelihood,
        impact,
        control_effectiveness: controlEffectiveness / 100,
        risk_type: riskType,
        risk_description: riskDescription,
      });
      setResult(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--surface)", color: "var(--text)" }}>
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            RISK ASSESSMENT CALCULATOR
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Evaluate inherent and residual risk with control effectiveness adjustments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LEFT — Inputs */}
          <div
            className="p-5 space-y-4"
            style={{
              background: "var(--surface-alt)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
            }}
          >
            <h2
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
            >
              Risk Parameters
            </h2>

            {/* Risk Type */}
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                RISK TYPE
              </label>
              <select
                value={riskType}
                onChange={(e) => setRiskType(e.target.value)}
                className="w-full px-3 py-2 text-sm"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontFamily: "var(--font-mono)",
                  borderRadius: "2px",
                  outline: "none",
                }}
              >
                {riskTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Description */}
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                RISK DESCRIPTION
              </label>
              <textarea
                value={riskDescription}
                onChange={(e) => setRiskDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm resize-none"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontFamily: "var(--font-mono)",
                  borderRadius: "2px",
                  outline: "none",
                }}
              />
            </div>

            {/* Likelihood Slider */}
            <div>
              <label
                className="flex items-center justify-between text-xs font-medium mb-1"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                <span>LIKELIHOOD</span>
                <span style={{ color: "var(--accent)" }}>{likelihood} / 5</span>
              </label>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={likelihood}
                onChange={(e) => setLikelihood(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "var(--accent)" }}
              />
              <div className="flex justify-between text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {likelihoodLabels.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>

            {/* Impact Slider */}
            <div>
              <label
                className="flex items-center justify-between text-xs font-medium mb-1"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                <span>IMPACT</span>
                <span style={{ color: "var(--accent)" }}>{impact} / 5</span>
              </label>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={impact}
                onChange={(e) => setImpact(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "var(--accent)" }}
              />
              <div className="flex justify-between text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {impactLabels.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>

            {/* Control Effectiveness Slider */}
            <div>
              <label
                className="flex items-center justify-between text-xs font-medium mb-1"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                <span>CONTROL EFFECTIVENESS</span>
                <span style={{ color: "var(--accent)" }}>{controlEffectiveness}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={controlEffectiveness}
                onChange={(e) => setControlEffectiveness(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "var(--accent)" }}
              />
              <div className="flex justify-between text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                <span>0% — No Controls</span>
                <span>100% — Fully Mitigated</span>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculate}
              disabled={loading}
              className="w-full py-2.5 text-sm font-bold uppercase tracking-wider"
              style={{
                background: "var(--accent)",
                color: "var(--surface)",
                border: "none",
                borderRadius: "2px",
                fontFamily: "var(--font-mono)",
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "CALCULATING..." : "CALCULATE RISK SCORE"}
            </button>

            {error && (
              <p className="text-sm" style={{ color: "var(--danger)", fontFamily: "var(--font-mono)" }}>
                {error}
              </p>
            )}
          </div>

          {/* RIGHT — Results + Heatmap */}
          <div className="space-y-4">
            {/* Result Cards */}
            {!result ? (
              <div
                className="flex items-center justify-center p-12"
                style={{
                  background: "var(--surface-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                }}
              >
                <p
                  className="text-sm uppercase tracking-wider"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                >
                  Configure parameters and calculate to see results
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="p-4 text-center"
                  style={{
                    background: "var(--surface-alt)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                  >
                    Inherent Risk
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}
                  >
                    {result.inherent_risk.toFixed(1)}
                  </p>
                </div>
                <div
                  className="p-4 text-center"
                  style={{
                    background: "var(--surface-alt)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                  >
                    Residual Risk
                  </p>
                  <p
                    className="text-3xl font-bold"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}
                  >
                    {result.residual_risk.toFixed(1)}
                  </p>
                </div>
                <div
                  className="p-4 text-center"
                  style={{
                    background: "var(--surface-alt)",
                    border: `2px solid ${levelBorderColor(result.risk_level)}`,
                    borderRadius: "4px",
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                  >
                    Risk Level
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: levelBorderColor(result.risk_level),
                    }}
                  >
                    {result.risk_level}
                  </p>
                </div>
              </div>
            )}

            {/* Heatmap */}
            <div
              className="p-5"
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
              }}
            >
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              >
                Risk Heatmap
              </h2>

              <div className="flex">
                {/* Y-axis label */}
                <div className="flex items-center justify-center mr-1">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                      writingMode: "vertical-lr",
                      transform: "rotate(180deg)",
                    }}
                  >
                    Likelihood
                  </span>
                </div>

                <div>
                  {/* Grid rows: likelihood 5 down to 1 */}
                  {[5, 4, 3, 2, 1].map((l) => (
                    <div key={l} className="flex items-center">
                      <span
                        className="w-5 text-right mr-2 text-xs"
                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                      >
                        {l}
                      </span>
                      {[1, 2, 3, 4, 5].map((i) => {
                        const val = l * i;
                        const isActive = l === likelihood && i === impact;
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-center m-0.5"
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "3px",
                              background: cellColor(val),
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: 700,
                              fontFamily: "var(--font-mono)",
                              boxShadow: isActive
                                ? `0 0 0 2px var(--surface-alt), 0 0 0 4px var(--accent)`
                                : "none",
                              transform: isActive ? "scale(1.1)" : "scale(1)",
                              transition: "transform 0.15s, box-shadow 0.15s",
                              zIndex: isActive ? 10 : 1,
                              position: "relative",
                            }}
                          >
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  ))}

                  {/* X-axis numbers */}
                  <div className="flex" style={{ marginLeft: 28 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className="text-center text-xs m-0.5"
                        style={{
                          width: 48,
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                  {/* X-axis label */}
                  <p
                    className="text-xs text-center font-bold uppercase tracking-wider mt-1"
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                      marginLeft: 28,
                    }}
                  >
                    Impact
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
