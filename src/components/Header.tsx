import { Search, Menu, RefreshCw, Layers } from 'lucide-react';

interface HeaderProps {
  onSearchChange: (val: string) => void;
  searchQuery: string;
  onOpenSidebar: () => void;
  onResetData: () => void;
  selectedTag: string;
}

export default function Header({ 
  onSearchChange, 
  searchQuery, 
  onOpenSidebar, 
  onResetData, 
  selectedTag 
}: HeaderProps) {
  return (
    <header className="bg-white/95 backdrop-blur-xs border-b border-[#E8E4DC] sticky top-0 z-40 w-full shrink-0 shadow-3xs">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-7xl mx-auto h-14">
        {/* Left Toggle menu for mobile */}
        <button 
          onClick={onOpenSidebar}
          aria-label="Menu" 
          className="md:hidden text-[#176970] hover:bg-[#FAF8F5] transition-colors rounded-full p-2"
        >
          <Menu size={22} className="stroke-[1.75]" />
        </button>

        {/* Brand logo heading paired correctly */}
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#D4A853]" />
          <h1 className="font-display text-[22px] md:text-[24px] text-[#176970] font-bold tracking-tight select-none">
            Repertório
          </h1>
          {selectedTag !== 'Todas' && (
            <span className="hidden sm:inline-flex bg-[#FAF8F5] border border-[#E8E4DC] text-gray-500 font-sans text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm">
              {selectedTag}
            </span>
          )}
        </div>

        {/* Simple Reset library / Search controller */}
        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={onResetData}
            title="Recarregar biblioteca inicial"
            className="text-gray-400 hover:text-[#176970] p-2 hover:bg-[#FAF8F5] rounded-full transition-all"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </div>
      
      {/* Editorial Subheader Banner */}
      <div className="w-full text-center border-b border-[#E8E4DC]/30 py-2.5 bg-[#FAF8F5]">
        <span className="text-[10.5px] font-sans font-bold text-gray-400 tracking-widest uppercase block">
          seu repertório criativo
        </span>
      </div>
    </header>
  );
}
