'use client';

import { useState } from 'react';
import AddCandidateModal from './AddCandidateModal';

interface CandidatesHeaderProps {
  totalCandidates: number;
  jobs: { id: string; title: string }[];
}

export default function CandidatesHeader({ totalCandidates, jobs }: CandidatesHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Candidates
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          {totalCandidates} candidate{totalCandidates !== 1 ? 's' : ''} in your talent pool
        </p>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Candidate
      </button>

      <AddCandidateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} jobs={jobs} />
    </div>
  );
}
