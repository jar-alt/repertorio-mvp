import React, { useMemo, useState } from 'react';
import {
  Download,
  Sparkles,
  FolderSync,
  Trash2,
  CheckCircle,
  Mail,
} from 'lucide-react';
import { Card, Project } from '../types';

interface ProfileViewProps {
  cards: Card[];
  projects: Project[];
  user: { email: string | null } | null;
  authLoading: boolean;
  authMessage: string | null;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
  onResetDatabase: () => void;
  onImportBackup: (data: string) => void;
  onClearAll: () => void;
}

export default function ProfileView({
  cards,
  projects,
  user,
  authLoading,
  authMessage,
  onSignUp,
  onSignIn,
  onSignOut,
  onResetDatabase,
  onImportBackup,
  onClearAll,
}: ProfileViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      observation: 0,
    };

    cards.forEach((card) => {
      if (counts[card.type] !== undefined) {
        counts[card.type] += 1;
      } else {
        counts[card.type] = 1;
      }
    });

    return counts;
  }, [cards]);

  const totalTags = useMemo(() => {
    const tagsSet = new Set<string>();
    cards.forEach((card) => card.tags.forEach((tag) => tagsSet.add(tag.toLowerCase())));
    return tagsSet.size;
  }, [cards]);

  const handleSignUpClick = async () => {
    await onSignUp(email.trim(), password.trim());
  };

  const handleSignInClick = async () => {
    await onSignIn(email.trim(), password.trim());
  };

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
      {!user ? (
        <div className="mb-8 rounded-xl border border-[#E8E4DC] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] max-w-2xl mx-auto">
          <div className="mb-4 text-center">
            <h2 className="font-display text-xl font-bold text-gray-950">Acesso ao Repertório</h2>
            <p className="mt-2 text-sm text-gray-500">Faça login ou cadastre uma conta usando seu email e senha.</p>
          </div>
          <div className="grid gap-4">
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#E8E4DC] px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                placeholder="seu@email.com"
              />
            </label>
            <label className="block text-xs uppercase tracking-widest text-gray-500 font-semibold">
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#E8E4DC] px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                placeholder="Mínimo 6 caracteres"
              />
            </label>
            {authMessage && (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                {authMessage}
              </div>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleSignInClick}
                disabled={authLoading}
                className="w-full rounded-xl bg-[#176970] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#145b5b] disabled:opacity-60"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={handleSignUpClick}
                disabled={authLoading}
                className="w-full rounded-xl border border-[#D4A853] bg-white px-4 py-3 text-sm font-bold text-[#176970] transition hover:bg-[#F8F5ED] disabled:opacity-60"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-xl border border-[#E8E4DC] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] flex flex-col gap-5 sm:flex-row items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#176970] text-2xl font-bold text-[#e9fdff] border-2 border-[#D4A853]">
            {user.email ? user.email[0].toUpperCase() : 'U'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center gap-1.5 sm:justify-start">
              <span className="rounded-sm bg-[#FDF3DC] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#B8892A]">Membro Criativo</span>
            </div>
            <h2 className="font-display text-xl font-bold text-gray-950">Repertório Curatorial</h2>
            <p className="flex items-center justify-center gap-1 text-xs text-gray-500 sm:justify-start">
              <Mail size={12} className="text-gray-400" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>
      )}

      <h3 className="mb-3.5 px-1 text-xs font-sans font-bold uppercase tracking-widest text-gray-400">Seu Progresso de Curadoria</h3>
      <div className="grid gap-3.5 sm:grid-cols-4 mb-8">
        <div className="rounded-[10px] border border-[#E8E4DC] bg-white p-4 shadow-3xs text-center">
          <div className="text-[28px] font-display font-bold text-[#176970]">{cards.length}</div>
          <div className="mt-1 text-[10.5px] font-sans font-semibold uppercase tracking-wider text-gray-400">Ideias Salvas</div>
        </div>
        <div className="rounded-[10px] border border-[#E8E4DC] bg-white p-4 shadow-3xs text-center">
          <div className="text-[28px] font-display font-bold text-[#7B6991]">{projects.length}</div>
          <div className="mt-1 text-[10.5px] font-sans font-semibold uppercase tracking-wider text-gray-400">Canais Ativos</div>
        </div>
        <div className="rounded-[10px] border border-[#E8E4DC] bg-white p-4 shadow-3xs text-center">
          <div className="text-[28px] font-display font-bold text-[#B8892A]">{totalTags}</div>
          <div className="mt-1 text-[10.5px] font-sans font-semibold uppercase tracking-wider text-gray-400">Tags Únicas</div>
        </div>
        <div className="rounded-[10px] border border-[#E8E4DC] bg-white p-4 shadow-3xs text-center">
          <div className="text-[20px] font-display font-bold text-[#E58F65] leading-8">100%</div>
          <div className="mt-1 text-[10.5px] font-sans font-semibold uppercase tracking-wider text-gray-400">Preservado Offline</div>
        </div>
      </div>

      {user && (
        <>
          <div className="mb-8 rounded-xl border border-[#E8E4DC] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-md font-bold text-gray-900">Distribuição por Tipo</h3>
                <p className="text-[11px] text-gray-400">análise composicional</p>
              </div>
            </div>
            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-gray-700">
                  <span>💡 Insights & Pensamentos</span>
                  <span>{(stats.insight || 0) + (stats.thought || 0)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#D4A853] transition-all duration-500"
                    style={{ width: `${Math.min(100, (((stats.insight || 0) + (stats.thought || 0)) / (cards.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-gray-700">
                  <span>🏛️ Conceitos Teóricos</span>
                  <span>{stats.concept || 0}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#176970] transition-all duration-500"
                    style={{ width: `${Math.min(100, ((stats.concept || 0) / (cards.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-gray-700">
                  <span>🔗 Referências de Site & Links</span>
                  <span>{(stats.reference || 0) + (stats.link || 0)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#4A6FA5] transition-all duration-500"
                    style={{ width: `${Math.min(100, (((stats.reference || 0) + (stats.link || 0)) / (cards.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-gray-700">
                  <span>💬 Citações Textuais</span>
                  <span>{stats.quote || 0}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#7B6991] transition-all duration-500"
                    style={{ width: `${Math.min(100, ((stats.quote || 0) / (cards.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold text-gray-700">
                  <span>🎨 Rascunhos, Imagens e Observações</span>
                  <span>{(stats.sketch || 0) + (stats.image || 0) + (stats.observation || 0)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#E58F65] transition-all duration-500"
                    style={{ width: `${Math.min(100, (((stats.sketch || 0) + (stats.image || 0) + (stats.observation || 0)) / (cards.length || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <h3 className="mb-3.5 px-1 text-xs font-sans font-bold uppercase tracking-widest text-gray-400">Ações do Administrador</h3>
          <div className="rounded-xl border border-[#E8E4DC] bg-white shadow-3xs overflow-hidden text-xs font-sans">
            <button
              onClick={handleExport}
              className="flex w-full items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 text-gray-500">
                <Download size={18} />
                <div>
                  <div className="font-bold text-gray-900">Exportar backup do Repertório</div>
                  <div className="text-[11px] text-gray-400">Baixar catálogo em arquivo formato .json</div>
                </div>
              </div>
              <CheckCircle size={16} className="text-green-500" />
            </button>
            <label className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 hover:bg-gray-50 text-gray-500">
              <div className="flex items-center gap-3">
                <FolderSync size={18} />
                <div>
                  <div className="font-bold text-gray-900">Importar backup em JSON</div>
                  <div className="text-[11px] text-gray-400">Fazer upload de backup compatível salvo previamente</div>
                </div>
              </div>
              <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
              <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[10px] font-bold">Upload</span>
            </label>
            <button
              onClick={() => {
                if (confirm('Deseja substituir sua biblioteca atual de ideias e carregar a biblioteca modelo inicial? Suas alterações serão perdidas.')) {
                  onResetDatabase();
                }
              }}
              className="flex w-full items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 hover:bg-gray-50 text-yellow-800"
            >
              <div className="flex items-center gap-3">
                <Sparkles size={18} className="text-[#D4A853]" />
                <div>
                  <div className="font-bold text-gray-900">Recarregar biblioteca inicial</div>
                  <div className="text-[11px] text-[#B8892A]">Recarrega o catálogo estético modelo com 16 ideias</div>
                </div>
              </div>
              <span className="rounded-md border border-[#D4A853]/35 bg-[#FDF3DC] px-2 py-1 text-[10px] font-bold text-[#B8892A]">Reset</span>
            </button>
            <button
              onClick={() => {
                if (confirm('ATENÇÃO: Deseja apagar todas as referências do seu Repertório? Esta ação é irreversível.')) {
                  onClearAll();
                }
              }}
              className="flex w-full items-center justify-between gap-3 bg-white px-4 py-4 hover:bg-red-50 text-red-600"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={18} className="text-red-500" />
                <div>
                  <div className="font-bold text-red-950">Excluir banco de dados inteiro</div>
                  <div className="text-[11px] text-red-500/75">Limpa totalmente o localStorage e deleta todos os registros</div>
                </div>
              </div>
              <span className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">Apagar Tudo</span>
            </button>
          </div>

          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={onSignOut}
              disabled={authLoading}
              className="rounded-xl bg-[#E58F65] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#c86c52] disabled:opacity-60"
            >
              Sair da Conta
            </button>
          </div>
        </>
      )}
    </div>
  );
}
