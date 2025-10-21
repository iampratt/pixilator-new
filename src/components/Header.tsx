import Link from 'next/link';
import { UserButton } from '@/components/ui/UserButton';

export function Header() {
  return (
    <header className="border-b border-white/20 bg-black/20 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold text-white">Pixilator</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Generate
            </Link>
            <Link href="/history" className="text-gray-300 hover:text-white transition-colors">
              History
            </Link>
            <Link href="/styles" className="text-gray-300 hover:text-white transition-colors">
              Styles
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
