from pydantic import BaseModel, Field
from typing import Optional


# --- PECV ---

class PECVRequest(BaseModel):
    performance_metrics: dict = Field(..., description="Keys: Accuracy, Latency, Availability, Scalability (0-10)")
    ethics_metrics: dict = Field(..., description="Keys: Fairness, Transparency, Privacy, Explainability (0-10)")
    compliance_metrics: dict = Field(..., description="Keys: Regulatory, Documentation, Auditability, Standards (0-10)")
    value_metrics: dict = Field(..., description="Keys: ROI, Efficiency, Strategic, Innovation (0-10)")
    weights: Optional[dict] = Field(
        default=None,
        description="Keys: Performance, Ethics, Compliance, Value (floats summing ~1.0)"
    )


class PECVResponse(BaseModel):
    dimension_scores: dict
    weighted_scores: dict
    overall_score: float
    risk_level: str
    impact_level: str
    priority: str
    weights: dict


# --- Risk ---

class RiskRequest(BaseModel):
    likelihood: int = Field(..., ge=1, le=5)
    impact: int = Field(..., ge=1, le=5)
    control_effectiveness: float = Field(..., ge=0, le=1)
    risk_type: str
    risk_description: str


class RiskResponse(BaseModel):
    inherent_risk: float
    residual_risk: float
    risk_level: str
    control_effectiveness: float


# --- Criticality ---

class CriticalityRequest(BaseModel):
    factors: dict = Field(
        ...,
        description="Keys: Business_Impact, Data_Sensitivity, Regulatory_Requirements, User_Base, System_Complexity (1-5)"
    )


class CriticalityResponse(BaseModel):
    score: float
    level: str
    factors: dict
    weights: dict


# --- Compliance ---

class ComplianceRequirement(BaseModel):
    requirement: str
    assessment_score: float = Field(..., ge=0, le=5)
    weight: float = Field(..., ge=0, le=1)


class ComplianceRequest(BaseModel):
    requirements: list[ComplianceRequirement]


class ComplianceGap(BaseModel):
    requirement: str
    score: float
    severity: str


class ComplianceResponse(BaseModel):
    compliance_score: float
    compliance_level: str
    gaps: list[ComplianceGap]
    max_score: float = 5.0


# --- Maturity ---

class MaturityAssessment(BaseModel):
    domain: str
    sub_domain: str
    current_score: float = Field(..., ge=1, le=5)
    target_score: float = Field(..., ge=1, le=5)


class MaturityRequest(BaseModel):
    assessments: list[MaturityAssessment]


class DomainScore(BaseModel):
    current_avg: float
    target_avg: float
    gap: float
    maturity_level: str


class MaturityResponse(BaseModel):
    domain_scores: dict[str, DomainScore]
    overall_current: float
    overall_target: float
    overall_gap: float
    overall_maturity: str
