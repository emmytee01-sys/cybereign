import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Terminal,
  ChevronRight,
  Menu,
  X,
  Globe,
  Cpu,
  Activity,
  Zap,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Award
} from 'lucide-react';
import './App.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'About Us', href: '#about' },
    { name: 'Expertise', href: '#expertise' },
    { name: 'Governance', href: '#governance' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass py-4 shadow-2xl' : 'py-6'}`}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-10 h-10 bg-gradient-to-br from-[#00CCFF] to-[#6600CC] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(0,204,255,0.3)]"
          >
            <Shield className="text-white w-6 h-6" />
          </motion.div>
          <span className="text-xl font-bold tracking-tighter uppercase font-space ml-2">
            Cybereign<span className="text-[#00CCFF]">.</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-[#00CCFF] transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00CCFF] transition-all group-hover:w-full"></span>
            </a>
          ))}
          <button className="px-6 py-2.5 bg-gradient-to-r from-[#00CCFF] to-[#6600CC] rounded-full text-sm font-bold text-white shadow-[0_0_20px_rgba(0,204,255,0.2)] hover:shadow-[0_0_30px_rgba(0,204,255,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95">
            Book Consultation
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t border-white/5 py-8 px-6 md:hidden flex flex-col gap-6 items-center"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-medium hover:text-[#00CCFF]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="w-full max-w-xs px-6 py-3 bg-gradient-to-r from-[#00CCFF] to-[#6600CC] rounded-full font-bold">
              Book Consultation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#00CCFF]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#6600CC]/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
          <div className="grid grid-cols-12 h-full gap-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border-r border-white/10 h-full"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="container relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00CCFF]/10 border border-[#00CCFF]/20 text-[#00CCFF] text-xs font-bold mb-6 tracking-wide uppercase">
            <Zap className="w-3 h-3" />
            Empowering Modern Enterprises
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
            Digital Growth Without <span className="gradient-text">Governance</span> is Reckless Ambition.
          </h1>
          <p className="text-lg text-[#b0b0d0] mb-8 max-w-xl">
            Establish structured control before you scale. We help organizations build compliant, resilient, and well-governed digital environments.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-[#00CCFF] to-[#6600CC] rounded-full text-base font-bold text-white shadow-[0_0_30px_rgba(0,204,255,0.3)] hover:shadow-[0_0_40px_rgba(0,204,255,0.5)] transition-all transform hover:-translate-y-1">
              Start Strategy Session
            </button>
            <button className="px-8 py-4 glass-card rounded-full font-bold text-white flex items-center gap-2 hover:bg-white/10">
              View Solutions <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#00CCFF]/30 bg-[#101025] flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#00CCFF]/20 to-[#6600CC]/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#00CCFF]/60" />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="font-bold text-[#00CCFF]">500+</span>
              <span className="text-[#b0b0d0] ml-1">Trust Cybereign Globally</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden glass shadow-2xl border border-white/10">
            <img
              src="/images/Artboard 3-2.jpg.jpeg"
              alt="Cybersecurity Visualization"
              className="w-full h-auto object-cover opacity-90 transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent opacity-60"></div>
          </div>

          {/* Floating Feature Cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 p-4 glass-card shadow-2xl z-20"
          >
            <div className="w-10 h-10 rounded-full bg-[#00CCFF] flex items-center justify-center mb-2">
              <Lock className="text-white w-5 h-5" />
            </div>
            <div className="text-xs font-bold">Encrypted Nodes</div>
            <div className="text-[10px] text-[#00CCFF]">Active Protections</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-6 p-4 glass-card shadow-2xl z-20"
          >
            <div className="w-10 h-10 rounded-full bg-[#6600CC] flex items-center justify-center mb-2">
              <Activity className="text-white w-5 h-5" />
            </div>
            <div className="text-xs font-bold">Risk Management</div>
            <div className="text-[10px] text-[#6600CC]">99.9% Compliance</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const VisionMission = () => {
  return (
    <section id="about" className="section relative">
      <div className="container overflow-hidden">
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            className="glass-card p-10 flex flex-col h-full relative group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Globe className="w-32 h-32" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#00CCFF]/10 flex items-center justify-center mb-8 border border-[#00CCFF]/20">
              <Award className="text-[#00CCFF] w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-[#b0b0d0] text-lg leading-relaxed flex-grow">
              To become a trusted <span className="text-white font-bold">African born advisory firm</span> that shapes how organizations around the world govern data, technology, and digital risk with integrity and accountability.
            </p>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card p-10 flex flex-col h-full relative group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cpu className="w-32 h-32" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#6600CC]/10 flex items-center justify-center mb-8 border border-[#6600CC]/20">
              <FileSearch className="text-[#6600CC] w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-[#b0b0d0] text-lg leading-relaxed flex-grow">
              To support organizations in building <span className="text-white font-bold">compliant, resilient, and well-governed</span> digital environments by delivering practical governance frameworks, risk assessment, compliance readiness, and data protection advisory services.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      title: "Governance Frameworks",
      desc: "Establishing structured control systems that enable sustainable growth without compromising security.",
      icon: <Terminal className="w-6 h-6" />,
      color: "#00CCFF"
    },
    {
      title: "Risk Assessment",
      desc: "Comprehensive identification and mitigation of digital threats before they impact your operations.",
      icon: <Shield className="w-6 h-6" />,
      color: "#6600CC"
    },
    {
      title: "Compliance Readiness",
      desc: "Ensuring your organization meets and exceeds global standards including GDPR, ISO, and local regulations.",
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "#00FF99"
    },
    {
      title: "Data Protection",
      desc: "Advanced advisory services to safeguard your most valuable digital assets and customer trust.",
      icon: <Lock className="w-6 h-6" />,
      color: "#00CCFF"
    }
  ];

  return (
    <section id="solutions" className="section bg-[#08081a]/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Practical <span className="gradient-text">Solutions</span> for Tomorrow</h2>
            <p className="text-[#b0b0d0] text-lg">
              Serious organizations don't "try" to be compliant. They are. We provide the tools and expertise to make it your reality.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 group hover:bg-[#101025]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                style={{ backgroundColor: `${service.color}20`, color: service.color, border: `1px solid ${service.color}40` }}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-[#b0b0d0] text-sm leading-relaxed mb-6">{service.desc}</p>
              <a href="#" className="flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3" style={{ color: service.color }}>
                Learn More <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="relative rounded-[40px] overflow-hidden glass p-12 md:p-20 text-center">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src="/images/Artboard 3-4.jpg.jpeg" alt="Protection BG" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00CCFF]/10 to-[#6600CC]/10"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 italic">
              "Compliance is not a department. It is a <span className="text-[#00CCFF]">standard</span>."
            </h2>
            <p className="text-xl text-[#b0b0d0] mb-10">
              Engage Cybereign for a private governance consultation and start your journey towards resilient digital growth.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="px-10 py-5 bg-[#00CCFF] hover:bg-[#00bbee] text-[#050510] font-black rounded-full shadow-[0_0_30px_rgba(0,204,255,0.4)] transition-all transform hover:scale-105 active:scale-95 text-lg">
                BOOK CONSULTATION NOW
              </button>
              <button className="px-10 py-5 border-2 border-white/20 hover:border-white/40 text-white font-bold rounded-full transition-all text-lg">
                CONTACT SALES
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="pt-20 pb-10 border-t border-white/5">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00CCFF] to-[#6600CC] rounded flex items-center justify-center">
                <Shield className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-space uppercase">Cybereign</span>
            </div>
            <p className="text-[#b0b0d0] text-sm mb-6">
              Leading the way in digital governance and risk management for the modern global landscape.
            </p>
            <div className="flex gap-4">
              {['twitter', 'linkedin', 'github'].map(social => (
                <a key={social} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-[#00CCFF]/20 transition-colors">
                  <div className="w-5 h-5 bg-[#b0b0d0]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Solutions</h4>
            <ul className="space-y-4 text-sm text-[#b0b0d0]">
              <li><a href="#" className="hover:text-white">Governance Audit</a></li>
              <li><a href="#" className="hover:text-white">Risk Strategy</a></li>
              <li><a href="#" className="hover:text-white">Data Protection</a></li>
              <li><a href="#" className="hover:text-white">Compliance Training</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-[#b0b0d0]">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Our Vision</a></li>
              <li><a href="#" className="hover:text-white">Mission Statement</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <p className="text-[#b0b0d0] text-sm mb-4">info@cybereign.com</p>
            <p className="text-[#b0b0d0] text-sm mb-4">+234 (0) 800 CYBEREIGN</p>
            <p className="text-[#b0b0d0] text-sm uppercase font-bold tracking-widest text-xs mt-8">
              Govern. Comply. Protect.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#606080] text-xs">
            © 2026 Cybereign Consulting Limited. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-xs text-[#606080]">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <VisionMission />
      <Services />

      {/* Dynamic Visual Section */}
      <section className="py-20 overflow-hidden pointer-events-none">
        <div className="flex gap-8 animate-scroll">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-4 text-6xl md:text-8xl font-black text-white/5 font-space uppercase">
              Cybereign <Shield className="w-16 h-16" />
            </div>
          ))}
        </div>
      </section>

      <CTA />
      <Footer />

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-[#00CCFF]/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[40%] bg-[#6600CC]/10 blur-[150px] rounded-full"></div>
        <div className="absolute top-[40%] right-[15%] w-2 h-2 bg-[#00CCFF] rounded-full shadow-[0_0_15px_#00CCFF] opacity-40 animate-ping"></div>
        <div className="absolute bottom-[30%] left-[20%] w-1.5 h-1.5 bg-[#6600CC] rounded-full shadow-[0_0_12px_#6600CC] opacity-30"></div>
      </div>
    </div>
  );
};

export default App;
