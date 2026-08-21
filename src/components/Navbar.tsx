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
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT US' },
    { id: 'services', label: 'SERVICES' },
    { id: 'courses', label: 'TRAINING' },
    { id: 'verify', label: 'VERIFY CERTIFICATE' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1F3A] border-b border-slate-800 shadow-md">
      {/* Top Utility Announcement Bar */}
      <div className="bg-[#071527] text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-[#F5B301]" />
              <a href="mailto:qualifiuk@gmail.com" className="hover:text-white transition">
                qualifiuk@gmail.com
              </a>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-[#F5B301]" />
              <span>UK Registry: +44 (0) 20 7946 0912</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-300 font-medium">
              Official UK Health & Safety Training Verification Portal
            </span>
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
            <Logo variant="light" size="md" />
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
                  className={`px-3 py-2 rounded-lg text-xs font-bold tracking-wider transition-all cursor-pointer relative ${
                    isActive
                      ? 'text-[#F5B301] border-b-2 border-[#F5B301] rounded-b-none'
                      : 'text-slate-300 hover:text-[#F5B301]'
                  } ${isVerifyTab ? 'text-blue-300' : ''}`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Prominent GET IN TOUCH / VERIFY Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="header-get-in-touch-button"
              onClick={() => handleNavClick('contact')}
              className="px-5 py-2.5 rounded-lg border-2 border-[#F5B301] text-[#F5B301] hover:bg-[#F5B301] hover:text-[#0B1F3A] font-bold text-xs tracking-wider transition-all uppercase cursor-pointer"
            >
              GET IN TOUCH
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('verify')}
              className="sm:hidden px-3 py-1.5 bg-[#F5B301] text-[#0B1F3A] text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1F3A] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition ${
                    isActive
                      ? 'bg-slate-800 text-[#F5B301] font-bold border-l-4 border-[#F5B301]'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleNavClick('verify')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1456A0] to-[#0B1F3A] text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 border border-blue-400/30"
            >
              <ShieldCheck className="w-5 h-5 text-[#F5B301]" />
              <span>VERIFY CERTIFICATE NOW</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Email: qualifiuk@gmail.com</span>
            <span>UK Training Registry</span>
          </div>
        </div>
      )}
    </header>
  );
};
