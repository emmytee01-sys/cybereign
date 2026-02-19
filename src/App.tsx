import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Terminal,
  ChevronRight,
  Globe,
  Cpu,
  Activity,
  Zap,
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Award,
  Linkedin,
  Twitter,
  Github,
  Mail,
  Phone,
  Instagram
} from 'lucide-react';
import './App.css';


type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
];

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container shell">
        <a className="logo" href="#hero">
          <img src="/images/logo.png" alt="Cybereign" />
        </a>

        <button
          className="mobileMenuButton"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'hamburgerOpen' : ''}`}>
            <span className="hamburgerLine" />
            <span className="hamburgerLine" />
            <span className="hamburgerLine" />
          </span>
        </button>

        <nav className={`nav ${mobileMenuOpen ? 'navOpen' : ''}`}>
          {navItems.map((item) => (
            <div key={item.label} className="navItemWrapper">
              <a
                href={item.href}
                className="navItem"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            </div>
          ))}
        </nav>

        <div className={`actions ${mobileMenuOpen ? 'actionsOpen' : ''}`}>
          <button
            className="ctaButton"
            onClick={() => {
              const el = document.getElementById('service-form');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              setMobileMenuOpen(false);
            }}
          >
            Request Service
          </button>
        </div>
      </div>
    </header>
  );
};


const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-32 md:pt-40 overflow-hidden hero-section"
      style={{ scrollMarginTop: '96px' }}
    >
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

        {/* Cyber orbits / animated lines */}
        <div className="hero-orbit hero-orbit--one"></div>
        <div className="hero-orbit hero-orbit--two"></div>
        <div className="hero-orbit hero-orbit--three"></div>
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hero-image-wrapper"
        >
          <div className="relative z-10 rounded-3xl overflow-hidden glass shadow-2xl border border-white/10 hero-image-card">
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
    <div id="about" className="section relative">
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
    </div>
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
    <div id="solutions" className="section bg-[#08081a]/50">
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
    </div>
  );
};

const CTA = () => {
  return (
    <div className="section relative overflow-hidden bg-[#050510] py-32">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,204,255,0.05)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="container relative z-10">
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#0c0c20] to-[#050510] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] group"
        >
          {/* Animated Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none"></div>

          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00CCFF]/50 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00CCFF]/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#00CCFF]/20 transition-colors duration-700"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#6600CC]/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#6600CC]/20 transition-colors duration-700"></div>

          <div className="relative z-10 px-6 py-20 md:p-32 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#00CCFF] font-mono text-xs md:text-sm tracking-widest mb-12 backdrop-blur-md uppercase"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00CCFF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00CCFF]"></span>
              </span>
              Global Advisory Excellence
            </motion.div>

            <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-10 leading-[0.9] tracking-tighter text-white">
              Compliance is not a department. <br className="hidden md:block" /> It is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00CCFF] via-[#fff] to-[#00CCFF] animate-gradient bg-[length:200%_auto]">Standard.</span>
            </h2>

            <p className="text-lg md:text-2xl text-[#b0b0d0] mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              Engage Cybereign for a <span className="text-white font-medium border-b border-[#00CCFF]/50 hover:border-[#00CCFF] transition-colors pb-0.5 cursor-pointer">private governance consultation</span> and start your journey towards resilient digital growth.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center mb-20">
              <button className="w-full sm:w-auto px-12 py-6 bg-[#00CCFF] text-[#050510] font-black tracking-widest uppercase text-lg hover:bg-[#00e6ff] hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(0,204,255,0.3)] hover:shadow-[0_0_60px_rgba(0,204,255,0.5)]">
                Book Consultation Now
              </button>

              <button className="w-full sm:w-auto px-12 py-6 bg-transparent border border-white/10 text-white font-black tracking-widest uppercase text-lg hover:bg-white/5 hover:border-white/30 transition-all flex items-center justify-center gap-3 group">
                Contact Sales <ArrowRight className="w-5 h-5 text-[#00CCFF] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              <div className="flex items-center gap-3 text-[#8888aa] group-hover:text-[#b0b0d0] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#00CCFF]" />
                <span className="font-mono text-sm tracking-wider uppercase">ISO 27001 Certified</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-white/10"></div>
              <div className="flex items-center gap-3 text-[#8888aa] group-hover:text-[#b0b0d0] transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#6600CC]" />
                <span className="font-mono text-sm tracking-wider uppercase">GDPR Compliant Advisory</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

const BrandStrip = () => (
  <div className="py-20 overflow-hidden pointer-events-none">
    <div className="flex gap-8 animate-scroll">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 flex items-center gap-8 text-6xl md:text-8xl font-black text-white/5 font-space uppercase"
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-16 md:h-24 opacity-10 grayscale"
          />
          <Shield className="w-16 h-16" />
        </div>
      ))}
    </div>
  </div>
);

const FeaturesSection = () => (
  <section
    id="features"
    className="relative bg-[#050510]"
    style={{ scrollMarginTop: '96px' }}
  >
    <VisionMission />
    <Services />
    <BrandStrip />
    <CTA />
  </section>
);


const ServiceFormSection = () => (
  <section
    id="service-form"
    className="service-section"
    style={{ scrollMarginTop: '96px' }}
  >
    <div className="container">
      <div className="service-inner">
        <div className="service-copy">
          <h2>Request a Governance &amp; Security Engagement</h2>
          <p>
            Share a bit about your environment, and our advisory team will reach out with a
            tailored proposal for governance, risk, and compliance support.
          </p>
        </div>
        <form className="service-form">
          <div className="service-grid">
            <div className="service-field">
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" name="fullName" type="text" placeholder="Jane Doe" />
            </div>
            <div className="service-field">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" placeholder="Acme Group" />
            </div>
            <div className="service-field">
              <label htmlFor="email">Work email</label>
              <input id="email" name="email" type="email" placeholder="you@company.com" />
            </div>
            <div className="service-field">
              <label htmlFor="role">Role / Title</label>
              <input id="role" name="role" type="text" placeholder="CISO, Head of Risk, CIO..." />
            </div>
            <div className="service-field service-field-full">
              <label htmlFor="focus">Primary area of focus</label>
              <select id="focus" name="focus">
                <option value="">Select an area</option>
                <option value="governance">Governance &amp; Operating Model</option>
                <option value="risk">Enterprise Risk Assessment</option>
                <option value="compliance">Regulatory &amp; Compliance Readiness</option>
                <option value="data">Data Protection &amp; Privacy</option>
                <option value="other">Other / Not sure yet</option>
              </select>
            </div>
            <div className="service-field service-field-full">
              <label htmlFor="message">Briefly describe your current challenge</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="For example: we are preparing for ISO 27001 certification and need to mature our governance framework..."
              />
            </div>
          </div>
          <div className="service-consent">
            <label>
              <input type="checkbox" name="consent" /> I agree to be contacted by Cybereign
              regarding this inquiry.
            </label>
          </div>
          <button type="submit" className="service-submit">
            Submit request
          </button>
        </form>
      </div>
    </div>
  </section>
);


const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="footerWrapper">
        <div className="footerLogoSection">
          <a href="#hero">
            <img
              src="/images/logo.png"
              alt="Cybereign Logo"
              className="footerLogo"
            />
          </a>
          <p className="footerDescription">
            Cybereign is a strategic cybersecurity and digital governance
            advisory for enterprises operating in complex, regulated
            environments.
          </p>
          <div className="footerSocialLinks">
            {[
              { icon: Twitter, href: '#' },
              { icon: Linkedin, href: '#' },
              { icon: Github, href: '#' },
              { icon: Instagram, href: '#' }
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="footerSocialIcon"
                aria-label={social.icon.name}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="footerContent">
          <div className="footerColumn footerColumnProducts">
            <h3 className="footerColumnTitle">Solutions</h3>
            <ul className="footerLinkList">
              <li>
                <a href="#solutions" className="footerLink">
                  Governance &amp; Risk
                </a>
              </li>
              <li>
                <a href="#solutions" className="footerLink">
                  Data Protection
                </a>
              </li>
              <li>
                <a href="#solutions" className="footerLink">
                  Compliance Readiness
                </a>
              </li>
              <li>
                <a href="#solutions" className="footerLink">
                  Security Frameworks
                </a>
              </li>
            </ul>
          </div>

          <div className="footerColumn footerColumnCompany">
            <h3 className="footerColumnTitle">Company</h3>
            <ul className="footerLinkList">
              <li>
                <a href="#about" className="footerLink">
                  About Cybereign
                </a>
              </li>
              <li>
                <a href="#about" className="footerLink">
                  Vision &amp; Mission
                </a>
              </li>
              <li>
                <a href="#contact" className="footerLink">
                  Contact
                </a>
              </li>
              <li>
                <a href="#hero" className="footerLink">
                  Book Consultation
                </a>
              </li>
            </ul>
          </div>

          <div className="footerColumn footerColumnLegal">
            <h3 className="footerColumnTitle">Legal</h3>
            <ul className="footerLinkList">
              <li>
                <a href="#" className="footerLink">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footerLink">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="footerLink">
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          <div className="footerColumn footerColumnContact">
            <h3 className="footerColumnTitle">Contact</h3>
            <ul className="footerLinkList">
              <li>
                <a href="tel:+2348002923734" className="footerLink">
                  +234 (0) 800 CYBEREIGN
                </a>
              </li>
              <li>
                <a href="mailto:info@cybereign.com" className="footerLink">
                  info@cybereign.com
                </a>
              </li>
              <li>
                <a href="#hero" className="footerLink">
                  Schedule a consultation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <p>© 2026 Cybereign Consulting Limited. All rights reserved.</p>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050510] text-white">
      <Header />
      <main className="main">
        <Hero />
        <FeaturesSection />
        <ServiceFormSection />
      </main>

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
