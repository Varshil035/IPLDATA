import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-[#0E1323] border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' ? 'bg-gray-800 text-white' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/team-builder"
              className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
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

export default Navigation; 