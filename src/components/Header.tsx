import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 animate-slide-in">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Pixilator</span>
          </Link>

          <nav className="flex items-center space-x-8 animate-slide-in">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Generate
            </Link>
            <Link href="/history" className="text-gray-600 hover:text-gray-900 transition-colors">
              History
            </Link>
            <Link href="/styles" className="text-gray-600 hover:text-gray-900 transition-colors">
              Styles
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
