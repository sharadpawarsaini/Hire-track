import Link from 'next/link';

export default function ContactPage() {
  return (
    <section className='max-w-2xl mx-auto py-12 text-center'>
      <h1 className='text-4xl font-bold text-white mb-6'>Contact Us</h1>
      <p className='text-lg text-gray-300 mb-8'>
        Have a question or want a personalized demo? Reach out and we’ll get back to you within 24 hours.
      </p>
      <form className='space-y-4 text-left'>
        <div>
          <label className='block text-gray-200 mb-1' htmlFor='name'>Name</label>
          <input id='name' type='text' required className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500' />
        </div>
        <div>
          <label className='block text-gray-200 mb-1' htmlFor='email'>Email</label>
          <input id='email' type='email' required className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500' />
        </div>
        <div>
          <label className='block text-gray-200 mb-1' htmlFor='message'>Message</label>
          <textarea id='message' rows={4} required className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500'></textarea>
        </div>
        <button type='submit' className='w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded transition-colors'>
          Send Message
        </button>
      </form>
      <p className='mt-8 text-sm text-gray-400'>
        Or email us directly at <a href='mailto:hello@hiretrack.io' className='underline hover:text-white'>hello@hiretrack.io</a>
      </p>
    </section>
  );
}
