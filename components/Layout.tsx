
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  FileText, 
  Settings,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Daftar Santri', path: '/santri', icon: Users },
    { name: 'Input Penilaian', path: '/penilaian', icon: ClipboardCheck },
    { name: 'Laporan Hasil', path: '/laporan', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-emerald-800 text-white transform transition-transform duration-300 ease-in-out z-50
        lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">E-Munaqasyah</h1>
            <p className="text-xs text-emerald-200">TPQ Kemenag Gowa</p>
          </div>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-emerald-600 shadow-lg' 
                    : 'hover:bg-emerald-700/50 text-emerald-100'}
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 p-4 bg-emerald-700/30 rounded-2xl border border-emerald-600/50">
          <p className="text-xs text-emerald-200 mb-2">Login sebagai:</p>
          <p className="text-sm font-semibold truncate">Tim Munaqasyah 2025</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 flex-shrink-0">
          <button 
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 lg:ml-0 ml-4">
            <h2 className="text-xl font-bold text-gray-800 lg:block hidden">
              Sistem Informasi Penilaian Santri
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">Kabupaten Gowa</p>
              <p className="text-xs text-gray-500">Sulawesi Selatan</p>
            </div>
            <img 
              src="https://picsum.photos/seed/kemenag/40/40" 
              className="w-10 h-10 rounded-full border-2 border-emerald-500" 
              alt="Profile"
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
