import React, { useState } from 'react';
import { 
  Search, 
  Award, 
  Clock, 
  ChevronRight, 
  Filter, 
  ShieldCheck, 
  BookOpen, 
  Layers,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { ALL_COURSES } from '../data/coursesData';
import { Course } from '../types';
import { DynamicIcon } from '../components/DynamicIcon';

interface CoursesPageProps {
  onSelectCourse: (course: Course) => void;
  onEnquire: (courseTitle: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onSelectCourse, onEnquire }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'technical' | 'iso' | 'emergency'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Courses (17)' },
    { id: 'core', label: 'Core Qualifications' },
    { id: 'technical', label: 'Technical & High Risk' },
    { id: 'iso', label: 'ISO Management Systems' },
    { id: 'emergency', label: 'Emergency & First Aid' }
  ];

  const filteredCourses = ALL_COURSES.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header Banner */}
      <section className="bg-[#0B1F3A] text-white pt-12 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#D6A84F] text-xs font-bold uppercase tracking-wider border border-white/15">
            <BookOpen className="w-4 h-4" />
            Curriculum Directory
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Health & Safety Training Courses
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Industry-relevant health, safety, and environmental training programs tailored for professionals, site supervisors, and organizations.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses (e.g. NEBOSH, IOSH, Fire, PTW)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1456A0] focus:ring-2 focus:ring-blue-100 outline-none text-xs sm:text-sm text-slate-900"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#1456A0] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Course Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No courses match your search</h3>
            <p className="text-xs text-slate-500">Try adjusting your keyword filter or browse all categories.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 bg-[#1456A0] text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {course.popular && (
                  <div className="absolute top-0 right-0 bg-[#D6A84F] text-[#0B1F3A] text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                    POPULAR
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1456A0] flex items-center justify-center group-hover:bg-[#1456A0] group-hover:text-white transition-colors shrink-0">
                      <DynamicIcon name={course.iconName} className="w-6 h-6" />
                    </div>

                    <div className="pr-12">
                      <span className="text-[10px] font-bold text-[#1456A0] uppercase tracking-wider block">
                        {course.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-[#0B1F3A] group-hover:text-[#1456A0] transition-colors leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.duration}</span>
                    </div>
                    <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verifiable</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>View Course</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onEnquire(course.title)}
                      className="w-full py-2.5 bg-[#1456A0] hover:bg-[#0B1F3A] text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center"
                    >
                      <span>Enquire</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Corporate Group Booking Note */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-lg font-bold text-white">Looking for Custom On-Site Corporate Training?</h4>
            <p className="text-xs text-slate-300 max-w-xl">
              We deliver tailored on-site courses for industrial teams, construction projects, and manufacturing plants across the UK and internationally.
            </p>
          </div>

          <button
            onClick={() => onEnquire('Corporate Safety Program')}
            className="px-6 py-3 bg-[#D6A84F] hover:bg-[#c99a42] text-[#0B1F3A] font-bold text-xs rounded-xl transition shadow cursor-pointer shrink-0"
          >
            Request Corporate Proposal
          </button>
        </div>
      </section>

    </div>
  );
};
