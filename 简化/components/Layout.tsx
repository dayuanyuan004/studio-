
import React from 'react';
import { Sparkles, Clapperboard, Zap, Gamepad2, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  hasDevices?: boolean; // New prop to check device status
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, hasDevices = false }) => {
  const navItems = [
    { id: 'profile', label: '首页', icon: User },
    { id: 'dashboard', label: '表演', icon: Clapperboard },
    { id: 'skills', label: '技能', icon: Zap },
    { id: 'creative', label: '灵感', icon: Sparkles },
    { id: 'remote', label: '遥控', icon: Gamepad2 },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#0C0C0C] overflow-hidden font-sans text-white relative">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="h-20 bg-[#0C0C0C]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-1 shrink-0 pb-safe z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] absolute bottom-0 left-0 right-0">
        {navItems.map((item) => {
          const isActive = activePage === item.id || (item.id === 'creative' && activePage === 'creative-preview');
          const isDisabled = !hasDevices && item.id !== 'profile';
          
          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onNavigate(item.id)}
              disabled={isDisabled}
              className={`flex flex-col items-center justify-center w-16 space-y-1.5 transition-all ${
                isActive ? 'text-cyan-500 scale-105' : (isDisabled ? 'text-slate-800 opacity-50 cursor-not-allowed grayscale' : 'text-slate-600 active:scale-90')
              }`}
            >
              <div className={`relative ${isActive ? '-translate-y-1' : ''} transition-transform duration-300`}>
                  <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} fill={isActive && item.id !== 'dashboard' ? "currentColor" : "none"} />
                  {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500 shadow-[0_0_5px_#06b6d4]"></div>}
              </div>
              <span className={`text-[9px] font-black tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
