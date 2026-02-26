import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, Play, Pause, Send, 
  Layers, Smile, Music, Move, Undo, Redo, Save, X, Check, Mic, Plus, Trash2, Repeat, Cpu, CheckSquare, Square, Scissors, AlertTriangle, Sparkles, Loader2, Volume2, User
} from 'lucide-react';
import { TimelineClip, TrackType, Device, DeploymentStatus } from '../types';
import VirtualRobot from './VirtualRobot';

interface StudioProps {
  onBack: () => void;
  initialTab?: TabType;
  workId?: string;
  workTitle?: string;
  initialClips?: TimelineClip[];
  availableMotions?: any[];
  availableMusic?: any[];
  availableVoices?: any[];
  onSave: (id: string | null, clips: TimelineClip[], title?: string) => void;
  activeDeviceCount: number;
  availableDevices?: Device[];
  onDeploy?: (deviceIds: string[]) => void;
  isTemplate?: boolean;
  deviceDeployments?: Record<string, DeploymentStatus>; 
}

type StudioMode = 'library' | 'editor';
type TabType = 'motion' | 'music' | 'voice';

// Default clips for Templates or existing Works if they arrive empty
const DEFAULT_TEMPLATE_CLIPS: TimelineClip[] = [
    { id: 'def-m1', trackId: 'motion', startTime: 0, duration: 4, name: '基础待机', color: 'bg-blue-500' },
    { id: 'def-a1', trackId: 'audio', startTime: 0, duration: 10, name: '默认环境音', color: 'bg-purple-500' }
];

