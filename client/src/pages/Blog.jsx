import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { Link, useSearchParams } from "react-router-dom";

export default function Blog() {
  const [sp, setSp] = useSearchParams();

  const [items, setItems] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0, q: "", tag: "" });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const q = sp.get("q") || "";
  const tag = sp.get("tag") || "";
  const page = parseInt(sp.get("page") || "1", 10);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/api/posts", {
        params: { q, tag, page, limit: 9 }
      });
      setItems(res.data.items || []);
      setFeatured(res.data.featured || []);
      setMeta(res.data.meta || { page: 1, pages: 1, total: 0, q, tag });
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tag, page]);

  const allTags = useMemo(() => {
    const s = new Set();
    [...featured, ...items].forEach((p) => (p.tags || []).forEach((t) => s.add(t)));
    return Array.from(s).slice(0, 16);
  }, [featured, items]);

  function setQuery(next) {
    const nextParams = {};
    if (next.q) nextParams.q = next.q;
    if (next.tag) nextParams.tag = next.tag;
    nextParams.page = String(next.page || 1);
    setSp(nextParams);
  }

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <h1 className="h2">Blog</h1>
          <p className="muted">Articles, updates, and learning resources.</p>
        </div>

        <div className="row" style={{ gap: 10 }}>
          <input
            className="input"
            style={{ width: 280 }}
            placeholder="Search posts..."
            value={q}
            onChange={(e) => setQuery({ q: e.target.value, tag, page: 1 })}
          />
          <button className="btn btnGhost" onClick={() => setQuery({ q: "", tag: "", page: 1 })}>
            Clear
          </button>
        </div>
      </div>

      {err && <div className="alert" style={{ marginTop: 12 }}>{err}</div>}
      {loading && <div className="card" style={{ marginTop: 12 }}>Loading...</div>}

      {!loading && (
        <>
          {featured.length > 0 && (
            <div className="blogFeatured">
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="kicker">Featured</div>
                  <div className="title" style={{ fontSize: 18, marginTop: 4 }}>
                    Recommended posts
                  </div>
                </div>
              </div>

              <div className="featuredGrid">
                {featured.slice(0, 3).map((p) => (
                  <Link key={p.slug} className="featuredCard" to={`/blog/${p.slug}`}>
                    <div className="featuredCover" style={{ backgroundImage: p.coverImage ? `url(${p.coverImage})` : undefined }} />
                    <div className="featuredBody">
                      <div className="tagRow">
                        {(p.tags || []).slice(0, 3).map((t) => (
                          <span key={t} className="tagPill" onClick={(e) => { e.preventDefault(); setQuery({ q, tag: t, page: 1 }); }}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="featuredTitle">{p.title}</div>
                      <div className="muted small">{p.excerpt || "Read more..."}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {allTags.length > 0 && (
            <div className="tagBar">
              <button
                className={`tagPill ${tag ? "" : "active"}`}
                onClick={() => setQuery({ q, tag: "", page: 1 })}
              >
                All
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  className={`tagPill ${tag === t ? "active" : ""}`}
                  onClick={() => setQuery({ q, tag: t, page: 1 })}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <div className="row" style={{ justifyContent: "space-between", marginTop: 14 }}>
            <div className="muted small">
              Showing page <b>{meta.page}</b> of <b>{meta.pages}</b> • Total: <b>{meta.total}</b>
              {tag ? <> • Tag: <b>{tag}</b></> : null}
              {q ? <> • Search: <b>{q}</b></> : null}
            </div>
          </div>

          <div className="grid" style={{ marginTop: 12 }}>
            {items.map((p) => (
              <Link key={p.slug} className="blogCard" to={`/blog/${p.slug}`}>
                <div className="blogCover" style={{ backgroundImage: p.coverImage ? `url(${p.coverImage})` : undefined }} />
                <div className="blogBody">
                  <div className="tagRow">
                    {(p.tags || []).slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="tagPill"
                        onClick={(e) => {
                          e.preventDefault();
                          setQuery({ q, tag: t, page: 1 });
                        }}
                      >
                        {t}
                      </span>
                    ))}
                    {p.isFeatured && <span className="tagPill active">Featured</span>}
                  </div>
                  <div className="title" style={{ marginTop: 10 }}>{p.title}</div>
                  <div className="muted small" style={{ marginTop: 6 }}>{p.excerpt || "Read more..."}</div>
                </div>
              </Link>
            ))}

            {items.length === 0 && (
              <div className="card" style={{ gridColumn: "1 / -1" }}>
                No posts found.
              </div>
            )}
          </div>

          <div className="pager">
            <button
              className="btn btnGhost"
              disabled={meta.page <= 1}
              onClick={() => setQuery({ q, tag, page: meta.page - 1 })}
            >
              ← Prev
            </button>

            <div className="muted small">
              Page <b>{meta.page}</b> / <b>{meta.pages}</b>
            </div>

            <button
              className="btn btnGhost"
              disabled={meta.page >= meta.pages}
              onClick={() => setQuery({ q, tag, page: meta.page + 1 })}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}