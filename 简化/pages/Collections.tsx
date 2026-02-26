import React, { useState, useRef } from 'react';
import { ChevronLeft, Star, Heart, User, Check, Trash2, LayoutGrid, Trash } from 'lucide-react';
import { FeedItem } from '../types';
import VirtualRobot from '../components/VirtualRobot';

interface CollectionsProps {
  onBack: () => void;
  onNavigate: (page: string, id?: string) => void;
  feedItems: FeedItem[];
  collectedIds: string[];
  onToggleCollect: (id: string) => void;
}

const Collections: React.FC<CollectionsProps> = ({ 
    onBack, 
    onNavigate,
    feedItems, 
    collectedIds,
    onToggleCollect
}) => {
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggered = useRef(false);

  const handlePointerDown = (id: string) => {
      isLongPressTriggered.current = false;
      longPressTimer.current = setTimeout(() => {
          isLongPressTriggered.current = true;
          setIsSelectionMode(true);
          setSelectedIds(prev => prev.includes(id) ? prev : [...prev, id]);
          if (navigator.vibrate) navigator.vibrate(50);
      }, 500);
  };

  const handlePointerUp = () => {
      if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
      }
  };

  const handleCardClick = (item: any) => {
      if (isLongPressTriggered.current) return;
      if (isSelectionMode) {
          setSelectedIds(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id]);
      } else {
          setPreviewItem(item);
      }
  };

  const handleBackgroundClick = () => {
      if (isSelectionMode) {
          setIsSelectionMode(false);
          setSelectedIds([]);
      }
  };

  const handleBatchDelete = () => {
      if (selectedIds.length > 0) {
          selectedIds.forEach(id => onToggleCollect(id));
          setSelectedIds([]);
          setIsSelectionMode(false);
      }
  };

  const collectedTemplates = feedItems.filter(item => collectedIds.includes(item.id));

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] text-white relative select-none" onClick={handleBackgroundClick}>
      {/* 1. Header */}
      <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center">
            <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all">
                <ChevronLeft className="w-6 h-6 text-slate-400" />
            </button>
            <h1 className="text-xl font-black tracking-tight text-white uppercase ml-1">模版收藏</h1>
        </div>
        {isSelectionMode && (
            <button onClick={(e) => { e.stopPropagation(); setIsSelectionMode(false); setSelectedIds([]); }} className="text-[10px] font-[1000] text-slate-300 uppercase tracking-widest bg-white/10 px-4 py-2.5 rounded-full active:scale-95 transition-all">完成</button>
        )}
      </div>

      {/* 2. Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-32">
          {collectedTemplates.length > 0 ? (
             <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-300">
                 {collectedTemplates.map((item) => {
                     const isSelected = selectedIds.includes(item.id);
                     return (
                     <div key={item.id} onPointerDown={() => handlePointerDown(item.id)} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onClick={(e) => { e.stopPropagation(); handleCardClick(item); }} className={`relative aspect-[4/5] bg-white/5 backdrop-blur-xl rounded-[2.25rem] overflow-hidden group active:scale-95 transition-all border shadow-sm ${isSelected ? 'border-cyan-500 border-2 bg-cyan-500/10' : 'border-white/10 hover:border-white/20'}`}>
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="transform scale-[0.55] group-hover:scale-[0.58] transition-transform duration-[2s]"><VirtualRobot isDancing={false} showStatus={false} /></div></div>
                         {isSelectionMode && (<div className="absolute top-4 right-4 z-20 pointer-events-none"><div className={`w-6 h-6 rounded-full border flex items-center justify-center backdrop-blur shadow-xl ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'bg-black/40 border-white/30'}`}>{isSelected && <Check className="w-3.5 h-3.5 text-black" strokeWidth={4} />}</div></div>)}
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 p-5 flex flex-col justify-end text-left pointer-events-none">
                             <div className="flex items-center text-[9px] font-black text-white/50 mb-1.5 uppercase tracking-widest"><User className="w-2.5 h-2.5 mr-1.5" strokeWidth={3} /> {item.author}</div>
                             <h3 className="font-black text-sm text-slate-200 line-clamp-2 leading-tight">{item.title}</h3>
                             <div className="flex justify-between items-center mt-4 text-[9px] font-black text-slate-500">
                                 <span className="flex items-center"><Heart className={`w-3 h-3 mr-1 ${item.isLiked ? 'text-red-400 fill-current' : ''}`} strokeWidth={3} /> {item.likes}</span>
                                 <span className="bg-white/5 px-1.5 py-0.5 rounded">{item.duration}</span>
                             </div>
                         </div>
                     </div>
                 )})}
             </div>
          ) : (
              <div className="flex flex-col items-center justify-center py-32 text-slate-600">
                <Star className="w-20 h-20 mb-6 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest mb-6">收藏库为空</p>
                <button onClick={() => onNavigate('creative')} className="text-cyan-500 text-[11px] font-[1000] uppercase tracking-[0.2em] bg-cyan-900/10 px-8 py-3.5 rounded-full border border-cyan-500/30 active:scale-95 transition-all shadow-lg">去灵感中心逛逛</button>
              </div>
          )}
      </div>

      {/* 3. Batch Delete Bar */}
      {isSelectionMode && (
          <div className="absolute bottom-24 left-0 right-0 z-50 px-6 pb-6 animate-in slide-in-from-bottom-10 duration-300">
              <button onClick={handleBatchDelete} disabled={selectedIds.length === 0} className={`w-full py-4 rounded-full font-[1000] uppercase tracking-widest text-[11px] flex items-center justify-center space-x-2 transition-all shadow-2xl ${selectedIds.length > 0 ? 'bg-red-600 text-white shadow-red-900/50' : 'bg-[#1A1A1A] text-slate-500 border border-white/10'}`}>
                  <Trash className="w-4 h-4" />
                  <span>取消收藏 ({selectedIds.length})</span>
              </button>
          </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[60] bg-[#0C0C0C] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="absolute top-8 left-0 right-0 px-6 flex justify-between items-center z-20">
                <button onClick={() => setPreviewItem(null)} className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full active:scale-90 transition-all"><ChevronLeft className="w-6 h-6 text-white" /></button>
                <button onClick={() => { onToggleCollect(previewItem.id); setPreviewItem(null); }} className="px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-full active:scale-90 transition-all flex items-center text-[10px] font-black uppercase tracking-widest text-red-500"><Trash2 className="w-3.5 h-3.5 mr-1.5" /> 移除</button>
            </div>
            <div className="flex-1 relative flex items-center justify-center overflow-hidden"><div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div><VirtualRobot isDancing={true} showStatus={false} />
                <div className="absolute bottom-0 left-0 right-0 p-8 pb-32 bg-gradient-to-t from-black via-black/90 to-transparent">
                    <div className="flex items-center space-x-2 mb-3"><span className="bg-cyan-500 text-black px-2 py-0.5 rounded text-[9px] font-[1000] uppercase tracking-[0.1em]">官方素材</span><span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center">{previewItem.author}</span></div>
                    <h2 className="text-3xl font-[1000] uppercase text-white mb-3 tracking-tight leading-none">{previewItem.title}</h2>
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed tracking-wide mb-6">{previewItem.desc}</p>
                    <div className="flex items-center space-x-6 border-t border-white/10 pt-6">
                        <button onClick={() => onNavigate('studio', previewItem.id)} className="flex-1 py-4 bg-cyan-500 rounded-2xl text-black font-[1000] uppercase text-xs shadow-xl active:scale-95 transition-all">立即试用模版</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Collections;