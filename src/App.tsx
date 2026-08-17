import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { VerifyPage } from './pages/VerifyPage';
import { CoursesPage } from './pages/CoursesPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactPage } from './pages/ContactPage';
import { CertificateDetailModal } from './components/CertificateDetailModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { PolicyModal } from './components/PolicyModal';
import { ActivePage, Certificate, Course } from './types';
import { ShieldCheck, Search, ArrowUp } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [policyModalType, setPolicyModalType] = useState<'privacy' | 'terms' | 'verification' | null>(null);
  const [contactSubject, setContactSubject] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check URL parameters on mount e.g. /verify?certificate=XXXX
  useEffect(() => {
    try {
      const search = window.location.search;
      const pathname = window.location.pathname;
      const params = new URLSearchParams(search);
      const certParam = params.get('certificate') || params.get('cert');
      const pageParam = params.get('page') as ActivePage;

      if (certParam || pathname.includes('verify')) {
        setActivePage('verify');
      } else if (pageParam && ['home', 'verify', 'courses', 'about', 'services', 'contact'].includes(pageParam)) {
        setActivePage(pageParam);
      }
    } catch (e) {
      console.warn('URL parsing error:', e);
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update browser URL query without reload
    try {
      const newUrl = page === 'home' 
        ? window.location.pathname 
        : `${window.location.pathname}?page=${page}`;
      window.history.pushState({}, '', newUrl);
    } catch {
      // ignore
    }
  };

  const handleEnquireCourse = (courseTitle: string) => {
    setContactSubject(`Enquiry: ${courseTitle}`);
    handleNavigate('contact');
  };

  const handleEnquireService = (serviceTitle: string) => {
    setContactSubject(`Service Enquiry: ${serviceTitle}`);
    handleNavigate('contact');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#172033] selection:bg-[#1456A0] selection:text-white font-sans antialiased">
      
      {/* Sticky Header Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onViewFullCertificate={(cert) => setSelectedCertificate(cert)}
            onSelectCourse={(course) => setSelectedCourse(course)}
          />
        )}

        {activePage === 'verify' && (
          <VerifyPage
            onViewFullCertificate={(cert) => setSelectedCertificate(cert)}
          />
        )}

        {activePage === 'courses' && (
          <CoursesPage
            onSelectCourse={(course) => setSelectedCourse(course)}
            onEnquire={handleEnquireCourse}
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'services' && (
          <ServicesPage
            onNavigate={handleNavigate}
            onEnquireService={handleEnquireService}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage
            initialSubject={contactSubject}
          />
        )}
      </main>

      {/* Dark Navy Corporate Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPolicy={(type) => setPolicyModalType(type)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Modals & Portals */}
      
      {/* 1. Official Digital Certificate Presentation Modal */}
      <CertificateDetailModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      {/* 2. Course Syllabus Details Modal */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnquire={handleEnquireCourse}
      />

      {/* 3. Protected Administration Portal Modal */}
      <AdminPortalModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      {/* 4. Policy & Verification Standard Modal */}
      <PolicyModal
        type={policyModalType}
        onClose={() => setPolicyModalType(null)}
      />

      {/* Floating Quick Action Buttons */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 no-print">
        {/* Floating Quick Verify Trigger (when not on verify page) */}
        {activePage !== 'verify' && (
          <button
            onClick={() => handleNavigate('verify')}
            className="px-4 py-3 bg-gradient-to-r from-[#1456A0] to-[#0B1F3A] text-white font-bold text-xs rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-blue-400/30 cursor-pointer"
            title="Instant Certificate Verification"
          >
            <ShieldCheck className="w-4 h-4 text-[#D6A84F]" />
            <span className="hidden sm:inline">Verify Certificate</span>
          </button>
        )}

        {/* Back to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3 bg-white text-slate-700 hover:text-[#1456A0] rounded-full shadow-lg border border-slate-200 transition-all hover:bg-slate-50 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
