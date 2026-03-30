import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Search, 
  Users, 
  ChevronRight, 
  Mail, 
  MapPin, 
  Linkedin, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Eye, 
  TrendingUp,
  Menu,
  X,
  Phone,
  Settings,
  Edit2,
  Save,
  LogOut,
  RefreshCcw,
  Palette,
  Layout,
  Type,
  User,
  Key,
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
      <div style={{ 
        '--accent-primary': content.colors.accentPrimary, 
        '--accent-secondary': content.colors.accentSecondary 
      } as React.CSSProperties}>
        {children}
      </div>
    </CMSContext.Provider>
  );
};

const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within CMSProvider');
  return context;
};

// --- LOGIN PAGE ---

const LoginPage = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { login } = useCMS();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const success = await login(username, password);
    setIsLoggingIn(false);
    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-bg-primary/95 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md p-10 relative overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary-10 rounded-3xl border border-accent-primary-20 mb-6 p-4">
            <Lock className="w-10 h-10 text-accent-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">CMS LOGIN</h2>
          <p className="text-text-secondary">Securely manage the CYBEREIGN environment.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-3">
             <label className="text-xs font-black uppercase tracking-widest text-text-muted">Username</label>
             <div className="relative">
               <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
               <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-white/5 border border-glass-border rounded-xl py-4 pl-12 pr-4 focus:border-accent-primary outline-none transition-all" placeholder="Enter username" />
             </div>
           </div>
           <div className="space-y-3">
             <label className="text-xs font-black uppercase tracking-widest text-text-muted">Password</label>
             <div className="relative">
               <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
               <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-white/5 border border-glass-border rounded-xl py-4 pl-12 pr-4 focus:border-accent-primary outline-none transition-all" placeholder="Enter password" />
             </div>
           </div>
           
           <button type="submit" disabled={isLoggingIn} className="btn btn-primary w-full h-16 text-lg font-bold">
             {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Access Dashboard'}
           </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- CMS DASHBOARD ---

const CMSControlPanel = () => {
  const { isEditMode, setIsEditMode, saveChanges, resetChanges, content, updateContent, logout } = useCMS();
  const [activeTab, setActiveTab] = useState<'text' | 'colors' | 'layout'>('text');

  if (!isEditMode) return null;

  return (
    <motion.div 
      initial={{ x: 400 }} animate={{ x: 0 }}
      className="fixed top-0 right-0 h-full w-[400px] bg-bg-secondary border-l border-glass-border z-[2000] shadow-2xl flex flex-col pt-24 px-8 overflow-y-auto pb-48"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Edit2 className="w-5 h-5 text-accent-primary" /> Admin Panel
        </h2>
        <div className="flex gap-4">
          <button onClick={logout} className="text-text-muted hover:text-red-500 transition-colors p-2 bg-white/5 rounded-lg"><LogOut className="w-5 h-5" /></button>
          <button onClick={() => setIsEditMode(false)} className="text-text-muted hover:text-white transition-colors p-2 bg-white/5 rounded-lg"><X className="w-6 h-6" /></button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-glass-border pb-4">
        {[
          { icon: Type, id: 'text', label: 'Text' },
          { icon: Palette, id: 'colors', label: 'Design' },
          { icon: Layout, id: 'layout', label: 'Sections' }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex flex-col items-center gap-2 text-xs font-bold uppercase tracking-widest ${activeTab === tab.id ? 'text-accent-primary' : 'text-text-muted hover:text-white'}`}>
            <tab.icon className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'colors' && (
        <div className="space-y-6">
          <SectionEditor title="Global Brand Theme">
            <ColorPicker label="Primary Accent" value={content.colors.accentPrimary} onChange={v => updateContent('colors.accentPrimary', v)} />
            <ColorPicker label="Secondary Accent" value={content.colors.accentSecondary} onChange={v => updateContent('colors.accentSecondary', v)} />
          </SectionEditor>
        </div>
      )}

      {activeTab === 'text' && (
        <div className="space-y-8">
          <SectionEditor title="Hero Content">
             <Field label="Tagline" value={content.hero.tagline} onChange={(v) => updateContent('hero.tagline', v)} />
             <Field label="Main Headline" value={content.hero.title} textarea onChange={(v) => updateContent('hero.title', v)} />
             <Field label="Subtext" value={content.hero.subtitle} textarea onChange={(v) => updateContent('hero.subtitle', v)} />
          </SectionEditor>
          <SectionEditor title="Contact Details">
             <Field label="Corporate Email" value={content.footer.email} onChange={(v) => updateContent('footer.email', v)} />
             <Field label="Contact Phone" value={content.footer.phone} onChange={(v) => updateContent('footer.phone', v)} />
          </SectionEditor>
        </div>
      )}
      
      <div className="fixed bottom-0 right-0 w-[400px] p-8 bg-bg-secondary border-t border-glass-border flex flex-col gap-4">
        <button onClick={saveChanges} className="btn btn-primary w-full h-12 flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Push to Database
        </button>
        <button onClick={resetChanges} className="btn btn-secondary w-full h-12 flex items-center justify-center gap-2 text-text-muted">
          <RefreshCcw className="w-5 h-5" /> Discard Changes
        </button>
      </div>
    </motion.div>
  );
};

const SectionEditor = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-black uppercase text-accent-primary border-l-4 border-accent-primary pl-3 tracking-widest">{title}</h3>
    <div className="space-y-4 pl-4 border-l border-white/5">{children}</div>
  </div>
);

const Field = ({ label, value, textarea, onChange }: { label: string, value: string, textarea?: boolean, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/5 border border-glass-border rounded-lg p-3 text-sm focus:border-accent-primary outline-none h-24" />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/5 border border-glass-border rounded-lg p-3 text-sm focus:border-accent-primary outline-none" />
    )}
  </div>
);

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</label>
    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-glass-border">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer" />
      <span className="font-mono text-sm uppercase text-white">{value}</span>
    </div>
  </div>
);

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary-10 border border-accent-primary-20 text-accent-primary text-sm font-semibold mb-8"><span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>{content.hero.tagline}</div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1]">{content.hero.title.split(',').map((p, i) => i === 1 ? <span key={i} className="gradient-text">{p}, </span> : p + (i === 0 ? ',' : ''))}</h1>
            <p className="text-xl text-text-secondary mb-10 max-w-xl">{content.hero.subtitle}</p>
            <div className="flex flex-wrap gap-5">
              <a href="#consultation" className="btn btn-primary px-10 h-16 text-lg">{content.hero.ctaText}</a>
              <a href="#services" className="btn btn-secondary px-10 h-16 text-lg">{content.hero.secondaryText} <ChevronRight className="w-5 h-5" /></a>
            </div>
            <div className="mt-12 flex gap-8 pt-12 border-t border-white/5 text-sm text-text-muted">
               <div><p className="font-bold uppercase tracking-widest text-accent-primary">Nigeria</p>Lagos State</div>
               <div className="w-px h-10 bg-white/5"></div>
               <div><p className="font-bold uppercase tracking-widest text-accent-secondary">USA</p>Duncanville, TX</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="rounded-3xl overflow-hidden glass-card p-2 border-accent-primary-20"><img src={content.hero.image} alt="Logo" className="w-full rounded-2xl" /></div>
            <div className="absolute -bottom-8 -left-8 glass-card p-8"><p className="text-3xl font-bold text-white">{content.hero.stats.value}</p><p className="text-xs text-text-muted uppercase tracking-widest">{content.hero.stats.label}</p></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ContentSection = () => {
  const { content } = useCMS();
  return (
    <>
      <section id="about" className="section"><div className="container"><div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="glass-card p-4 rounded-3xl"><img src={content.about.image} alt="About" className="rounded-2xl" /></div>
        <div>
          <h2 className="text-sm font-bold text-accent-primary uppercase tracking-widest mb-6">{content.about.tagline}</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">{content.about.title}</h3>
          <p className="text-lg text-text-secondary mb-10 leading-relaxed">{content.about.subtitle}</p>
          <div className="space-y-4">{content.about.bullets.map((b, i) => <div key={i} className="flex gap-4"><CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0" /><p className="text-white font-medium">{b}</p></div>)}</div>
        </div>
      </div></div></section>

      <section id="services" className="section bg-bg-secondary-30"><div className="container">
        <div className="text-center mb-16"><h2 className="text-sm font-bold text-accent-primary mb-4 uppercase tracking-widest">{content.services.tagline}</h2><h3 className="text-4xl md:text-6xl font-bold">{content.services.title}</h3></div>
        <div className="grid md:grid-cols-2 gap-8">{content.services.items.map((s, i) => (
          <div key={i} className="glass-card p-10 hover:translate-y-[-10px] transition-all group">
            <div className="w-16 h-16 bg-accent-primary-10 rounded-2xl mb-8 flex items-center justify-center p-4 border border-accent-primary-20">
              <Shield className="w-full h-full text-accent-primary" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-accent-primary transition-colors">{s.title}</h4>
            <p className="text-text-secondary mb-8">{s.description}</p>
            <a href="#consultation" className="font-bold flex items-center gap-2 group-hover:gap-4 transition-all">Request Advisory <ArrowRight className="w-5 h-5 text-accent-primary" /></a>
          </div>
        ))}</div>
      </div></section>

      <section id="industries" className="section"><div className="container"><div className="glass-card p-12 md:p-20 relative overflow-hidden text-center">
        <h2 className="text-sm font-bold text-accent-primary mb-6 uppercase tracking-widest">{content.industries.tagline}</h2>
        <h3 className="text-4xl md:text-5xl font-bold mb-10">{content.industries.title}</h3>
        <div className="flex flex-wrap justify-center gap-8">{content.industries.items.map((ind, i) => <div key={i} className="px-8 py-4 bg-white/5 border border-glass-border rounded-full hover:border-accent-primary transition-colors font-bold text-text-secondary hover:text-white">{ind}</div>)}</div>
      </div></div></section>

      <section id="consultation" className="section py-32"><div className="container text-center"><div className="glass-card p-16 md:p-32 border-accent-primary-20">
        <h2 className="text-4xl md:text-7xl font-bold mb-10 leading-tight">{content.consultation.title}</h2>
        <p className="text-xl md:text-2xl text-text-secondary mb-16">{content.consultation.subtitle}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="btn btn-primary px-12 h-16 text-xl">Consult CYBEREIGN</button>
          <a href={`mailto:${content.footer.email}`} className="btn btn-secondary px-12 h-16 text-xl"><Mail className="w-6 h-6" /> Contact Us</a>
        </div>
      </div></div></section>
    </>
  );
};

const Footer = () => {
  const { content, isLoggedIn, setIsEditMode } = useCMS();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <footer className="bg-bg-primary pt-32 pb-16 border-t border-glass-border">
      <div className="container">
        <div className="grid lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <a href="#" className="mb-8 block"><img src="/images/logo.png" alt="Logo" className="h-12 w-auto" /></a>
            <p className="text-lg text-text-secondary mb-8 max-w-sm">{content.footer.description}</p>
            <div className="flex gap-4"><a href={content.footer.linkedin} className="w-12 h-12 rounded-full border border-glass-border flex items-center justify-center hover:bg-accent-primary transition-all"><Linkedin className="w-5 h-5" /></a></div>
          </div>
          <div><h4 className="text-lg font-bold text-white mb-8">Nigeria Area</h4><p className="text-text-secondary">Lagos Presence</p></div>
          <div>
            <h4 className="text-lg font-bold text-white mb-8">Contact System</h4>
            <div className="space-y-4">
              <a href={`tel:${content.footer.phone.replace(/\s+/g,'')}`} className="flex items-center gap-3 text-text-secondary hover:text-white"><Phone className="w-4 h-4 text-accent-primary" /> {content.footer.phone}</a>
              <a href={`mailto:${content.footer.email}`} className="flex items-center gap-3 text-text-secondary hover:text-white"><Mail className="w-4 h-4 text-accent-secondary" /> {content.footer.email}</a>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-text-muted text-sm tracking-widest uppercase">© 2026 CYBEREIGN Consulting. Govern. Protect. Comply.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-xs text-text-muted hover:text-white">Privacy</a>
            {isLoggedIn ? (
              <button onClick={() => setIsEditMode(true)} className="text-accent-primary font-black uppercase text-xs flex items-center gap-2 border-l border-white/5 pl-8"><Settings className="w-3 h-3 animate-spin" /> Manage Site</button>
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
          <Header />
          <main><Hero /><ContentSection /></main>
          <Footer /><CMSControlPanel />
       </div>
    </CMSProvider>
  );
}
