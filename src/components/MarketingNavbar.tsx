import Link from 'next/link';

export default function MarketingNavbar() {
  return (
    <header className="bg-gray-900 text-white py-4 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold hover:text-indigo-300 transition-colors">
          HireTrack
        </Link>
        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link href="/" className="hover:text-indigo-300 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-indigo-300 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-indigo-300 transition-colors">
            Contact
          </Link>
          <Link
            href="/login"
            className="hover:text-indigo-300 transition-colors text-sm font-medium border border-gray-700 px-3 py-1.5 rounded-lg hover:border-indigo-500 transition-all"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
