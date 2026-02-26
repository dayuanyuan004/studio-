
import React, { useState, useRef } from 'react';
import { Search, Play, Trash2, X, Send, ChevronLeft, Cpu, CheckCircle, Check, Trash } from 'lucide-react';
import { Work, WorkStatus } from '../types';
import VirtualRobot from '../components/VirtualRobot';

interface WorksProps {
    onBack?: () => void;
    onNavigate?: (page: string, id?: string) => void;
    works: Work[];
    viewMode: 'all' | 'published'; // Changed 'draft' to 'all' to show the newly published item AND the copy
    onDelete: (ids: string | string[]) => void;
    onToggleDeploy: (id: string) => void;
}

const Works: React.FC<WorksProps> = ({ onBack, onNavigate, works, viewMode, onDelete, onToggleDeploy }) => {
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Long press refs
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggered = useRef(false);

  const filteredWorks = works.filter(w => {
      // If viewMode is 'published', strictly show only published.
      // If viewMode is 'all', show everything (Drafts AND Published).
      const statusMatch = viewMode === 'published' 
          ? w.status === WorkStatus.Completed 
          : true; 
          
      const searchMatch = searchQuery 
          ? w.title.toLowerCase().includes(searchQuery.toLowerCase()) 
          : true;
      return statusMatch && searchMatch;
  });

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

  const handleCardClick = (work: Work) => {
      if (isLongPressTriggered.current) return;

      if (isSelectionMode) {
          toggleSelection(work.id);
      } else {
          if (onNavigate) onNavigate('work-preview', work.id);
      }
  };

  const toggleSelection = (id: string) => {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBatchDelete = () => {
      if (selectedIds.length > 0) {
          onDelete(selectedIds);
          setSelectedIds([]);
          setIsSelectionMode(false);
      }
  };

  const handleBackgroundClick = () => {
      if (isSelectionMode) {
          setIsSelectionMode(false);
          setSelectedIds([]);
      }
  };

  return (
    <div 
        className="flex-1 bg-[#0C0C0C] flex flex-col h-full overflow-hidden text-white relative select-none"
        onClick={handleBackgroundClick}
    >
      {/* Header */}
      <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-10 shadow-lg" onClick={(e) => e.stopPropagation()}>
         {isSearching ? (
             <div className="flex-1 flex items-center bg-white/5 border border-cyan-500 rounded-full px-4 py-2 animate-in fade-in slide-in-from-right-2 duration-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                 <Search className="w-4 h-4 text-cyan-400 mr-2" />
                 <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索作品..."
                    autoFocus
                    className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 flex-1 min-w-0"
                 />
                 <button onClick={() => { setSearchQuery(''); setIsSearching(false); }} className="p-1 -mr-2 text-slate-500 hover:text-white">
                     <X className="w-4 h-4" />
                 </button>
             </div>
         ) : (
             <>
                <div className="flex items-center">
                    <button 
                        onClick={onBack || (() => onNavigate && onNavigate(viewMode === 'published' ? 'profile' : 'dashboard'))} 
                        className="p-1 -ml-2 mr-2 rounded-full hover:bg-white/5 active:scale-95 transition-all"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-400" />
                    </button>
                    <h1 className="text-xl font-black tracking-tight text-white uppercase">{viewMode === 'all' ? '本地作品' : '发布的作品'}</h1>
                </div>
                
                {isSelectionMode ? (
                    <button 
                        onClick={() => { setIsSelectionMode(false); setSelectedIds([]); }}
                        className="text-[10px] font-[1000] text-slate-300 uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full active:scale-95 transition-all"
                    >
                        完成
                    </button>
                ) : (
                    <button onClick={() => setIsSearching(true)} className="p-2 bg-white/5 rounded-full border border-white/10 text-slate-400 active:scale-95 transition-all">
                        <Search className="w-5 h-5" />
                    </button>
                )}
             </>
         )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32">
         <div className="space-y-4">
             {filteredWorks.map((work) => {
                 const isSelected = selectedIds.includes(work.id);
                 return (
                 <div 
                    key={work.id} 
                    onPointerDown={() => handlePointerDown(work.id)}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={(e) => { e.stopPropagation(); handleCardClick(work); }}
                    className={`w-full text-left bg-white/5 backdrop-blur-xl rounded-[2rem] p-3 border flex space-x-3 active:scale-[0.98] transition-all group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer ${isSelected ? 'border-cyan-500 border-2 bg-cyan-500/5' : 'border-white/10 hover:border-cyan-500/30'}`}
                 >
                     <div className="w-24 h-24 bg-black/40 rounded-[1.5rem] overflow-hidden shrink-0 relative flex items-center justify-center border border-white/5 group-hover:border-cyan-500/50">
                         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                         <div className="transform scale-[0.35] group-hover:scale-[0.38] transition-transform duration-500">
                             <VirtualRobot isDancing={true} playbackMode="loop" showStatus={false} /> 
                         </div>
                         
                         {/* Selection Indicator Overlay */}
                         {isSelectionMode ? (
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                                 <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'bg-black/40 border-white/30'}`}>
                                     {isSelected && <Check className="w-5 h-5 text-black" strokeWidth={3} />}
                                 </div>
                             </div>
                         ) : (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Play className="w-8 h-8 text-cyan-400 fill-current" />
                             </div>
                         )}
                         
                         {!isSelectionMode && (
                             <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black border border-white/10 backdrop-blur-sm">{work.duration}</span>
                         )}
                     </div>
                     
                     <div className="flex-1 flex flex-col justify-between py-1 pr-1 min-w-0">
                         <div className="min-w-0">
                             <div className="flex justify-between items-start">
                                <h3 className="font-bold text-slate-200 text-sm truncate group-hover:text-white transition-colors tracking-wide">{work.title}</h3>
                             </div>
                             <p className="text-[10px] font-black text-slate-500 uppercase mt-0.5">
                                 {viewMode === 'all' ? `创建于 ${work.createTime || work.lastModified}` : `发布于 ${work.publishTime || work.lastModified}`}
                             </p>
                         </div>
                         
                         <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-2">
                                 {/* Deployed Tag - Cyan for Tech/Active */}
                                 <div 
                                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${work.isDeployed ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/10 opacity-60'}`}
                                 >
                                     {work.isDeployed ? <CheckCircle className="w-2.5 h-2.5" /> : <Cpu className="w-2.5 h-2.5" />}
                                     <span>{work.isDeployed ? '已部署' : '未部署'}</span>
                                 </div>

                                 {/* Publish Status Tag - Green for Success/Completed */}
                                 <div 
                                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${work.status === WorkStatus.Draft ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}
                                 >
                                     {work.status === WorkStatus.Draft ? <Send className="w-2.5 h-2.5" /> : <Check className="w-2.5 h-2.5" />}
                                     <span>{work.status === WorkStatus.Draft ? '未发布' : '已发布'}</span>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             )})}
         </div>
      </div>

      {/* Bulk Action Bar */}
      {isSelectionMode && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#0C0C0C]/90 backdrop-blur-xl border-t border-white/5 pb-safe z-40 transition-all animate-in slide-in-from-bottom-full duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="h-20 px-6 flex items-center justify-center">
                  <button 
                    onClick={handleBatchDelete}
                    disabled={selectedIds.length === 0}
                    className={`w-full py-4 rounded-full font-[1000] uppercase tracking-widest text-[11px] flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${selectedIds.length > 0 ? 'bg-red-600 text-white shadow-xl shadow-red-900/30' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
                  >
                      <Trash className="w-4 h-4" />
                      <span>删除 ({selectedIds.length})</span>
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default Works;
