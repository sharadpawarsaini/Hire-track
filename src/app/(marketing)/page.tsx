import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <section className='text-center'>
      {/* Hero */}
      <div className='py-24 bg-gradient-to-b from-gray-800 to-gray-900'>
        <h1 className='text-5xl md:text-6xl font-extrabold text-white mb-6'>
          HireTrack – Premium ATS for Modern Teams
        </h1>
        <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
          Streamline recruitment, visualise pipelines, and make data‑driven hiring decisions—all in a sleek, dark‑theme experience.
        </p>
        <Link
          href="/about"
          className='inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-8 rounded-lg transition-colors'
        >
          Learn More
        </Link>
      </div>

      {/* Features grid */}
      <div className='container mx-auto py-16'>
        <h2 className='text-3xl font-bold text-white mb-12'>Key Features</h2>
        <div className='grid md:grid-cols-3 gap-8'>
          <Feature title='Kanban Pipeline' description='Drag‑and‑drop candidates across stages in real‑time.' />
          <Feature title='Scorecards' description='Standardised interview evaluations with rating & comments.' />
          <Feature title='Audit Trail' description='Immutable activity log for compliance and transparency.' />
        </div>
      </div>

      {/* CTA */}
      <div className='py-20 bg-gray-800'>
        <h2 className='text-4xl font-bold text-white mb-4'>Ready to supercharge your hiring?</h2>
        <p className='text-gray-300 mb-6'>Start a free demo or contact us for an enterprise quote.</p>
        <div className='flex justify-center space-x-4'>
          <Link
            href="/contact"
            className='bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg transition-colors'
          >
            Contact Sales
          </Link>
          <Link
            href="https://github.com/shara/Hire-Track"
            target="_blank"
            rel="noopener noreferrer"
            className='bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition-colors'
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
      <h3 className='text-2xl font-semibold text-white mb-3'>{title}</h3>
      <p className='text-gray-300'>{description}</p>
    </div>
  );
}
