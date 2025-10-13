import React, { useEffect, useMemo, useRef, useState } from "react";

const DEFAULTS = ["Food","Materials","Goods","Copper","Tin","Bronze","Gold","Silver","Horses","Fish"];
const KEY = "bbb_resources_v1";

export default function ResourcesPage() {
  const [rows, setRows] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || DEFAULTS.map(n => ({ id: uid(), name: n, qty: 0 })); }
    catch { return DEFAULTS.map(n => ({ id: uid(), name: n, qty: 0 })); }
  });
  const [filter, setFilter] = useState("");
  const undo = useRef([]);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch {} }, [rows]);

  const view = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return f ? rows.filter(r => r.name.toLowerCase().includes(f)) : rows;
  }, [rows, filter]);

  function push() { undo.current.push(rows); if (undo.current.length > 30) undo.current.shift(); }
  function add() { push(); setRows(r => [{ id: uid(), name: "New", qty: 0 }, ...r]); }
  function del(id) { push(); setRows(r => r.filter(x => x.id !== id)); }
  function setName(id, name) { push(); setRows(r => r.map(x => x.id === id ? { ...x, name } : x)); }
  function setQty(id, qty) { push(); setRows(r => r.map(x => x.id === id ? { ...x, qty: clamp(qty) } : x)); }
  function nudge(id, d) { push(); setRows(r => r.map(x => x.id === id ? { ...x, qty: clamp((+x.qty||0)+d) } : x)); }
  function back() { const p = undo.current.pop(); if (p) setRows(p); }

  return (
    <div className="page">
      <h1>📦 Resources</h1>

      <div className="row">
        <button className="btn" onClick={add}>+ Add</button>
        <button className="btn" onClick={back} title="Undo">Undo</button>
        <input className="input" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filter…" />
      </div>

      <div className="card">
        {view.length === 0 && <div className="muted">No matches.</div>}
        {view.map(r => (
          <div key={r.id} className="row wrap">
            <input className="input name" value={r.name} onChange={e=>setName(r.id, e.target.value)} />
            <input className="input qty" inputMode="numeric" value={r.qty} onChange={e=>setQty(r.id, e.target.value)} />
            <div className="row">
              <button className="btn sm" onClick={()=>nudge(r.id,-10)}>-10</button>
              <button className="btn sm" onClick={()=>nudge(r.id,-1)}>-1</button>
              <button className="btn sm" onClick={()=>nudge(r.id,+1)}>+1</button>
              <button className="btn sm" onClick={()=>nudge(r.id,+10)}>+10</button>
              <button className="btn sm danger" onClick={()=>del(r.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const uid = () => Math.random().toString(36).slice(2,10);
const clamp = v => {
  const n = parseInt(String(v).replace(/[^-0-9]/g,""),10);
  if (Number.isNaN(n)) return 0;
  return Math.max(-999999, Math.min(999999, n));
};
