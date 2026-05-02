# valuation.py — The Brain of the System

def get_circle_rate(city: str, property_type: str) -> float:
    """Returns circle rate in ₹ per sq ft based on city and type"""
    circle_rates = {
        "mumbai":    {"apartment": 12000, "villa": 15000, "plot": 8000, "shop": 18000, "warehouse": 5000},
        "delhi":     {"apartment": 9000,  "villa": 12000, "plot": 6000, "shop": 14000, "warehouse": 4000},
        "bangalore": {"apartment": 7000,  "villa": 10000, "plot": 5000, "shop": 12000, "warehouse": 3500},
        "hyderabad": {"apartment": 6000,  "villa": 8000,  "plot": 4000, "shop": 10000, "warehouse": 3000},
        "chennai":   {"apartment": 5500,  "villa": 7500,  "plot": 3500, "shop": 9000,  "warehouse": 2800},
        "pune":      {"apartment": 6500,  "villa": 9000,  "plot": 4500, "shop": 11000, "warehouse": 3200},
        "default":   {"apartment": 4000,  "villa": 6000,  "plot": 3000, "shop": 7000,  "warehouse": 2000},
    }
    city = city.lower().strip()
    ptype = property_type.lower().strip()
    rates = circle_rates.get(city, circle_rates["default"])
    return rates.get(ptype, rates.get("apartment", 4000))


def get_location_score(city: str, area: str) -> float:
    """Returns a location premium multiplier (1.0 = neutral, >1 = premium, <1 = below average)"""
    premium_areas = {
        "mumbai":    ["bandra", "juhu", "worli", "andheri", "powai"],
        "delhi":     ["connaught place", "hauz khas", "vasant kunj", "dwarka"],
        "bangalore": ["koramangala", "indiranagar", "whitefield", "hsr layout"],
        "hyderabad": ["banjara hills", "jubilee hills", "hitech city", "gachibowli"],
        "chennai":   ["anna nagar", "adyar", "velachery", "t nagar"],
        "pune":      ["koregaon park", "baner", "hinjewadi", "kharadi"],
    }
    area_lower = area.lower().strip()
    city_lower = city.lower().strip()
    prime_areas = premium_areas.get(city_lower, [])
    if any(p in area_lower for p in prime_areas):
        return 1.3   # 30% premium for prime area
    return 1.0       # neutral for unknown area


def get_depreciation_factor(age_years: int) -> float:
    """Returns depreciation multiplier based on property age"""
    if age_years < 5:
        return 1.0     # New — no depreciation
    elif age_years <= 15:
        return 0.90    # Mid-age — 10% depreciation
    elif age_years <= 25:
        return 0.78    # Old — 22% depreciation
    else:
        return 0.65    # Very old — 35% depreciation


def get_liquidity_discount(property_type: str, resale_index: float) -> float:
    """Returns discount applied to get distress value from market value"""
    if resale_index >= 80:
        return 0.10    # High liquidity — 10% discount
    elif resale_index >= 50:
        return 0.20    # Medium liquidity — 20% discount
    else:
        return 0.35    # Low liquidity — 35% discount


def calculate_resale_index(
    city: str, area: str, property_type: str,
    age_years: int, is_rented: bool, has_clear_title: bool
) -> float:
    """Calculates Resale Potential Index from 0 to 100"""
    score = 50  # start neutral

    # Location boost
    loc = get_location_score(city, area)
    if loc > 1.0:
        score += 20

    # Standard property types sell faster
    if property_type.lower() in ["apartment", "villa"]:
        score += 10
    elif property_type.lower() in ["shop"]:
        score += 5
    else:
        score -= 10   # warehouse / plot harder to sell

    # Age penalty
    if age_years < 5:
        score += 10
    elif age_years <= 15:
        score += 0
    elif age_years <= 25:
        score -= 10
    else:
        score -= 20

    # Rented property = investor attractive
    if is_rented:
        score += 5

    # Clear title = highly liquid
    if has_clear_title:
        score += 10
    else:
        score -= 15

    return max(0, min(100, score))  # clamp between 0 and 100


def get_time_to_liquidate(resale_index: float) -> dict:
    """Returns estimated days range to sell the property"""
    if resale_index >= 80:
        return {"min_days": 30,  "max_days": 60}
    elif resale_index >= 60:
        return {"min_days": 60,  "max_days": 120}
    elif resale_index >= 40:
        return {"min_days": 120, "max_days": 240}
    else:
        return {"min_days": 240, "max_days": 540}


