import { 
  Home, 
  Compass, 
  Plus, 
  User 
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAddModal: () => void;
  onClearProjectFilter: () => void;
}

export default function BottomNav({ 
  currentTab, 
  onTabChange, 
  onOpenAddModal,
  onClearProjectFilter
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[56px] bg-white border-t border-[#E8E4DC] flex items-center justify-around px-4 z-40 pb-safe md:hidden shadow-[0_-2px_12px_rgba(0,0,0,0.03)] select-none">
      {/* 1. HOME/INÍCIO */}
      <button 
        onClick={() => {
          onTabChange('home');
          onClearProjectFilter();
        }}
        className={`flex flex-col items-center justify-center w-14 h-12 transition-colors ${
          currentTab === 'home' 
            ? 'text-[#D4A853]' 
            : 'text-[#9E9A94] hover:text-[#D4A853]'
        }`}
      >
        <Home size={22} className={currentTab === 'home' ? 'stroke-[2.25]' : 'stroke-[1.5]'} />
        <span className="text-[9.5px] font-sans font-bold uppercase mt-1 tracking-wider">Início</span>
      </button>

      {/* 2. EXPLORE/EXPLORAR */}
      <button 
        onClick={() => {
          onTabChange('explore');
          onClearProjectFilter();
        }}
        className={`flex flex-col items-center justify-center w-14 h-12 transition-colors ${
          currentTab === 'explore' 
            ? 'text-[#D4A853]' 
            : 'text-[#9E9A94] hover:text-[#D4A853]'
        }`}
      >
        <Compass size={22} className={currentTab === 'explore' ? 'stroke-[2.25]' : 'stroke-[1.5]'} />
        <span className="text-[9.5px] font-sans font-bold uppercase mt-1 tracking-wider">Explorar</span>
      </button>

      {/* 3. FLOAT CENTRAL FAB: ADICIONAR */}
      <button 
        onClick={onOpenAddModal}
        aria-label="Adicionar Nova Referência" 
        className="flex flex-col items-center justify-center -mt-8 relative group"
      >
        <div className="w-12 h-12 rounded-full bg-[#D4A853] text-white flex items-center justify-center shadow-lg border-4 border-white transition-transform group-active:scale-95 duration-100">
          <Plus size={24} className="stroke-[2.5]" />
        </div>
        <span className="text-[9px] font-sans font-bold uppercase mt-1 text-[#9E9A94] tracking-wider">Adicionar</span>
      </button>

      {/* 4. USER PROFILE/PERFIL */}
      <button 
        onClick={() => {
          onTabChange('profile');
          onClearProjectFilter();
        }}
        className={`flex flex-col items-center justify-center w-14 h-12 transition-colors ${
          currentTab === 'profile' 
            ? 'text-[#D4A853]' 
            : 'text-[#9E9A94] hover:text-[#D4A853]'
        }`}
      >
        <User size={22} className={currentTab === 'profile' ? 'stroke-[2.25]' : 'stroke-[1.5]'} />
        <span className="text-[9.5px] font-sans font-bold uppercase mt-1 tracking-wider">Perfil</span>
      </button>
    </nav>
  );
}
