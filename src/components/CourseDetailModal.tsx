import React from 'react';
import { X, Clock, Award, Users, CheckCircle, BookOpen, Send, ShieldCheck } from 'lucide-react';
import { Course } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onEnquire: (courseTitle: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onEnquire
}) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#0B1F3A] text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-[#D6A84F]">
              <DynamicIcon name={course.iconName} className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D6A84F] bg-[#D6A84F]/10 px-2.5 py-0.5 rounded border border-[#D6A84F]/20">
                {course.level} • {course.code}
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {course.title}
          </h2>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto text-xs sm:text-sm">
          {/* Key Quick Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#1456A0]" />
                <span>{course.duration}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Level</span>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Award className="w-3.5 h-3.5 text-[#1456A0]" />
                <span>{course.level}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Verification</span>
              <div className="font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Online Verifiable</span>
              </div>
            </div>
          </div>

          {/* Course Overview */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#1456A0]" /> Course Overview
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Curriculum Modules */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2.5">
              Key Learning Modules & Syllabus
            </h3>
            <div className="space-y-2">
              {course.keyModules.map((module, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 text-slate-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{module}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience & Assessment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase block mb-1">Target Audience</span>
              <p className="text-xs text-slate-600 leading-normal">{course.targetAudience}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-900 uppercase block mb-1">Assessment Method</span>
              <p className="text-xs text-slate-600 leading-normal">{course.assessmentType}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl transition text-xs font-semibold cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onEnquire(course.title);
              onClose();
            }}
            className="px-6 py-2.5 bg-[#1456A0] hover:bg-[#0B1F3A] text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#D6A84F]" />
            <span>Enquire About This Course</span>
          </button>
        </div>
      </div>
    </div>
  );
};
