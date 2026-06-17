import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Layers, 
  Menu, 
  Plus, 
  Eye, 
  Grid3X3, 
  FileText, 
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import type { Session, User } from '@supabase/supabase-js';

// Core imports
import { Card, Project, CardType } from './types';
import { INITIAL_CARDS, INITIAL_PROJECTS } from './data';
import { supabase } from './supabaseClient';
import {
  fetchUserCards,
  fetchUserProjects,
  createCard,
  updateCard,
  deleteCard,
  createProject,
  saveLocalCards,
  saveLocalProjects,
  clearLocalData,
  getLocalCards,
  getLocalProjects,
} from './services/supabaseService';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import CardComponent from './components/CardComponent';
import CardDetailView from './components/CardDetailView';
import AddCardModal from './components/AddCardModal';
import ProfileView from './components/ProfileView';

export default function App() {
  // Navigation tabs state
  const [currentTab, setCurrentTab] = useState<string>('home'); // 'home' | 'explore' | 'profile'
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('Todas');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  
  // Modal toggle state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Active workspace project filters
  const [activeProjectFilter, setActiveProjectFilter] = useState<string | null>(null);

  // Core Data Lists - Now synced with Supabase
  const [cards, setCards] = useState<Card[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  
  // Sync and loading states
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Keep localStorage up-to-date as fallback for offline
  useEffect(() => {
    if (cards.length > 0) {
      saveLocalCards(cards);
    }
  }, [cards]);

  useEffect(() => {
    if (projects.length > 0) {
      saveLocalProjects(projects);
    }
  }, [projects]);

  // Initialize auth and fetch user data
  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setCurrentUser(data.session?.user ?? null);

      // Load user data from Supabase if logged in
      if (data.session?.user) {
        await loadUserData(data.session.user.id);
      } else {
        // No session, try loading from offline fallback
        setCards(getLocalCards());
        setProjects(getLocalProjects());
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);

      // Load user data when auth state changes
      if (session?.user) {
        await loadUserData(session.user.id);
      } else {
        // User logged out, clear data
        setCards([]);
        setProjects([]);
        clearLocalData();
      }
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  // Load user data from Supabase
  const loadUserData = async (userId: string) => {
    try {
      setIsLoadingData(true);
      setSyncError(null);

      const [fetchedCards, fetchedProjects] = await Promise.all([
        fetchUserCards(userId),
        fetchUserProjects(userId),
      ]);

      setCards(fetchedCards);
      setProjects(fetchedProjects);
      
      // Also save to localStorage as fallback
      saveLocalCards(fetchedCards);
      saveLocalProjects(fetchedProjects);
    } catch (error) {
      console.error('Error loading user data:', error);
      setSyncError('Erro ao carregar dados. Usando dados em cache.');
      // Try to load from offline cache
      setCards(getLocalCards());
      setProjects(getLocalProjects());
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthMessage(null);

    const { error } = await supabase.auth.signUp({ email, password });
    setAuthLoading(false);

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setAuthMessage('Cadastro iniciado! Verifique seu email para confirmar a conta, se necessário.');
  };

  const handleSignIn = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setAuthMessage('Login realizado com sucesso!');
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    setAuthMessage(null);

    const { error } = await supabase.auth.signOut();
    setAuthLoading(false);

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    // Clear all local data on logout
    setCards([]);
    setProjects([]);
    clearLocalData();
    setSelectedTag('Todas');
    setSearchQuery('');
    setActiveProjectFilter(null);
    setSelectedCard(null);
    
    setAuthMessage('Sessão encerrada.');
  };

  // Recalculate Project item counts dynamically based on cards linked
  const dynamicProjects = useMemo(() => {
    return projects.map((p) => {
      const associatedCount = cards.filter((c) => c.projects?.includes(p.id)).length;
      return {
        ...p,
        itemCount: associatedCount > 0 ? associatedCount : p.itemCount, // fallback to initial if zero
      };
    });
  }, [projects, cards]);

  // Handle adding new cards
  const handleSaveCard = async (newCardData: Omit<Card, 'id' | 'date'>) => {
    if (!currentUser) {
      setAuthMessage('Você precisa estar autenticado para criar um card.');
      return;
    }

    try {
      setIsSyncing(true);
      setSyncError(null);

      const dateObj = new Date();
      const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const formattedDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

      const cardToCreate: Omit<Card, 'id' | 'created_at' | 'updated_at'> = {
        ...newCardData,
        user_id: currentUser.id,
        date: formattedDate,
      };

      // If context project name is input, find or create project
      if (newCardData.context) {
        const matchedProj = projects.find(
          (p) => p.name.toLowerCase() === newCardData.context?.toLowerCase()
        );
        if (matchedProj) {
          cardToCreate.projects = [matchedProj.id];
        } else {
          // Create new project
          const newProj = await createProject(currentUser.id, {
            name: newCardData.context,
            description: `Canal criado automaticamente para: ${newCardData.context}`,
            itemCount: 1,
          });
          if (newProj) {
            cardToCreate.projects = [newProj.id];
            setProjects((prev) => [...prev, newProj]);
          }
        }
      }

      // Create card in Supabase
      const createdCard = await createCard(currentUser.id, cardToCreate);
      if (createdCard) {
        setCards((prev) => [createdCard, ...prev]);
      } else {
        setSyncError('Erro ao criar card. Tente novamente.');
      }
    } catch (error) {
      console.error('Error saving card:', error);
      setSyncError('Erro ao salvar card.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle updating existing cards
  const handleUpdateCard = async (updatedCard: Card) => {
    if (!currentUser) {
      setAuthMessage('Você precisa estar autenticado para atualizar um card.');
      return;
    }

    try {
      setIsSyncing(true);
      setSyncError(null);

      const result = await updateCard(currentUser.id, updatedCard);
      if (result) {
        setCards((prev) => prev.map((c) => (c.id === updatedCard.id ? result : c)));
        if (selectedCard?.id === updatedCard.id) {
          setSelectedCard(result);
        }
      } else {
        setSyncError('Erro ao atualizar card ou permissão negada.');
      }
    } catch (error) {
      console.error('Error updating card:', error);
      setSyncError('Erro ao atualizar card.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle deleting card
  const handleDeleteCard = async (id: string) => {
    if (!currentUser) {
      setAuthMessage('Você precisa estar autenticado para deletar um card.');
      return;
    }

    try {
      setIsSyncing(true);
      setSyncError(null);

      const success = await deleteCard(currentUser.id, id);
      if (success) {
        setCards((prev) => prev.filter((c) => c.id !== id));
        setSelectedCard(null);
      } else {
        setSyncError('Erro ao deletar card ou permissão negada.');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      setSyncError('Erro ao deletar card.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Get list of all tags present dynamically across all cards
  const dynamicTags = useMemo(() => {
    const counts: Record<string, number> = {};
    cards.forEach((c) => {
      c.tags.forEach((tag) => {
        const cleaned = tag.trim().toLowerCase();
        if (cleaned) {
          counts[cleaned] = (counts[cleaned] || 0) + 1;
        }
      });
    });

    // Sort tags by frequency
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [cards]);

  // Derived filtered cards for displaying
  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      // 1. Filter by Workspace canal/project if active
      if (activeProjectFilter) {
        const matchingProj = projects.find((p) => p.name === activeProjectFilter);
        if (!matchingProj || !c.projects?.includes(matchingProj.id)) {
          return false;
        }
      }

      // 2. Filter by tag chip selection
      if (selectedTag !== 'Todas') {
        const hasTag = c.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());
        if (!hasTag) return false;
      }

      // 3. Filter by search text criteria
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = c.title?.toLowerCase().includes(query) || false;
        const matchesContent = c.content.toLowerCase().includes(query);
        const matchesTag = c.tags.some((t) => t.toLowerCase().includes(query));
        const matchesContext = c.context?.toLowerCase().includes(query) || false;
        
        if (!matchesTitle && !matchesContent && !matchesTag && !matchesContext) {
          return false;
        }
      }

      return true;
    });
  }, [cards, activeProjectFilter, selectedTag, searchQuery, projects]);

  // Admin Database reset functions passed to Profile
  const handleResetDatabase = () => {
    setCards(INITIAL_CARDS.map(card => ({ ...card, user_id: currentUser?.id || '' })));
    setProjects(INITIAL_PROJECTS.map(proj => ({ ...proj, user_id: currentUser?.id || '' })));
    setSelectedTag('Todas');
    setSearchQuery('');
    setActiveProjectFilter(null);
    setSelectedCard(null);
  };

  const handleImportBackup = (backupStr: string) => {
    try {
      const parsed = JSON.parse(backupStr);
      if (parsed.cards && Array.isArray(parsed.cards)) {
        setCards(parsed.cards);
      }
      if (parsed.projects && Array.isArray(parsed.projects)) {
        setProjects(parsed.projects);
      }
      setAuthMessage('Sincronização e Importação de dados concluída com sucesso!');
    } catch (e) {
      setAuthMessage('Arquivo inválido de backup JSON.');
    }
  };

  const handleClearAll = () => {
    setCards([]);
    setProjects([]);
    clearLocalData();
    setSelectedTag('Todas');
    setSearchQuery('');
    setActiveProjectFilter(null);
    setSelectedCard(null);
  };

  return (
    <div className="bg-brand-canvas text-gray-900 min-h-screen flex flex-col md:flex-row antialiased font-sans">
      {/* 1. DESKTOP SIDEBAR */}
      <Sidebar 
        currentTab={currentTab} 
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setSelectedCard(null);
          setSelectedTag('Todas');
          setSearchQuery('');
          setActiveProjectFilter(null);
        }}
        projects={dynamicProjects}
        activeProjectFilter={activeProjectFilter}
        onProjectFilterChange={(pName) => {
          setActiveProjectFilter(pName);
          setSelectedCard(null);
          setSelectedTag('Todas');
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* 2. MAIN WORKSPACE WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP EDITORIAL APPBAR HEADER */}
        {!selectedCard && (
          <Header 
            onSearchChange={setSearchQuery} 
            searchQuery={searchQuery}
            onOpenSidebar={() => setMobileSidebarOpen(true)}
            onResetData={handleResetDatabase}
            selectedTag={selectedTag}
          />
        )}

        {/* MOBILE WORKSPACE PANEL DRAWER SLEEVE - BLURS SENSITIVE AREA */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/60"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="relative bg-white w-72 h-full flex flex-col p-6 shadow-xl"
              >
                {/* Mobile sidebar container content */}
                <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-[#D4A853]" />
                    <span className="font-display font-medium text-lg text-[#176970]">Curadoria</span>
                  </div>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      setCurrentTab('home');
                      setSelectedCard(null);
                      setSelectedTag('Todas');
                      setActiveProjectFilter(null);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 py-2 px-3 text-xs font-bold uppercase ${
                      currentTab === 'home' && !activeProjectFilter ? 'text-[#1s76970]' : 'text-gray-500'
                    }`}
                  >
                    <span>Todas as ideias</span>
                  </button>

                  <button 
                    onClick={() => {
                      setCurrentTab('explore');
                      setSelectedCard(null);
                      setSelectedTag('Todas');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 py-2 px-3 text-xs font-bold uppercase ${
                      currentTab === 'explore' ? 'text-[#1s76970]' : 'text-gray-500'
                    }`}
                  >
                    <span>Explorar tags</span>
                  </button>

                  <button 
                    onClick={() => {
                      setCurrentTab('profile');
                      setSelectedCard(null);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 py-2 px-3 text-xs font-bold uppercase ${
                      currentTab === 'profile' ? 'text-[#1s76970]' : 'text-gray-500'
                    }`}
                  >
                    <span>Estatísticas & Perfil</span>
                  </button>
                </div>

                {/* Mobile channels list */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider block mb-3 pl-3">Canais ativos</span>
                  <div className="space-y-1 overflow-y-auto max-h-[220px]">
                    {dynamicProjects.map(proj => {
                      const isSelected = activeProjectFilter === proj.name;
                      return (
                        <button
                          key={proj.id}
                          onClick={() => {
                            setCurrentTab('home');
                            setSelectedCard(null);
                            setActiveProjectFilter(isSelected ? null : proj.name);
                            setMobileSidebarOpen(false);
                          }}
                          className={`w-full text-left py-2 px-3 text-xs font-sans rounded-md block truncate ${
                            isSelected ? 'bg-[#D4A853]/15 text-[#B8892A] font-bold' : 'text-gray-500'
                          }`}
                        >
                          # {proj.name} ({proj.itemCount})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 3. SWITCHABLE ACTIVE WINDOW TAB CONTENT */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-5">
          <AnimatePresence mode="wait">
            {/* A. PREVIEWING CARD DETAILS (Detail Screen Mockups) */}
            {selectedCard ? (
              <motion.div
                key={`detail-${selectedCard.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CardDetailView 
                  card={selectedCard}
                  allCards={cards}
                  projects={dynamicProjects}
                  currentUser={currentUser}
                  onBack={() => setSelectedCard(null)}
                  onUpdate={handleUpdateCard}
                  onDelete={handleDeleteCard}
                  onSelectCard={setSelectedCard}
                />
              </motion.div>
            ) : (
              // B. PRIMARY VIEWS ROUTER
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="w-full h-full"
              >
                {/* SECTION 1: HOME PAGE (Grid / Curations Feed) */}
                {currentTab === 'home' && (
                  <div className="space-y-6">
                    {/* Active filter marker banner if any */}
                    {activeProjectFilter && (
                      <div className="p-4 bg-[#D4A853]/10 border border-[#D4A853]/20 rounded-xl flex items-center justify-between text-xs text-[#B8892A]">
                        <div className="flex items-center gap-2">
                          <FolderOpen size={16} />
                          <span>Exibindo arquivamentos do Canal: <strong>{activeProjectFilter}</strong></span>
                        </div>
                        <button 
                          onClick={() => setActiveProjectFilter(null)}
                          className="hover:underline font-bold uppercase tracking-wider text-[10px]"
                        >
                          Exibir Todas as pastas
                        </button>
                      </div>
                    )}

                    {/* Integrated Search Bar inside layout matching mockups */}
                    <div className="relative w-full shadow-3xs max-w-xl mx-auto md:mx-0">
                      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 stroke-[2]" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white text-gray-900 placeholder:text-gray-400 rounded-lg border border-[#E8E4DC] pl-10 pr-4 py-3 text-xs font-sans focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] transition-all"
                        placeholder="Buscar referências..."
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700"
                        >
                          Limpar
                        </button>
                      )}
                    </div>

                    {/* Filter chips scrollbox (Todas, design, cultura, etc.) */}
                    <div className="pb-1 overflow-x-auto hide-scrollbar flex items-center gap-2 select-none">
                      <button 
                        onClick={() => setSelectedTag('Todas')}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-[10.5px] font-sans font-bold uppercase tracking-wider transition-all duration-200 ${
                          selectedTag === 'Todas'
                            ? 'bg-[#D4A853] text-[#FAF8F5] shadow-xs'
                            : 'bg-white text-gray-500 hover:bg-[#FAF8F5] border border-gray-100'
                        }`}
                      >
                        Todas
                      </button>
                      {(dynamicTags.length > 0 ? dynamicTags.slice(0, 10) : ['design', 'cultura', 'ux', 'tendência', 'filosofia', 'estética']).map((tag) => {
                        const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
                        return (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(isSelected ? 'Todas' : tag)}
                            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[10.5px] font-sans font-bold uppercase tracking-wider transition-all duration-200 ${
                              isSelected
                                ? 'bg-[#D4A853] text-[#FAF8F5] shadow-xs'
                                : 'bg-white text-gray-500 hover:bg-[#FAF8F5] border border-gray-100'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>

                    {/* Highly responsive Editorial Masonry CSS columns Grid */}
                    {filteredCards.length > 0 ? (
                      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 w-full [column-fill:_balance] pb-16">
                        {filteredCards.map((card) => (
                          <CardComponent 
                            key={card.id} 
                            card={card} 
                            onClick={setSelectedCard} 
                          />
                        ))}
                      </div>
                    ) : (
                      /* No results illustrative state */
                      <div className="p-16 border-2 border-dashed border-[#E8E4DC] rounded-xl flex flex-col items-center text-center max-w-md mx-auto my-12 bg-white/50">
                        <div className="w-12 h-12 bg-gray-55/65 rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-3xs">
                          <HelpCircle size={22} />
                        </div>
                        <h4 className="font-display font-bold text-md text-gray-800">Nenhuma ideia encontrada</h4>
                        <p className="text-xs text-gray-400 mt-1 pb-4 leading-relaxed max-w-xs font-sans">
                          Sua curadoria atual não correspondência aos termos pesquisados ou tag selecionada.
                        </p>
                        <button 
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedTag('Todas');
                            setActiveProjectFilter(null);
                          }}
                          className="px-4 py-2 bg-[#D4A853] text-white rounded-lg text-xs font-sans font-bold tracking-wider uppercase shadow-2xs hover:opacity-95 transition-all"
                        >
                          Limpar Filtros
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 2: EXPLORE TAB (Curated search box and tag clouds) */}
                {currentTab === 'explore' && (
                  <div className="space-y-6">
                    <div className="bg-white border border-[#E8E4DC] p-6 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
                      <h2 className="font-display font-medium text-[20px] text-gray-900 mb-2">Articulação Conceitual</h2>
                      <p className="text-xs text-gray-500 leading-relaxed max-w-xl font-sans">
                        Filtragem semântica baseada nas tendências e etiquetas catalogadas. Toque em qualquer tag para isolar os pensamentos na galeria abaixo.
                      </p>
                      
                      {/* Full tag cloud */}
                      <div className="flex flex-wrap gap-2.5 mt-5">
                        {dynamicTags.map((tag) => {
                          const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
                          return (
                            <button
                              key={tag}
                              onClick={() => setSelectedTag(isSelected ? 'Todas' : tag)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
                                isSelected
                                  ? 'bg-[#176970] text-[#e9fdff] border-[#176970] shadow-xs scale-98'
                                  : 'bg-[#FAF8F5] text-gray-700 border-gray-200/80 hover:bg-[#FAF8F5]/80'
                              }`}
                            >
                              #{tag}
                            </button>
                          );
                        })}
                        {dynamicTags.length === 0 && (
                          <div className="text-xs text-gray-400 font-sans italic py-2">
                            Nenhuma etiqueta catalogada nas suas referências.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Explore feed section title */}
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <h3 className="font-sans font-bold text-xs uppercase text-gray-400 tracking-widest pl-1">
                        {selectedTag === 'Todas' ? 'Tudo Catalogado' : `Galeria isolada: #${selectedTag}`}
                      </h3>
                      {selectedTag !== 'Todas' && (
                        <button 
                          onClick={() => setSelectedTag('Todas')}
                          className="text-xs text-[#176970] hover:underline"
                        >
                          Limpar filtro
                        </button>
                      )}
                    </div>

                    {/* Cards grid */}
                    {filteredCards.length > 0 ? (
                      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 w-full [column-fill:_balance] pb-16">
                        {filteredCards.map((card) => (
                          <CardComponent 
                            key={card.id} 
                            card={card} 
                            onClick={setSelectedCard} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center border rounded-lg bg-white/40">
                        <p className="text-xs text-gray-400 italic">Nenhum card correspondente à tag articulada.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* SECTION 3: DEEP STATS & SETTINGS PROFILE TAB */}
                {currentTab === 'profile' && (
                  <ProfileView 
                    cards={cards}
                    projects={dynamicProjects}
                    user={currentUser}
                    authLoading={authLoading}
                    authMessage={authMessage}
                    onSignUp={handleSignUp}
                    onSignIn={handleSignIn}
                    onSignOut={handleSignOut}
                    onResetDatabase={handleResetDatabase}
                    onImportBackup={handleImportBackup}
                    onClearAll={handleClearAll}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. MOBILE BOTTOM BAR NAVIGATION CONTROL */}
      {!selectedCard && (
        <BottomNav 
          currentTab={currentTab} 
          onTabChange={(tab) => {
            setCurrentTab(tab);
            setSelectedCard(null);
            setSelectedTag('Todas');
            setSearchQuery('');
            setActiveProjectFilter(null);
          }}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onClearProjectFilter={() => setActiveProjectFilter(null)}
        />
      )}

      {/* 5. ELEVATED CARD CREATOR MODAL WINDOW OVERLAY */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddCardModal 
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSaveCard}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
