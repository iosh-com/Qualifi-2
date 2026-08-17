import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Lock, 
  Search, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ActivePage } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'verify', label: 'Certificate Verification' },
    { id: 'courses', label: 'Courses' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Utility Announcement Bar */}
      <div className="bg-[#0B1F3A] text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-[#D6A84F]" />
              <a href="mailto:hiqual.com.uk@gmail.com" className="hover:text-white transition">
                hiqual.com.uk@gmail.com
              </a>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>UK Registry: +44 (0) 20 7946 0912</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="hidden sm:inline-block text-blue-200 font-medium">
              Official UK Health & Safety Training Verification Portal
            </span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer"
              title="Admin Registry Portal"
            >
              <Lock className="w-3 h-3 text-[#D6A84F]" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-none cursor-pointer"
          >
            <Logo variant="dark" size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              const isVerifyTab = item.id === 'verify';

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer relative ${
                    isActive
                      ? 'text-[#1456A0] bg-blue-50/80 font-bold'
                      : 'text-slate-700 hover:text-[#1456A0] hover:bg-slate-50'
                  } ${isVerifyTab ? 'border border-blue-200/60 bg-blue-50/30' : ''}`}
                >
                  {item.label}
                  {isVerifyTab && (
                    <span className="inline-block ml-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Prominent VERIFY CERTIFICATE CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="header-verify-certificate-button"
              onClick={() => handleNavClick('verify')}
              className="relative group overflow-hidden px-5 py-3 rounded-xl bg-gradient-to-r from-[#1456A0] via-[#1976D2] to-[#0B1F3A] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center gap-2 cursor-pointer border border-blue-400/30"
            >
              <ShieldCheck className="w-4 h-4 text-[#D6A84F] group-hover:rotate-12 transition-transform" />
              <span>VERIFY CERTIFICATE</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 pointer-events-none" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('verify')}
              className="sm:hidden px-3 py-1.5 bg-[#1456A0] text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>Verify</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-[#1456A0] hover:bg-slate-100 transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition ${
                    isActive
                      ? 'bg-blue-50 text-[#1456A0] font-bold border-l-4 border-[#1456A0]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleNavClick('verify')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1456A0] to-[#0B1F3A] text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-[#D6A84F]" />
              <span>VERIFY CERTIFICATE NOW</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Email: hiqual.com.uk@gmail.com</span>
            <button onClick={onOpenAdmin} className="text-[#1456A0] font-semibold underline">
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
