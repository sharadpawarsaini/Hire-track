'use client';

import { useActionState, useEffect } from 'react';
import { createJobAction } from '@/lib/actions';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewJobModal({ isOpen, onClose }: NewJobModalProps) {
  const [state, formAction, isPending] = useActionState(createJobAction, null);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-gray-950 border border-gray-850 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Create New Job Requisition</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {state?.error && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <form action={formAction} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1" htmlFor="title">Job Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-3.5 py-2 bg-gray-900 border border-gray-850 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1" htmlFor="department">Department *</label>
              <input
                id="department"
                name="department"
                type="text"
                required
                placeholder="e.g. Engineering"
                className="w-full px-3.5 py-2 bg-gray-900 border border-gray-850 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1" htmlFor="location">Location *</label>
              <input
                id="location"
                name="location"
                type="text"
                required
                placeholder="e.g. Remote (India)"
                className="w-full px-3.5 py-2 bg-gray-900 border border-gray-850 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1" htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                required
                className="w-full px-3.5 py-2 bg-gray-900 border border-gray-850 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1" htmlFor="cutoffRequirements">Key Requirements</label>
            <textarea
              id="cutoffRequirements"
              name="cutoffRequirements"
              rows={3}
              placeholder="List core requirements or criteria..."
              className="w-full px-3.5 py-2 bg-gray-900 border border-gray-855 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-white transition-colors cursor-pointer bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
            >
              {isPending ? 'Creating...' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
