import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Trash2, Check, Cpu, CheckCircle, Download, Star, Plus, Search, X, Zap, User, Clock, Trash, CloudDownload, CheckSquare, Square, Edit2, Calendar } from 'lucide-react';
import VirtualRobot from '../components/VirtualRobot';
import { Device } from '../types';

interface MyMotionsProps {
  onBack: () => void;
  onNavigate: (page: string, id?: string) => void;
  motionList: any[];
  onDelete: (id: string | string[]) => void;
  onUpdateMotion?: (id: string, updates: any) => void;
  devices: Device[];
  activeDeviceIds: string[];
  initialSelectedId?: string | null;
  onDownload?: (item: any) => void;
  onRename?: (id: string, newName: string) => void;
}

const MyMotions: React.FC<MyMotionsProps> = ({ 
    onBack, 
    onNavigate, 
    motionList = [], 
    onDelete, 
    onUpdateMotion,
    devices = [],
    activeDeviceIds = [],
    initialSelectedId,
    onDownload,
    onRename
}) => {
  const [activeTab, setActiveTab] = useState<'local' | 'online'>('local');
  const [activeTag, setActiveTag] = useState('推荐');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedMotion, setSelectedMotion] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [selectedDevicesForApply, setSelectedDevicesForApply] = useState<string[]>([]);
  
  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Rename State
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  // Downloading state
  const [downloadingItems, setDownloadingItems] = useState<Record<string, number>>({});
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressTriggered = useRef(false);

  const tags = ['推荐', '日常', '演讲', '二次元', '韩系', '机械舞', '战斗'];

  // Filter Logic
  const displayList = motionList.filter(m => {
      const typeMatch = activeTab === 'local' ? m.type === 'local' : m.type === 'online';
      const searchMatch = searchQuery ? m.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return typeMatch && searchMatch;
  });

  useEffect(() => {
    if (initialSelectedId) {
        const motion = motionList.find(m => m.id === initialSelectedId);
        if (motion) setSelectedMotion(motion);
    }
  }, [initialSelectedId, motionList]);

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
          setSelectedMotion(item);
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
          setToast('已批量删除动作');
          setTimeout(() => setToast(null), 2000);
      }
  };

  const handleDetailDelete = () => {
    if (selectedMotion) {
      onDelete(selectedMotion.id);
      setSelectedMotion(null);
    }
  };

  const handleConfirm = () => {
     setSelectedMotion(null);
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

  const submitRename = () => {
      if (renameTargetId && newName.trim() && onRename) {
          onRename(renameTargetId, newName);
          setShowRenameModal(false);
          setRenameTargetId(null);
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
        className="flex flex-col h-full bg-[#0C0C0C] text-white relative select-none"
        onClick={handleBackgroundClick}
    >
      {toast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[150] bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
              <Check className="w-4 h-4 mr-2 text-green-500" strokeWidth={3} />
              <span className="text-[11px] font-black uppercase tracking-widest">{toast}</span>
          </div>
      )}

      {/* 1. Header */}
      <div className="px-5 pt-8 pb-2 bg-[#0C0C0C] flex items-center justify-between sticky top-0 z-30" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1 flex items-center space-x-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all shrink-0">
                <ChevronLeft className="w-6 h-6 text-slate-400" />
            </button>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-full h-10 flex items-center px-4 transition-all focus-within:border-cyan-500/50 focus-within:bg-white/10">
                <Search className="w-4 h-4 text-slate-500 mr-2" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={activeTab === 'local' ? "搜索本地动作..." : "搜索官方素材..."}
                    className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder-slate-600 flex-1 min-w-0"
                />
            </div>
        </div>
        
        {isSelectionMode ? (
            <button 
                onClick={(e) => { e.stopPropagation(); setIsSelectionMode(false); setSelectedIds([]); }}
                className="ml-3 text-[10px] font-[1000] text-slate-300 uppercase tracking-widest bg-white/10 px-4 py-2.5 rounded-full active:scale-95 transition-all"
            >
                完成
            </button>
        ) : (
            <button 
                onClick={(e) => { e.stopPropagation(); onNavigate('mimic-flow'); }}
                className="ml-3 w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-black active:scale-95 transition-all shadow-lg shadow-cyan-900/20"
            >
                <Plus className="w-5 h-5" strokeWidth={3} />
            </button>
        )}
      </div>

      {/* 2. Tag Tabs (Only for Online) */}
      {activeTab === 'online' && (
        <div className="px-5 pb-2 bg-[#0C0C0C] sticky top-[60px] z-20 overflow-x-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="flex space-x-2">
                {tags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeTag === tag ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-transparent hover:bg-white/10 hover:text-slate-300'}`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
      )}

      {/* 3. Main Content List */}
      <div className="flex-1 overflow-y-auto p-5 pb-32 animate-in fade-in duration-300 no-scrollbar">
          <div className="grid grid-cols-2 gap-4">
              {displayList.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                  <div
                    key={item.id}
                    onPointerDown={() => handlePointerDown(item.id)}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={(e) => { e.stopPropagation(); handleCardClick(item); }}
                    className={`relative aspect-[4/5] bg-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden group active:scale-[0.98] transition-all border shadow-sm cursor-pointer select-none ${isSelected ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/5 hover:border-white/10'}`}
                  >
                      <div className="absolute inset-0 flex items-center justify-center transform scale-[0.45] translate-y-[-10px] group-hover:scale-[0.48] transition-transform duration-500">
                          <VirtualRobot isDancing={false} showStatus={false} />
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/90"></div>

                      <div className="absolute inset-0 p-5 flex flex-col justify-end text-left">
                           <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 items-end">
                               {isSelectionMode ? (
                                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center backdrop-blur shadow-xl ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'bg-black/40 border-white/30'}`}>
                                        {isSelected && <Check className="w-4 h-4 text-black" strokeWidth={4} />}
                                    </div>
                               ) : (
                                   activeTab === 'online' && (
                                        <div 
                                            onClick={(e) => handleDownloadClick(e, item)}
                                            className="w-8 h-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all overflow-hidden relative shadow-lg"
                                        >
                                            {downloadingItems[item.id] !== undefined ? (
                                                <>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-cyan-500/30 transition-all" style={{ height: `${downloadingItems[item.id]}%` }}></div>
                                                    <span className="text-[8px] font-bold z-10">{downloadingItems[item.id]}%</span>
                                                </>
                                            ) : downloadedIds.includes(item.id) ? (
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <Download className="w-4 h-4" strokeWidth={2.5} />
                                            )}
                                        </div>
                                   )
                               )}
                           </div>
                           
                           <div className="mb-1">
                               {activeTab === 'online' && (
                                   <div className="inline-flex items-center space-x-1 mb-1 opacity-70">
                                       <User className="w-2.5 h-2.5 text-cyan-400" />
                                       <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Official</span>
                                   </div>
                               )}
                               <h3 className="font-[1000] text-sm text-slate-100 truncate uppercase tracking-widest">{item.name}</h3>
                           </div>
                           
                           <div className="flex flex-col space-y-1">
                               <div className="flex items-center space-x-2 text-[9px] font-black text-slate-500 uppercase tracking-wider">
                                   <span className="bg-white/10 px-1.5 py-0.5 rounded text-slate-400">{item.format}</span>
                                   <span className="flex items-center"><Clock className="w-2.5 h-2.5 mr-1" /> {item.duration}</span>
                               </div>
                           </div>
                      </div>
                  </div>
                  );
              })}
          </div>
      </div>

      {/* 4. Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#0C0C0C]/90 backdrop-blur-xl border-t border-white/5 pb-safe z-40" onClick={(e) => e.stopPropagation()}>
          {isSelectionMode ? (
              <div className="h-20 px-6 flex items-center justify-center animate-in slide-in-from-bottom-full duration-300">
                  <button 
                    onClick={handleBatchDelete}
                    disabled={selectedIds.length === 0}
                    className={`w-full py-4 rounded-full font-[1000] uppercase tracking-widest text-[11px] flex items-center justify-center space-x-2 transition-all active:scale-[0.98] ${selectedIds.length > 0 ? 'bg-red-600 text-white shadow-xl shadow-red-900/30' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
                  >
                      <Trash className="w-4 h-4" />
                      <span>删除 ({selectedIds.length})</span>
                  </button>
              </div>
          ) : (
              <div className="flex justify-around items-center h-20 px-2 animate-in fade-in duration-300">
                  <button 
                    onClick={() => { setActiveTab('local'); setIsSelectionMode(false); }}
                    className={`flex-1 flex flex-col items-center space-y-1.5 transition-all ${activeTab === 'local' ? 'text-cyan-500' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                      <Zap className={`w-5 h-5 ${activeTab === 'local' ? 'fill-current' : ''}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">我的动作</span>
                  </button>
                  <div className="w-px h-8 bg-white/5"></div>
                  <button 
                    onClick={() => { setActiveTab('online'); setIsSelectionMode(false); }}
                    className={`flex-1 flex flex-col items-center space-y-1.5 transition-all ${activeTab === 'online' ? 'text-cyan-500' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                      <CloudDownload className={`w-5 h-5 ${activeTab === 'online' ? 'stroke-[3px]' : ''}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">官方素材</span>
                  </button>
              </div>
          )}
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-6 animate-in fade-in duration-200">
              <div className="bg-[#1A1A1A] border border-white/10 backdrop-blur-2xl w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                  <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">重命名</h3>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="输入新名称"
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest mb-8 outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-slate-700 transition-all"
                  />
                  <div className="flex gap-4">
                      <button onClick={() => setShowRenameModal(false)} className="flex-1 py-4 bg-white/5 rounded-full text-slate-500 font-black uppercase text-[10px] active:scale-95 transition-all border border-white/5">取消</button>
                      <button onClick={submitRename} className="flex-1 py-4 bg-cyan-500 rounded-full text-black font-[1000] uppercase text-[10px] active:scale-95 transition-all shadow-lg shadow-cyan-900/40">确认</button>
                  </div>
              </div>
          </div>
      )}

      {/* Detail Modal */}
      {selectedMotion && (
        <div className="fixed inset-0 z-50 bg-[#0C0C0C] flex flex-col text-white animate-in slide-in-from-right duration-300">
            <div className="absolute top-8 left-0 right-0 px-6 flex justify-between items-center z-20">
                <button onClick={() => setSelectedMotion(null)} className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full active:scale-90 transition-all"><ChevronLeft className="w-6 h-6 text-white" /></button>
                <div className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">{selectedMotion.name}</div>
                {selectedMotion.type === 'local' ? (
                    <button onClick={() => setShowDeviceSelector(true)} className="px-4 py-2 rounded-full text-[10px] font-[1000] uppercase tracking-widest flex items-center bg-cyan-500 text-black active:scale-95 shadow-lg shadow-cyan-900/40"><Cpu className="w-3.5 h-3.5 mr-1.5" strokeWidth={3} /> 部署</button>
                ) : <div className="w-16"></div>}
            </div>
            <div className="flex-1 relative flex items-center justify-center overflow-hidden"><div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div><VirtualRobot isDancing={true} showStatus={false} /></div>
            <div className="h-32 bg-[#0C0C0C] border-t border-white/5 flex flex-col justify-end pb-safe px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-around h-full pb-6">
                    {selectedMotion.type === 'local' ? (
                        <>
                            <button onClick={handleDetailDelete} className="flex flex-col items-center space-y-1 group mr-4"><Trash2 className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Delete</span></button>
                            <button onClick={() => { setRenameTargetId(selectedMotion.id); setNewName(selectedMotion.name); setShowRenameModal(true); }} className="flex flex-col items-center space-y-1 group mr-4"><Edit2 className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Rename</span></button>
                            <button onClick={handleConfirm} className="flex-1 px-10 py-4 bg-cyan-500 rounded-2xl font-[1000] uppercase tracking-widest text-[11px] text-black shadow-xl shadow-cyan-900/40 active:scale-95 transition-all">确认</button>
                        </>
                    ) : (
                        <>
                            <button onClick={(e) => handleDownloadClick(e, selectedMotion)} className="flex flex-col items-center space-y-1 group active:scale-95 transition-all"><div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500"><Download className="w-6 h-6" /></div><span className="text-[9px] font-black uppercase tracking-widest text-slate-600">下载</span></button>
                            <div className="w-px h-10 bg-white/10 mx-2"></div>
                            <button onClick={() => setSelectedMotion(null)} className="px-12 py-4 bg-white/10 rounded-2xl font-[1000] uppercase tracking-widest text-[11px] text-white border border-white/10 active:scale-95 transition-all">关闭预览</button>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MyMotions;