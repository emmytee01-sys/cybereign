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
  LayoutDashboard,
  Type,
  Grid,
  FileText,
  Palette,
  Eye,
  Settings
} from 'lucide-react';

import contentData from './content.json';

// --- PHP API SETTINGS ---
const API_URL = '/backend/api/api.php';

// --- CMS CONTEXT & LOGIC ---

const initialContent = contentData;

interface CMSContextType {
  content: typeof initialContent; 
  updateContent: (path: string, value: any) => void;
  isLoggedIn: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
  isLoading: boolean;
  currentPage: 'home' | 'dashboard' | 'article';
  setCurrentPage: (page: 'home' | 'dashboard' | 'article') => void;
  selectedArticle: any;
  setSelectedArticle: (article: any) => void;
}

const CMSContext = createContext<CMSContextType | null>(null);

const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within a CMSProvider');
  return context;
};

const CMSProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState(initialContent);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'article'>('home');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    fetchContent();
    const token = localStorage.getItem('cybereign_token');
    if (token) {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch(`${API_URL}?action=get_content`);
      const data = await res.json();
      if (data.status === 'success') {
        setContent(data.content);
        return;
      }
    } catch (e) {
      console.warn('API unavailable, checking local storage...', e);
    }

    // Fallback to localStorage if API fails
    const localSaved = localStorage.getItem('cybereign_content_backup');
    if (localSaved) {
      try {
        setContent(JSON.parse(localSaved));
        console.log('Loaded content from local storage backup.');
      } catch (e) {
        console.error('Failed to parse local content backup.', e);
      }
    }
  };

  const login = async (username: string, password: string) => {
    // Development/Standalone Bypass
    if (username === 'admin' && password === 'admin') {
      console.info('Using local admin bypass.');
      localStorage.setItem('cybereign_token', 'local_mode_token');
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
      return true;
    }

    try {
      const res = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        localStorage.setItem('cybereign_token', data.token);
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error, API might be down:', e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('cybereign_token');
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const updateContent = (path: string, value: any) => {
    setContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current: any = newContent;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newContent;
    });
  };

  const saveChanges = async () => {
    const token = localStorage.getItem('cybereign_token');
    
    // Always save to localStorage as backup/standalone mode
    localStorage.setItem('cybereign_content_backup', JSON.stringify(content));

    if (token === 'local_mode_token') {
       alert('Changes saved LOCALLY. (Admin bypass active)');
       return;
    }

    try {
      const res = await fetch(`${API_URL}?action=save_content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('Changes pushed to production!');
      } else {
        throw new Error(data.message || 'Save failed');
      }
    } catch (e) {
      console.error('API Save Error:', e);
      alert('Changes saved locally, but failed to sync with server. Your changes will persist in this browser.');
    }
  };

  const resetChanges = () => {
    if (confirm('Revert all unsaved changes to database version?')) {
      fetchContent();
    }
  };

  return (
    <CMSContext.Provider value={{ 
      content, updateContent, isLoggedIn, login, logout, saveChanges, resetChanges, 
      isLoading, currentPage, setCurrentPage, selectedArticle, setSelectedArticle 
    }}>
      <div 
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

// --- CMS DASHBOARD PAGE ---

const Dashboard = () => {
  const { content, updateContent, logout, saveChanges, resetChanges, setCurrentPage } = useCMS();
  const [activeTab, setActiveTab] = useState('hero');

  const menu = [
    { id: 'hero', label: 'Hero Section', icon: LayoutDashboard },
    { id: 'about', label: 'About Us', icon: Type },
    { id: 'services', label: 'Services', icon: Grid },
    { id: 'industries', label: 'Industries', icon: Eye },
    { id: 'insights', label: 'Insights & Articles', icon: FileText },
    { id: 'footer', label: 'Footer & Links', icon: Settings },
    { id: 'colors', label: 'Site Branding', icon: Palette },
  ];

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden font-jakarta">
       {/* Sidebar */}
       <div className="w-80 h-full border-r border-glass-border flex flex-col pt-8 bg-bg-secondary/20">
          <div className="px-8 mb-12 flex items-center justify-between">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
            <button onClick={() => setCurrentPage('home')} className="p-2 text-text-muted hover:text-white transition-colors bg-white/5 rounded-lg">
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>

          <nav className="flex-1 space-y-2 px-4">
            {menu.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 h-14 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-accent-primary text-bg-primary shadow-xl' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-5 h-5" /> {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6 mt-auto border-t border-glass-border">
             <button onClick={logout} className="w-full flex items-center justify-center gap-2 h-12 text-red-500 font-bold hover:bg-red-500/10 rounded-xl transition-all">
               <LogOut className="w-5 h-5" /> Log Out
             </button>
          </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 overflow-y-auto bg-[#0a0f1d] pb-24">
          <header className="h-20 border-b border-glass-border flex items-center px-12 justify-between sticky top-0 bg-[#0a0f1d]/90 backdrop-blur-xl z-20">
             <h1 className="text-xl font-black uppercase tracking-widest text-white">{activeTab.replace('_', ' ')} Management</h1>
             <div className="flex gap-4">
                <button onClick={resetChanges} className="flex items-center gap-2 px-6 h-12 bg-white/5 text-text-muted rounded-xl text-sm font-bold hover:text-white transition-all"><RefreshCcw className="w-4 h-4" /> Reset</button>
                <button onClick={saveChanges} className="flex items-center gap-2 px-8 h-12 bg-accent-primary text-bg-primary rounded-xl text-sm font-bold shadow-xl hover:scale-105 transition-all"><Save className="w-4 h-4" /> Push Updates</button>
             </div>
          </header>

          <div className="p-12 max-w-5xl">
             {activeTab === 'hero' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <InputGroup title="Hero Media">
                     <ImageField label="Background Visualization" value={content.hero.image} onChange={v => updateContent('hero.image', v)} />
                  </InputGroup>
                  <InputGroup title="Main Content">
                     <TextField label="Tagline Badge" value={content.hero.tagline} onChange={v => updateContent('hero.tagline', v)} />
                     <TextAreaField label="Main Headline" value={content.hero.title} onChange={v => updateContent('hero.title', v)} />
                     <TextAreaField label="Subtext Description" value={content.hero.subtitle} onChange={v => updateContent('hero.subtitle', v)} />
                  </InputGroup>
                  <InputGroup title="Call to Actions">
                     <div className="grid grid-cols-2 gap-6">
                        <TextField label="Primary Button" value={content.hero.ctaText} onChange={v => updateContent('hero.ctaText', v)} />
                        <TextField label="Secondary Link" value={content.hero.secondaryText} onChange={v => updateContent('hero.secondaryText', v)} />
                     </div>
                  </InputGroup>
               </div>
             )}

             {activeTab === 'about' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <InputGroup title="Story & Visuals">
                     <ImageField label="Company Imagery" value={content.about.image} onChange={v => updateContent('about.image', v)} />
                     <TextField label="Tagline" value={content.about.tagline} onChange={v => updateContent('about.tagline', v)} />
                  </InputGroup>
                  <InputGroup title="Mission Content">
                     <TextField label="Section Title" value={content.about.title} onChange={v => updateContent('about.title', v)} />
                     <TextAreaField label="Intro Paragraph" value={content.about.subtitle} onChange={v => updateContent('about.subtitle', v)} />
                  </InputGroup>
               </div>
             )}

             {activeTab === 'services' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <InputGroup title="Header">
                     <TextField label="Tagline" value={content.services.tagline} onChange={v => updateContent('services.tagline', v)} />
                     <TextField label="Title" value={content.services.title} onChange={v => updateContent('services.title', v)} />
                  </InputGroup>
                  <div className="grid gap-6">
                    {content.services.items.map((s, i) => (
                      <div key={i} className="p-8 bg-white/5 border border-glass-border rounded-3xl relative group">
                        <p className="text-[10px] font-black uppercase text-accent-primary mb-4">Service Layer {i + 1}</p>
                        <TextField label="Title" value={s.title} onChange={v => {
                           const n = [...content.services.items]; n[i].title = v; updateContent('services.items', n);
                        }} />
                        <div className="mt-4">
                           <TextAreaField label="Description" value={s.description} onChange={v => {
                              const n = [...content.services.items]; n[i].description = v; updateContent('services.items', n);
                           }} />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {activeTab === 'insights' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center mb-8">
                     <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-accent-primary" /> Manage Articles</h2>
                     <button 
                       onClick={() => updateContent('insights.items', [{ title: "New Article Title", category: "Governance", date: new Date().toLocaleDateString(), image: content.about.image }, ...content.insights.items])} 
                       className="flex items-center gap-2 px-6 h-12 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary rounded-xl text-sm font-bold hover:bg-accent-primary hover:text-bg-primary transition-all"
                     >
                        <Plus className="w-4 h-4" /> Create New Insight
                     </button>
                  </div>
                  <div className="grid gap-8">
                    {content.insights.items.map((item, i) => (
                       <div key={i} className="p-8 bg-white/5 border border-glass-border rounded-3xl relative group hover:border-accent-primary/30 transition-all">
                          <button 
                            onClick={() => { const n = [...content.insights.items]; n.splice(i, 1); updateContent('insights.items', n); }}
                            className="absolute top-8 right-8 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          ><Trash2 className="w-5 h-5" /></button>
                          
                          <div className="grid md:grid-cols-3 gap-8">
                             <div className="md:col-span-1">
                                <ImageField label="Article Cover" value={item.image} onChange={v => { const n = [...content.insights.items]; n[i].image = v; updateContent('insights.items', n); }} />
                             </div>
                             <div className="md:col-span-2 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                   <TextField label="Category" value={item.category} onChange={v => { const n = [...content.insights.items]; n[i].category = v; updateContent('insights.items', n); }} />
                                   <TextField label="Date" value={item.date} onChange={v => { const n = [...content.insights.items]; n[i].date = v; updateContent('insights.items', n); }} />
                                </div>
                                <TextField label="Full Title" value={item.title} onChange={v => { const n = [...content.insights.items]; n[i].title = v; updateContent('insights.items', n); }} />
                                <TextAreaField label="Full Narrative" value={item.content || ""} onChange={v => { const n = [...content.insights.items]; n[i].content = v; updateContent('insights.items', n); }} />
                             </div>
                          </div>
                       </div>
                    ))}
                  </div>
                </div>
             )}

             {activeTab === 'footer' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <InputGroup title="Contact Info">
                     <TextField label="Email" value={content.footer.email} onChange={v => updateContent('footer.email', v)} />
                     <TextField label="Phone" value={content.footer.phone} onChange={v => updateContent('footer.phone', v)} />
                  </InputGroup>
                  <InputGroup title="Brand Blurb">
                     <TextAreaField label="Footer Description" value={content.footer.description} onChange={v => updateContent('footer.description', v)} />
                  </InputGroup>
               </div>
             )}

             {activeTab === 'colors' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <InputGroup title="Visual Identity">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-xs font-black uppercase tracking-widest text-text-muted">Primary Accent</label>
                           <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-glass-border">
                              <input type="color" value={content.colors.accentPrimary} onChange={e => updateContent('colors.accentPrimary', e.target.value)} className="w-12 h-12 bg-transparent border-none cursor-pointer" />
                              <span className="font-mono text-white text-lg font-bold">{content.colors.accentPrimary}</span>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-xs font-black uppercase tracking-widest text-text-muted">Secondary Accent</label>
                           <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-glass-border">
                              <input type="color" value={content.colors.accentSecondary} onChange={e => updateContent('colors.accentSecondary', e.target.value)} className="w-12 h-12 bg-transparent border-none cursor-pointer" />
                              <span className="font-mono text-white text-lg font-bold">{content.colors.accentSecondary}</span>
                           </div>
                        </div>
                     </div>
                  </InputGroup>
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

const InputGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-bg-secondary/40 border border-glass-border rounded-3xl p-10 space-y-8">
    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent-primary border-l-4 border-accent-primary pl-4">{title}</h3>
    <div className="grid gap-8">{children}</div>
  </div>
);

const TextField = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-white/5 border border-glass-border rounded-xl px-6 h-14 text-white focus:border-accent-primary outline-none transition-all placeholder:text-text-muted/30"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">{label}</label>
    <textarea 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full bg-white/5 border border-glass-border rounded-2xl p-6 h-32 text-white focus:border-accent-primary outline-none transition-all resize-none"
    />
  </div>
);

const ImageField = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-4">
    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">{label}</label>
    <div className="flex gap-6 items-center">
       <div className="w-32 h-32 rounded-2xl overflow-hidden bg-bg-primary border border-glass-border flex-shrink-0">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
       </div>
       <div className="flex-1">
          <input 
            type="text" 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            placeholder="Paste global image URL..."
            className="w-full bg-white/5 border border-glass-border rounded-xl px-6 h-12 text-xs text-text-secondary focus:border-accent-primary outline-none"
          />
          <p className="mt-2 text-[8px] uppercase tracking-widest text-text-muted ml-1">Asset URL mapping required for production deployment.</p>
       </div>
    </div>
  </div>
);

// --- INLINE EDIT COMPONENTS (STILL USED IN PUBLIC SITE DISPLAY IF LOGGED IN) ---

const EditableText = ({ value, className }: { value: string, className?: string }) => {
  return <span className={className}>{value}</span>;
};

const EditableTextArea = ({ value, className }: { value: string, className?: string }) => {
  return <p className={className}>{value}</p>;
};

const EditableImage = ({ src, className, alt }: { src: string, className?: string, alt?: string }) => {
  return <img src={src} alt={alt} className={className} />;
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
      borderWidth: "1.5px",
      borderStyle: "solid",
      borderColor: "transparent",
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
           <img src="/images/logo.png" alt="Logo" style={{ height: "40px", filter: "invert(1) brightness(200%)" }} />
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
  const { content } = useCMS();
  return (
    <section className="relative min-h-screen pt-40 pb-20 overflow-hidden flex items-center">
      <div className="container relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary-10 border border-accent-primary-20 text-accent-primary text-sm font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              <EditableText value={content.hero.tagline} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1]">
               {content.hero.title.split('Governance, Risk,').length > 1 ? (
                 <>
                   <span className="gradient-text">Governance, Risk,</span>
                   {content.hero.title.split('Governance, Risk,')[1]}
                 </>
               ) : content.hero.title}
            </h1>

            <EditableTextArea 
              value={content.hero.subtitle}
              className="text-xl text-text-secondary mb-10 max-w-xl"
            />

            <div className="flex flex-wrap gap-5">
              <a href="#consultation" className="btn btn-primary px-10 h-16 text-lg">
                <EditableText value={content.hero.ctaText} />
              </a>
              <a href="#services" className="btn btn-secondary px-10 h-16 text-lg">
                <EditableText value={content.hero.secondaryText} /> <ChevronRight className="w-5 h-5" />
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
                 className="w-full rounded-2xl" 
               />
            </div>
            <div className="absolute -bottom-8 -left-8 glass-card p-8">
              <p className="text-3xl font-bold text-white">
                <EditableText value={content.hero.stats.value} />
              </p>
              <p className="text-xs text-text-muted uppercase tracking-widest">
                <EditableText value={content.hero.stats.label} />
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ContentSection = () => {
  const { content, setCurrentPage, setSelectedArticle } = useCMS();

  return (
    <>
      <section id="about" className="section"><div className="container"><div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="glass-card p-4 rounded-3xl">
          <EditableImage 
            src={content.about.image} 
            className="rounded-2xl w-full" 
          />
        </div>
        <div>
          <span className="text-sm font-bold text-accent-primary uppercase tracking-widest mb-6 block">
            <EditableText value={content.about.tagline} />
          </span>
          <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
             <EditableTextArea value={content.about.title} className="text-4xl md:text-5xl font-bold" />
          </h3>
          <EditableTextArea value={content.about.subtitle} className="text-lg text-text-secondary mb-10 leading-relaxed" />
          <div className="space-y-4">
            {content.about.bullets.map((b, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" />
                <EditableText 
                  value={b} 
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
            <EditableText value={content.services.tagline} />
          </span>
          <h3 className="text-4xl md:text-6xl font-bold">
            <EditableText value={content.services.title} />
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {content.services.items.map((s, i) => (
            <div key={i} className="glass-card p-10 hover:translate-y-[-10px] transition-all group relative">
              <div className="w-16 h-16 bg-accent-primary-10 rounded-2xl mb-8 flex items-center justify-center p-4 border border-accent-primary-20">
                <Shield className="w-full h-full text-accent-primary" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-accent-primary transition-colors">
                 <EditableText value={s.title} />
              </h4>
              <EditableTextArea value={s.description} className="text-text-secondary mb-8" />
              <a href="#consultation" className="font-bold flex items-center gap-2 group-hover:gap-4 transition-all">Request Advisory <ArrowRight className="w-5 h-5 text-accent-primary" /></a>
            </div>
          ))}
        </div>
      </div></section>

      <section id="industries" className="section"><div className="container"><div className="glass-card p-12 md:p-20 relative overflow-hidden text-center">
        <span className="text-sm font-bold text-accent-primary mb-6 uppercase tracking-widest block">
          <EditableText value={content.industries.tagline} />
        </span>
        <h3 className="text-4xl md:text-5xl font-bold mb-10">
          <EditableText value={content.industries.title} />
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          {content.industries.items.map((ind, i) => (
            <div key={i} className="px-8 py-4 bg-white/5 border border-glass-border rounded-full hover:border-accent-primary transition-colors font-bold text-text-secondary hover:text-white group relative">
               <EditableText value={ind} />
            </div>
          ))}
        </div>
      </div></div></section>

      <section id="insights" className="section bg-bg-secondary-30"><div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-left">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold text-accent-primary mb-4 uppercase tracking-widest">
              <EditableText value={content.insights.tagline} />
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold">
              <EditableText value={content.insights.title} />
            </h3>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.insights.items.map((item, i) => (
            <div key={i} className="glass-card overflow-hidden group border border-glass-border">
              <div className="relative h-64 overflow-hidden">
                <EditableImage 
                  src={item.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-bg-primary/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-accent-primary border border-accent-primary/20">
                  <EditableText value={item.category} />
                </div>
              </div>
              <div className="p-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-4 font-bold">
                  <EditableText value={item.date} />
                </p>
                <h4 className="text-xl font-bold text-white mb-6 leading-tight group-hover:text-accent-primary transition-colors min-h-[60px]">
                  <EditableTextArea value={item.title} className="text-xl font-bold bg-transparent" />
                </h4>
                <button 
                  onClick={() => { setSelectedArticle(item); setCurrentPage('article'); window.scrollTo(0, 0); }}
                  className="inline-flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-white transition-all group/link"
                >
                  Read Full Article <ArrowRight className="w-4 h-4 text-accent-primary group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div></section>

      <section id="consultation" className="section py-32"><div className="container text-center"><div className="glass-card p-16 md:p-32 border-accent-primary-20">
        <h2 className="text-4xl md:text-7xl font-bold mb-10 leading-tight">
          <EditableTextArea value={content.consultation.title} className="text-4xl md:text-7xl font-bold" />
        </h2>
        <EditableTextArea value={content.consultation.subtitle} className="text-xl md:text-2xl text-text-secondary mb-16" />
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="btn btn-primary px-12 h-16 text-xl">Consult CYBEREIGN</button>
          <a href={`mailto:${content.footer.email}`} className="btn btn-secondary px-12 h-16 text-xl"><Mail className="w-6 h-6" /> Contact Us</a>
        </div>
      </div></div></section>
    </>
  );
};

const ArticleDetail = () => {
  const { selectedArticle, setCurrentPage } = useCMS();
  
  if (!selectedArticle) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-bg-primary pt-40 pb-32">
      <div className="container max-w-4xl">
        <button 
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 text-sm font-bold text-text-muted hover:text-accent-primary transition-colors mb-12 uppercase tracking-widest"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Perspectives
        </button>

        <div className="mb-16">
          <span className="px-4 py-1.5 bg-accent-primary-10 border border-accent-primary-20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-accent-primary mb-8 inline-block">
             {selectedArticle.category}
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold leading-[1.1] text-white selection-accent-primary">
             {selectedArticle.title}
          </h1>
          <div className="flex items-center gap-4 mt-12 text-sm text-text-muted font-bold tracking-widest uppercase">
             <span>{selectedArticle.date}</span>
             <div className="w-1.5 h-1.5 rounded-full bg-accent-primary opacity-30"></div>
             <span>CYBEREIGN Consulting</span>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden glass-card p-2 mb-16 border-accent-primary-10">
           <img src={selectedArticle.image} className="w-full h-auto rounded-2xl aspect-video object-cover" alt="Cover" />
        </div>

        <div className="prose prose-invert prose-2xl max-w-none">
           <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-medium whitespace-pre-wrap">
              {selectedArticle.content || "Full perspective content has not been detailed for this specific insight report."}
           </p>
           
           <div className="mt-20 p-12 glass-card border-accent-primary-20">
              <h3 className="text-2xl font-bold mb-4 text-white">Join the Dialogue</h3>
              <p className="text-text-secondary mb-10">CYBEREIGN Consulting actively partners with organizations to implement these structures. To discuss this perspective in the context of your specific operations, request a dedicated consultation.</p>
              <a href="#consultation" onClick={() => setCurrentPage('home')} className="btn btn-primary px-10 h-16 text-lg">Consult CYBEREIGN</a>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

const Footer = () => {
  const { content, isLoggedIn } = useCMS();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <footer className="bg-bg-primary pt-32 pb-16 border-t border-glass-border">
      <div className="container">
        <div className="grid lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <a href="#" className="mb-8 block"><img src="/images/logo.png" alt="Logo" className="h-12 w-auto" /></a>
            <EditableTextArea value={content.footer.description} className="text-lg text-text-secondary mb-8 max-w-sm" />
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
                <EditableText value={content.footer.phone} />
              </a>
              <a href={`mailto:${content.footer.email}`} className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-accent-secondary" /> 
                <EditableText value={content.footer.email} />
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
  const { currentPage } = useCMS();
  
  if (currentPage === 'dashboard') {
    return <Dashboard />;
  }

  return (
    <div className="bg-bg-primary text-text-primary selection-accent-primary">
      <Header />
      <main className="transition-all duration-500">
        {currentPage === 'home' ? (
          <>
            <Hero />
            <ContentSection />
          </>
        ) : (
          <ArticleDetail />
        )}
      </main>
      <Footer />
    </div>
  );
}

export function AppWrapper() {
  return (
    <CMSProvider>
       <App />
    </CMSProvider>
  );
}
