'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AppNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-[#0E1323] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`inline-block text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                pathname === '/' ? 'bg-gray-800 text-white' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/team-builder"
              className={`inline-block text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                pathname === '/team-builder' ? 'bg-gray-800 text-white' : ''
              }`}
            >
              Team Builder
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavigation; 