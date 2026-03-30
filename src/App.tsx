import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  ChevronRight, 
  Mail, 
  MapPin, 
  Linkedin, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Menu,
  X,
  Phone,
  Save,
  LogOut,
  RefreshCcw,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';

import contentData from './content.json';

// --- PHP API SETTINGS ---
const API_URL = '/backend/api/api.php'; // Update with your actual hosting path

// --- CMS CONTEXT & LOGIC ---

type CMSContent = typeof contentData;

const CMSContext = createContext<{
  content: CMSContent;
  updateContent: (path: string, value: any) => void;
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
  isLoggedIn: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
} | null>(null);

const CMSProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<CMSContent>(contentData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Check if user was previously logged in (via localStorage token)
    const token = localStorage.getItem('cybereign_cms_token');
    if (token) setIsLoggedIn(true);

    // 2. Fetch initial content from PHP API
    fetch(`${API_URL}?action=get_content`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.status) { // Check if it returned the config object
          setContent(data);
        } else {
           // Fallback if DB empty or fail
           const savedDraft = localStorage.getItem('cybereign_cms_draft');
           if (savedDraft) setContent(JSON.parse(savedDraft));
        }
      })
      .catch(err => {
        console.error('PHP API Fetch failed, using local content:', err);
        const savedDraft = localStorage.getItem('cybereign_cms_draft');
        if (savedDraft) setContent(JSON.parse(savedDraft));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        localStorage.setItem('cybereign_cms_token', data.token);
        setIsLoggedIn(true);
        return true;
      } else {
        alert(data.message);
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      // Mock login for offline testing (password: cybereign2026)
      if (password === 'cybereign2026') { 
        setIsLoggedIn(true); 
        return true; 
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('cybereign_cms_token');
    setIsLoggedIn(false);
    setIsEditMode(false);
  };

  const updateContent = (path: string, value: any) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const parts = path.split('.');
    let target = newContent;
    for (let i = 0; i < parts.length - 1; i++) {
      target = target[parts[i]];
    }
    target[parts[parts.length - 1]] = value;
    setContent(newContent);
    localStorage.setItem('cybereign_cms_draft', JSON.stringify(newContent));
  };

  const saveChanges = async () => {
    try {
      const res = await fetch(`${API_URL}?action=update_content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('Site content updated successfully in database!');
        localStorage.removeItem('cybereign_cms_draft');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error('Update content error:', err);
      alert('Network error while saving to database. Saving locally as backup.');
    }
  };

  const resetChanges = () => {
    if (confirm('Reset all draft changes?')) {
      setContent(contentData);
      localStorage.removeItem('cybereign_cms_draft');
    }
  };

  return (
    <CMSContext.Provider value={{ content, updateContent, isEditMode, setIsEditMode, saveChanges, resetChanges, isLoggedIn, login, logout, isLoading }}>
      <div 
        className={isLoggedIn && isEditMode ? 'pt-16' : ''}
        style={{ 
          '--accent-primary': content.colors.accentPrimary, 
          '--accent-secondary': content.colors.accentSecondary 
        } as React.CSSProperties}
      >
        {children}
      </div>
    </CMSContext.Provider>
  );
};

// --- INLINE EDIT COMPONENTS ---

const EditableText = ({ value, onChange, className }: { value: string, onChange: (v: string) => void, className?: string }) => {
  const { isEditMode } = useCMS();
  if (!isEditMode) return <span className={className}>{value}</span>;
  return (
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className={`${className} bg-accent-primary/10 border-b border-accent-primary outline-none focus:bg-accent-primary/20 px-2 rounded-sm transition-all w-full`}
    />
  );
};

const EditableTextArea = ({ value, onChange, className }: { value: string, onChange: (v: string) => void, className?: string }) => {
  const { isEditMode } = useCMS();
  if (!isEditMode) return <p className={className}>{value}</p>;
  return (
    <textarea 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className={`${className} bg-accent-primary/10 border border-accent-primary outline-none focus:bg-accent-primary/20 p-4 rounded-xl transition-all w-full h-auto min-h-[100px]`}
    />
  );
};

const EditableImage = ({ src, onChange, className, alt }: { src: string, onChange: (v: string) => void, className?: string, alt?: string }) => {
  const { isEditMode } = useCMS();
  return (
    <div className="relative group">
      <img src={src} alt={alt} className={className} />
      {isEditMode && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[inherit]">
          <div className="p-4 bg-bg-secondary rounded-xl border border-glass-border shadow-2xl w-[80%]">
            <label className="text-[10px] font-bold uppercase tracking-widest text-accent-primary mb-2 block">Change Image URL</label>
            <input 
              type="text" 
              value={src} 
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-white/5 border border-glass-border rounded-lg p-2 text-xs text-white outline-none focus:border-accent-primary"
              placeholder="Enter image URL..."
            />
          </div>
        </div>
      )}
    </div>
  );
}

const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within CMSProvider');
  return context;
};

// --- LOGIN PAGE ---

const LoginPage = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { login } = useCMS();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<"username" | "password" | null>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    
    if (success) {
      onClose();
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const loginStyles: Record<string, React.CSSProperties> = {
    root: {
      position: 'fixed' as const,
      inset: 0,
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(245, 246, 250, 0.95)", // Slightly translucent to see background blur
      backdropFilter: "blur(20px)",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    },
    bgCircle1: {
      position: "absolute",
      top: "-120px",
      right: "-120px",
      width: "420px",
      height: "420px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(0,242,255,0.15) 0%, transparent 70%)",
      pointerEvents: "none",
    },
    bgCircle2: {
      position: "absolute",
      bottom: "-100px",
      left: "-100px",
      width: "340px",
      height: "340px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(112,0,255,0.10) 0%, transparent 70%)",
      pointerEvents: "none",
    },
    card: {
      background: "#ffffff",
      borderRadius: "20px",
      padding: "52px 44px 44px",
      width: "100%",
      maxWidth: "420px",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(0,0,0,0.12)",
      animation: "floatIn 0.55s cubic-bezier(0.22,1,0.36,1) both",
      position: "relative",
      zIndex: 1,
    },
    logoWrap: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "28px",
    },
    title: {
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "700",
      fontSize: "24px",
      color: "#0a2351",
      textAlign: "center",
      marginBottom: "8px",
      letterSpacing: "-0.3px",
    },
    subtitle: {
      fontSize: "15px",
      color: "#5a6278",
      textAlign: "center",
      marginBottom: "32px",
      fontWeight: "400",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    inputWrap: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "#f0f3fa",
      border: "1.5px solid transparent",
      borderRadius: "12px",
      padding: "0 16px",
      height: "52px",
      transition: "all 0.2s",
    },
    inputWrapFocused: {
      borderColor: "var(--accent-primary)",
      boxShadow: "0 0 0 3px rgba(0,242,255,0.10)",
      background: "#fff",
    },
    inputIcon: {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
    input: {
      flex: 1,
      border: "none",
      background: "transparent",
      fontSize: "15px",
      color: "#1e2340",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "500",
      outline: "none",
    },
    forgotWrap: {
      textAlign: "right" as const,
      marginTop: "-4px",
    },
    forgot: {
      fontSize: "13px",
      color: "var(--accent-primary)",
      textDecoration: "none",
      fontWeight: "500",
      opacity: 0.85,
    },
    error: {
      fontSize: "13px",
      color: "#ff0033",
      textAlign: "center" as const,
      background: "rgba(255,0,51,0.06)",
      borderRadius: "8px",
      padding: "8px 12px",
    },
    btn: {
      marginTop: "8px",
      height: "52px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: "600",
      fontSize: "16px",
      border: "none",
      cursor: "pointer",
      letterSpacing: "0.3px",
      boxShadow: "0 4px 16px rgba(0,242,255,0.20)",
      transition: "all 0.2s",
    },
    btnLoading: {
      opacity: 0.75,
      cursor: "not-allowed",
      transform: "scale(0.99)",
    },
    spinnerWrap: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    spinner: {
      display: "inline-block",
      width: "18px",
      height: "18px",
      border: "2.5px solid rgba(255,255,255,0.35)",
      borderTopColor: "#fff",
      borderRadius: "50%",
      animation: "spin 0.75s linear infinite",
    },
  };

  return (
    <div style={loginStyles.root}>
      <div style={loginStyles.bgCircle1} />
      <div style={loginStyles.bgCircle2} />

      <div style={loginStyles.card}>
        <div style={loginStyles.logoWrap}>
           <img src="/images/logo.png" alt="Logo" style={{ height: "40px", filter: "grayscale(100%) brightness(0%)" }} />
        </div>

        <h1 style={loginStyles.title}>Administrator Login!</h1>
        <p style={loginStyles.subtitle}>Enter your details to login.</p>

        <form onSubmit={handleSubmit} style={loginStyles.form} noValidate>
          <div style={{ ...loginStyles.inputWrap, ...(focused === "username" ? loginStyles.inputWrapFocused : {}) }}>
            <span style={loginStyles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#aab0c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="#aab0c0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
              style={loginStyles.input}
            />
          </div>

          <div style={{ ...loginStyles.inputWrap, ...(focused === "password" ? loginStyles.inputWrapFocused : {}) }}>
            <span style={loginStyles.inputIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#aab0c0" strokeWidth="1.8"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#aab0c0" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              style={loginStyles.input}
            />
          </div>

          <div style={loginStyles.forgotWrap}>
            <a href="#" style={loginStyles.forgot}>Forgot password?</a>
          </div>

          {error && <p style={loginStyles.error}>{error}</p>}

          <button type="submit" disabled={isLoading} style={{ ...loginStyles.btn, ...(isLoading ? loginStyles.btnLoading : {}) }}>
            {isLoading ? (
              <span style={loginStyles.spinnerWrap}><span style={loginStyles.spinner} /> Logging in...</span>
            ) : "Login"}
          </button>
        </form>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatIn {
          from { opacity: 0; transform: scale(0.96) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

// --- ADMIN TOOLBAR ---

const AdminToolbar = () => {
  const { isEditMode, setIsEditMode, saveChanges, resetChanges, logout, isLoggedIn } = useCMS();

  if (!isLoggedIn) return null;

  return (
    <motion.div 
      initial={{ y: -100 }} animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full h-16 bg-bg-secondary/90 backdrop-blur-xl border-b border-glass-border z-[3000] flex items-center px-8 justify-between shadow-2xl"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-white">Cybereign CMS</span>
        </div>
        <div className="h-6 w-px bg-glass-border"></div>
        <button 
          onClick={() => setIsEditMode(!isEditMode)} 
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isEditMode ? 'bg-accent-primary text-bg-primary' : 'bg-white/5 text-text-muted hover:text-white'}`}
        >
          {isEditMode ? 'Editing Active' : 'Enable Inline Editing'}
        </button>
      </div>

      <div className="flex items-center gap-4">
        {isEditMode && (
          <>
            <button onClick={saveChanges} className="flex items-center gap-2 px-4 py-2 bg-accent-primary/10 text-accent-primary border border-accent-primary/20 rounded-lg text-xs font-bold hover:bg-accent-primary hover:text-bg-primary transition-all">
              <Save className="w-4 h-4" /> Save to Database
            </button>
            <button onClick={resetChanges} className="flex items-center gap-2 px-4 py-2 bg-white/5 text-text-muted rounded-lg text-xs font-bold hover:text-white transition-all">
              <RefreshCcw className="w-4 h-4" /> Discard
            </button>
          </>
        )}
        <div className="h-6 w-px bg-glass-border"></div>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-red-500 transition-colors text-xs font-bold">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </motion.div>
  );
};

// --- WEBSITE COMPONENTS --- (Header, Hero, About, etc. same as before but using CMS context)

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-bg-primary-80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container flex justify-between items-center">
        <a href="#" className="flex items-center group"><img src="/images/logo.png" alt="Logo" className="h-10 md:h-12 w-auto" /></a>
        <nav className="hidden md:flex items-center gap-12">
          {['About', 'Services', 'Industries', 'Insights'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-sm font-semibold text-text-secondary hover:text-white transition-all uppercase tracking-widest">{item}</a>
          ))}
          <a href="#consultation" className="btn btn-primary h-10 py-0 px-5 text-sm">Book Consultation</a>
        </nav>
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>{isMenuOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 w-full bg-bg-secondary p-8 border-b border-glass-border flex flex-col gap-6">
          {['About', 'Services', 'Industries', 'Insights'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-lg font-medium text-text-secondary" onClick={() => setIsMenuOpen(false)}>{item}</a>
          ))}
          <a href="#consultation" className="btn btn-primary w-full" onClick={() => setIsMenuOpen(false)}>Request Consultation</a>
        </motion.div>
      )}</AnimatePresence>
    </header>
  );
};

