import { useState, useEffect } from 'react';
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
  Phone
} from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
        <nav className="hidden md:flex items-center gap-8">
          {['About', 'Services', 'Industries', 'Insights'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link text-sm font-semibold text-text-secondary hover:text-white transition-all uppercase tracking-widest">
              {item}
            </a>
          ))}
          <a href="#consultation" className="btn btn-primary h-12 py-0 px-6">
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
  return (
    <section className="relative min-h-screen pt-40 pb-20 overflow-hidden flex items-center">
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-accent-primary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-accent-secondary/10 blur-[150px] rounded-full"></div>
      </div>
      
      <div className="container relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary-10 border border-accent-primary-20 text-accent-primary text-sm font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              Govern, Protect, Comply
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1]">
              Strengthening <span className="gradient-text">Governance, Risk,</span> and Data Protection.
            </h1>
            
            <p className="text-xl text-text-secondary mb-10 max-w-xl leading-relaxed">
              CYBEREIGN Consulting supports organizations that want to build stronger governance structures, improve compliance culture, and handle data responsibly in an increasingly regulated world.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <a href="#consultation" className="btn btn-primary px-10 h-16 text-lg">
                Request Consultation
              </a>
              <a href="#services" className="btn btn-secondary px-10 h-16 text-lg">
                Explore Our Services <ChevronRight className="w-5 h-5" />
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-8 border-t border-glass-border pt-12">
              <div>
                <p className="text-sm text-text-muted mb-2 uppercase tracking-widest font-bold">Nigeria Presence</p>
                <div className="flex items-center gap-2 text-white font-medium">
                  <MapPin className="w-4 h-4 text-accent-primary" /> Lagos, Nigeria
                </div>
              </div>
              <div className="h-10 w-px bg-glass-border"></div>
              <div>
                <p className="text-sm text-text-muted mb-2 uppercase tracking-widest font-bold">United States Presence</p>
                <div className="flex items-center gap-2 text-white font-medium">
                  <Globe className="w-4 h-4 text-accent-secondary" /> Duncanville, TX
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-glass-border">
              <img 
                src="/images/hero_abstract_governance.png" 
                alt="Governance & Security" 
                className="w-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-60"></div>
            </div>
            
            {/* Stats Card Overlay */}
            <motion.div 
              className="absolute -bottom-10 -left-10 glass-card p-6 p-8 max-w-[240px]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent-primary-10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-accent-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">99%</p>
                  <p className="text-xs text-text-muted">Compliance Rate</p>
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
  return (
    <section id="about" className="section relative overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden glass-card p-4">
              <img 
                src="/images/data_protection_visualization.png" 
                alt="Data Protection" 
                className="rounded-2xl" 
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-primary/20 blur-[60px] rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent-secondary/20 blur-[60px] rounded-full"></div>
          </motion.div>
          
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 30 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-accent-primary mb-6 uppercase tracking-widest">About CYBEREIGN</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8">Practical structures that organizations can <span className="gradient-text">actually use</span>.</h3>
            
            <p className="text-lg text-text-secondary mb-10 leading-relaxed">
              CYBEREIGN Consulting Limited is a governance, risk, and compliance advisory practice focused on helping organizations build systems that support accountability, manage risk, and protect trust.
            </p>
            
            <div className="space-y-6">
              {[
                "We focus on practical structures, not just policies that sit on paper.",
                "Supporting startups, financial services, and beauty/lifestyle brands.",
                "Specialized in handling data and operational risk across industries."
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 w-6 h-6 rounded-full bg-accent-primary-20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent-primary" />
                  </div>
                  <p className="text-white text-lg">{text}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <a href="#consultation" className="btn btn-secondary py-5 px-8">
                Learn our approach
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Governance, Risk and Compliance Advisory",
      desc: "We support organizations in developing governance structures, risk management processes, and compliance frameworks that align with regulatory expectations.",
      icon: Shield,
      color: "accent-primary"
    },
    {
      title: "Data Protection and Privacy Governance",
      desc: "We help organizations understand how they collect, use, and protect data, while building systems that support responsible data practices.",
      icon: Lock,
      color: "white"
    },
    {
      title: "IT Audit and Compliance Reviews",
      desc: "We conduct structured reviews of internal systems and processes to identify gaps, improve controls, and strengthen accountability.",
      icon: Search,
      color: "accent-secondary"
    },
    {
      title: "Data Protection Awareness Programs",
      desc: "We design and deliver awareness sessions that help teams understand their role in protecting data and maintaining compliance.",
      icon: Users,
      color: "accent-primary"
    }
  ];

  return (
    <section id="services" className="section bg-bg-secondary/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-accent-primary mb-6 uppercase tracking-widest">Our Expertise</h2>
            <h3 className="text-4xl md:text-6xl font-bold mb-8">Specialized Services for Modern Growth</h3>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 flex flex-col items-start gap-6 group hover:translate-y-[-10px] transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl bg-${item.color === 'accent-primary' ? 'accent-primary-10' : item.color === 'accent-secondary' ? 'accent-secondary-10' : 'white-5'} flex items-center justify-center p-4 border border-${item.color === 'accent-primary' ? 'accent-primary-20' : item.color === 'accent-secondary' ? 'accent-secondary-20' : 'glass-border'} group-hover:scale-110 transition-transform`}>
                 <item.icon className={`w-full h-full text-${item.color === 'white' ? 'accent-primary' : item.color}`} />
              </div>
              <h4 className="text-2xl font-bold text-white group-hover:text-accent-primary transition-colors">{item.title}</h4>
              <p className="text-text-secondary text-lg leading-relaxed">{item.desc}</p>
              <a href="#consultation" className="mt-auto flex items-center gap-2 font-bold text-white group-hover:gap-4 transition-all">
                Request Advisory <ArrowRight className="w-5 h-5 text-accent-primary" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Industries = () => {
  const industries = [
    "Financial services and fintech",
    "Technology startups",
    "Beauty and lifestyle brands",
    "Creative and media industries",
    "Small and medium enterprises"
  ];

  return (
    <section id="industries" className="section">
      <div className="container">
        <div className="glass-card p-12 md:p-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-accent-primary/5 blur-[100px] pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-3xl font-bold text-accent-primary mb-6 uppercase tracking-widest">Who We Serve</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-8">Governing Growth across Diverse Sectors.</h3>
              <p className="text-xl text-text-secondary leading-relaxed">
                Our work applies across industries where governance, risk, and data protection matter. We adapt our frameworks to fit your specific operational needs.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {industries.map((industry, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-3 h-3 rounded-full bg-accent-primary group-hover:scale-150 transition-transform"></div>
                  <span className="text-xl font-medium text-text-secondary group-hover:text-white transition-colors">{industry}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Insights = () => {
  const insights = [
    {
      title: "The Future of Privacy in Fintech",
      type: "Data Protection",
      icon: Eye
    },
    {
      title: "Navigating African Compliance Landscapes",
      type: "Governance",
      icon: Globe
    },
    {
      title: "Building Accountability in Operations",
      type: "Risk Management",
      icon: TrendingUp
    }
  ];

  return (
    <section id="insights" className="section bg-bg-secondary/30">
      <div className="container text-center">
        <motion.div
           whileInView={{ opacity: 1, y: 0 }}
           initial={{ opacity: 0, y: 20 }}
           viewport={{ once: true }}
           className="mb-16"
        >
          <h2 className="text-3xl font-bold text-accent-primary mb-6 uppercase tracking-widest">Perspectives</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-8">Latest Insights & Thought Leadership.</h3>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            We share insights on governance, compliance, and data protection to help organizations better understand risk and accountability.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {insights.map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-10 text-left hover:border-accent-primary/30 group"
            >
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-glass-border">
                <item.icon className="w-6 h-6 text-accent-primary" />
              </div>
              <p className="text-sm font-bold text-accent-primary uppercase tracking-widest mb-4">{item.type}</p>
              <h4 className="text-2xl font-bold text-white mb-8 leading-tight group-hover:text-accent-primary transition-colors">{item.title}</h4>
              <button className="flex items-center gap-2 font-bold group-hover:gap-4 transition-all">
                Read Article <ChevronRight className="w-4 h-4 text-accent-primary" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Consultation = () => {
  return (
    <section id="consultation" className="section bg-accent-secondary-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-primary-30 to-transparent"></div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true }}
            className="glass-card p-12 md:p-24 border-accent-primary/20 backdrop-blur-xl"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Strong organizations do not wait for incidents.</h2>
            <p className="text-xl md:text-2xl text-text-secondary mb-12 leading-relaxed">
              If your organization is thinking about governance, compliance, or data protection, CYBEREIGN Consulting can support that journey.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="btn btn-primary px-12 py-6 text-xl">
                Request Advisory Consultation
              </button>
              <a href="mailto:cybereignconsulting@gmail.com" className="btn btn-secondary px-12 py-6 text-xl">
                <Mail className="w-6 h-6" /> Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-bg-primary pt-32 pb-16 border-t border-glass-border">
      <div className="container">
        <div className="grid lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center mb-8">
              <img src="/images/logo.png" alt="CYBEREIGN" className="h-12 md:h-14 w-auto object-contain" />
            </a>
            <p className="text-lg text-text-secondary mb-8 max-w-sm">
              Helping organizations build systems that support accountability, manage risk, and protect trust.
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com/company/cybereignconsulting" className="w-12 h-12 rounded-full border border-glass-border flex items-center justify-center hover:bg-accent-primary hover:text-bg-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:cybereignconsulting@gmail.com" className="w-12 h-12 rounded-full border border-glass-border flex items-center justify-center hover:bg-accent-primary hover:text-bg-primary transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-8">Locations</h4>
            <div className="space-y-6">
              <div>
                <p className="text-accent-primary font-bold text-sm uppercase mb-2">Head office</p>
                <p className="text-text-secondary leading-relaxed">
                  Lagos, Nigeria
                </p>
              </div>
              <div>
                <p className="text-accent-secondary font-bold text-sm uppercase mb-2">Remote Presence</p>
                <p className="text-text-secondary leading-relaxed">
                  Duncanville, Texas, United States
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-8">Contact</h4>
            <div className="space-y-4">
              <a href="tel:+2349063787767" className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-accent-primary" /> +234 906 378 7767
              </a>
              <a href="mailto:cybereignconsulting@gmail.com" className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-accent-secondary" /> cybereignconsulting@gmail.com
              </a>
              <a href="https://linkedin.com/company/cybereignconsulting" className="flex items-center gap-3 text-text-secondary hover:text-white transition-colors">
                <Linkedin className="w-5 h-5 text-accent-primary" /> cybereignconsulting
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-text-muted text-sm">
            © 2026 CYBEREIGN Consulting Limited. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-text-muted hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-text-muted hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
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
    </div>
  );
}

export default App;
