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
        <nav className="flex space-x-6">
          <Link href="/" className="hover:text-indigo-300 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-indigo-300 transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-indigo-300 transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
