const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API error");
  }
  return res.json();
}

export interface PECVResult {
  dimension_scores: Record<string, number>;
  weighted_scores: Record<string, number>;
  overall_score: number;
  risk_level: string;
  impact_level: string;
  priority: string;
  weights: Record<string, number>;
}

export interface RiskResult {
  inherent_risk: number;
  residual_risk: number;
  risk_level: string;
  control_effectiveness: number;
}

export interface CriticalityResult {
  score: number;
  level: string;
  factors: Record<string, number>;
  weights: Record<string, number>;
}

export interface ComplianceGap {
  requirement: string;
  score: number;
  severity: string;
}

export interface ComplianceResult {
  compliance_score: number;
  compliance_level: string;
  gaps: ComplianceGap[];
  max_score: number;
}

export interface DomainScore {
  domain: string;
  current_avg: number;
  target_avg: number;
  gap: number;
  maturity_level: string;
}

export interface MaturityResult {
  domain_scores: Record<string, Omit<DomainScore, "domain">>;
  overall_current: number;
  overall_target: number;
  overall_gap: number;
  overall_maturity: string;
}

export const api = {
  pecv: (data: {
    performance_metrics: Record<string, number>;
    ethics_metrics: Record<string, number>;
    compliance_metrics: Record<string, number>;
    value_metrics: Record<string, number>;
    weights?: Record<string, number>;
  }) => post<PECVResult>("/api/pecv", data),

  risk: (data: {
    likelihood: number;
    impact: number;
    control_effectiveness: number;
    risk_type?: string;
    risk_description?: string;
  }) => post<RiskResult>("/api/risk", data),

  criticality: (data: {
    factors: Record<string, number>;
  }) => post<CriticalityResult>("/api/criticality", data),

  compliance: (data: {
    requirements: { requirement: string; assessment_score: number; weight: number }[];
  }) => post<ComplianceResult>("/api/compliance", data),

  maturity: (data: {
    assessments: { domain: string; sub_domain: string; current_score: number; target_score: number }[];
  }) => post<MaturityResult>("/api/maturity", data),
};
