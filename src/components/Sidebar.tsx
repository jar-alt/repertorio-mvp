import { 
  Grid2X2, 
  FolderLock, 
  Settings, 
  Library,
  BookOpenCheck,
  Compass,
  User,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Project } from '../types';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  projects: Project[];
  activeProjectFilter: string | null;
  onProjectFilterChange: (projName: string | null) => void;
  onOpenAddModal: () => void;
}

export default function Sidebar({ 
  currentTab, 
  onTabChange, 
  projects,
  activeProjectFilter,
  onProjectFilterChange,
  onOpenAddModal
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col p-6 gap-6 bg-white border-r border-[#E8E4DC] h-screen w-72 sticky top-0 shrink-0 select-none">
      <div className="flex flex-col gap-1.5 border-b border-[#E8E4DC]/55 pb-4">
        <span className="font-sans font-bold text-[10.5px] tracking-widest text-[#D4A853] uppercase">
          Studio Curatorial
        </span>
        <div className="font-display font-bold text-[22px] text-gray-900 leading-snug">
          Biblioteca
        </div>
      </div>
      
      {/* Primary Navigation links */}
      <nav className="flex flex-col gap-1">
        <button 
          onClick={() => {
            onTabChange('home');
            onProjectFilterChange(null);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-200 ${
            currentTab === 'home' && !activeProjectFilter
              ? 'bg-[#176970]/10 text-[#176970]' 
              : 'text-gray-500 hover:text-[#176970] hover:bg-[#FAF8F5]'
          }`}
        >
          <Grid2X2 size={16} />
          <span>Todas as Ideias</span>
        </button>

        <button 
          onClick={() => {
            onTabChange('explore');
            onProjectFilterChange(null);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-200 ${
            currentTab === 'explore' 
              ? 'bg-[#176970]/10 text-[#176970]' 
              : 'text-gray-500 hover:text-[#176970] hover:bg-[#FAF8F5]'
          }`}
        >
          <Compass size={16} />
          <span>Explorar tags</span>
        </button>

        <button 
          onClick={() => {
            onTabChange('profile');
            onProjectFilterChange(null);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-200 ${
            currentTab === 'profile' 
              ? 'bg-[#176970]/10 text-[#176970]' 
              : 'text-gray-500 hover:text-[#176970] hover:bg-[#FAF8F5]'
          }`}
        >
          <User size={16} />
          <span>Estatísticas / Perfil</span>
        </button>
      </nav>

      {/* Workspace Active Projects filters */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="font-sans font-bold text-[10px] uppercase text-gray-400 tracking-widest px-4 mb-1">
          Canais Ativos
        </div>
        <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1 text-xs">
          {projects.map((proj) => {
            const isSelected = activeProjectFilter === proj.name;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  onTabChange('home');
                  onProjectFilterChange(isSelected ? null : proj.name);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-left font-sans transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-[#D4A853]/10 text-[#B8892A] font-bold border border-[#D4A853]/15' 
                    : 'text-gray-500 hover:text-gray-900 border border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FolderOpen size={14} className={isSelected ? 'text-[#D4A853]' : 'text-gray-400'} />
                  <span className="truncate">{proj.name}</span>
                </div>
                <span className="text-[10px] bg-[#FAF8F5] text-gray-400 px-1.5 py-0.5 rounded-xs border border-[#E8E4DC]/20">
                  {proj.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Studio CTA button */}
      <button
        onClick={onOpenAddModal}
        className="mt-4 px-4 py-3 w-full bg-[#D4A853] text-white hover:opacity-95 rounded-lg font-sans font-bold text-xs tracking-wider uppercase shadow-xs transition-opacity shrink-0"
      >
        Novo Documento
      </button>

      {/* Footer copyright marker link */}
      <div className="mt-auto border-t border-[#E8E4DC]/30 pt-4 text-[10.5px] text-gray-400 font-sans">
        <p className="font-semibold text-gray-500">Repertório © 2026</p>
        <p className="mt-0.5 leading-snug">Curadoria consciente baseada em estética experimental brasileira-japonesa.</p>
      </div>
    </aside>
  );
}
