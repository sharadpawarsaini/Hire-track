import Link from 'next/link';

export default function AboutPage() {
  return (
    <section className='max-w-3xl mx-auto py-12 text-center'>
      <h1 className='text-4xl font-bold text-white mb-6'>About HireTrack</h1>
      <p className='text-lg text-gray-300 mb-8'>
        HireTrack was built by <strong>Shatrad Pawarsaini</strong> to bring a premium, dark‑theme applicant tracking experience to every hiring team. Our mission is to make recruitment transparent, data‑driven, and delightfully visual.
      </p>
      <p className='text-gray-400 mb-8'>
        Powered by Next.js 16, Prisma 7, and Supabase PostgreSQL, HireTrack combines modern web performance with a robust data layer, giving you instant insights into every stage of the hiring funnel.
      </p>
      <Link
        href="/contact"
        className='inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-8 rounded-lg transition-colors'
      >
        Get In Touch
      </Link>
    </section>
  );
}