const Hero = () => {
  const { content, updateContent, isEditMode } = useCMS();
  return (
    <section className="relative min-h-screen pt-40 pb-20 overflow-hidden flex items-center">
      <div className="container relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary-10 border border-accent-primary-20 text-accent-primary text-sm font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              <EditableText value={content.hero.tagline} onChange={v => updateContent('hero.tagline', v)} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1]">
              <EditableTextArea 
                value={content.hero.title} 
                onChange={v => updateContent('hero.title', v)} 
                className="text-5xl md:text-7xl font-extrabold"
              />
            </h1>

            <EditableTextArea 
              value={content.hero.subtitle} 
              onChange={v => updateContent('hero.subtitle', v)}
              className="text-xl text-text-secondary mb-10 max-w-xl"
            />

            <div className="flex flex-wrap gap-5">
              <a href="#consultation" className="btn btn-primary px-10 h-16 text-lg">
                <EditableText value={content.hero.ctaText} onChange={v => updateContent('hero.ctaText', v)} />
              </a>
              <a href="#services" className="btn btn-secondary px-10 h-16 text-lg">
                <EditableText value={content.hero.secondaryText} onChange={v => updateContent('hero.secondaryText', v)} /> <ChevronRight className="w-5 h-5" />
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-8 border-t border-glass-border pt-12 text-sm">
              <div>
                <p className="text-text-muted mb-2 uppercase tracking-widest font-bold">Nigeria Presence</p>
                <div className="flex items-center gap-2 text-white font-medium"><MapPin className="w-4 h-4 text-accent-primary" /> Lagos, Nigeria</div>
              </div>
              <div className="h-10 w-px bg-glass-border"></div>
              <div>
                <p className="text-text-muted mb-2 uppercase tracking-widest font-bold">United States Presence</p>
                <div className="flex items-center gap-2 text-white font-medium"><Globe className="w-4 h-4 text-accent-secondary" /> Duncanville, TX</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="rounded-3xl overflow-hidden glass-card p-2 border-accent-primary-20">
               <EditableImage 
                 src={content.hero.image} 
                 onChange={v => updateContent('hero.image', v)} 
                 className="w-full rounded-2xl" 
               />
            </div>
            <div className="absolute -bottom-8 -left-8 glass-card p-8">
              <p className="text-3xl font-bold text-white">
                <EditableText value={content.hero.stats.value} onChange={v => updateContent('hero.stats.value', v)} />
              </p>
              <p className="text-xs text-text-muted uppercase tracking-widest">
                <EditableText value={content.hero.stats.label} onChange={v => updateContent('hero.stats.label', v)} />
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ContentSection = () => {
  const { content, updateContent, isEditMode } = useCMS();

  const addInsight = () => {
    const newItem = {
      title: "New Insight Title",
      category: "Category",
      image: "/images/data_protection_visualization.png",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    updateContent('insights.items', [newItem, ...content.insights.items]);
  };

  const removeInsight = (index: number) => {
    if (confirm('Delete this insight?')) {
      const newItems = [...content.insights.items];
      newItems.splice(index, 1);
      updateContent('insights.items', newItems);
    }
  };

  return (
    <>
      <section id="about" className="section"><div className="container"><div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="glass-card p-4 rounded-3xl group relative">
          <EditableImage 
            src={content.about.image} 
            onChange={v => updateContent('about.image', v)} 
            className="rounded-2xl w-full" 
          />
        </div>
        <div>
          <span className="text-sm font-bold text-accent-primary uppercase tracking-widest mb-6 block">
            <EditableText value={content.about.tagline} onChange={v => updateContent('about.tagline', v)} />
          </span>
          <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
             <EditableTextArea value={content.about.title} onChange={v => updateContent('about.title', v)} className="text-4xl md:text-5xl font-bold" />
          </h3>
          <EditableTextArea value={content.about.subtitle} onChange={v => updateContent('about.subtitle', v)} className="text-lg text-text-secondary mb-10 leading-relaxed" />
          <div className="space-y-4">
            {content.about.bullets.map((b, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                <EditableText 
                  value={b} 
                  onChange={v => {
                    const newBullets = [...content.about.bullets];
                    newBullets[i] = v;
                    updateContent('about.bullets', newBullets);
                  }}
                  className="text-white font-medium w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div></div></section>

      <section id="services" className="section bg-bg-secondary-30"><div className="container">
        <div className="text-center mb-16">
          <span className="text-sm font-bold text-accent-primary mb-4 uppercase tracking-widest block">
            <EditableText value={content.services.tagline} onChange={v => updateContent('services.tagline', v)} />
          </span>
          <h3 className="text-4xl md:text-6xl font-bold">
            <EditableText value={content.services.title} onChange={v => updateContent('services.title', v)} />
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {content.services.items.map((s, i) => (
            <div key={i} className="glass-card p-10 hover:translate-y-[-10px] transition-all group relative">
              <div className="w-16 h-16 bg-accent-primary-10 rounded-2xl mb-8 flex items-center justify-center p-4 border border-accent-primary-20">
                <Shield className="w-full h-full text-accent-primary" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-accent-primary transition-colors">
                 <EditableText value={s.title} onChange={v => {
                   const newItems = [...content.services.items];
                   newItems[i].title = v;
                   updateContent('services.items', newItems);
                 }} />
              </h4>
              <EditableTextArea value={s.description} onChange={v => {
                const newItems = [...content.services.items];
                newItems[i].description = v;
                updateContent('services.items', newItems);
              }} className="text-text-secondary mb-8" />
              <a href="#consultation" className="font-bold flex items-center gap-2 group-hover:gap-4 transition-all">Request Advisory <ArrowRight className="w-5 h-5 text-accent-primary" /></a>
            </div>
          ))}
        </div>
      </div></section>

      <section id="industries" className="section"><div className="container"><div className="glass-card p-12 md:p-20 relative overflow-hidden text-center">
        <span className="text-sm font-bold text-accent-primary mb-6 uppercase tracking-widest block">
          <EditableText value={content.industries.tagline} onChange={v => updateContent('industries.tagline', v)} />
        </span>
        <h3 className="text-4xl md:text-5xl font-bold mb-10">
          <EditableText value={content.industries.title} onChange={v => updateContent('industries.title', v)} />
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          {content.industries.items.map((ind, i) => (
            <div key={i} className="px-8 py-4 bg-white/5 border border-glass-border rounded-full hover:border-accent-primary transition-colors font-bold text-text-secondary hover:text-white group relative">
               <EditableText 
                 value={ind} 
                 onChange={v => {
                   const newItems = [...content.industries.items];
                   newItems[i] = v;
                   updateContent('industries.items', newItems);
                 }} 
               />
               {isEditMode && (
                 <button 
                   onClick={() => {
                     const newItems = [...content.industries.items];
                     newItems.splice(i, 1);
                     updateContent('industries.items', newItems);
                   }}
                   className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white p-1 shadow-lg"
                 >
                   <X className="w-3 h-3" />
                 </button>
               )}
            </div>
          ))}
          {isEditMode && (
            <button 
              onClick={() => updateContent('industries.items', [...content.industries.items, "New Industry"])}
              className="px-8 py-4 bg-accent-primary/10 border border-accent-primary dashed rounded-full text-accent-primary font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Industry
            </button>
          )}
        </div>
      </div></div></section>

      <section id="insights" className="section bg-bg-secondary-30"><div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-left">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-accent-primary mb-4 uppercase tracking-widest">
              <EditableText value={content.insights.tagline} onChange={v => updateContent('insights.tagline', v)} />
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold">
              <EditableText value={content.insights.title} onChange={v => updateContent('insights.title', v)} />
            </h3>
          </div>
          {isEditMode && (
             <button onClick={addInsight} className="btn btn-primary flex items-center gap-2 h-14 px-8">
               <Plus className="w-5 h-5" /> Add New Article
             </button>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.insights.items.map((item, i) => (
            <div key={i} className="glass-card overflow-hidden group border border-glass-border">
              <div className="relative h-64 overflow-hidden">
                <EditableImage 
                  src={item.image} 
                  onChange={v => {
                    const newItems = [...content.insights.items];
                    newItems[i].image = v;
                    updateContent('insights.items', newItems);
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-bg-primary/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-accent-primary border border-accent-primary/20">
                  <EditableText value={item.category} onChange={v => {
                    const newItems = [...content.insights.items];
                    newItems[i].category = v;
                    updateContent('insights.items', newItems);
                  }} />
                </div>
                {isEditMode && (
                  <button onClick={() => removeInsight(i)} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="p-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-4 font-bold">
                  <EditableText value={item.date} onChange={v => {
                    const newItems = [...content.insights.items];
                    newItems[i].date = v;
                    updateContent('insights.items', newItems);
                  }} />
                </p>
                <h4 className="text-xl font-bold text-white mb-6 leading-tight group-hover:text-accent-primary transition-colors min-h-[60px]">
                  <EditableTextArea value={item.title} onChange={v => {
                    const newItems = [...content.insights.items];
                    newItems[i].title = v;
                    updateContent('insights.items', newItems);
                  }} className="text-xl font-bold bg-transparent" />
                </h4>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-white transition-all group/link">
                  Read Full Article <ArrowRight className="w-4 h-4 text-accent-primary group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div></section>

      <section id="consultation" className="section py-32"><div className="container text-center"><div className="glass-card p-16 md:p-32 border-accent-primary-20">
        <h2 className="text-4xl md:text-7xl font-bold mb-10 leading-tight">
          <EditableTextArea value={content.consultation.title} onChange={v => updateContent('consultation.title', v)} className="text-4xl md:text-7xl font-bold" />
        </h2>
        <EditableTextArea value={content.consultation.subtitle} onChange={v => updateContent('consultation.subtitle', v)} className="text-xl md:text-2xl text-text-secondary mb-16" />
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="btn btn-primary px-12 h-16 text-xl">Consult CYBEREIGN</button>
          <a href={`mailto:${content.footer.email}`} className="btn btn-secondary px-12 h-16 text-xl"><Mail className="w-6 h-6" /> Contact Us</a>
        </div>
      </div></div></section>
    </>
  );
};

const Footer = () => {
  const { content, isLoggedIn, setIsEditMode, updateContent } = useCMS();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <footer className="bg-bg-primary pt-32 pb-16 border-t border-glass-border">
      <div className="container">
        <div className="grid lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <a href="#" className="mb-8 block"><img src="/images/logo.png" alt="Logo" className="h-12 w-auto" /></a>
            <EditableTextArea value={content.footer.description} onChange={v => updateContent('footer.description', v)} className="text-lg text-text-secondary mb-8 max-w-sm" />
            <div className="flex gap-4"><a href={content.footer.linkedin} className="w-12 h-12 rounded-full border border-glass-border flex items-center justify-center hover:bg-accent-primary transition-all"><Linkedin className="w-5 h-5" /></a></div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-8">Locations</h4>
            <div className="space-y-6">
              <div><p className="text-accent-primary font-bold text-sm uppercase mb-2">Head office</p><p className="text-text-secondary">Lagos, Nigeria</p></div>
              <div><p className="text-accent-secondary font-bold text-sm uppercase mb-2">Remote Presence</p><p className="text-text-secondary">Duncanville, Texas, US</p></div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-8">Contact</h4>
            <div className="space-y-4">
              <a href={`tel:${content.footer.phone.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-accent-primary" /> 
                <EditableText value={content.footer.phone} onChange={v => updateContent('footer.phone', v)} />
              </a>
              <a href={`mailto:${content.footer.email}`} className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-accent-secondary" /> 
                <EditableText value={content.footer.email} onChange={v => updateContent('footer.email', v)} />
              </a>
              <a href={content.footer.linkedin} className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors"><Linkedin className="w-5 h-5 text-accent-primary" /> cybereignconsulting</a>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-text-muted text-sm tracking-widest uppercase">© 2026 CYBEREIGN Consulting. Govern. Protect. Comply.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-xs text-text-muted hover:text-white">Privacy</a>
            {isLoggedIn ? (
              <span className="text-accent-primary font-black uppercase text-xs flex items-center gap-2 border-l border-white/5 pl-8"><Shield className="w-3 h-3" /> System Managed</span>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="text-text-muted hover:text-accent-primary uppercase text-xs flex items-center gap-2 border-l border-white/5 pl-8"><Lock className="w-3 h-3" /> System Login</button>
            )}
          </div>
        </div>
      </div>
      <LoginPage isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </footer>
  );
};

export default function App() {
  return (
    <CMSProvider>
       <div className="bg-bg-primary text-text-primary selection-accent-primary">
          <AdminToolbar />
          <Header />
          <main className="transition-all duration-500"><Hero /><ContentSection /></main>
          <Footer />
       </div>
    </CMSProvider>
  );
}
