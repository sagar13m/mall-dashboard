import { useEffect, useMemo, useState } from "react";
import "./app.css";

const API_BASE = ""; // we use Vite proxy => call "/api/..." directly

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

export default function App() {
  const [malls, setMalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [minBrands, setMinBrands] = useState(0);

  const [selectedKey, setSelectedKey] = useState("");
  const [selectedMall, setSelectedMall] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailErr, setDetailErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiGet("/api/malls");
        if (!alive) return;
        setMalls(data.items || []);
      } catch (e) {
        if (!alive) return;
        setErr(String(e));
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return malls
      .filter(m => (m.productsCount || 0) >= Number(minBrands || 0))
      .filter(m => {
        if (!query) return true;
        return (
          (m.mallName || "").toLowerCase().includes(query) ||
          (m.city || "").toLowerCase().includes(query) ||
          (m.state || "").toLowerCase().includes(query) ||
          (m.mallKey || "").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => (b.productsCount || 0) - (a.productsCount || 0));
  }, [malls, q, minBrands]);

  async function openMall(mallKey) {
    try {
      setSelectedKey(mallKey);
      setSelectedMall(null);
      setDetailErr("");
      setDetailLoading(true);

      const data = await apiGet(`/api/malls/${encodeURIComponent(mallKey)}`);
      setSelectedMall(data);
    } catch (e) {
      setDetailErr(String(e));
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="titleRow">
          <h2>Malls</h2>
          <span className="pill">{filtered.length}/{malls.length}</span>
        </div>

        <div className="controls">
          <input
            className="input"
            placeholder="Search mall / city / state / key…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="row">
            <label className="label">Min brands</label>
            <input
              className="input small"
              type="number"
              min="0"
              value={minBrands}
              onChange={(e) => setMinBrands(e.target.value)}
            />
          </div>
        </div>

        {loading && <div className="muted">Loading malls…</div>}
        {err && <div className="error">Error: {err}</div>}

        <div className="list">
          {filtered.map(m => (
            <button
              key={m.mallKey}
              className={`card ${selectedKey === m.mallKey ? "active" : ""}`}
              onClick={() => openMall(m.mallKey)}
              title={m.mallKey}
            >
              <div className="cardTitle">{m.mallName}</div>
              <div className="cardSub">{m.city}, {m.state}</div>
              <div className="cardMeta">Brands: {m.productsCount}</div>
            </button>
          ))}
        </div>
      </aside>

      <main className="main">
        {!selectedKey && (
          <div className="empty">
            <h2>Select a mall</h2>
            <p>Choose a mall from the left to view its brands/products.</p>
          </div>
        )}

        {selectedKey && detailLoading && (
          <div className="empty">
            <h2>Loading…</h2>
            <p>Fetching mall details.</p>
          </div>
        )}

        {selectedKey && detailErr && (
          <div className="empty">
            <h2>Error</h2>
            <pre className="pre">{detailErr}</pre>
          </div>
        )}

        {selectedMall && (
          <div>
            <div className="header">
              <div>
                <h1 className="h1">{selectedMall.mallName}</h1>
                <div className="muted">{selectedMall.city}, {selectedMall.state}</div>
                <div className="muted smallText">
                  Mall Key: <code>{String(selectedMall.pk || "").replace("MALL#", "")}</code>
                </div>
              </div>
              <div className="pill big">{(selectedMall.products || []).length} brands</div>
            </div>

            <div className="tableWrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Brand name</th>
                    <th>Product ID</th>
                    <th>Store name where found</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedMall.products || []).map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.brandName}</td>
                      <td><code>{p.productId}</code></td>
                      <td>{p.storeName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!selectedMall.products || selectedMall.products.length === 0) && (
                <div className="muted">No brands found for this mall (should be skipped in DB).</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
