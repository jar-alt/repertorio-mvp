import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Lightbulb, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Sparkles, 
  Save, 
  Hash, 
  FolderOpen,
  Paperclip,
  PenTool,
  Bookmark
} from 'lucide-react';
import { CardType, Card } from '../types';

interface AddCardModalProps {
  onClose: () => void;
  onSave: (newCard: Omit<Card, 'id' | 'date'>) => void;
  initialType?: CardType;
  availableProjects?: string[];
}

export default function AddCardModal({ onClose, onSave, initialType = 'thought' }: AddCardModalProps) {
  const [selectedType, setSelectedType] = useState<CardType>(initialType);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [context, setContext] = useState('');
  
  // Type-specific details state
  const [author, setAuthor] = useState('');
  const [source, setSource] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Suggested tags matching the ones from the mockups
  const SUGGESTED_TAGS = ['design', 'architecture', 'typography', 'estética', 'cultura', 'ux', 'tendência', 'filosofia'];

  // Automatically parse space/comma or let user type and press Enter to select tags
  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim().toLowerCase();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags(prev => [...prev, trimmed]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const value = tagsInput.replace(/,/g, '').trim();
      if (value) {
        handleAddTag(value);
        setTagsInput('');
      }
    }
  };

  // Submit action
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Combine manual tag input with selectedTags
    const finalTags = [...selectedTags];
    const extraTag = tagsInput.trim().toLowerCase();
    if (extraTag && !finalTags.includes(extraTag)) {
      finalTags.push(extraTag);
    }

    onSave({
      type: selectedType,
      title: title.trim() || undefined,
      content: content.trim(),
      tags: finalTags.length > 0 ? finalTags : ['geral'],
      context: context.trim() || undefined,
      author: selectedType === 'quote' ? author.trim() : undefined,
      source: selectedType === 'reference' || selectedType === 'link' ? source.trim() : undefined,
      imageUrl: selectedType === 'image' ? imageUrl.trim() : undefined,
    });
    
    onClose();
  };

  // Style helper based on type
  const getTypeConfig = (type: CardType) => {
    switch (type) {
      case 'thought':
        return { label: 'Pensamento', icon: <Lightbulb size={18} /> };
      case 'quote':
        return { label: 'Citação', icon: <Quote size={18} /> };
      case 'link':
        return { label: 'Link', icon: <LinkIcon size={18} /> };
      case 'image':
        return { label: 'Imagem', icon: <ImageIcon size={18} /> };
      case 'insight':
        return { label: 'Insight', icon: <Sparkles size={18} /> };
      case 'reference':
        return { label: 'Referência', icon: <Paperclip size={18} /> };
      case 'sketch':
        return { label: 'Rascunho', icon: <PenTool size={18} /> };
      default:
        return { label: 'Pensamento', icon: <Lightbulb size={18} /> };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md transition-opacity">
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.98 }}
        className="w-full max-w-2xl bg-white border border-[#E8E4DC] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E4DC] bg-[#FAF8F5]">
          <h2 className="font-display font-medium text-[22px] tracking-tight text-gray-900">
            Adicionar ao Repertório
          </h2>
          <button 
            onClick={onClose}
            aria-label="Close" 
            className="text-[#7A7670] hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 hide-scrollbar">
          {/* Type Selector Visual Radio Chips Row */}
          <div>
            <label className="block font-sans font-bold text-[10.5px] uppercase text-gray-400 tracking-widest mb-3">
              Tipo / Categoria
            </label>
            <div className="flex flex-wrap gap-2.5">
              {(['thought', 'quote', 'link', 'image', 'insight', 'reference', 'sketch'] as CardType[]).map((type) => {
                const isSelected = selectedType === type;
                const config = getTypeConfig(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-full border text-xs font-sans font-semibold transition-all flex items-center gap-2 cursor-pointer select-none ${
                      isSelected 
                        ? 'bg-[#176970] text-[#e9fdff] border-[#176970] shadow-2xs' 
                        : 'bg-[#FAF8F5] text-gray-500 border-gray-200/80 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    {config.icon}
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Content Area */}
          <div className="space-y-4">
            <textarea
              autoFocus
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg px-4 py-3 font-sans text-[15px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853] resize-none transition-colors"
              placeholder="Capture um pensamento, anote um aprendizado, cite um livro ou registre seu insight aqui..."
            />

            {/* Optional Title input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent border-b border-gray-200 hover:border-gray-300 py-2.5 font-display text-[17px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#D4A853] transition-colors focus:ring-0"
              placeholder="Título conceitual (opcional)"
            />
          </div>

          {/* Type-driven complementary fields */}
          {selectedType === 'quote' && (
            <div className="border-l-2 border-l-[#D4A853] pl-4 space-y-3">
              <label className="block font-sans font-bold text-[10.5px] uppercase text-gray-400 tracking-widest mb-1.5">
                Detalhes da Citação
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-gray-200 rounded-lg px-3 py-2 text-xs font-sans text-gray-900 focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]"
                placeholder="Nome do autor da frase (ex: Oscar Wilde)"
              />
            </div>
          )}

          {(selectedType === 'reference' || selectedType === 'link') && (
            <div className="border-l-2 border-l-[#4A6FA5] pl-4 space-y-3">
              <label className="block font-sans font-bold text-[10.5px] uppercase text-gray-400 tracking-widest mb-1.5">
                Fonte ou Link de Referência
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-gray-200 rounded-lg px-3 py-2 text-xs font-sans text-gray-900 focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]"
                placeholder="Ex: Editorial Review, www.artforum.com, Awwwards Blog"
              />
            </div>
          )}

          {selectedType === 'image' && (
            <div className="border-l-2 border-l-[#E58F65] pl-4 space-y-3">
              <label className="block font-sans font-bold text-[10.5px] uppercase text-gray-400 tracking-widest mb-1.5">
                Endereço da Imagem (URL)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-gray-200 rounded-lg px-3 py-2 text-xs font-sans text-gray-900 focus:outline-none focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]"
                placeholder="Insira um link direto de imagem (ex: Unsplash)"
              />
              <p className="text-[10px] text-gray-400">Sugestão: Use fotos do Unsplash para deixar seu mural esteticamente estimulante.</p>
            </div>
          )}

          {/* Grid section for Tags & Project context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
            {/* Tags area */}
            <div>
              <label className="block font-sans font-bold text-[10.5px] uppercase text-gray-400 tracking-widest mb-2">
                Etiquetas / Tags
              </label>
              <div className="flex items-center bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg px-3 py-0.5 focus-within:border-[#D4A853] focus-within:ring-1 focus-within:ring-[#D4A853] transition-colors">
                <Hash size={14} className="text-gray-400 mr-1 shrink-0" />
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={handleTagsKeyDown}
                  className="w-full bg-transparent border-none p-2 text-xs font-sans text-gray-800 placeholder:text-gray-450 focus:outline-none focus:ring-0"
                  placeholder="Nova tag (aperte espaço ou enter)"
                />
              </div>

              {/* Selected Tag Capsules */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {selectedTags.map((t) => (
                  <span 
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#D4A853]/10 text-[#B8892A] text-[11px] font-sans font-semibold border border-[#D4A853]/15"
                  >
                    <span>{t}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(t)}
                      className="hover:bg-[#D4A853]/20 hover:text-red-600 rounded-full text-[10px] w-3 h-3 flex items-center justify-center p-0 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Recommended Quick Suggestion Tags from Mockups */}
              <div className="mt-3">
                <p className="text-[10px] text-gray-400 mb-1.5 font-bold uppercase tracking-wider">Sugestões do Repertório:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_TAGS.map((tag) => {
                    const isAlreadySelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        disabled={isAlreadySelected}
                        onClick={() => handleAddTag(tag)}
                        className={`text-[10.5px] font-sans font-semibold px-2 py-1 rounded-md border transition-all ${
                          isAlreadySelected 
                            ? 'bg-gray-150 text-gray-300 border-gray-100 cursor-not-allowed' 
                            : 'bg-[#FAF8F5] text-gray-500 border-gray-250/50 hover:bg-gray-100'
                        }`}
                      >
                        +{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Context project input area */}
            <div>
              <label className="block font-sans font-bold text-[10.5px] uppercase text-gray-400 tracking-widest mb-2">
                Contexto / Canal de Trabalho (Projeto)
              </label>
              <div className="flex items-center bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg px-3 py-0.5 focus-within:border-[#D4A853] focus-within:ring-1 focus-within:ring-[#D4A853] transition-colors">
                <FolderOpen size={14} className="text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full bg-transparent border-none p-2 text-xs font-sans text-gray-800 placeholder:text-gray-450 focus:outline-none focus:ring-0"
                  placeholder="Vincular a um Canal (ex: Redesign Editorial)"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                Ideal para catalogar e filtrar suas referências sob as mesmas diretivas criativas.
              </p>
            </div>
          </div>
        </form>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#E8E4DC] bg-[#FAF8F5] flex justify-end gap-3.5 items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 font-sans font-bold text-xs hover:bg-gray-50 transition-colors select-none"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-lg bg-[#D4A853] text-[#FAF8F5] font-sans font-bold text-xs shadow-xs hover:opacity-95 transition-opacity flex items-center gap-2 select-none"
          >
            <Save size={15} />
            <span>Salvar Card</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
