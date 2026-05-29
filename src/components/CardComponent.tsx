import { motion } from 'motion/react';
import { 
  Eye, 
  Lightbulb, 
  TrendingUp, 
  BookOpen, 
  Quote, 
  Image as ImageIcon, 
  Sparkles, 
  Paperclip,
  Share2
} from 'lucide-react';
import { Card } from '../types';

interface CardComponentProps {
  card: Card;
  onClick: (card: Card) => void;
  key?: string;
}

export default function CardComponent({ card, onClick }: CardComponentProps) {
  // Styles depending on Card Type
  const renderCardContent = () => {
    switch (card.type) {
      case 'observation':
        return (
          <div className="relative p-5 flex flex-col h-full bg-white border border-[#E8E4DC] rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300">
            {/* Peach colored left border decoration */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#E58F65]" />
            <div className="flex items-center gap-2 mb-3">
              <Eye size={15} className="text-[#E58F65]" />
              <span className="text-[#E58F65] font-sans font-bold text-[10px] tracking-wider uppercase">
                Observação
              </span>
            </div>
            <h3 className="font-sans font-semibold text-[16px] text-gray-900 leading-snug mb-2 border-b border-[#FAF8F5] pb-2">
              {card.title}
            </h3>
            <p className="font-sans text-[13px] text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-4">
              {card.content}
            </p>
            <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-[#FAF8F5]">
              {card.tags.map((tag) => (
                <span key={tag} className="text-gray-400 font-sans font-semibold text-[10px] uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );

      case 'insight':
        return (
          <div className="relative p-5 flex flex-col h-full bg-[#F4F1EA] rounded-[10px] border border-[#E8E4DC]/50 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* Top-right decorative background glow */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#E2D5C3] rounded-full opacity-35 blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-3 z-10">
              <span className="bg-white text-[#176970] font-sans font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm border border-[#E8E4DC]/30">
                Insight
              </span>
              <Lightbulb size={16} className="text-[#7A7670]" />
            </div>
            
            <h3 className="font-display font-medium text-[18px] text-gray-900 leading-snug mb-2 z-10">
              {card.title}
            </h3>
            <p className="font-sans text-[13.5px] text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-4 z-10">
              {card.content}
            </p>
            
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2 z-10">
              {card.tags.map((tag) => (
                <span key={tag} className="bg-white/70 text-gray-700 font-sans font-semibold text-[10px] px-2 py-0.5 rounded-sm shadow-2xs border border-[#E8E4DC]/10">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );

      case 'reference':
        return (
          <div className="relative p-5 flex flex-col h-full bg-white border border-[#E8E4DC] rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300">
            {/* Blue-accent top bar */}
            <div className="absolute left-6 top-0 w-10 h-1 bg-[#4A6FA5]" />
            
            <div className="flex justify-between items-start mb-3 mt-1">
              <span className="text-[#4A6FA5] font-sans font-bold text-[10px] tracking-wider uppercase">
                Referência
              </span>
              <BookOpen size={15} className="text-[#4A6FA5]/70" />
            </div>
            
            <h3 className="font-sans font-bold text-[15px] text-gray-900 leading-snug mb-2 line-clamp-2">
              {card.title}
            </h3>
            <p className="font-sans text-[13px] text-gray-600 leading-relaxed mb-4 flex-1 line-clamp-4">
              {card.content}
            </p>
            
            <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-[#FAF8F5]">
              <div className="flex flex-wrap gap-1">
                {card.tags.map((tag) => (
                  <span key={tag} className="bg-[#FAF8F5] text-gray-500 font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full border border-[#E8E4DC]/40">
                    #{tag}
                  </span>
                ))}
              </div>
              {card.source && (
                <div className="inline-flex items-center gap-1 self-start text-[#4A6FA5] bg-[#4A6FA5]/5 border border-[#4A6FA5]/20 px-2 py-0.5 rounded-md text-[10.5px] font-sans">
                  <Paperclip size={10} />
                  <span className="font-medium truncate max-w-[120px]">{card.source}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'trend':
        return (
          <div className="relative flex flex-col h-full bg-white border border-[#E8E4DC] rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* Pink colored header strip */}
            <div className="bg-[#F8E5EE] px-4 py-2 flex items-center justify-between border-b border-[#E8E4DC]/40">
              <span className="text-[#A34371] font-sans font-bold text-[10px] tracking-wider uppercase">
                Tendência
              </span>
              <TrendingUp size={15} className="text-[#A34371]" />
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-sans font-bold text-[15px] text-gray-900 leading-snug mb-2 line-clamp-2">
                {card.title}
              </h3>
              <p className="font-sans text-[13px] text-[#555555] leading-relaxed mb-4 flex-1 line-clamp-4">
                {card.content}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-[#FAF8F5]">
                {card.tags.map((tag) => (
                  <span key={tag} className="bg-[#FDF2F7] text-[#A34371] font-sans font-semibold text-[10px] px-2 py-0.5 rounded-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'concept':
        return (
          <div className="relative p-5 flex flex-col h-full bg-[#176970] text-[#e9fdff] rounded-[10px] shadow-[0_2px_8px_rgba(23,105,112,0.15)] hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Purple decorative circular shape in background */}
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#69587e] rounded-full opacity-25 blur-2xl pointer-events-none" />
            
            <div className="mb-3 border-b border-white/20 pb-1.5 self-start shrink-0">
              <span className="text-[#93dbe3] font-sans font-semibold text-[10px] tracking-widest uppercase">
                Conceito
              </span>
            </div>
            
            <h3 className="font-display font-bold text-[22px] leading-tight text-white mb-2">
              {card.title}
            </h3>
            <p className="font-sans text-[13.5px] text-teal-100/90 leading-relaxed mb-4 flex-1 line-clamp-3">
              {card.content}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-white/10 z-10">
              {card.tags.map((tag) => (
                <span key={tag} className="text-white/80 font-sans font-semibold text-[10px] tracking-wider uppercase bg-white/10 px-2 py-0.5 rounded-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );

      case 'sketch':
        return (
          <div className="relative p-5 flex flex-col h-full bg-[#FFFEF5] border-2 border-dashed border-[#D4C9A8] rounded-[10px] shadow-none hover:shadow-xs transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-[#F5F0DC] text-[#9E8A50] font-sans font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-sm">
                Rascunho
              </span>
              <Sparkles size={14} className="text-[#9E8A50]" />
            </div>
            
            {/* Interactive/Visual connection graph representation */}
            <div className="relative h-[115px] w-full flex items-center justify-center my-1 select-none overflow-hidden bg-white/25 border border-[#D4C9A8]/20 rounded-md">
              {/* Lines representation */}
              <div className="absolute w-[85px] h-[85px] border border-[#D4C9A8]/45 rounded-full opacity-35" />
              <div className="absolute w-[120px] h-[1px] bg-[#D4C9A8]/30 rotate-[35deg]" />
              <div className="absolute w-[120px] h-[1px] bg-[#D4C9A8]/30 -rotate-[35deg]" />
              
              {/* Central node */}
              <div className="z-10 bg-[#1A1A1A] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-[0_2px_5px_rgba(0,0,0,0.15)]">
                repertório vivo
              </div>
              
              {/* Branch nodes */}
              <div className="absolute top-2 left-3 bg-[#FDF3DC] text-[#B8892A] text-[9px] font-sans font-bold px-2 py-0.5 rounded-full shadow-xs border border-[#B8892A]/10">
                capturar
              </div>
              <div className="absolute top-2 right-3 bg-[#F0EDE8] text-[#7A7670] text-[9px] font-sans font-bold px-2 py-0.5 rounded-full shadow-xs border border-[#7A7670]/10">
                conectar
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#E8F0ED] text-[#4A7A6A] text-[9px] font-sans font-bold px-2 py-0.5 rounded-full shadow-xs border border-[#4A7A6A]/10">
                transformar
              </div>
            </div>
            
            <p className="font-handwriting italic text-[14px] text-[#8C8675] text-center my-3 leading-relaxed underline decoration-[#D4C9A8]/40 underline-offset-4">
              "ideias não precisam ser lineares"
            </p>
            
            <div className="flex flex-wrap gap-2.5 border-t border-[#D4C9A8]/20 pt-2.5 mt-auto">
              {card.tags.map((tag) => (
                <span key={tag} className="text-[#9E8A50] font-sans font-bold text-[10px] uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className="relative p-5 flex flex-col h-full bg-[#FDFAF4] border border-[#E8E4DC] border-l-4 border-l-[#D4A853] rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-2.5">
              <span className="text-[#7A7670] font-sans font-bold text-[10px] tracking-wider uppercase">
                Citação
              </span>
              <Quote size={15} className="text-[#D4A853]/60" />
            </div>
            <p className="font-display italic text-[16px] text-gray-800 leading-relaxed mb-2 flex-1">
              "{card.content}"
            </p>
            {card.author && (
              <p className="font-sans text-[11.5px] text-[#9E9A94] uppercase tracking-wider mb-3">
                — {card.author}
              </p>
            )}
            
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-[#FAF8F5]">
              {card.tags.map((tag) => (
                <span key={tag} className="bg-[#FAF8F5] text-gray-500 font-sans font-medium text-[10.5px] px-2 py-0.5 rounded-full border border-[#E8E4DC]/40">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="relative flex flex-col h-full bg-white border border-[#E8E4DC] rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 overflow-hidden group/img">
            <div className="relative overflow-hidden aspect-video bg-gray-50 max-h-[160px]">
              {card.imageUrl ? (
                <img 
                  src={card.imageUrl} 
                  alt={card.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#E1E3DF]/55 text-gray-400">
                  <ImageIcon size={28} className="stroke-[1.25]" />
                  <span className="text-[10px] mt-1 tracking-wider uppercase font-sans">Sem imagem</span>
                </div>
              )}
              {/* Badge overlay */}
              <div className="absolute top-2 left-2">
                <span className="bg-black/70 backdrop-blur-xs text-white font-sans font-semibold text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-xs">
                  Mural
                </span>
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h4 className="font-sans font-bold text-[14.5px] text-gray-950 leading-tight mb-1">
                {card.title}
              </h4>
              <p className="font-sans text-[12px] text-[#7A7670] leading-snug mb-3 flex-1 line-clamp-2">
                {card.content}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-[#FAF8F5]">
                {card.tags.map((tag) => (
                  <span key={tag} className="text-gray-500 font-sans font-semibold text-[10px] uppercase">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        // Generic Fallback
        return (
          <div className="p-5 flex flex-col h-full bg-white border border-[#E8E4DC] rounded-[10px] shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-sans font-bold text-[15px] mb-2">{card.title || 'Referência'}</h3>
            <p className="font-sans text-[13px] text-gray-600 mb-4 fill-1">{card.content}</p>
            <div className="flex flex-wrap gap-1 mt-auto">
              {card.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[11px]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      layoutId={`card-${card.id}`}
      whileHover={{ y: -3 }}
      viewport={{ once: true }}
      className="cursor-pointer break-inside-avoid w-full card-item h-auto"
      onClick={() => onClick(card)}
    >
      {renderCardContent()}
    </motion.div>
  );
}
