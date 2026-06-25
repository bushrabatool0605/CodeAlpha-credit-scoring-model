import { useState } from "react";

const API_URL = "http://localhost:8000/predict";

const defaultForm = {
  age: "", monthly_income: "", open_credit_lines: "",
  number_of_dependents: "", times_30_59_days_late: "",
  times_60_89_days_late: "", times_90_days_late: "",
};

export default function CreditScorer() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleReset = () => { setForm(defaultForm); setResult(null); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setResult(null); setError("");
    const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v)]));
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.detail || "Server error"); }
      setResult(await res.json());
    } catch (err) {
      setError(err.message || "Cannot reach backend. Make sure FastAPI is running on port 8000.");
    } finally { setLoading(false); }
  };

  const isHigh = result?.prediction === 1;
  const pct = result ? Math.round(result.default_probability * 100) : 0;
  const totalLate = Number(form.times_30_59_days_late) + Number(form.times_60_89_days_late) + Number(form.times_90_days_late);
  const barColor = pct > 50 ? "#A32D2D" : pct > 30 ? "#BA7517" : "#3B6D11";

  const inputStyle = {
    height: 38, padding: "0 12px", border: "0.5px solid #e5e7eb",
    borderRadius: 8, background: "#f9fafb", color: "#111827",
    fontSize: 14, width: "100%", outline: "none",
  };

  const sectionCard = {
    background: "#fff", border: "0.5px solid #e5e7eb",
    borderRadius: 12, overflow: "hidden", marginBottom: "1rem",
  };

  const sectionHeader = {
    padding: "0.85rem 1.25rem", borderBottom: "0.5px solid #e5e7eb",
    display: "flex", alignItems: "center", gap: 10,
  };

  const numBadge = {
    width: 22, height: 22, borderRadius: "50%", background: "#f3f4f6",
    border: "0.5px solid #d1d5db", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 11, fontWeight: 500,
    color: "#6b7280", flexShrink: 0,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, system-ui, sans-serif", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#378ADD" }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>CreditIQ</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>Risk Assessment Platform</div>
            </div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: "#EAF3DE", color: "#3B6D11", fontSize: 11, fontWeight: 500, border: "0.5px solid #C0DD97" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#639922" }} />
            Model online
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "1.5rem", alignItems: "start" }}>

          {/* Left — Form */}
          <div>
            {/* Section 1 */}
            <div style={sectionCard}>
              <div style={sectionHeader}>
                <div style={numBadge}>1</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>Personal information</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>Applicant demographics</div>
                </div>
              </div>
              <div style={{ padding: "1rem 1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {[
                    { name: "age", label: "Age", placeholder: "35" },
                    { name: "number_of_dependents", label: "Dependents", placeholder: "2" },
                  ].map((f) => (
                    <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280" }}>{f.label}</label>
                      <input name={f.name} type="number" value={form[f.name]} onChange={handleChange}
                        placeholder={f.placeholder} min={0} required style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#378ADD"; e.target.style.background = "#fff"; }}
                        onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div style={sectionCard}>
              <div style={sectionHeader}>
                <div style={numBadge}>2</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>Financial profile</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>Income and credit exposure</div>
                </div>
              </div>
              <div style={{ padding: "1rem 1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  {[
                    { name: "monthly_income", label: "Monthly income ($)", placeholder: "5,000" },
                    { name: "open_credit_lines", label: "Open credit lines", placeholder: "4" },
                  ].map((f) => (
                    <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280" }}>{f.label}</label>
                      <input name={f.name} type="number" value={form[f.name]} onChange={handleChange}
                        placeholder={f.placeholder} min={0} required style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#378ADD"; e.target.style.background = "#fff"; }}
                        onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div style={{ ...sectionCard, marginBottom: 0 }}>
              <div style={sectionHeader}>
                <div style={numBadge}>3</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>Delinquency history</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>Late payments in last 2 years</div>
                </div>
              </div>
              <div style={{ padding: "1rem 1.25rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  {[
                    { name: "times_30_59_days_late", label: "30–59 days late", placeholder: "0" },
                    { name: "times_60_89_days_late", label: "60–89 days late", placeholder: "0" },
                    { name: "times_90_days_late", label: "90+ days late", placeholder: "0" },
                  ].map((f) => (
                    <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      <label style={{ fontSize: 12, fontWeight: 500, color: "#6b7280" }}>{f.label}</label>
                      <input name={f.name} type="number" value={form[f.name]} onChange={handleChange}
                        placeholder={f.placeholder} min={0} required style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "#378ADD"; e.target.style.background = "#fff"; }}
                        onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#f9fafb"; }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: "0.75rem", padding: "0.6rem 1rem", borderRadius: 8, background: "#FCEBEB", color: "#A32D2D", fontSize: 12, border: "0.5px solid #F7C1C1" }}>
                ⚠ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.65rem", marginTop: "1.1rem" }}>
              <button type="submit" disabled={loading} style={{ flex: 1, height: 40, borderRadius: 8, border: "none", background: loading ? "#6b7280" : "#185FA5", color: "#fff", fontSize: 13, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Analyzing…" : "Run assessment"}
              </button>
              <button type="button" onClick={handleReset} style={{ height: 40, padding: "0 16px", borderRadius: 8, border: "0.5px solid #d1d5db", background: "transparent", color: "#6b7280", fontSize: 13, cursor: "pointer" }}>
                Clear form
              </button>
            </form>
          </div>

          {/* Right — Result panel */}
          <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "0.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>Risk report</span>
              <span style={{ fontSize: 16, color: "#9ca3af" }}>📋</span>
            </div>
            <div style={{ padding: "1.25rem" }}>

              {!result && !loading && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 300, textAlign: "center" }}>
                  <span style={{ fontSize: 30, color: "#d1d5db" }}>📊</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#6b7280" }}>No assessment yet</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Fill in all three sections<br />and run the assessment</div>
                  </div>
                </div>
              )}

              {loading && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 300, fontSize: 13, color: "#6b7280" }}>
                  ⏳ Analyzing applicant…
                </div>
              )}

              {result && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

                  {/* Verdict */}
                  <div style={{ borderRadius: 10, padding: "1.1rem", display: "flex", alignItems: "flex-start", gap: 12, background: isHigh ? "#FCEBEB" : "#EAF3DE", border: `0.5px solid ${isHigh ? "#F7C1C1" : "#C0DD97"}` }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: isHigh ? "#F7C1C1" : "#C0DD97", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {isHigh ? "⚠" : "✓"}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: isHigh ? "#993C1D" : "#3B6D11", marginBottom: 3 }}>
                        {isHigh ? "High risk" : "Low risk"}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 500, color: isHigh ? "#791F1F" : "#27500A" }}>
                        {isHigh ? "Likely to default" : "Creditworthy applicant"}
                      </div>
                      <div style={{ fontSize: 12, color: isHigh ? "#993C1D" : "#3B6D11", marginTop: 3 }}>
                        {isHigh ? "90+ day delinquency expected within 2 years" : "No serious delinquency expected within 2 years"}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: "0.5px", background: "#e5e7eb" }} />

                  {/* Probability */}
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>Default probability</span>
                      <span style={{ fontSize: 28, fontWeight: 600, color: barColor }}>{pct}%</span>
                    </div>
                    <div style={{ height: 8, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 999, transition: "width .7s ease" }} />
                    </div>
                    <div style={{ display: "flex", gap: 3, marginTop: 5 }}>
                      {[["#639922", 3], ["#BA7517", 2], ["#A32D2D", 2]].map(([c, f], i) => (
                        <div key={i} style={{ flex: f, height: 3, borderRadius: 2, background: c }} />
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      {["Low 0–30%", "Medium 30–50%", "High 50%+"].map((l) => (
                        <span key={l} style={{ fontSize: 10, color: "#9ca3af" }}>{l}</span>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: "0.5px", background: "#e5e7eb" }} />

                  {/* Factors */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9ca3af", marginBottom: "0.6rem" }}>Contributing factors</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      {[
                        ["Total late payments", `${totalLate} instance${totalLate !== 1 ? "s" : ""}`],
                        ["Income level", Number(form.monthly_income) < 3400 ? "Below $3,400" : "Above $3,400"],
                        ["Open credit lines", `${form.open_credit_lines} active`],
                        ["Dependents", `${form.number_of_dependents} person${Number(form.number_of_dependents) !== 1 ? "s" : ""}`],
                      ].map(([name, val]) => (
                        <div key={name} style={{ background: "#f9fafb", borderRadius: 8, padding: "0.65rem 0.85rem" }}>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>{name}</div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div style={{ borderRadius: 8, padding: "0.85rem 1rem", background: isHigh ? "#FCEBEB" : "#EAF3DE", borderLeft: `3px solid ${isHigh ? "#F09595" : "#97C459"}` }}>
                    <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: isHigh ? "#791F1F" : "#27500A", marginBottom: 4 }}>Recommendation</div>
                    <div style={{ fontSize: 12, lineHeight: 1.6, color: isHigh ? "#993C1D" : "#3B6D11" }}>
                      {isHigh
                        ? "Refer to underwriting for manual review. Do not approve automatically — request additional income verification or collateral before proceeding."
                        : "Applicant meets automated approval criteria. Proceed with standard credit line offer based on income-to-debt ratio."}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}