def get_confidence_score(
    has_clear_title: bool, age_years: int,
    is_rented: bool, area: str
) -> float:
    """Returns confidence in this valuation from 0.0 to 1.0"""
    score = 0.6  # base confidence
    if has_clear_title:
        score += 0.15
    if age_years < 20:
        score += 0.10
    if is_rented:
        score += 0.05
    if area and len(area) > 2:
        score += 0.05
    return round(min(1.0, score), 2)


def get_risk_flags(
    age_years: int, has_clear_title: bool,
    property_type: str, size_sqft: float, city: str
) -> list:
    """Returns list of risk warnings"""
    flags = []
    if age_years > 25:
        flags.append("Property age exceeds 25 years — structural risk")
    if not has_clear_title:
        flags.append("Title clarity not confirmed — legal risk")
    if property_type.lower() in ["warehouse", "plot"]:
        flags.append("Niche asset type — lower resale liquidity")
    if size_sqft > 5000 and property_type.lower() == "apartment":
        flags.append("Very large apartment — limited buyer pool")
    if size_sqft < 200:
        flags.append("Very small unit — restricted usability")
    return flags


def valuate_property(
    city: str,
    area: str,
    property_type: str,
    size_sqft: float,
    age_years: int,
    is_rented: bool = False,
    has_clear_title: bool = True,
    latitude: float = None,
    longitude: float = None
) -> dict:
    """Main function — runs full valuation and returns complete report"""

    # Step 1: Get base rate
    circle_rate = get_circle_rate(city, property_type)

    # Step 2: Location premium
    location_multiplier = get_location_score(city, area)

    # Step 3: Boost multiplier if coordinates are in known premium zones
    if latitude and longitude:
        # Hyderabad premium zones (Banjara Hills, Jubilee Hills, HiTech City)
        if 17.40 <= latitude <= 17.45 and 78.42 <= longitude <= 78.48:
            location_multiplier = max(location_multiplier, 1.35)
        # Mumbai premium zones (Bandra, Juhu)
        elif 19.04 <= latitude <= 19.08 and 72.82 <= longitude <= 72.87:
            location_multiplier = max(location_multiplier, 1.40)
        # Bangalore premium zones (Koramangala, Indiranagar)
        elif 12.93 <= latitude <= 12.98 and 77.60 <= longitude <= 77.65:
            location_multiplier = max(location_multiplier, 1.35)
        # Delhi premium zones (South Delhi)
        elif 28.52 <= latitude <= 28.58 and 77.18 <= longitude <= 77.24:
            location_multiplier = max(location_multiplier, 1.38)

    # Step 4: Depreciation
    depreciation = get_depreciation_factor(age_years)

    # Step 5: Base market value
    base_value = circle_rate * size_sqft * location_multiplier * depreciation

    # Step 6: Market value range (±10%)
    market_value_min = round(base_value * 0.90)
    market_value_max = round(base_value * 1.10)

    # Step 7: Resale Index
    resale_index = calculate_resale_index(
        city, area, property_type, age_years, is_rented, has_clear_title
    )

    # Step 8: Distress value
    discount = get_liquidity_discount(property_type, resale_index)
    distress_min = round(market_value_min * (1 - discount))
    distress_max = round(market_value_max * (1 - discount))

    # Step 9: Time to liquidate
    liquidation = get_time_to_liquidate(resale_index)

    # Step 10: Confidence score — higher if coordinates provided
    confidence = get_confidence_score(has_clear_title, age_years, is_rented, area)
    if latitude and longitude:
        confidence = round(min(1.0, confidence + 0.05), 2)

    # Step 11: Risk flags
    flags = get_risk_flags(age_years, has_clear_title, property_type, size_sqft, city)

    return {
        "market_value":           {"min": market_value_min, "max": market_value_max},
        "distress_value":         {"min": distress_min, "max": distress_max},
        "resale_potential_index": resale_index,
        "time_to_liquidate":      liquidation,
        "confidence_score":       confidence,
        "risk_flags":             flags,
        "key_drivers": {
            "circle_rate_per_sqft": circle_rate,
            "location_multiplier":  location_multiplier,
            "depreciation_factor":  depreciation,
            "coordinates_used":     latitude is not None and longitude is not None
        }
    }

# Quick test — run this file directly to see output
if __name__ == "__main__":
    result = valuate_property(
        city="hyderabad",
        area="banjara hills",
        property_type="apartment",
        size_sqft=1200,
        age_years=8,
        is_rented=True,
        has_clear_title=True
    )
    import json
    print(json.dumps(result, indent=2))