const Studio: React.FC<StudioProps> = ({ 
    onBack, 
    initialTab, 
    workId,
    workTitle,
    initialClips = [],
    availableMotions = [],
    availableMusic = [],
    availableVoices = [],
    onSave,
    activeDeviceCount,
    availableDevices = [],
    onDeploy,
    isTemplate = false,
    deviceDeployments = {}
}) => {
  const [mode, setMode] = useState<StudioMode>(workId ? 'editor' : (initialTab ? 'library' : 'editor'));
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'motion');
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [replacingClipId, setReplacingClipId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 30; 
  const [showSaveModal, setShowSaveModal] = useState(false); 
  const [newWorkTitle, setNewWorkTitle] = useState(''); 
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [selectedDevicesForApply, setSelectedDevicesForApply] = useState<string[]>([]);
  const [history, setHistory] = useState<TimelineClip[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Drag State
  const [draggingClipId, setDraggingClipId] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [clipInitialStartTime, setClipInitialStartTime] = useState(0);
  
  // UX States
  const [hasChanges, setHasChanges] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showDeployConfirm, setShowDeployConfirm] = useState(false); 
  const [trimDuration, setTrimDuration] = useState(5);
  const [showTrimModal, setShowTrimModal] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
      if (initialClips.length > 0) {
          setClips(initialClips);
          addToHistory(initialClips);
      } else if (workId || isTemplate) {
          setClips(DEFAULT_TEMPLATE_CLIPS);
          addToHistory(DEFAULT_TEMPLATE_CLIPS);
      } else {
          setClips([]);
          addToHistory([]);
      }
      setHasChanges(false);
  }, [workId, isTemplate]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= totalDuration ? 0 : prev + 0.1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleDragStart = (clientX: number, clip: TimelineClip) => {
      setDraggingClipId(clip.id);
      setDragStartX(clientX);
      setClipInitialStartTime(clip.startTime);
      setSelectedClipId(clip.id);
  };

  const handleDragMove = useCallback((clientX: number) => {
      if (draggingClipId && timelineRef.current) {
          const deltaX = clientX - dragStartX;
          const timelineWidth = timelineRef.current.clientWidth;
          const deltaSeconds = (deltaX / timelineWidth) * totalDuration; 
          
          setClips(prevClips => {
              return prevClips.map(clip => {
                  if (clip.id === draggingClipId) {
                      let newStartTime = clipInitialStartTime + deltaSeconds;
                      const SNAP_THRESHOLD = 0.3;
                      if (Math.abs(newStartTime) < SNAP_THRESHOLD) newStartTime = 0;
                      prevClips.forEach(other => {
                          if (other.id !== clip.id && other.trackId === clip.trackId) {
                              const otherEnd = other.startTime + other.duration;
                              if (Math.abs(newStartTime - otherEnd) < SNAP_THRESHOLD) newStartTime = otherEnd;
                              if (Math.abs((newStartTime + clip.duration) - other.startTime) < SNAP_THRESHOLD) newStartTime = other.startTime - clip.duration;
                          }
                      });
                      newStartTime = Math.max(0, Math.min(totalDuration - clip.duration, newStartTime)); 
                      return { ...clip, startTime: newStartTime };
                  }
                  return clip;
              });
          });
      }
  }, [draggingClipId, dragStartX, clipInitialStartTime, totalDuration]);

  const handleDragEnd = useCallback(() => {
      if (draggingClipId) {
          setDraggingClipId(null);
          setHasChanges(true); 
      }
  }, [draggingClipId]);

  useEffect(() => {
      if (!draggingClipId && hasChanges) {
          if (history.length > 0 && history[historyIndex] !== clips) {
             addToHistory(clips);
          }
      }
  }, [draggingClipId]);

  useEffect(() => {
      const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX);
      const onMouseUp = () => handleDragEnd();
      const onTouchMove = (e: TouchEvent) => { if (draggingClipId) e.preventDefault(); handleDragMove(e.touches[0].clientX); };
      const onTouchEnd = () => handleDragEnd();
      if (draggingClipId) {
          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
          window.addEventListener('touchmove', onTouchMove, { passive: false });
          window.addEventListener('touchend', onTouchEnd);
      }
      return () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
          window.removeEventListener('touchmove', onTouchMove);
          window.removeEventListener('touchend', onTouchEnd);
      };
  }, [draggingClipId, handleDragMove, handleDragEnd]);

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 2000); }
  const addToHistory = (newClips: TimelineClip[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newClips);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
  };
  const handleUndo = () => { if (historyIndex > 0) { const idx = historyIndex - 1; setHistoryIndex(idx); setClips(history[idx]); setHasChanges(true); showToast('已撤销'); } };
  const handleRedo = () => { if (historyIndex < history.length - 1) { const idx = historyIndex + 1; setHistoryIndex(idx); setClips(history[idx]); setHasChanges(true); showToast('已重做'); } };
  const formatTime = (t: number) => `${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;

  const currentMaterials = [
      ...availableMotions.map(m => ({ ...m, type: 'motion', color: 'bg-blue-500', name: m.name || 'Motion' })),
      ...availableMusic.map(m => ({ ...m, type: 'music', color: 'bg-purple-500', name: m.title || 'Music', duration: 10 })),
      ...availableVoices.map(v => ({ ...v, type: 'voice', color: 'bg-green-500', name: v.title || 'Voice', duration: 5 }))
  ];

  const handleStartComposing = () => {
      if (selectedMaterialIds.length === 0) return;
      if (replacingClipId) {
          const mat = currentMaterials.find(m => m.id === selectedMaterialIds[0])!;
          let dur = typeof mat.duration === 'string' ? 5 : mat.duration || 5;
          const updated = clips.map(c => c.id === replacingClipId ? { ...c, name: mat.name, duration: dur, color: mat.color, materialId: mat.id } : c);
          setClips(updated); addToHistory(updated); setMode('editor'); setHasChanges(true);
      } else {
          const trackEndTimes: any = { motion: 0, audio: 0, voice: 0 };
          clips.forEach(c => { const end = c.startTime + c.duration; const k = c.trackId === 'expression' ? 'motion' : c.trackId; if (end > trackEndTimes[k]) trackEndTimes[k] = end; });
          const newClips = [...clips];
          selectedMaterialIds.forEach((id, i) => {
              const mat = currentMaterials.find(m => m.id === id)!;
              let track: TrackType = mat.type === 'music' ? 'audio' : (mat.type === 'voice' ? 'voice' : 'motion');
              let dur = typeof mat.duration === 'string' ? 5 : mat.duration || 5;
              newClips.push({ id: `clip-${Date.now()}-${i}`, trackId: track, startTime: trackEndTimes[track], duration: dur, name: mat.name, color: mat.color, materialId: mat.id });
              trackEndTimes[track] += dur;
          });
          setClips(newClips); addToHistory(newClips); setHasChanges(true); setMode('editor');
      }
  };

  const handleSmartCompose = () => {
      setIsOptimizing(true);
      setTimeout(() => {
          const newClips = clips.map(c => ({...c}));
          (['motion', 'audio', 'voice'] as const).forEach(track => {
              const items = newClips.filter(c => c.trackId === track).sort((a, b) => a.startTime - b.startTime);
              if (items.length < 2) return;
              let cur = items[0].startTime + items[0].duration;
              for (let k = 1; k < items.length; k++) { items[k].startTime = cur + 0.5; cur = items[k].startTime + items[k].duration; }
          });
          setClips(newClips); addToHistory(newClips); setIsOptimizing(false); showToast('智能优化完成');
      }, 1200);
  };

  if (mode === 'library') {
      const items = currentMaterials.filter(m => activeTab === 'motion' ? m.type === 'motion' : (activeTab === 'music' ? m.type === 'music' : m.type === 'voice'));
      return (
          <div className="flex flex-col h-full bg-[#0C0C0C] text-white animate-in slide-in-from-right-2 fade-in">
              <div className="bg-[#0C0C0C] z-30 shadow-lg border-b border-white/5">
                  <div className="px-5 pt-8 pb-3 flex items-center justify-between">
                      <button onClick={() => setMode('editor')} className="p-1 -ml-2 rounded-full hover:bg-white/5"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
                      <h2 className="font-black text-xl tracking-tight uppercase ml-1">我的资源</h2><div className="w-6"></div>
                  </div>
                  <div className="px-5 pb-4"><div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl">
                      {(['motion', 'music', 'voice'] as const).map(tab => (
                          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? 'bg-cyan-500 text-black' : 'text-slate-500'}`}>{tab === 'motion' ? '动作' : tab === 'music' ? '音乐' : '语音'}</button>
                      ))}
                  </div></div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 pb-32"><div className="grid grid-cols-2 gap-4">
                  {items.map(item => (
                      <div key={item.id} onClick={() => setSelectedMaterialIds(prev => prev.includes(item.id) ? prev.filter(p=>p!==item.id) : (replacingClipId ? [item.id] : [...prev, item.id]))} className={`relative bg-white/5 rounded-[2rem] overflow-hidden group border transition-all active:scale-95 ${selectedMaterialIds.includes(item.id) ? 'border-cyan-500' : 'border-white/5'}`} style={{ aspectRatio: item.type === 'motion' ? '4/5' : '1/1' }}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-40">{item.type === 'motion' ? <div className="scale-[0.4]"><VirtualRobot isDancing={false} showStatus={false}/></div> : (item.type === 'music' ? <Music className="w-8 h-8" /> : <Mic className="w-8 h-8" />)}</div>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 p-4 flex flex-col justify-end">
                              <h3 className="font-black text-sm truncate uppercase">{item.name}</h3>
                              <span className="text-[10px] text-slate-500">{typeof item.duration === 'number' ? `${item.duration}s` : item.duration}</span>
                          </div>
                      </div>
                  ))}
              </div></div>
              <div className="p-5 border-t border-white/5 bg-[#0C0C0C] pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                  <button onClick={handleStartComposing} disabled={selectedMaterialIds.length === 0} className={`w-full py-5 rounded-full font-[1000] uppercase tracking-[0.2em] text-[11px] ${selectedMaterialIds.length > 0 ? 'bg-cyan-500 text-black' : 'bg-white/10 text-slate-600'}`}>{replacingClipId ? '确认更换' : `添加素材 (${selectedMaterialIds.length})`}</button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] text-white relative select-none">
      {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-5 py-2.5 rounded-full shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
              <Check className="w-4 h-4 mr-2 text-green-500" strokeWidth={3} /><span className="text-[10px] font-black uppercase tracking-widest">{toastMessage}</span>
          </div>
      )}

      {/* Top Header */}
      <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center z-20 sticky top-0 shadow-lg">
        <button onClick={() => hasChanges ? setShowExitConfirm(true) : onBack()} className="p-1 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{workTitle || 'NEW TIMELINE'}</div>
        <button onClick={() => setShowDeviceSelector(true)} className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-900/20 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-900/10">部署作品</button>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 relative bg-[#0C0C0C] flex items-center justify-center overflow-hidden" onClick={() => setSelectedClipId(null)}>
         <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
         <div className="transform scale-[0.8]">
             <VirtualRobot isDancing={isPlaying} playbackMode="loop" showStatus={false} />
         </div>
      </div>

      {/* Timeline Panel */}
      <div className="h-[40%] bg-white/5 backdrop-blur-2xl border-t border-white/10 flex flex-col rounded-t-[2.5rem] shadow-2xl relative z-10" onClick={() => setSelectedClipId(null)}>
          {/* Controls */}
          <div className="h-14 border-b border-white/5 flex items-center justify-between px-6" onClick={(e) => e.stopPropagation()}>
              <div className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-widest">{formatTime(currentTime)} <span className="opacity-30">/ {formatTime(totalDuration)}</span></div>
              <div className="flex items-center space-x-2">
                 <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20"><Undo className="w-4 h-4" /></button>
                 <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20"><Redo className="w-4 h-4" /></button>
                 <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 rounded-full flex items-center justify-center transition-all ml-2 bg-white text-black shadow-lg">
                     {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                 </button>
                 <button onClick={handleSmartCompose} disabled={clips.length < 2 || isOptimizing} className="h-10 px-3 rounded-full flex items-center justify-center ml-2 space-x-1 border bg-purple-500/10 text-purple-300 border-purple-500/20 disabled:opacity-30">
                    {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                 </button>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto relative no-scrollbar">
              <div className="flex min-h-full">
                  <div className="w-16 shrink-0 bg-black/40 border-r border-white/5 pt-8 z-20" onClick={(e) => e.stopPropagation()}>
                      {['motion', 'audio', 'voice'].map((t) => (
                          <div key={t} className="h-14 flex items-center justify-center text-slate-500">
                             {t === 'motion' ? <Move className="w-5 h-5" /> : (t === 'audio' ? <Music className="w-5 h-5" /> : <Mic className="w-5 h-5" />)}
                          </div>
                      ))}
                  </div>
                  <div className="flex-1 relative pt-8 pb-32" ref={timelineRef}>
                      <div className="absolute top-0 bottom-0 w-[1.5px] bg-cyan-500 z-30 shadow-[0_0_10px_#06b6d4] pointer-events-none transition-all duration-100 ease-linear" style={{ left: `${(currentTime / totalDuration) * 100}%` }}></div>
                      <div className="absolute top-0 left-0 right-0 h-8 border-b border-white/5 flex justify-between text-[8px] text-slate-700 px-2 font-black uppercase tracking-widest select-none"><span>0s</span><span>15s</span><span>30s</span></div>
                      <div className="space-y-2 pr-12">
                          {['motion', 'audio', 'voice'].map((track) => (
                              <div key={track} className="relative h-12 w-full bg-white/5 rounded-r-2xl border border-white/5 overflow-hidden flex items-center group">
                                 {clips.filter(c => c.trackId === track).map(clip => (
                                     <div key={clip.id} onMouseDown={(e) => {e.stopPropagation(); handleDragStart(e.clientX, clip);}} onTouchStart={(e) => {e.stopPropagation(); handleDragStart(e.touches[0].clientX, clip);}} onClick={(e) => {e.stopPropagation(); setSelectedClipId(clip.id);}} className={`absolute top-1 bottom-1 rounded-xl border-2 shadow-lg transition-all cursor-ew-resize flex items-center justify-center text-[9px] font-black uppercase tracking-tighter ${selectedClipId === clip.id ? 'border-white z-50 scale-y-110 shadow-white/10' : 'border-white/10 z-10'} ${clip.color} opacity-80`} style={{ left: `${(clip.startTime / totalDuration) * 100}%`, width: `${(clip.duration / totalDuration) * 100}%` }}>
                                         <span className="truncate px-2 pointer-events-none select-none">{clip.name}</span>
                                     </div>
                                 ))}
                                 <button onClick={(e) => { e.stopPropagation(); setActiveTab(track === 'audio' ? 'music' : track as any); setMode('library'); }} className="absolute right-0 top-0 bottom-0 w-10 z-30 flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-600"><Plus className="w-4 h-4" /></button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

          <div className="h-20 bg-[#0C0C0C] border-t border-white/5 flex items-center justify-center px-4 pb-safe z-40 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {selectedClipId ? (
                 <div className="flex w-full justify-around items-center animate-in slide-in-from-bottom-2">
                      <button onClick={() => { const clip = clips.find(c=>c.id===selectedClipId); if(clip) { setReplacingClipId(selectedClipId); setActiveTab(clip.trackId === 'audio' ? 'music' : clip.trackId as any); setMode('library'); } }} className="flex flex-col items-center space-y-1 active:scale-95 transition-all"><div className="w-12 h-12 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center"><Repeat className="w-5 h-5 text-slate-400" /></div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">更换</span></button>
                      <button onClick={() => { const clip = clips.find(c=>c.id===selectedClipId); if(clip) { setTrimDuration(clip.duration); setShowTrimModal(true); } }} className="flex flex-col items-center space-y-1 active:scale-95 transition-all"><div className="w-12 h-12 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center"><Scissors className="w-5 h-5 text-slate-400" /></div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">裁剪</span></button>
                      <button onClick={() => { setClips(clips.filter(c=>c.id!==selectedClipId)); addToHistory(clips.filter(c=>c.id!==selectedClipId)); setHasChanges(true); setSelectedClipId(null); }} className="flex flex-col items-center space-y-1 active:scale-95 transition-all"><div className="w-12 h-12 rounded-[1.25rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center"><Trash2 className="w-5 h-5 text-red-500" /></div><span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">删除</span></button>
                 </div>
              ) : (
                 <div className="flex w-full justify-around items-center">
                    <button onClick={() => {setActiveTab('motion'); setMode('library');}} className="group flex flex-col items-center"><Move className="w-6 h-6 text-slate-500 group-hover:text-white" /></button>
                    <button onClick={() => {setActiveTab('music'); setMode('library');}} className="group flex flex-col items-center"><Music className="w-6 h-6 text-slate-500 group-hover:text-white" /></button>
                    <button onClick={() => { if(workId && !isTemplate) { onSave(workId, clips); setHasChanges(false); showToast('保存成功'); } else { setNewWorkTitle(workTitle ? `${workTitle} (副本)` : `新作品 ${new Date().toLocaleDateString()}`); setShowSaveModal(true); } }} className="w-14 h-14 -mt-10 rounded-full bg-cyan-500 flex items-center justify-center shadow-2xl active:scale-90 transition-all border-4 border-[#0C0C0C]"><Save className="w-6 h-6 text-black" strokeWidth={2.5} /></button>
                    <button onClick={() => {setActiveTab('voice'); setMode('library');}} className="group flex flex-col items-center"><Mic className="w-6 h-6 text-slate-500 group-hover:text-white" /></button>
                    <button className="group flex flex-col items-center"><Layers className="w-6 h-6 text-slate-500 group-hover:text-white" /></button>
                 </div>
              )}
          </div>
      </div>

      {/* Exit Confirm Modal */}
      {showExitConfirm && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
              <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl text-center">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500"><AlertTriangle className="w-8 h-8" /></div>
                  <h3 className="text-xl font-black text-white mb-2 uppercase">未保存更改</h3>
                  <p className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-widest px-4">离开后当前编排进度将无法恢复。</p>
                  <div className="flex gap-4">
                      <button onClick={() => { setHasChanges(false); setShowExitConfirm(false); onBack(); }} className="flex-1 py-4 bg-white/5 rounded-full text-slate-500 font-black uppercase text-[10px]">直接退出</button>
                      <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-4 bg-cyan-500 rounded-full text-black font-black uppercase text-[10px]">继续编辑</button>
                  </div>
              </div>
          </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-6 animate-in fade-in">
              <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl text-center">
                  <h3 className="text-xl font-black text-white mb-6 uppercase">保存作品</h3>
                  <input type="text" value={newWorkTitle} onChange={(e) => setNewWorkTitle(e.target.value)} placeholder="作品名称" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black mb-8 outline-none text-white transition-all"/>
                  <div className="flex gap-4">
                      <button onClick={() => setShowSaveModal(false)} className="flex-1 py-4 bg-white/5 rounded-full text-slate-500 font-black uppercase text-[10px]">取消</button>
                      <button onClick={() => { onSave(workId || null, clips, newWorkTitle); setHasChanges(false); setShowSaveModal(false); onBack(); }} className="flex-1 py-4 bg-cyan-500 rounded-full text-black font-[1000] uppercase text-[10px]">确认保存</button>
                  </div>
              </div>
          </div>
      )}

      {/* Device Selector */}
      {showDeviceSelector && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in">
              <div className="bg-[#1A1A1A] border border-white/10 w-full sm:w-96 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl flex flex-col">
                  <div className="flex justify-between items-center mb-6 shrink-0"><h2 className="text-xl font-black text-white uppercase">选择部署设备</h2><button onClick={() => setShowDeviceSelector(false)} className="p-2 text-slate-500"><X className="w-6 h-6" /></button></div>
                  <div className="flex-1 overflow-y-auto mb-8 space-y-3 no-scrollbar">
                      {availableDevices.length > 0 ? availableDevices.map(device => (
                          <button key={device.id} onClick={() => setSelectedDevicesForApply(p => p.includes(device.id) ? p.filter(id=>id!==device.id) : [...p, device.id])} className={`w-full p-5 rounded-[1.5rem] border flex items-center justify-between transition-all ${selectedDevicesForApply.includes(device.id) ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-white/5 border-white/5'}`}>
                              <div className="flex items-center space-x-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDevicesForApply.includes(device.id) ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-600'}`}><Cpu className="w-6 h-6" /></div><div className="text-left"><div className="font-black text-[11px] text-white uppercase">{device.name}</div><div className="text-[9px] font-black text-slate-600 uppercase mt-0.5">{device.serialNumber}</div></div></div>
                              {selectedDevicesForApply.includes(device.id) ? <CheckSquare className="w-5 h-5 text-cyan-400" /> : <Square className="w-5 h-5 text-slate-700" />}
                          </button>
                      )) : (<div className="text-center py-10"><p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">暂无在线设备</p></div>)}
                  </div>
                  <button onClick={() => { if(onDeploy) onDeploy(selectedDevicesForApply); showToast(`已部署至 ${selectedDevicesForApply.length} 台机器人`); setShowDeviceSelector(false); }} disabled={selectedDevicesForApply.length === 0} className={`w-full py-5 rounded-full font-[1000] uppercase tracking-[0.2em] transition-all ${selectedDevicesForApply.length > 0 ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-700 cursor-not-allowed'}`}>确认部署 ({selectedDevicesForApply.length})</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default Studio;