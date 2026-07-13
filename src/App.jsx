import { useState, useMemo, useRef, useEffect } from "react";
import {
  Gem, Sparkles, Cross, Heart, Star, Watch, ShoppingBag, ShoppingCart,
  User, Lock, MessageCircle, X, Plus, Minus, Search, Menu, ChevronRight,
  Send, Bot, LogOut, Package, Settings, Trash2, CheckCircle2, Phone,
  Mail, Instagram, ArrowRight, Sparkle, CircleDot, Diamond
} from "lucide-react";

/* ---------------------------------------------------------------
   TOKENS
   bg: #150F1B  surface: #1F1729  surfaceAlt: #241B31
   gold: #C9A24C  rose: #C97B84  teal: #4C8577  ivory: #F3EDE4
   muted: #B8AFC2
---------------------------------------------------------------- */

const CATEGORIES = [
  { id: "joias", label: "Joias", icon: Gem, color: "#C9A24C" },
  { id: "bijuterias", label: "Bijuterias", icon: Sparkles, color: "#C97B84" },
  { id: "religiosos", label: "Artigos Religiosos", icon: Cross, color: "#4C8577" },
];

const PRODUCTS = [
  { id: 1, name: "Anel Solitário Ouro 18k", category: "joias", price: 1890, material: "Ouro 18k, Zircônia", icon: Diamond, desc: "Anel clássico com zircônia lapidada, acabamento polido espelhado." },
  { id: 2, name: "Corrente Veneziana", category: "joias", price: 1240, material: "Ouro 18k", icon: CircleDot, desc: "Elo veneziano cerrado, 60cm, fecho reforçado." },
  { id: 3, name: "Brinco Argola Cravejada", category: "joias", price: 780, material: "Ouro 18k, Zircônias", icon: Gem, desc: "Argola média cravejada, ideal para o dia a dia." },
  { id: 4, name: "Colar Choker Pérolas", category: "bijuterias", price: 129, material: "Pérolas sintéticas, banho dourado", icon: Sparkles, desc: "Choker delicado com pérolas, ajuste em três alturas." },
  { id: 5, name: "Pulseira Berloques", category: "bijuterias", price: 89, material: "Liga metálica dourada", icon: Sparkle, desc: "Berloques temáticos intercambiáveis, fecho lagosta." },
  { id: 6, name: "Conjunto Brinco + Anel", category: "bijuterias", price: 149, material: "Banho ouro rosé", icon: Heart, desc: "Conjunto combinando com pedras coloridas facetadas." },
  { id: 7, name: "Terço Prata 925", category: "religiosos", price: 340, material: "Prata 925, Ágata", icon: Cross, desc: "Terço tradicional com contas em ágata natural." },
  { id: 8, name: "Medalha N. Sra. Aparecida", category: "religiosos", price: 210, material: "Ouro 18k", icon: Star, desc: "Medalha em ouro com corrente veneziana 45cm." },
  { id: 9, name: "Crucifixo de Parede", category: "religiosos", price: 165, material: "Madeira e metal dourado", icon: Cross, desc: "Peça artesanal para oratório ou sala de oração." },
];

const WHATSAPP_NUMBER = "5512935005340";

