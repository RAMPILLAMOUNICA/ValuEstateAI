import { useState } from "react"
import axios from "axios"

export default function InputForm({ loading, setLoading, setResult, setSubmittedData }) {
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")
  const [propertyType, setPropertyType] = useState("apartment")
  const [sizeSqft, setSizeSqft] = useState("")
  const [ageYears, setAgeYears] = useState("")
  const [isRented, setIsRented] = useState(false)
  const [hasClearTitle, setHasClearTitle] = useState(true)
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [photoPreview, setPhotoPreview] = useState(null)

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!city || !area || !sizeSqft || !ageYears) {
      alert("Please fill all required fields")
      return
    }
    setLoading(true)
    try {
      const payload = {
        city, area,
        property_type: propertyType,
        size_sqft: parseFloat(sizeSqft),
        age_years: parseInt(ageYears),
        is_rented: isRented,
        has_clear_title: hasClearTitle,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      }
      const res = await axios.post("https://valuestate-backend.onrender.com/valuate", payload)
      setSubmittedData({ ...payload, photoPreview })
      setResult(res.data)
    } catch {
      alert("Error connecting to backend. Make sure FastAPI is running.")
    }
    setLoading(false)
  }

  return (
    <div className="glass-card" style={{ padding: 36, animation: "fadeUp 0.6s ease forwards" }}>

      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
          Enter Property Details
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
          Fill in the details below to generate an instant AI-powered valuation report
        </p>
      </div>

      {/* Grid fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
        <div style={{ marginBottom: 18 }}>
          <label className="field-label">City *</label>
          <input className="glass-input" placeholder="e.g. Hyderabad"
            value={city} onChange={e => setCity(e.target.value)} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="field-label">Area / Locality *</label>
          <input className="glass-input" placeholder="e.g. Banjara Hills"
            value={area} onChange={e => setArea(e.target.value)} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="field-label">Property Type *</label>
          <select className="glass-input" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="shop">Shop</option>
            <option value="warehouse">Warehouse</option>
          </select>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="field-label">Size (sq ft) *</label>
          <input className="glass-input" type="number" placeholder="e.g. 1200"
            value={sizeSqft} onChange={e => setSizeSqft(e.target.value)} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="field-label">Age of Building (years) *</label>
          <input className="glass-input" type="number" placeholder="e.g. 8"
            value={ageYears} onChange={e => setAgeYears(e.target.value)} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "8px 0 20px" }} />

      {/* Coordinates */}
      <div style={{ marginBottom: 8 }}>
        <label className="field-label" style={{ marginBottom: 12 }}>
          Location Coordinates
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 400, marginLeft: 8, textTransform: "none" }}>
            optional — improves accuracy
          </span>
        </label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", marginBottom: 18 }}>
        <div>
          <label className="field-label">Latitude</label>
          <input className="glass-input" type="number" placeholder="e.g. 17.4156"
            value={latitude} onChange={e => setLatitude(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Longitude</label>
          <input className="glass-input" type="number" placeholder="e.g. 78.4347"
            value={longitude} onChange={e => setLongitude(e.target.value)} />
        </div>
      </div>

      {/* Photo upload */}
      <div style={{ marginBottom: 24 }}>
        <label className="field-label">
          Property Photo
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 400, marginLeft: 8, textTransform: "none" }}>
            optional — shown in report
          </span>
        </label>
        <div
          onClick={() => document.getElementById("photo-upload").click()}
          style={{
            marginTop: 8,
            border: "1px dashed rgba(255,255,255,0.15)",
            borderRadius: 14, padding: 20,
            textAlign: "center",
            background: "rgba(255,255,255,0.03)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Property"
              style={{ maxHeight: 140, borderRadius: 10, maxWidth: "100%", objectFit: "cover" }} />
          ) : (
            <div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Click to upload property photo</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 4 }}>JPG, PNG supported</div>
            </div>
          )}
        </div>
        <input id="photo-upload" type="file" accept="image/*"
          style={{ display: "none" }} onChange={handlePhoto} />
      </div>

      {/* Checkboxes */}
      <div style={{
        display: "flex", gap: 24, marginBottom: 28,
        padding: "14px 18px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)"
      }}>
        <label className="glass-checkbox">
          <input type="checkbox" checked={isRented} onChange={e => setIsRented(e.target.checked)} />
          Property is currently rented
        </label>
        <label className="glass-checkbox">
          <input type="checkbox" checked={hasClearTitle} onChange={e => setHasClearTitle(e.target.checked)} />
          Has clear legal title
        </label>
      </div>

      <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading ? "Analysing property..." : "Generate Valuation Report →"}
      </button>
    </div>
  )
}