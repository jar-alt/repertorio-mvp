import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Folder, 
  Calendar, 
  Plus, 
  X, 
  Check, 
  Sparkles,
  ChevronRight,
  Bookmark,
  Share2
} from 'lucide-react';
import { Card, Project, CardType } from '../types';

interface CardDetailViewProps {
  card: Card;
  allCards: Card[];
  projects: Project[];
  onBack: () => void;
  onUpdate: (updatedCard: Card) => void;
  onDelete: (id: string) => void;
}

export default function CardDetailView({ 
  card, 
  allCards, 
  projects, 
  onBack, 
  onUpdate, 
  onDelete 
}: CardDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title || '');
  const [editedContent, setEditedContent] = useState(card.content);
  const [editedType, setEditedType] = useState<CardType>(card.type);
  const [editedTagsString, setEditedTagsString] = useState(card.tags.join(', '));
  const [editedSource, setEditedSource] = useState(card.source || '');
  const [editedAuthor, setEditedAuthor] = useState(card.author || '');
  const [editedImageUrl, setEditedImageUrl] = useState(card.imageUrl || '');
  const [selectedProjects, setSelectedProjects] = useState<string[]>(card.projects || []);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Derive related ideas based on shared tags or fallback to random cards
  const relatedIdeas = useMemo(() => {
    const cardTags = new Set(card.tags.map(t => t.toLowerCase()));
    const matching = allCards.filter(c => {
      if (c.id === card.id) return false;
      return c.tags.some(tag => cardTags.has(tag.toLowerCase()));
    });
    
    if (matching.length > 0) return matching.slice(0, 5);
    // fallback to other ideas
    return allCards.filter(c => c.id !== card.id).slice(0, 5);
  }, [card, allCards]);

  // Handle save changes
  const handleSave = () => {
    if (!editedContent.trim()) return;
    
    const parsedTags = editedTagsString
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const updated: Card = {
      ...card,
      title: editedTitle.trim() || undefined,
      content: editedContent.trim(),
      type: editedType,
      tags: parsedTags,
      source: editedType === 'reference' ? editedSource.trim() : undefined,
      author: editedType === 'quote' ? editedAuthor.trim() : undefined,
      imageUrl: editedType === 'image' ? editedImageUrl.trim() : undefined,
      projects: selectedProjects,
    };
    
    onUpdate(updated);
    setIsEditing(false);
  };

  // Toggle project association
  const toggleProject = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(prev => prev.filter(id => id !== projectId));
    } else {
      setSelectedProjects(prev => [...prev, projectId]);
    }
  };

  // Find linked Project objects
  const linkedProjects = useMemo(() => {
    return projects.filter(p => selectedProjects.includes(p.id));
  }, [projects, selectedProjects]);

  return (
    <div className="flex-1 min-h-[calc(100vh-130px)] max-w-2xl mx-auto px-4 py-6 md:py-10 pb-24">
      {/* Top action bar */}
      <div className="flex justify-between items-center mb-6 pt-1">
        <button 
          onClick={onBack}
          className="text-[#176970] p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1 font-medium text-sm select-none"
        >
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </button>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-[#176970] p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1.5 font-medium text-sm"
                title="Editar card"
              >
                <Edit3 size={18} />
                <span className="hidden sm:inline">Editar</span>
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-[#ac3434] p-2 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1.5 font-medium text-sm"
                title="Excluir card"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Excluir</span>
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium text-xs shadow-sm transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-[#D4A853] text-white hover:opacity-90 font-semibold text-xs shadow-sm transition-opacity"
              >
                Salvar
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* DELETE CONFIRM ALERT */}
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 border border-red-200 bg-red-50/50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs"
          >
            <div>
              <h4 className="text-red-950 font-bold text-sm">Excluir esta referência permanentemente?</h4>
              <p className="text-red-700 text-xs mt-0.5">Esta ação não poderá ser desfeita.</p>
            </div>
            <div className="flex gap-2 self-end sm:self-auto">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-md text-xs font-semibold"
              >
                Não, manter
              </button>
              <button 
                onClick={() => {
                  onDelete(card.id);
                  onBack();
                }}
                className="px-3 py-1 bg-[#ac3434] text-white hover:bg-red-700 rounded-md text-xs font-semibold shadow-xs"
              >
                Sim, excluir
              </button>
            </div>
          </motion.div>
        )}

        {/* DETAILS/EDIT SHEET CONTAINER */}
        {!isEditing ? (
          <motion.div
            key="display"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            {/* Visual Card detailing */}
            <article className="p-6 md:p-8 bg-white border border-[#E8E4DC] rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-8 transition-shadow">
              {/* Card Type Tag */}
              <div className="inline-block bg-[#F0EDE8] text-[#7A7670] font-sans font-bold text-[10px] tracking-widest px-3 py-1 rounded-full uppercase mb-4 shadow-3xs">
                {card.type}
              </div>
              
              {/* Optional Title */}
              {card.title && (
                <h1 className="font-display text-[28px] sm:text-[32px] text-gray-900 font-bold mb-4 tracking-tight leading-tight">
                  {card.title}
                </h1>
              )}
              
              {/* Image preview inline if image type */}
              {card.type === 'image' && card.imageUrl && (
                <div className="w-full h-64 mb-6 rounded-lg overflow-hidden border border-gray-100 shadow-2xs">
                  <img 
                    src={card.imageUrl} 
                    alt={card.title || "Imagem curtida"} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              
              {/* Main Content text */}
              <p className="font-sans text-[15px] sm:text-[16px] text-gray-700 leading-relaxed font-normal">
                {card.content}
              </p>

              {/* Special Quote fields */}
              {card.type === 'quote' && card.author && (
                <p className="font-display italic text-right text-gray-500 mt-4 font-semibold">
                  — {card.author}
                </p>
              )}

              {/* Special source fields */}
              {card.type === 'reference' && card.source && (
                <p className="text-xs text-[#4A6FA5] bg-[#4A6FA5]/5 border border-[#4A6FA5]/10 px-2.5 py-1 rounded-md mt-4 inline-flex items-center gap-1">
                  <span>Fonte original: </span>
                  <span className="font-semibold">{card.source}</span>
                </p>
              )}
              
              <hr className="border-t border-[#F0EDE8] my-5" />
              
              <div className="text-[12px] text-gray-400 mb-6 flex flex-wrap items-center gap-2">
                <Calendar size={13} />
                <span>Modificado em: {card.date}</span>
                <span>·</span>
                <span className="italic">{card.context || 'conceitual'}</span>
                <span>·</span>
                <span className="text-[#D4A853] font-semibold">hoje</span>
              </div>
              
              {/* Color badges for tags list */}
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="bg-[#FDF3DC] text-[#B8892A] hover:bg-[#FDF3DC]/80 px-3.5 py-1 rounded-full text-[12px] font-sans font-medium shadow-3xs cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Linked Projects Container */}
            <section className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-[13px] font-bold text-gray-900 tracking-wider uppercase font-sans">
                  Projetos vinculados
                </h2>
                <button 
                  onClick={() => setShowProjectSelector(prev => !prev)}
                  className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#176970] hover:underline"
                >
                  <Plus size={14} />
                  <span>Gerenciar links</span>
                </button>
              </div>

              {/* Dynamic Project Selector dropdown */}
              {showProjectSelector && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-gray-50 border border-[#E8E4DC] rounded-[10px] space-y-2.5 shadow-2xs"
                >
                  <p className="text-xs text-gray-500 font-medium mb-1">Vincule esta ideia aos canais de trabalho ativos:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {projects.map(p => {
                      const isLinked = selectedProjects.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            toggleProject(p.id);
                            // Also submit actual updates live to keep parent synchronized
                            const updatedProjectsList = selectedProjects.includes(p.id)
                              ? selectedProjects.filter(id => id !== p.id)
                              : [...selectedProjects, p.id];
                            onUpdate({
                              ...card,
                              projects: updatedProjectsList
                            });
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs font-sans transition-all ${
                            isLinked 
                              ? 'border-[#D4A853] bg-white text-gray-900 font-bold' 
                              : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Folder size={14} className={isLinked ? 'text-[#D4A853]' : 'text-gray-400'} />
                            <span>{p.name}</span>
                          </div>
                          {isLinked && <Check size={14} className="text-[#D4A853]" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Projects Lists */}
              <div className="border border-[#E8E4DC] bg-white rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
                {linkedProjects.length > 0 ? (
                  linkedProjects.map((p, index) => (
                    <div 
                      key={p.id}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors ${
                        index > 0 ? 'border-t border-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#176970]/10 flex items-center justify-center text-[#176970]">
                          <Folder size={16} />
                        </div>
                        <div>
                          <span className="font-sans font-semibold text-[14.5px] block text-gray-900">{p.name}</span>
                          <span className="text-[11px] text-gray-400 block mt-0.5">{p.description || 'Diretório criativo'}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-xs text-gray-400 font-sans italic">Não vinculado a nenhum projeto de estúdio.</p>
                    <button 
                      onClick={() => setShowProjectSelector(true)}
                      className="mt-2 text-xs font-semibold text-[#176970] hover:underline"
                    >
                      Vincular projeto agora
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Related Ideas Section */}
            <section className="mt-8">
              <h2 className="text-[13px] font-bold text-gray-900 tracking-wider uppercase font-sans mb-3 px-1">
                Ideias relacionadas
              </h2>
              
              {/* Horizon Scroll List */}
              <div className="flex overflow-x-auto gap-3.5 pb-4 hide-scrollbar snap-x snap-mandatory">
                {relatedIdeas.map((rel) => {
                  // Determine tags highlight or generic display
                  return (
                    <div 
                      key={rel.id}
                      onClick={() => onUpdate({ ...rel })} // Visual switch to this card
                      className="flex-shrink-0 w-[145px] p-3 to-pointer bg-white border border-[#E8E4DC] rounded-lg shadow-2xs hover:shadow-xs hover:border-[#D4A853]/60 transition-all flex flex-col justify-between h-[110px] cursor-pointer snap-start select-none"
                    >
                      <div className="inline-block bg-[#F0EDE8] text-[#7A7670] font-sans font-bold text-[8.5px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider self-start mb-2">
                        {rel.type}
                      </div>
                      <span className="font-display text-[13px] text-gray-800 leading-snug line-clamp-3 font-semibold">
                        {rel.title || rel.content}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </motion.div>
        ) : (
          /* EDIT CARD FORM */
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-6 bg-white border border-[#E8E4DC] rounded-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <h2 className="text-md font-sans font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
              <Edit3 size={16} className="text-[#D4A853]" />
              <span>Editar Referência</span>
            </h2>

            <div className="space-y-4">
              {/* TYPE RADIO SELECTOR */}
              <div>
                <label className="block text-[10.5px] font-sans font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Tipo de Card
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['thought', 'quote', 'link', 'image', 'insight', 'reference', 'concept', 'sketch'] as CardType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setEditedType(t)}
                      className={`px-3 py-1.5 text-xs font-sans font-medium rounded-full border transition-all ${
                        editedType === t 
                          ? 'bg-[#176970] text-white border-[#176970] shadow-2xs' 
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* TITLE (OPTIONAL) */}
              <div>
                <label className="block text-[10.5px] font-sans font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Título (Opcional)
                </label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-sans text-gray-900 focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] transition-colors"
                  placeholder="Ex: Cerâmica Kintsugi"
                />
              </div>

              {/* MAIN CONTENT */}
              <div>
                <label className="block text-[10.5px] font-sans font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Conteúdo / Descrição
                </label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={5}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-sans text-gray-900 focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] resize-none transition-colors"
                  placeholder="Escreva sua ideia, rascunho ou pensamento..."
                  required
                />
              </div>

              {/* TYPE-SPECIFIC COMPLEMENTS */}
              {editedType === 'quote' && (
                <div>
                  <label className="block text-[10.5px] font-sans font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Autor da Citação
                  </label>
                  <input
                    type="text"
                    value={editedAuthor}
                    onChange={(e) => setEditedAuthor(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-sans text-gray-900 focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] transition-colors"
                    placeholder="Ex: Oscar Wilde"
                  />
                </div>
              )}

              {editedType === 'reference' && (
                <div>
                  <label className="block text-[10.5px] font-sans font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Fonte ou Link de Origem
                  </label>
                  <input
                    type="text"
                    value={editedSource}
                    onChange={(e) => setEditedSource(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-sans text-gray-900 focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] transition-colors"
                    placeholder="Ex: Awwwards Blog"
                  />
                </div>
              )}

              {editedType === 'image' && (
                <div>
                  <label className="block text-[10.5px] font-sans font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={editedImageUrl}
                    onChange={(e) => setEditedImageUrl(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-sans text-gray-900 focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] transition-colors"
                    placeholder="Ex: https://images.unsplash.com/photo-..."
                  />
                </div>
              )}

              {/* TAGS (COMMAS) */}
              <div>
                <label className="block text-[10.5px] font-sans font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Tags (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={editedTagsString}
                  onChange={(e) => setEditedTagsString(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs font-sans text-gray-900 focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] transition-colors"
                  placeholder="Ex: estética, design, japan"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3.5 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4.5 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Descartar mudanças
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4.5 py-2 text-xs font-semibold bg-[#D4A853] text-white rounded-lg hover:opacity-90 shadow-2xs transition-opacity"
              >
                Salvar Card
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
