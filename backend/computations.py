from statistics import mean
from models import (
    PECVRequest, PECVResponse,
    RiskRequest, RiskResponse,
    CriticalityRequest, CriticalityResponse,
    ComplianceRequest, ComplianceResponse, ComplianceGap,
    MaturityRequest, MaturityResponse, DomainScore,
)


def compute_pecv(req: PECVRequest) -> PECVResponse:
    weights = req.weights or {
        "Performance": 0.25, "Ethics": 0.30, "Compliance": 0.25, "Value": 0.20
    }

    dimension_scores = {
        "Performance": round(mean(req.performance_metrics.values()), 2),
        "Ethics": round(mean(req.ethics_metrics.values()), 2),
        "Compliance": round(mean(req.compliance_metrics.values()), 2),
        "Value": round(mean(req.value_metrics.values()), 2),
    }

    weighted_scores = {
        k: round(dimension_scores[k] * weights[k], 2) for k in dimension_scores
    }

    overall_score = round(sum(weighted_scores.values()), 2)

    ethics_score = dimension_scores["Ethics"]
    compliance_score = dimension_scores["Compliance"]
    performance_score = dimension_scores["Performance"]
    value_score = dimension_scores["Value"]

    # Risk
    risk_score = (10 - ethics_score) * 0.6 + (10 - compliance_score) * 0.4
    if risk_score >= 7:
        risk_level = "High"
    elif risk_score >= 4:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    # Impact
    impact_score = performance_score * 0.4 + value_score * 0.6
    if impact_score >= 8:
        impact_level = "High"
    elif impact_score >= 5:
        impact_level = "Medium"
    else:
        impact_level = "Low"

    # Priority
    level_weight = {"High": 3, "Medium": 2, "Low": 1}
    priority_score = level_weight[risk_level] * level_weight[impact_level]
    if priority_score >= 9:
        priority = "Critical"
    elif priority_score >= 6:
        priority = "High"
    elif priority_score >= 4:
        priority = "Medium"
    else:
        priority = "Low"

    return PECVResponse(
        dimension_scores=dimension_scores,
        weighted_scores=weighted_scores,
        overall_score=overall_score,
        risk_level=risk_level,
        impact_level=impact_level,
        priority=priority,
        weights=weights,
    )


def compute_risk(req: RiskRequest) -> RiskResponse:
    inherent_risk = round(req.likelihood * req.impact, 2)
    residual_risk = round(inherent_risk * (1 - req.control_effectiveness), 2)

    if residual_risk >= 20:
        risk_level = "Critical"
    elif residual_risk >= 15:
        risk_level = "High"
    elif residual_risk >= 10:
        risk_level = "Medium"
    elif residual_risk >= 5:
        risk_level = "Low"
    else:
        risk_level = "Very Low"

    return RiskResponse(
        inherent_risk=inherent_risk,
        residual_risk=residual_risk,
        risk_level=risk_level,
        control_effectiveness=req.control_effectiveness,
    )


def compute_criticality(req: CriticalityRequest) -> CriticalityResponse:
    weights = {
        "Business_Impact": 0.3,
        "Data_Sensitivity": 0.25,
        "Regulatory_Requirements": 0.2,
        "User_Base": 0.15,
        "System_Complexity": 0.1,
    }

    score = round(sum(req.factors[k] * weights[k] for k in weights), 2)

    if score >= 4:
        level = "High"
    elif score >= 2.5:
        level = "Medium"
    else:
        level = "Low"

    return CriticalityResponse(score=score, level=level, factors=req.factors, weights=weights)


def compute_compliance(req: ComplianceRequest) -> ComplianceResponse:
    total_weight = sum(r.weight for r in req.requirements)
    compliance_score = round(
        sum(r.assessment_score * r.weight for r in req.requirements) / total_weight, 2
    ) if total_weight > 0 else 0.0

    if compliance_score >= 4:
        level = "Compliant"
    elif compliance_score >= 3:
        level = "Developing"
    elif compliance_score >= 2:
        level = "Partial"
    else:
        level = "Non-Compliant"

    gaps = []
    for r in req.requirements:
        if r.assessment_score < 3:
            if r.assessment_score < 1:
                severity = "Critical"
            elif r.assessment_score < 2:
                severity = "High"
            else:
                severity = "Medium"
            gaps.append(ComplianceGap(requirement=r.requirement, score=r.assessment_score, severity=severity))

    return ComplianceResponse(
        compliance_score=compliance_score,
        compliance_level=level,
        gaps=gaps,
        max_score=5.0,
    )


def compute_maturity(req: MaturityRequest) -> MaturityResponse:
    from collections import defaultdict

    domain_items: dict[str, list] = defaultdict(list)
    for a in req.assessments:
        domain_items[a.domain].append(a)

    def maturity_level(score: float) -> str:
        if score >= 4.5:
            return "Optimized"
        if score >= 3.5:
            return "Managed"
        if score >= 2.5:
            return "Defined"
        if score >= 1.5:
            return "Developing"
        return "Initial"

    domain_scores = {}
    for domain, items in domain_items.items():
        c = round(mean(i.current_score for i in items), 2)
        t = round(mean(i.target_score for i in items), 2)
        g = round(t - c, 2)
        domain_scores[domain] = DomainScore(current_avg=c, target_avg=t, gap=g, maturity_level=maturity_level(c))

    all_current = [a.current_score for a in req.assessments]
    all_target = [a.target_score for a in req.assessments]
    overall_current = round(mean(all_current), 2)
    overall_target = round(mean(all_target), 2)
    overall_gap = round(overall_target - overall_current, 2)

    return MaturityResponse(
        domain_scores=domain_scores,
        overall_current=overall_current,
        overall_target=overall_target,
        overall_gap=overall_gap,
        overall_maturity=maturity_level(overall_current),
    )
