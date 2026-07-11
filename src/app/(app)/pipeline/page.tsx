import { getPipelineData } from '@/lib/queries';
import { Badge } from '@/components/ui/Badge';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pipeline' };
export const dynamic = 'force-dynamic';

const STAGE_LABELS: Record<string, string> = {
  APPLIED: 'Applied',
  SCREEN: 'Screen',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  HIRED: 'Hired',
  REJECTED: 'Rejected',
};

const STAGE_COLORS: Record<string, string> = {
  APPLIED:   'hsl(215,20%,55%)',
  SCREEN:    'hsl(280,70%,65%)',
  INTERVIEW: 'hsl(224,76%,65%)',
  OFFER:     'hsl(38,92%,55%)',
  HIRED:     'hsl(142,71%,50%)',
  REJECTED:  'hsl(0,72%,60%)',
};

import PipelineBoard from '@/components/pipeline/PipelineBoard';

export default async function PipelinePage() {
  const pipeline = await getPipelineData();

  return (
    <div className="animate-page flex h-full flex-col px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(210,40%,96%)' }}>
          Pipeline
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
          Kanban view of all applications across hiring stages.
        </p>
      </div>

      <PipelineBoard initialPipeline={pipeline} />
    </div>
  );
}
