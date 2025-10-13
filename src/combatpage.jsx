import React, { useEffect, useState } from "react";

export default function TradePage() {
  const [resources, setResources] = useState([]);
  const [setName, setSetName] = useState("Resources");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/resources/resources.json", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        const arr = Array.isArray(json) ? json : json.resources || [];
        setResources(arr);
        setSetName(json.setName || "Resources");
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{setName}</h1>

      {/* Responsive grid: 1+ columns, ~3+ on desktop (no Tailwind breakpoints required) */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
      >
        {resources.map((r) => (
          <div
            key={r.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
          >
            {r.image ? (
              <img
                src={r.image}
                alt={r.name}
                style={{
                  width: "96px",
                  height: "96px",
                  objectFit: "contain",
                  margin: "0 auto 0.75rem",
                }}
              />
            ) : (
              <div className="w-full h-40 rounded-lg mb-3 bg-slate-100 flex items-center justify-center text-slate-500">
                No image
              </div>
            )}

            <div className="text-lg font-semibold">{r.name}</div>
            <div className="text-sm text-slate-600 mt-1">
              Tier {r.tier} • {r.category}
            </div>
            {r.notes && (
              <p className="text-sm mt-2 text-slate-800">{r.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