function formatBRL(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function FacetCard({ children, accent = "#C9A24C", style = {}, className = "" }) {
  return (
    <div
      className={className}
      style={{
        clipPath: "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
        background: "#1F1729",
        border: `1px solid ${accent}33`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState("loja"); // loja | admin
  const [activeCategory, setActiveCategory] = useState("todos");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [interests, setInterests] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [toast, setToast] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      const catOk = activeCategory === "todos" || p.category === activeCategory;
      const searchOk = p.name.toLowerCase().includes(search.toLowerCase());
      return catOk && searchOk;
    });
  }, [activeCategory, search]);

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} adicionado ao carrinho`);
  }

  function changeQty(id, delta) {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0));
  }

  function toggleInterest(product) {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const exists = interests.find(i => i.id === product.id);
    setInterests(prev => exists ? prev.filter(i => i.id !== product.id) : [...prev, product]);
    showToast(exists ? "Interesse removido" : "Interesse registrado");
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function whatsappLink(product) {
    const base = `Olá! Tenho interesse no produto: ${product ? product.name : ""}`;
    const cartMsg = cart.length
      ? ` | Itens no carrinho: ${cart.map(i => `${i.qty}x ${i.name}`).join(", ")} | Total: ${formatBRL(cartTotal)}`
      : "";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(base + cartMsg)}`;
  }

  if (route === "admin") {
    return (
      <AdminPanel
        authed={adminAuthed}
        pass={adminPass}
        setPass={setAdminPass}
        error={adminError}
        onLogin={(pw) => {
          if (pw === "loja2026") { setAdminAuthed(true); setAdminError(""); }
          else setAdminError("Senha incorreta.");
        }}
        onExit={() => { setRoute("loja"); setAdminAuthed(false); }}
        interests={interests}
      />
    );
  }

  return (
    <div style={{ background: "#150F1B", color: "#F3EDE4", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Cormorant Garamond', serif; }
        ::selection { background: #C9A24C55; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #C9A24C55; border-radius: 4px; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "#150F1Bee", backdropFilter: "blur(8px)", borderBottom: "1px solid #C9A24C22" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="md:hidden" onClick={() => setMenuOpen(m => !m)} style={{ color: "#F3EDE4" }}>
              <Menu size={22} />
            </button>
            <Gem size={22} color="#C9A24C" />
            <span className="font-display" style={{ fontSize: 26, fontWeight: 700, letterSpacing: 0.5 }}>Lumière Fé</span>
          </div>

          <nav className="hidden md:flex" style={{ gap: 24, fontSize: 14 }}>
            <button onClick={() => setActiveCategory("todos")} style={{ color: activeCategory === "todos" ? "#C9A24C" : "#B8AFC2" }}>Todos</button>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{ color: activeCategory === c.id ? c.color : "#B8AFC2" }}>
                {c.label}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a href={whatsappLink(null)} target="_blank" rel="noreferrer" title="Fale no WhatsApp Business" style={{ color: "#4C8577" }}>
              <Phone size={20} />
            </a>
            <button onClick={() => user ? setProfileOpen(true) : setAuthOpen(true)} title="Minha conta">
              <User size={20} color={user ? "#C9A24C" : "#F3EDE4"} />
            </button>
            <button onClick={() => setCartOpen(true)} style={{ position: "relative" }} title="Carrinho">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -8, right: -10, background: "#C97B84", fontSize: 10, borderRadius: 999, padding: "1px 6px", fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden" style={{ padding: "0 20px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => { setActiveCategory("todos"); setMenuOpen(false); }} style={{ textAlign: "left", color: "#B8AFC2" }}>Todos os produtos</button>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => { setActiveCategory(c.id); setMenuOpen(false); }} style={{ textAlign: "left", color: c.color }}>
                {c.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 20px 40px", display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
        <div>
          <p style={{ color: "#C9A24C", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>Joias · Bijuterias · Fé</p>
          <h1 className="font-display" style={{ fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.05, fontWeight: 700, maxWidth: 640 }}>
            Peças que carregam significado, lapidadas para durar.
          </h1>
          <p style={{ color: "#B8AFC2", marginTop: 14, maxWidth: 520, fontSize: 15 }}>
            Um catálogo entre o brilho do ouro e a delicadeza da fé — para presentear, guardar ou usar todos os dias.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "#C9A24C", color: "#150F1B", padding: "12px 22px", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, clipPath: "polygon(0 8px,8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}>
              Ver catálogo <ArrowRight size={16} />
            </button>
            <a href={whatsappLink(null)} target="_blank" rel="noreferrer"
              style={{ border: "1px solid #4C8577", color: "#8fc2b3", padding: "12px 22px", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#1F1729", border: "1px solid #C9A24C33", padding: "10px 14px", maxWidth: 420 }}>
          <Search size={16} color="#B8AFC2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar produto..."
            style={{ background: "transparent", border: "none", outline: "none", color: "#F3EDE4", width: "100%", fontSize: 14 }}
          />
        </div>
      </div>

      {/* CATALOGO */}
      <section id="catalogo" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
          {filtered.map(p => {
            const cat = CATEGORIES.find(c => c.id === p.category);
            const Icon = p.icon;
            const isInterest = interests.some(i => i.id === p.id);
            return (
              <FacetCard key={p.id} accent={cat.color} className="group" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div onClick={() => setSelectedProduct(p)} style={{ cursor: "pointer", height: 160, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${cat.color}22, #150F1B)` }}>
                  <Icon size={54} color={cat.color} strokeWidth={1.2} />
                </div>
                <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: cat.color }}>{cat.label}</span>
                  <h3 className="font-display" style={{ fontSize: 19, fontWeight: 600, cursor: "pointer" }} onClick={() => setSelectedProduct(p)}>{p.name}</h3>
                  <p style={{ fontSize: 12, color: "#B8AFC2" }}>{p.material}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ fontWeight: 700, color: "#F3EDE4" }}>{formatBRL(p.price)}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => toggleInterest(p)} title="Registrar interesse">
                        <Heart size={18} color={isInterest ? "#C97B84" : "#B8AFC2"} fill={isInterest ? "#C97B84" : "none"} />
                      </button>
                      <button onClick={() => addToCart(p)} title="Adicionar ao carrinho">
                        <ShoppingBag size={18} color="#C9A24C" />
                      </button>
                    </div>
                  </div>
                </div>
              </FacetCard>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p style={{ color: "#B8AFC2", textAlign: "center", marginTop: 40 }}>Nenhum produto encontrado para essa busca.</p>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #C9A24C22", padding: "32px 20px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, color: "#B8AFC2", fontSize: 13 }}>
        <span>© 2026 Lumière Fé — joias, bijuterias e artigos religiosos.</span>
        <div style={{ display: "flex", gap: 16 }}>
          <button onClick={() => setRoute("admin")} style={{ display: "flex", alignItems: "center", gap: 6, color: "#B8AFC2" }}>
            <Lock size={13} /> Painel administrativo
          </button>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 6 }}><Instagram size={13} /> @lumierefe</a>
        </div>
      </footer>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <Modal onClose={() => setSelectedProduct(null)}>
          <ProductDetail
            product={selectedProduct}
            onAddCart={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
            onInterest={() => toggleInterest(selectedProduct)}
            isInterest={interests.some(i => i.id === selectedProduct.id)}
            whatsappLink={whatsappLink(selectedProduct)}
          />
        </Modal>
      )}

      {/* CART DRAWER */}
      {cartOpen && (
        <Drawer onClose={() => setCartOpen(false)} title="Seu carrinho">
          {cart.length === 0 ? (
            <p style={{ color: "#B8AFC2", marginTop: 20 }}>Seu carrinho está vazio.</p>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
                {cart.map(i => (
                  <div key={i.id} style={{ display: "flex", gap: 12, alignItems: "center", borderBottom: "1px solid #C9A24C22", paddingBottom: 12 }}>
                    <i.icon size={28} color="#C9A24C" />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{i.name}</p>
                      <p style={{ fontSize: 12, color: "#B8AFC2" }}>{formatBRL(i.price)}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => changeQty(i.id, -1)}><Minus size={14} /></button>
                      <span>{i.qty}</span>
                      <button onClick={() => changeQty(i.id, 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <span>Total</span><span>{formatBRL(cartTotal)}</span>
              </div>
              <a href={whatsappLink(null)} target="_blank" rel="noreferrer"
                style={{ marginTop: 16, background: "#4C8577", color: "#F3EDE4", padding: "12px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600 }}>
                <MessageCircle size={16} /> Fechar pedido no WhatsApp
              </a>
            </>
          )}
        </Drawer>
      )}

      {/* AUTH MODAL */}
      {authOpen && (
        <Modal onClose={() => setAuthOpen(false)}>
          <AuthForm onSuccess={(u) => { setUser(u); setAuthOpen(false); showToast(`Bem-vindo(a), ${u.name}!`); }} />
        </Modal>
      )}

      {/* PROFILE DRAWER */}
      {profileOpen && user && (
        <Drawer onClose={() => setProfileOpen(false)} title="Minha conta">
          <div style={{ marginTop: 12 }}>
            <p style={{ fontWeight: 700 }}>{user.name}</p>
            <p style={{ color: "#B8AFC2", fontSize: 13 }}>{user.email}</p>
            <p style={{ color: "#B8AFC2", fontSize: 13 }}>{user.phone}</p>
          </div>
          <h4 style={{ marginTop: 24, marginBottom: 10, color: "#C9A24C", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>Produtos de interesse</h4>
          {interests.length === 0 ? (
            <p style={{ color: "#B8AFC2", fontSize: 13 }}>Você ainda não marcou interesse em nenhum produto.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {interests.map(i => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                  <span>{i.name}</span>
                  <button onClick={() => toggleInterest(i)}><Trash2 size={14} color="#C97B84" /></button>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => { setUser(null); setProfileOpen(false); }} style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 8, color: "#B8AFC2", fontSize: 13 }}>
            <LogOut size={14} /> Sair da conta
          </button>
        </Drawer>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#1F1729", border: "1px solid #C9A24C55", padding: "10px 18px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, zIndex: 60 }}>
          <CheckCircle2 size={16} color="#C9A24C" /> {toast}
        </div>
      )}

      {/* AI CHAT AGENT */}
      <AiAgent open={chatOpen} setOpen={setChatOpen} products={PRODUCTS} whatsappLink={whatsappLink(null)} />
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#150F1Bcc", backdropFilter: "blur(3px)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#1F1729", border: "1px solid #C9A24C33", maxWidth: 480, width: "100%", padding: 24, position: "relative", maxHeight: "88vh", overflowY: "auto" }} className="scrollbar-thin">
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, color: "#B8AFC2" }}><X size={18} /></button>
        {children}
      </div>
    </div>
  );
}

function Drawer({ children, onClose, title }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#150F1Bcc", zIndex: 70 }}>
      <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 0, right: 0, height: "100%", width: "min(380px, 100%)", background: "#1F1729", borderLeft: "1px solid #C9A24C33", padding: 22, overflowY: "auto" }} className="scrollbar-thin">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProductDetail({ product, onAddCart, onInterest, isInterest, whatsappLink }) {
  const Icon = product.icon;
  return (
    <div>
      <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", background: "#150F1B", marginBottom: 16 }}>
        <Icon size={64} color="#C9A24C" strokeWidth={1.2} />
      </div>
      <h2 className="font-display" style={{ fontSize: 26, fontWeight: 700 }}>{product.name}</h2>
      <p style={{ color: "#B8AFC2", fontSize: 13, marginTop: 4 }}>{product.material}</p>
      <p style={{ marginTop: 12, fontSize: 14, color: "#F3EDE4dd" }}>{product.desc}</p>
      <p style={{ marginTop: 16, fontSize: 24, fontWeight: 700, color: "#C9A24C" }}>{formatBRL(product.price)}</p>
      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <button onClick={onAddCart} style={{ background: "#C9A24C", color: "#150F1B", padding: "10px 18px", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <ShoppingBag size={16} /> Adicionar ao carrinho
        </button>
        <button onClick={onInterest} style={{ border: "1px solid #C97B84", color: "#C97B84", padding: "10px 18px", display: "flex", alignItems: "center", gap: 6 }}>
          <Heart size={16} fill={isInterest ? "#C97B84" : "none"} /> {isInterest ? "Remover interesse" : "Registrar interesse"}
        </button>
        <a href={whatsappLink} target="_blank" rel="noreferrer" style={{ border: "1px solid #4C8577", color: "#8fc2b3", padding: "10px 18px", display: "flex", alignItems: "center", gap: 6 }}>
          <MessageCircle size={16} /> Perguntar no WhatsApp
        </a>
      </div>
    </div>
  );
}

function AuthForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!name || !email) { setError("Preencha nome e e-mail."); return; }
    onSuccess({ name, email, phone });
  }

  return (
    <form onSubmit={submit}>
      <h2 className="font-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Entrar ou criar conta</h2>
      <p style={{ color: "#B8AFC2", fontSize: 13, marginBottom: 18 }}>Cadastre-se para registrar interesse em peças e acompanhar seus pedidos.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" style={inputStyle} />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" type="email" style={inputStyle} />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="WhatsApp (opcional)" style={inputStyle} />
      </div>
      {error && <p style={{ color: "#C97B84", fontSize: 12, marginTop: 8 }}>{error}</p>}
      <button type="submit" style={{ marginTop: 18, background: "#C9A24C", color: "#150F1B", padding: "11px", width: "100%", fontWeight: 700 }}>
        Continuar
      </button>
    </form>
  );
}

const inputStyle = {
  background: "#150F1B", border: "1px solid #C9A24C33", padding: "10px 12px", color: "#F3EDE4", fontSize: 14, outline: "none",
};

function AdminPanel({ authed, pass, setPass, error, onLogin, onExit, interests }) {
  if (!authed) {
    return (
      <div style={{ background: "#150F1B", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#F3EDE4", fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: "#1F1729", border: "1px solid #C9A24C33", padding: 32, width: 340 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Lock size={18} color="#C9A24C" />
            <h2 style={{ fontWeight: 700, fontSize: 18 }}>Painel administrativo</h2>
          </div>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Senha de administrador" style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }} />
          {error && <p style={{ color: "#C97B84", fontSize: 12, marginTop: 8 }}>{error}</p>}
          <button onClick={() => onLogin(pass)} style={{ marginTop: 16, background: "#C9A24C", color: "#150F1B", padding: "10px", width: "100%", fontWeight: 700 }}>Entrar</button>
          <button onClick={onExit} style={{ marginTop: 10, color: "#B8AFC2", fontSize: 12, width: "100%", textAlign: "center" }}>Voltar à loja</button>
          <p style={{ marginTop: 14, fontSize: 11, color: "#B8AFC2" }}>Demo: senha "loja2026". Em produção, use autenticação real (ex.: Supabase Auth / JWT) — ver README.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#150F1B", minHeight: "100vh", color: "#F3EDE4", fontFamily: "Inter, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #C9A24C22" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Settings size={18} color="#C9A24C" /><span style={{ fontWeight: 700 }}>Painel administrativo — Lumière Fé</span>
        </div>
        <button onClick={onExit} style={{ color: "#B8AFC2", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><LogOut size={14} /> Sair</button>
      </header>
      <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
        <h3 style={{ color: "#C9A24C", fontSize: 13, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Catálogo de produtos</h3>
        <div style={{ border: "1px solid #C9A24C22", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#1F1729", textAlign: "left" }}>
                <th style={thStyle}>Produto</th><th style={thStyle}>Categoria</th><th style={thStyle}>Preço</th><th style={thStyle}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map(p => (
                <tr key={p.id} style={{ borderTop: "1px solid #C9A24C15" }}>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{p.category}</td>
                  <td style={tdStyle}>{formatBRL(p.price)}</td>
                  <td style={tdStyle}><button style={{ color: "#C9A24C" }}>Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={{ color: "#C9A24C", fontSize: 13, textTransform: "uppercase", letterSpacing: 1, margin: "28px 0 12px" }}>Registros de interesse (nesta sessão)</h3>
        {interests.length === 0 ? (
          <p style={{ color: "#B8AFC2", fontSize: 13 }}>Nenhum registro de interesse ainda.</p>
        ) : (
          <ul style={{ fontSize: 13, color: "#B8AFC2", display: "flex", flexDirection: "column", gap: 6 }}>
            {interests.map(i => <li key={i.id}>• {i.name}</li>)}
          </ul>
        )}
        <p style={{ marginTop: 24, fontSize: 12, color: "#B8AFC2", maxWidth: 600 }}>
          Este painel é uma demonstração front-end. Em produção, conecte a um backend (ex.: Supabase, Firebase ou API própria)
          para persistir produtos, pedidos e registros de interesse — detalhes no README do repositório.
        </p>
      </div>
    </div>
  );
}
const thStyle = { padding: "10px 12px", fontWeight: 600, color: "#B8AFC2" };
const tdStyle = { padding: "10px 12px" };

/* ---------------- AI AGENT ---------------- */
function AiAgent({ open, setOpen, products, whatsappLink }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Olá! Sou a assistente virtual da Lumière Fé ✨ Posso ajudar com materiais, tamanhos, preços ou indicar uma peça. O que você procura?" }
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  function reply(text) {
    const t = text.toLowerCase();
    const found = products.find(p => t.includes(p.name.toLowerCase().split(" ")[0].toLowerCase()));
    if (found) return `Temos "${found.name}" por ${formatBRL(found.price)}, em ${found.material}. Quer que eu te direcione ao WhatsApp para fechar o pedido?`;
    if (t.includes("preço") || t.includes("valor")) return "Os preços variam de R$ 89 (bijuterias) a R$ 1.890 (joias em ouro 18k). Me diga a categoria e eu detalho melhor.";
    if (t.includes("ouro")) return "Trabalhamos com ouro 18k em anéis, correntes e brincos. Quer ver as opções da categoria Joias?";
    if (t.includes("terço") || t.includes("religios") || t.includes("medalha") || t.includes("crucifixo")) return "Nossa linha de artigos religiosos inclui terços em prata 925, medalhas em ouro e crucifixos artesanais. Posso indicar um deles.";
    if (t.includes("entrega") || t.includes("prazo")) return "O prazo de entrega e formas de pagamento são combinados diretamente pelo WhatsApp Business da loja, para agilizar o atendimento.";
    if (t.includes("whatsapp") || t.includes("humano") || t.includes("atendente")) return "Claro! Toque no botão verde de WhatsApp no topo da página para falar com nossa equipe.";
    return "Posso te ajudar a encontrar joias, bijuterias ou artigos religiosos — me conte o que você procura, ou toque em 'Falar no WhatsApp' para atendimento humano.";
  }

  function send() {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    const botMsg = { from: "bot", text: reply(input) };
    setMessages(m => [...m, userMsg, botMsg]);
    setInput("");
  }

  return (
    <>
      <button onClick={() => setOpen(o => !o)}
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 80, background: "#C9A24C", color: "#150F1B", width: 54, height: 54, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px #00000055" }}>
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>
      {open && (
        <div style={{ position: "fixed", bottom: 84, right: 20, zIndex: 80, width: "min(320px, 90vw)", height: 420, background: "#1F1729", border: "1px solid #C9A24C33", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #C9A24C22", display: "flex", alignItems: "center", gap: 8 }}>
            <Bot size={16} color="#C9A24C" /> <span style={{ fontWeight: 700, fontSize: 14 }}>Assistente Lumière Fé</span>
          </div>
          <div className="scrollbar-thin" style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start", background: m.from === "user" ? "#C9A24C22" : "#150F1B", border: "1px solid #C9A24C22", padding: "8px 10px", fontSize: 13, maxWidth: "85%" }}>
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #C9A24C22" }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Digite sua pergunta..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#F3EDE4", padding: "10px 12px", fontSize: 13 }} />
            <button onClick={send} style={{ padding: "0 14px", color: "#C9A24C" }}><Send size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}
