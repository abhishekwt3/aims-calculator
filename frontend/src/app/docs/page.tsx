"use client";

export default function DocsPage() {
  const riskLevels: { level: string; range: string; action: string; color: string }[] = [
    { level: "Very Low", range: "< 5", action: "Accept", color: "var(--text-muted)" },
    { level: "Low", range: "5 - 10", action: "Monitor", color: "var(--success)" },
    { level: "Medium", range: "10 - 15", action: "Mitigate", color: "var(--accent-warm)" },
    { level: "High", range: "15 - 20", action: "Remediate urgently", color: "#f97316" },
    { level: "Critical", range: ">= 20", action: "Immediate action required", color: "var(--danger)" },
  ];

  const maturityLevels: { level: number; name: string; desc: string; borderColor: string }[] = [
    { level: 1, name: "Initial", desc: "Ad-hoc and reactive. No formal AI governance processes. Efforts are uncoordinated and inconsistent.", borderColor: "var(--danger)" },
    { level: 2, name: "Developing", desc: "Basic processes emerging. Some awareness of AI governance needs. Initial policies being drafted but not consistently applied.", borderColor: "#f97316" },
    { level: 3, name: "Defined", desc: "Standardized processes in place. Formal governance framework documented and communicated. Roles and responsibilities established.", borderColor: "var(--accent-warm)" },
    { level: 4, name: "Managed", desc: "Measured and controlled. Metrics and KPIs track governance effectiveness. Continuous monitoring and regular assessments conducted.", borderColor: "var(--accent)" },
    { level: 5, name: "Optimized", desc: "Continuous improvement culture. Governance processes are proactively refined. Industry-leading practices with automated compliance checks.", borderColor: "var(--success)" },
  ];

  const cardStyle: React.CSSProperties = {
    background: "var(--surface-alt)",
    border: "1px solid var(--border)",
  };

  const formulaBoxStyle: React.CSSProperties = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
  };

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--surface)" }}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
            AIMS Computation Documentation
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            Reference documentation for AIMS scoring frameworks and formulas.
          </p>
        </div>

        {/* 1. PECV Scoring */}
        <div className="rounded-lg p-6 space-y-4" style={cardStyle}>
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
            PECV Scoring
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            The PECV framework evaluates AI systems across four dimensions, each scored on a 0-10 scale:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Performance (P)", desc: "Measures model accuracy, reliability, latency, throughput, and overall technical effectiveness." },
              { name: "Ethics (E)", desc: "Evaluates fairness, bias mitigation, transparency, explainability, and responsible AI practices." },
              { name: "Compliance (C)", desc: "Assesses adherence to regulations, standards, policies, and governance frameworks." },
              { name: "Value (V)", desc: "Quantifies business impact, ROI, cost efficiency, and strategic alignment of the AI system." },
            ].map((d) => (
              <div
                key={d.name}
                className="rounded-lg p-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <h3 className="font-semibold text-sm" style={{ color: "var(--accent)" }}>{d.name}</h3>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-4" style={formulaBoxStyle}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Weighted Overall Score Formula
            </p>
            <p className="text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
              Overall = (P &times; w<sub>P</sub>) + (E &times; w<sub>E</sub>) + (C &times; w<sub>C</sub>) + (V &times; w<sub>V</sub>)
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Default weights: w<sub>P</sub> = 0.25, w<sub>E</sub> = 0.30, w<sub>C</sub> = 0.25, w<sub>V</sub> = 0.20.
              Weights must sum to 1.0 and can be adjusted based on organizational priorities.
            </p>
          </div>
        </div>

        {/* 2. Risk Scoring */}
        <div className="rounded-lg p-6 space-y-4" style={cardStyle}>
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
            Risk Scoring
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Risk is quantified through inherent and residual risk calculations on a 1-5 scale, factoring in control effectiveness.
          </p>

          <div className="space-y-3">
            <div className="rounded-lg p-4" style={formulaBoxStyle}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--danger)" }}>Inherent Risk</p>
              <p className="text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
                R<sub>i</sub> = L &times; I
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Where L = Likelihood (1-5) and I = Impact (1-5). Range: 1-25.
              </p>
            </div>

            <div className="rounded-lg p-4" style={formulaBoxStyle}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--accent-warm)" }}>Residual Risk</p>
              <p className="text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
                R<sub>res</sub> = R<sub>i</sub> &times; (1 - C)
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Where C = Control Effectiveness (0.0 - 1.0). Higher control effectiveness reduces residual risk.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <th className="text-left py-2 px-3 font-medium" style={{ color: "var(--text-muted)" }}>Level</th>
                  <th className="text-left py-2 px-3 font-medium" style={{ color: "var(--text-muted)" }}>Residual Risk Range</th>
                  <th className="text-left py-2 px-3 font-medium" style={{ color: "var(--text-muted)" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {riskLevels.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="py-2 px-3">
                      <span className="font-medium" style={{ color: r.color }}>{r.level}</span>
                    </td>
                    <td className="py-2 px-3" style={{ color: "var(--text)" }}>{r.range}</td>
                    <td className="py-2 px-3" style={{ color: "var(--text-muted)" }}>{r.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Criticality Scoring */}
        <div className="rounded-lg p-6 space-y-4" style={cardStyle}>
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
            Criticality Scoring
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Criticality is determined by five weighted factors on a 1-5 scale that assess the overall importance and risk profile of an AI system.
          </p>

          <div className="space-y-2">
            {[
              { factor: "Business Impact", weight: 0.30, desc: "Revenue, operations, and strategic importance" },
              { factor: "Data Sensitivity", weight: 0.25, desc: "PII, financial, health, or classified data handling" },
              { factor: "Regulatory Requirements", weight: 0.20, desc: "Applicable regulations and compliance requirements" },
              { factor: "User Base", weight: 0.15, desc: "Number of users and breadth of system exposure" },
              { factor: "System Complexity", weight: 0.10, desc: "Technical complexity and integration dependencies" },
            ].map((f) => (
              <div
                key={f.factor}
                className="flex items-center justify-between rounded-lg px-4 py-3"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{f.factor}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                </div>
                <span
                  className="text-sm font-semibold ml-4 whitespace-nowrap"
                  style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
                >
                  {(f.weight * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-4" style={formulaBoxStyle}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
              Weighted Criticality Formula
            </p>
            <p className="text-sm" style={{ color: "var(--text)", fontFamily: "var(--font-mono)" }}>
              Score = &Sigma; (Factor<sub>i</sub> &times; Weight<sub>i</sub>)
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              Each factor is scored 1-5. Final score range: 1.0 - 5.0.
              Levels: High &ge; 4, Medium &ge; 2.5, Low &lt; 2.5.
            </p>
          </div>
        </div>

        {/* 4. Maturity Levels */}
        <div className="rounded-lg p-6 space-y-4" style={cardStyle}>
          <h2 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
            Maturity Levels
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            AI governance maturity is assessed on a 1-5 scale, from ad-hoc practices to fully optimized governance.
          </p>

          <div className="space-y-3">
            {maturityLevels.map((m) => (
              <div
                key={m.level}
                className="rounded-lg p-4"
                style={{
                  background: "var(--surface)",
                  borderLeft: `3px solid ${m.borderColor}`,
                  border: `1px solid var(--border)`,
                  borderLeftColor: m.borderColor,
                  borderLeftWidth: "3px",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                    style={{
                      background: `color-mix(in srgb, ${m.borderColor} 15%, transparent)`,
                      color: m.borderColor,
                    }}
                  >
                    {m.level}
                  </span>
                  <h3 className="font-semibold" style={{ color: m.borderColor }}>
                    {m.name}
                  </h3>
                </div>
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
