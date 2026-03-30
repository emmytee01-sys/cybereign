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
  Image as ImageIcon
} from 'lucide-react';

import contentData from './content.json';

// --- CMS CONTEXT & LOGIC ---

type CMSContent = typeof contentData;

const CMSContext = createContext<{
  content: CMSContent;
  updateContent: (path: string, value: any) => void;
  isEditMode: boolean;
  setIsEditMode: (v: boolean) => void;
  saveChanges: () => void;
  resetChanges: () => void;
} | null>(null);

const CMSProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<CMSContent>(contentData);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem('cybereign_cms_draft');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }
  }, []);

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

  const saveChanges = () => {
    // In a real app, this would push to Supabase/Firebase/Server
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content.json';
    link.click();
    alert('Content saved to draft. Downloaded content.json. Replace it in the /src folder to finalize deployment.');
  };

  const resetChanges = () => {
    if (confirm('Reset all draft changes to the original values?')) {
      setContent(contentData);
      localStorage.removeItem('cybereign_cms_draft');
    }
  };

  return (
    <CMSContext.Provider value={{ content, updateContent, isEditMode, setIsEditMode, saveChanges, resetChanges }}>
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

// --- CMS UI COMPONENTS ---

const CMSControlPanel = () => {
  const { isEditMode, setIsEditMode, saveChanges, resetChanges, content, updateContent } = useCMS();
  const [activeTab, setActiveTab] = useState<'text' | 'colors' | 'layout'>('text');

  if (!isEditMode) return null;

  return (
    <motion.div 
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      className="fixed top-0 right-0 h-full w-[400px] bg-bg-secondary border-l border-glass-border z-[200] shadow-2xl flex flex-col pt-24 px-8 overflow-y-auto pb-32"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Edit2 className="w-5 h-5 text-accent-primary" /> Admin CMS
        </h2>
        <button onClick={() => setIsEditMode(false)} className="text-text-muted hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-glass-border pb-4">
        {[
          { icon: Type, id: 'text', label: 'Content' },
          { icon: Palette, id: 'colors', label: 'Theme' },
          { icon: Layout, id: 'layout', label: 'Structure' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-2 text-xs font-bold uppercase tracking-widest ${activeTab === tab.id ? 'text-accent-primary' : 'text-text-muted hover:text-white'}`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-widest text-text-muted">Primary Accent</label>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={content.colors.accentPrimary} 
                onChange={(e) => updateContent('colors.accentPrimary', e.target.value)}
                className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
              />
              <span className="font-mono text-sm uppercase">{content.colors.accentPrimary}</span>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-widest text-text-muted">Secondary Accent</label>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={content.colors.accentSecondary} 
                onChange={(e) => updateContent('colors.accentSecondary', e.target.value)}
                className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
              />
              <span className="font-mono text-sm uppercase">{content.colors.accentSecondary}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'text' && (
        <div className="space-y-8">
          <SectionEditor title="Hero Section">
             <Field label="Tagline" value={content.hero.tagline} onChange={(v) => updateContent('hero.tagline', v)} />
             <Field label="Headline" value={content.hero.title} textarea onChange={(v) => updateContent('hero.title', v)} />
             <Field label="Subtext" value={content.hero.subtitle} textarea onChange={(v) => updateContent('hero.subtitle', v)} />
          </SectionEditor>

          <SectionEditor title="Contact Info">
             <Field label="Email" value={content.footer.email} onChange={(v) => updateContent('footer.email', v)} />
             <Field label="Phone" value={content.footer.phone} onChange={(v) => updateContent('footer.phone', v)} />
             <Field label="LinkedIn URL" value={content.footer.linkedin} onChange={(v) => updateContent('footer.linkedin', v)} />
          </SectionEditor>
        </div>
      )}
      
      <div className="fixed bottom-0 right-0 w-[400px] p-8 bg-bg-secondary border-t border-glass-border flex flex-col gap-4">
        <button onClick={saveChanges} className="btn btn-primary w-full h-12 flex items-center justify-center gap-2">
          <Save className="w-5 h-5" /> Deploy & Save
        </button>
        <button onClick={resetChanges} className="btn btn-secondary w-full h-12 flex items-center justify-center gap-2">
          <RefreshCcw className="w-5 h-5" /> Reset Draft
        </button>
      </div>
    </motion.div>
  );
};

const SectionEditor = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-4">
    <h3 className="text-sm font-black uppercase text-accent-primary border-l-4 border-accent-primary pl-3">{title}</h3>
    <div className="space-y-4 pl-4">{children}</div>
  </div>
);

const Field = ({ label, value, textarea, onChange }: { label: string, value: string, textarea?: boolean, onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</label>
    {textarea ? (
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-glass-border rounded-lg p-3 text-sm focus:border-accent-primary transition-colors outline-none h-24"
      />
    ) : (
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-glass-border rounded-lg p-3 text-sm focus:border-accent-primary transition-colors outline-none"
      />
    )}
  </div>
);

// --- WEBSITE COMPONENTS ---

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
        <a href="#" className="flex items-center group">
          <img src="/images/logo.png" alt="CYBEREIGN" className="h-10 md:h-12 w-auto object-contain" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          {['About', 'Services', 'Industries', 'Insights'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-sm font-semibold text-text-secondary hover:text-white transition-all uppercase tracking-widest">
              {item}
            </a>
          ))}
          <a href="#consultation" className="btn btn-primary h-10 py-0 px-5 text-sm">
            Book Consultation
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-bg-secondary p-8 border-b border-glass-border flex flex-col gap-6"
          >
            {['About', 'Services', 'Industries', 'Insights'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-lg font-medium text-text-secondary" onClick={() => setIsMenuOpen(false)}>
                {item}
              </a>
            ))}
            <a href="#consultation" className="btn btn-primary w-full" onClick={() => setIsMenuOpen(false)}>
              Request Consultation
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => {
  const { content } = useCMS();
  return (
    <section className="relative min-h-screen pt-40 pb-20 overflow-hidden flex items-center">
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-accent-primary-10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-accent-secondary-10 blur-[150px] rounded-full"></div>
      </div>
      
      <div className="container relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary-10 border border-accent-primary-20 text-accent-primary text-sm font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              {content.hero.tagline}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1]">
              Strengthening <span className="gradient-text">Governance, Risk,</span> and Data Protection.
            </h1>
            
            <p className="text-xl text-text-secondary mb-10 max-w-xl leading-relaxed">
              {content.hero.subtitle}
            </p>
            
            <div className="flex flex-wrap gap-5">
              <a href="#consultation" className="btn btn-primary px-10 h-16 text-lg">{content.hero.ctaText}</a>
              <a href="#services" className="btn btn-secondary px-10 h-16 text-lg">
                {content.hero.secondaryText} <ChevronRight className="w-5 h-5" />
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-8 border-t border-glass-border pt-12">
              <div>
                <p className="text-sm text-text-muted mb-2 uppercase tracking-widest font-bold">Nigeria Presence</p>
                <div className="flex items-center gap-2 text-white font-medium"><MapPin className="w-4 h-4 text-accent-primary" /> Lagos, Nigeria</div>
              </div>
              <div className="h-10 w-px bg-glass-border"></div>
              <div>
                <p className="text-sm text-text-muted mb-2 uppercase tracking-widest font-bold">United States Presence</p>
                <div className="flex items-center gap-2 text-white font-medium"><Globe className="w-4 h-4 text-accent-secondary" /> Duncanville, TX</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-glass-border">
              <img src={content.hero.image} alt="Governance" className="w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-60"></div>
            </div>
            
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-10 -left-10 glass-card p-6 p-8 max-w-[240px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent-primary-10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-accent-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{content.hero.stats.value}</p>
                  <p className="text-xs text-text-muted">{content.hero.stats.label}</p>
                </div>
              </div>
              <div className="h-1 w-full bg-glass-border rounded-full overflow-hidden">
                <div className="h-full bg-accent-primary w-full animate-pulse"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const { content } = useCMS();
  return (
    <section id="about" className="section relative overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -30 }} viewport={{ once: true }} className="relative">
            <div className="rounded-3xl overflow-hidden glass-card p-4">
              <img src={content.about.image} alt="Data" className="rounded-2xl" />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-primary-20 blur-[60px] rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-secondary-20 blur-[60px] rounded-full"></div>
          </motion.div>
          
          <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 30 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-accent-primary mb-6 uppercase tracking-widest">{content.about.tagline}</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8">Practical structures that organizations can <span className="gradient-text">actually use</span>.</h3>
            
            <p className="text-lg text-text-secondary mb-10 leading-relaxed">{content.about.subtitle}</p>
            
            <div className="space-y-6">
              {content.about.bullets.map((text, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 w-6 h-6 rounded-full bg-accent-primary-20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-white text-lg">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const { content } = useCMS();
  const iconMap: any = { Shield, Lock, Search, Users };

  return (
    <section id="services" className="section bg-bg-secondary-30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
           <h2 className="text-3xl font-bold text-accent-primary mb-6 uppercase tracking-widest">{content.services.tagline}</h2>
           <h3 className="text-4xl md:text-6xl font-bold mb-8">{content.services.title}</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {content.services.items.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div key={i} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} className="glass-card p-10 flex flex-col items-start gap-6 group hover:translate-y-[-10px] transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-${item.color === 'accentPrimary' ? 'accent-primary-10' : item.color === 'accentSecondary' ? 'accent-secondary-10' : 'white-5'} flex items-center justify-center p-4 border border-glass-border group-hover:scale-110 transition-transform`}>
                   <Icon className={`w-full h-full text-${item.color === 'white' ? 'accent-primary' : item.color}`} />
                </div>
                <h4 className="text-2xl font-bold text-white group-hover:text-accent-primary transition-colors">{item.title}</h4>
                <p className="text-text-secondary text-lg leading-relaxed">{item.description}</p>
                <a href="#consultation" className="mt-auto flex items-center gap-2 font-bold text-white group-hover:gap-4 transition-all">
                  Request Advisory <ArrowRight className="w-5 h-5 text-accent-primary" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Industries = () => {
  const { content } = useCMS();
  return (
    <section id="industries" className="section">
      <div className="container">
        <div className="glass-card p-12 md:p-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-accent-primary-5 blur-[100px] pointer-events-none"></div>
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-bold text-accent-primary mb-6 uppercase tracking-widest">{content.industries.tagline}</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-8">{content.industries.title}</h3>
              <p className="text-xl text-text-secondary leading-relaxed">{content.industries.description}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {content.industries.items.map((industry, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-3 h-3 rounded-full bg-accent-primary group-hover:scale-150 transition-transform"></div>
                  <span className="text-xl font-medium text-text-secondary group-hover:text-white transition-colors">{industry}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Insights = () => {
  const { content } = useCMS();
  const iconMap: any = { Eye, Globe, TrendingUp };

  return (
    <section id="insights" className="section bg-bg-secondary-30">
      <div className="container text-center">
        <h2 className="text-3xl font-bold text-accent-primary mb-6 uppercase tracking-widest">{content.insights.tagline}</h2>
        <h3 className="text-4xl md:text-5xl font-bold mb-8">{content.insights.title}</h3>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-16">{content.insights.description}</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {content.insights.items.map((item, i) => {
             const Icon = iconMap[item.icon];
             return (
              <motion.div key={i} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }} className="glass-card p-10 text-left hover:border-accent-primary-30 group">
                <div className="w-12 h-12 bg-white-5 rounded-xl flex items-center justify-center mb-8 border border-glass-border">
                  <Icon className="w-6 h-6 text-accent-primary" />
                </div>
                <p className="text-sm font-bold text-accent-primary uppercase tracking-widest mb-4">{item.type}</p>
                <h4 className="text-2xl font-bold text-white mb-8 leading-tight group-hover:text-accent-primary transition-colors">{item.title}</h4>
                <button className="flex items-center gap-2 font-bold group-hover:gap-4 transition-all">
                  Read Article <ChevronRight className="w-4 h-4 text-accent-primary" />
                </button>
              </motion.div>
             );
          })}
        </div>
      </div>
    </section>
  );
};

const Consultation = () => {
  const { content } = useCMS();
  return (
    <section id="consultation" className="section bg-accent-secondary-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-primary-30 to-transparent"></div>
      <div className="container relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.95 }} viewport={{ once: true }} className="glass-card p-12 md:p-24 border-accent-primary-20 backdrop-blur-xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">{content.consultation.title}</h2>
            <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed">{content.consultation.subtitle}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="btn btn-primary px-12 py-6 text-xl">Request Advisory Consultation</button>
              <a href={`mailto:${content.footer.email}`} className="btn btn-secondary px-12 py-6 text-xl"><Mail className="w-6 h-6" /> Contact Us</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { content } = useCMS();
  return (
    <footer className="bg-bg-primary pt-32 pb-16 border-t border-glass-border">
      <div className="container">
        <div className="grid lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center mb-8"><img src="/images/logo.png" alt="Logo" className="h-12 md:h-14 w-auto object-contain" /></a>
            <p className="text-lg text-text-secondary mb-8 max-w-sm">{content.footer.description}</p>
            <div className="flex gap-4">
              <a href={content.footer.linkedin} className="w-12 h-12 rounded-full border border-glass-border flex items-center justify-center hover:bg-accent-primary hover:text-bg-primary transition-all"><Linkedin className="w-5 h-5" /></a>
              <a href={`mailto:${content.footer.email}`} className="w-12 h-12 rounded-full border border-glass-border flex items-center justify-center hover:bg-accent-primary hover:text-bg-primary transition-all"><Mail className="w-5 h-5" /></a>
            </div>
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
              <a href={`tel:${content.footer.phone.replace(/\s+/g, '')}`} className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors"><Phone className="w-5 h-5 text-accent-primary" /> {content.footer.phone}</a>
              <a href={`mailto:${content.footer.email}`} className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors"><Mail className="w-5 h-5 text-accent-secondary" /> {content.footer.email}</a>
              <a href={content.footer.linkedin} className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors"><Linkedin className="w-5 h-5 text-accent-primary" /> cybereignconsulting</a>
            </div>
          </div>
        </div>
        <div className="pt-12 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-text-muted text-sm">© 2026 CYBEREIGN Consulting Limited. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-text-muted hover:text-white">Privacy Policy</a>
            <a href="#" className="text-sm text-text-muted hover:text-white">Terms of Service</a>
            <button 
              onClick={() => {
                const pass = prompt('Enter Admin Password:');
                if (pass === 'cybereign2026') setIsEditMode(true);
              }}
              className="text-sm text-accent-primary/50 hover:text-accent-primary flex items-center gap-2 border-l border-glass-border pl-8 transition-colors"
            >
              <Lock className="w-3 h-3" /> Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <CMSProvider>
       <div className="bg-bg-primary text-text-primary selection-accent-primary">
          <Header />
          <main>
            <Hero />
            <About />
            <Services />
            <Industries />
            <Insights />
            <Consultation />
          </main>
          <Footer />
          <CMSControlPanel />
       </div>
    </CMSProvider>
  );
}
