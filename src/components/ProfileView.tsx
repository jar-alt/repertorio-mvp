import React, { useMemo } from 'react';
import { 
  User, 
  Database, 
  Download, 
  Sparkles, 
  FolderSync, 
  Trash2,
  Calendar,
  Layers,
  CheckCircle,
  Lightbulb,
  FileText,
  Mail
} from 'lucide-react';
import { Card, Project } from '../types';

interface ProfileViewProps {
  cards: Card[];
  projects: Project[];
  userEmail?: string;
  onResetDatabase: () => void;
  onImportBackup: (data: string) => void;
  onClearAll: () => void;
}

export default function ProfileView({ 
  cards, 
  projects, 
  userEmail = 'jar@cesar.school', 
  onResetDatabase, 
  onImportBackup,
  onClearAll 
}: ProfileViewProps) {
  
  // Calculate category aggregates
  const stats = useMemo(() => {
    const counts: Record<string, number> = {
      thought: 0,
      quote: 0,
      link: 0,
      image: 0,
      insight: 0,
      reference: 0,
      sketch: 0,
      concept: 0,
      observation: 0
    };
    
    cards.forEach(c => {
      if (counts[c.type] !== undefined) {
        counts[c.type]++;
      } else {
        counts[c.type] = 1;
      }
    });

    return counts;
  }, [cards]);

  // Total tags list
  const totalTags = useMemo(() => {
    const tagsSet = new Set<string>();
    cards.forEach(c => c.tags.forEach(t => tagsSet.add(t.toLowerCase())));
    return tagsSet.size;
  }, [cards]);

  // Export JSON backups
  const handleExport = () => {
    const dataStr = JSON.stringify({ cards, projects }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `repertorio-backup-2026.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import file handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onImportBackup(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto px-4 py-8 pb-24">
      {/* Studio Member Profile Header */}
      <div className="p-6 bg-white border border-[#E8E4DC] rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.05)] mb-8 flex flex-col sm:flex-row items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#176970] text-[#e9fdff] flex items-center justify-center font-display text-2xl font-bold border-2 border-[#D4A853]">
          {userEmail ? userEmail[0].toUpperCase() : 'U'}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-1.5">
            <span className="font-sans font-bold text-[10px] tracking-widest text-[#B8892A] uppercase bg-[#FDF3DC] px-2 py-0.5 rounded-sm">Membro Criativo</span>
          </div>
          <h2 className="font-display font-bold text-xl text-gray-950 flex items-center justify-center sm:justify-start gap-1">
            Repertório Curatorial
          </h2>
          <p className="text-xs text-gray-500 font-sans flex items-center justify-center sm:justify-start gap-1">
            <Mail size={12} className="text-gray-400" />
            <span>{userEmail}</span>
          </p>
        </div>
      </div>

      {/* Numeric Highlights KPI Grid */}
      <h3 className="text-xs font-sans font-bold text-gray-400 uppercase tracking-widest mb-3.5 px-1">Seu Progresso de Curadoria</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
        <div className="p-4 bg-white border border-[#E8E4DC] rounded-[10px] shadow-3xs flex flex-col justify-center text-center">
          <span className="text-[28px] font-display font-bold text-[#176970]">{cards.length}</span>
          <span className="text-[10.5px] font-sans font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Ideias Salvas</span>
        </div>
        <div className="p-4 bg-white border border-[#E8E4DC] rounded-[10px] shadow-3xs flex flex-col justify-center text-center">
          <span className="text-[28px] font-display font-bold text-[#7B6991]">{projects.length}</span>
          <span className="text-[10.5px] font-sans font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Canais Ativos</span>
        </div>
        <div className="p-4 bg-white border border-[#E8E4DC] rounded-[10px] shadow-3xs flex flex-col justify-center text-center">
          <span className="text-[28px] font-display font-bold text-[#B8892A]">{totalTags}</span>
          <span className="text-[10.5px] font-sans font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Tags Únicas</span>
        </div>
        <div className="p-4 bg-white border border-[#E8E4DC] rounded-[10px] shadow-3xs flex flex-col justify-center text-center">
          <span className="text-[20px] font-display font-bold text-[#E58F65] leading-8">100%</span>
          <span className="text-[10.5px] font-sans font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Preservado Offline</span>
        </div>
      </div>

      {/* Category Chart Bars */}
      <div className="p-6 bg-white border border-[#E8E4DC] rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.05)] mb-8">
        <h3 className="font-display font-bold text-md text-gray-900 mb-5 pb-2 border-b border-gray-100 flex items-center justify-between">
          <span>Distribuição por Tipo</span>
          <span className="text-[11px] font-sans text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-sm">análise composicional</span>
        </h3>
        
        <div className="space-y-4 font-sans text-xs">
          {/* Insights Progress stats bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">💡 Insights & Pensamentos</span>
              <span className="text-gray-500">{(stats.insight || 0) + (stats.thought || 0)}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#D4A853] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (((stats.insight || 0) + (stats.thought || 0)) / (cards.length || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Concepts Progress stats bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">🏛️ Conceitos Teóricos</span>
              <span className="text-gray-500">{stats.concept || 0}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#176970] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((stats.concept || 0) / (cards.length || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* References & Links Progress stats bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">🔗 Referências de Site & Links</span>
              <span className="text-gray-500">{(stats.reference || 0) + (stats.link || 0)}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#4A6FA5] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (((stats.reference || 0) + (stats.link || 0)) / (cards.length || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Quotes Progress stats bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">💬 Citações Textuais</span>
              <span className="text-gray-500">{stats.quote || 0}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#7B6991] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((stats.quote || 0) / (cards.length || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Other types: Sketches, Images, Observations */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-gray-700">🎨 Rascunhos, Imagens e Observações</span>
              <span className="text-gray-500">{(stats.sketch || 0) + (stats.image || 0) + (stats.observation || 0)}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#E58F65] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (((stats.sketch || 0) + (stats.image || 0) + (stats.observation || 0)) / (cards.length || 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Backup controls & Storage System Management */}
      <h3 className="text-xs font-sans font-bold text-gray-400 uppercase tracking-widest mb-3.5 px-1">Ações do Administrador</h3>
      <div className="bg-white border border-[#E8E4DC] rounded-xl shadow-3xs overflow-hidden font-sans text-xs">
        {/* Export Backup line */}
        <button 
          onClick={handleExport}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-55/65 text-left border-b border-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="text-gray-400 group-hover:text-gray-700">
              <Download size={18} />
            </div>
            <div>
              <span className="block font-bold text-gray-900 text-[13px]">Exportar backup do Repertório</span>
              <span className="block text-[11px] text-gray-400 mt-0.5">Baixar catálogo em arquivo formato .json</span>
            </div>
          </div>
          <CheckCircle size={16} className="text-green-500/70" />
        </button>

        {/* Import Backup file input button */}
        <label className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-55/65 text-left border-b border-gray-100 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="text-gray-400">
              <FolderSync size={18} />
            </div>
            <div>
              <span className="block font-bold text-gray-900 text-[13px]">Importar backup em JSON</span>
              <span className="block text-[11px] text-gray-400 mt-0.5">Fazer upload de backup compatível salvo previamente</span>
            </div>
          </div>
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <span className="inline-block border border-gray-250 bg-gray-50 text-gray-500 px-2 py-0.5 text-[10px] rounded-md font-bold">Upload</span>
        </label>

        {/* Reload initial seed template data */}
        <button 
          onClick={() => {
            if (confirm("Deseja substituir sua biblioteca atual de ideias e carregar a biblioteca modelo inicial? Suas alterações serão perdidas.")) {
              onResetDatabase();
            }
          }}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-yellow-50/50 text-left border-b border-gray-100 transition-colors text-yellow-800"
        >
          <div className="flex items-center gap-3">
            <div className="text-[#D4A853]">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="block font-bold text-gray-900 text-[13px]">Recarregar biblioteca inicial</span>
              <span className="block text-[11px] text-[#B8892A] mt-0.5">Recarrega o catálogo estético modelo com 16 ideias</span>
            </div>
          </div>
          <span className="inline-block border border-[#D4A853]/35 bg-[#FDF3DC] text-[#B8892A] px-2 py-0.5 text-[10px] rounded-md font-bold">Reset</span>
        </button>

        {/* Clear all cards database */}
        <button 
          onClick={() => {
            if (confirm("ATENÇÃO: Deseja apagar todas as referências do seu Repertório? Esta ação é irreversível.")) {
              onClearAll();
            }
          }}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-red-50/50 text-left transition-colors text-red-600"
        >
          <div className="flex items-center gap-3">
            <Trash2 size={18} className="text-red-500 shrink-0" />
            <div>
              <span className="block font-bold text-red-950 text-[13px]">Excluir banco de dados inteiro</span>
              <span className="block text-[11px] text-red-500/75 mt-0.5">Limpa totalmente o localStorage e deleta todos os registros</span>
            </div>
          </div>
          <span className="inline-block border border-red-200 bg-red-50 text-red-600 px-2 py-0.5 text-[10px] rounded-md font-bold">Apagar Tudo</span>
        </button>
      </div>
    </div>
  );
}
