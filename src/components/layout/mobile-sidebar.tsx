'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './sidebar';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F1916]/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#FAF7F2] shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/80 border border-[#EAE5DE] text-[#635A52] hover:text-[#1F1916] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar className="w-full h-full border-r-0" onNavigate={onClose} />
      </div>
    </div>
  );
}
