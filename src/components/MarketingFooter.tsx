export default function MarketingFooter() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © 2026 Shatrad Pawarsaini. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-2 text-xs">
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          <a href="https://github.com/shara/Hire-Track" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
