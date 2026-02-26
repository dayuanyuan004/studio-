import React, { useState, useRef } from 'react';
import { ChevronLeft, Upload, Play, Pause, Trash2, CheckCircle, Search, X, Download, Star, Check, Zap, CloudDownload, User, Clock, Trash, Music, Edit2 } from 'lucide-react';

interface MyMusicProps {
  onBack: () => void;
  musicList: any[];
  onDelete: (ids: string[]) => void;
  onDownload?: (item: any) => void;
  onRename?: (id: string, newName: string) => void;
}

const MyMusic: React.FC<MyMusicProps> = ({ onBack, musicList = [], onDelete, onDownload, onRename }) => {
  const [activeTab, setActiveTab] = useState<'local' | 'online'>('local');
  const [activeTag, setActiveTag] = useState('推荐');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [downloadingItems, setDownloadingItems] = useState<Record<string, number>>({});
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggered = useRef(false);

  const tags = ['推荐', '流行', '电子', '古典', '摇滚', '氛围', '爵士'];

  const displayList = musicList.filter(item => {
      const typeMatch = activeTab === 'local' ? item.type === 'local' : item.type === 'online';
      const searchMatch = searchQuery ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return typeMatch && searchMatch;
  });

  const handleBatchDelete = () => {
    if (selectedIds.length > 0) {
      onDelete(selectedIds);
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  const toggleSelection = (id: string) => {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleDownloadClick = (e: React.MouseEvent, item: any) => {
      e.stopPropagation();
      if (downloadingItems[item.id] !== undefined || downloadedIds.includes(item.id)) return;
      if (!onDownload) return;
      setDownloadingItems(prev => ({ ...prev, [item.id]: 0 }));
      const interval = setInterval(() => {
          setDownloadingItems(prev => {
              const currentProgress = prev[item.id];
              if (currentProgress >= 100) {
                  clearInterval(interval);
                  onDownload(item);
                  setDownloadedIds(prevIds => [...prevIds, item.id]);
                  setTimeout(() => {
                      setDownloadingItems(current => {
                          const newState = { ...current };
                          delete newState[item.id];
                          return newState;
                      });
                  }, 500);
                  return prev;
              }
              return { ...prev, [item.id]: currentProgress + 10 };
          });
      }, 100);
  };

  const openRenameModal = (e: React.MouseEvent, item: any) => {
      e.stopPropagation();
      setRenameTargetId(item.id);
      setNewName(item.title);
      setShowRenameModal(true);
  };

  const submitRename = () => {
      if (renameTargetId && newName.trim() && onRename) {
          onRename(renameTargetId, newName);
          setShowRenameModal(false);
          setRenameTargetId(null);
      }
  };

  const handlePointerDown = (id: string) => {
      if (activeTab === 'online') return; 
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
      if (isSelectionMode && activeTab === 'local') {
          toggleSelection(item.id);
      } else {
          setPlayingId(prev => prev === item.id ? null : item.id);
      }
  };

  const handleBackgroundClick = () => {
      if (isSelectionMode) {
          setIsSelectionMode(false);
          setSelectedIds([]);
      }
  };

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] text-white relative select-none" onClick={handleBackgroundClick}>
      <div className="px-5 pt-8 pb-2 bg-[#0C0C0C] flex items-center justify-between sticky top-0 z-30" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1 flex items-center space-x-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all shrink-0"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-full h-10 flex items-center px-4 focus-within:border-cyan-500/50">
                <Search className="w-4 h-4 text-slate-500 mr-2" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={activeTab === 'local' ? "搜索本地音乐..." : "搜索官方音乐..."} className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder-slate-600 flex-1 min-w-0" />
            </div>
        </div>
        {isSelectionMode ? (
            <button onClick={(e) => { e.stopPropagation(); setIsSelectionMode(false); setSelectedIds([]); }} className="ml-3 text-[10px] font-[1000] text-slate-300 uppercase tracking-widest bg-white/10 px-4 py-2.5 rounded-full active:scale-95 transition-all">完成</button>
        ) : (
            activeTab === 'local' && (<button onClick={(e) => { e.stopPropagation(); }} className="ml-3 w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black active:scale-95 transition-all shadow-lg shadow-cyan-900/20"><Upload className="w-5 h-5" strokeWidth={2.5} /></button>)
        )}
      </div>

      {activeTab === 'online' && (
        <div className="px-5 pb-2 bg-[#0C0C0C] sticky top-[60px] z-20 overflow-x-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex space-x-2">
                {tags.map(tag => (
                    <button key={tag} onClick={() => setActiveTag(tag)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeTag === tag ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-transparent'}`}>{tag}</button>
                ))}
            </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5 pb-32 animate-in fade-in duration-300">
          <div className="space-y-3">
              {displayList.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  const isPlaying = playingId === item.id;
                  return (
                  <div key={item.id} onPointerDown={() => handlePointerDown(item.id)} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} onClick={(e) => { e.stopPropagation(); handleCardClick(item); }} className={`w-full bg-white/5 backdrop-blur-xl rounded-2xl p-3 flex items-center justify-between border transition-all active:scale-[0.99] group ${isSelected ? 'border-cyan-500 bg-cyan-500/10' : (isPlaying ? 'border-purple-500/50 bg-purple-900/10' : 'border-white/5 hover:border-white/20')}`}>
                      <div className="flex items-center gap-4 overflow-hidden flex-1">
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative bg-black/20">
                              <img src={`https://picsum.photos/seed/${item.id}music/200/200`} alt={item.title} className={`w-full h-full object-cover transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />
                              {isPlaying && (<div className="absolute inset-0 bg-black/40 flex items-center justify-center"><div className="flex space-x-0.5 items-end h-3"><div className="w-1 bg-purple-400 animate-[bounce_0.5s_infinite]"></div><div className="w-1 bg-purple-400 animate-[bounce_0.7s_infinite]"></div><div className="w-1 bg-purple-400 animate-[bounce_0.6s_infinite]"></div></div></div>)}
                          </div>
                          <div className="min-w-0 flex-1 text-left"><h3 className={`font-bold text-sm truncate ${isPlaying ? 'text-purple-400' : 'text-slate-200'}`}>{item.title}</h3><div className="flex items-center mt-0.5"><span className="text-xs text-slate-500 truncate max-w-[100px]">{item.author}</span>{item.type === 'online' && <span className="ml-2 px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-400 border border-white/5">Official</span>}</div></div>
                      </div>
                      <div className="flex items-center gap-3 pl-3 shrink-0">
                           {!isSelectionMode && (
                               activeTab === 'local' ? (
                                    <button onClick={(e) => openRenameModal(e, item)} className="p-2 text-slate-600 hover:text-white rounded-full hover:bg-white/10"><Edit2 className="w-4 h-4" /></button>
                               ) : (
                                    <button onClick={(e) => handleDownloadClick(e, item)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-white transition-all relative">
                                        {downloadingItems[item.id] !== undefined ? (<span className="text-[8px] font-bold text-cyan-400">{downloadingItems[item.id]}%</span>) : downloadedIds.includes(item.id) ? (<CheckCircle className="w-4 h-4 text-green-400" />) : (<Download className="w-4 h-4" />)}
                                    </button>
                               )
                           )}
                           <span className="text-xs font-mono text-slate-600 hidden sm:block">{item.duration}</span>
                           {isSelectionMode ? (
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'bg-transparent border-white/30'}`}>{isSelected && <Check className="w-3.5 h-3.5 text-black" strokeWidth={4} />}</div>
                           ) : (
                               <button onClick={(e) => { e.stopPropagation(); setPlayingId(prev => prev === item.id ? null : item.id); }} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-90 shadow-lg ${isPlaying ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-white'}`}>{isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}</button>
                           )}
                      </div>
                  </div>
                  );
              })}
          </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#0C0C0C]/90 backdrop-blur-xl border-t border-white/5 pb-safe z-40" onClick={(e) => e.stopPropagation()}>
          {isSelectionMode ? (
              <div className="h-20 px-6 flex items-center justify-center animate-in slide-in-from-bottom-full duration-300"><button onClick={handleBatchDelete} disabled={selectedIds.length === 0} className={`w-full py-4 rounded-full font-[1000] uppercase tracking-widest text-[11px] flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${selectedIds.length > 0 ? 'bg-red-600 text-white shadow-xl shadow-red-900/30' : 'bg-white/10 text-slate-500'}`}><Trash className="w-4 h-4" /><span>删除 ({selectedIds.length})</span></button></div>
          ) : (
              <div className="flex justify-around items-center h-20 px-2 animate-in fade-in duration-300">
                  <button onClick={() => { setActiveTab('local'); setIsSelectionMode(false); }} className={`flex-1 flex flex-col items-center space-y-1.5 transition-all ${activeTab === 'local' ? 'text-cyan-500' : 'text-slate-600'}`}><Zap className={`w-5 h-5 ${activeTab === 'local' ? 'fill-current' : ''}`} /><span className="text-[10px] font-black uppercase tracking-widest">我的音乐</span></button>
                  <div className="w-px h-8 bg-white/5"></div>
                  <button onClick={() => { setActiveTab('online'); setIsSelectionMode(false); }} className={`flex-1 flex flex-col items-center space-y-1.5 transition-all ${activeTab === 'online' ? 'text-cyan-500' : 'text-slate-600'}`}><CloudDownload className={`w-5 h-5 ${activeTab === 'online' ? 'stroke-[3px]' : ''}`} /><span className="text-[10px] font-black uppercase tracking-widest">官方素材</span></button>
              </div>
          )}
      </div>

      {showRenameModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-6 animate-in fade-in duration-200"><div className="bg-[#1A1A1A] border border-white/10 backdrop-blur-2xl w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl text-center"><h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">重命名</h3><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="输入新名称" autoFocus className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black uppercase text-white outline-none focus:ring-2 focus:ring-cyan-500/50" /><div className="flex gap-4 mt-8"><button onClick={() => setShowRenameModal(false)} className="flex-1 py-4 bg-white/5 rounded-full text-slate-500 font-black uppercase text-[10px]">取消</button><button onClick={submitRename} className="flex-1 py-4 bg-cyan-500 rounded-full text-black font-[1000] uppercase text-[10px]">确认</button></div></div></div>
      )}
    </div>
  );
};

export default MyMusic;