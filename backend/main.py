from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import (
    PECVRequest, PECVResponse,
    RiskRequest, RiskResponse,
    CriticalityRequest, CriticalityResponse,
    ComplianceRequest, ComplianceResponse,
    MaturityRequest, MaturityResponse,
)
from computations import (
    compute_pecv, compute_risk, compute_criticality,
    compute_compliance, compute_maturity,
)

app = FastAPI(title="AIMS Computation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/pecv", response_model=PECVResponse)
def pecv(req: PECVRequest):
    return compute_pecv(req)


@app.post("/api/risk", response_model=RiskResponse)
def risk(req: RiskRequest):
    return compute_risk(req)


@app.post("/api/criticality", response_model=CriticalityResponse)
def criticality(req: CriticalityRequest):
    return compute_criticality(req)


@app.post("/api/compliance", response_model=ComplianceResponse)
def compliance(req: ComplianceRequest):
    return compute_compliance(req)


@app.post("/api/maturity", response_model=MaturityResponse)
def maturity(req: MaturityRequest):
    return compute_maturity(req)
