# main.py — The API Server

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from valuation import valuate_property

app = FastAPI()

# This allows your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# This defines what inputs the API expects
class PropertyInput(BaseModel):
    city: str
    area: str
    property_type: str
    size_sqft: float
    age_years: int
    is_rented: bool = False
    has_clear_title: bool = True
    latitude: float = None
    longitude: float = None

# The main endpoint
@app.post("/valuate")
def valuate(data: PropertyInput):
    result = valuate_property(
        city=data.city,
        area=data.area,
        property_type=data.property_type,
        size_sqft=data.size_sqft,
        age_years=data.age_years,
        is_rented=data.is_rented,
        has_clear_title=data.has_clear_title,
        latitude=data.latitude,
        longitude=data.longitude
    )
    return result

# Health check
@app.get("/")
def root():
    return {"status": "Collateral Engine is running"}