
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Upload, Video, X, Check, Trash2, Download, 
  RefreshCw, Play, Pause, Zap, Move, Cpu, AlertTriangle, CheckSquare, Square, Plus, Minimize2, ArrowDown,
  Activity, Circle, StopCircle, ScanLine, Brain, LayoutDashboard
} from 'lucide-react';
import VirtualRobot from './VirtualRobot';
import { Device, BackgroundTask } from '../types';

interface MimicFlowProps {
  onBack: () => void;
  onSave: (motion: any) => void;
  onDiscard?: () => void; 
  activeDeviceCount: number;
  availableDevices?: Device[];
  existingTask?: BackgroundTask; 
  onStartNewTask?: (name?: string) => void;
  onMinimize?: () => void;
}

type Step = 'selection' | 'recording' | 'uploading' | 'confirming' | 'learning' | 'result';

const MimicFlow: React.FC<MimicFlowProps> = ({ 
    onBack, onSave, onDiscard, activeDeviceCount, availableDevices = [], existingTask, onStartNewTask, onMinimize
}) => {
  // If viewing an existing task, jump to correct state
  const initialStep = existingTask 
      ? (existingTask.status === 'done' ? 'result' : 'learning') 
      : 'selection';
      
  const [step, setStep] = useState<Step>(initialStep);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [motionName, setMotionName] = useState('');
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);

  // Sync with prop updates (e.g. background task finished while viewing)
  useEffect(() => {
      if (existingTask?.status === 'done' && step === 'learning') {
          setTimeout(() => setStep('result'), 500);
      }
  }, [existingTask?.status, step]);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => setRecordingTimer(t => t + 1), 1000);
    } else {
      setRecordingTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const confirmSave = () => {
      if (!motionName.trim()) return;
      onSave({ id: `mimic_${Date.now()}`, name: motionName, duration: '02:00', date: new Date().toISOString().split('T')[0], type: 'local', format: 'bvh', isCollected: false }); 
      setIsSaved(true); 
      setShowSaveModal(false);
  };

  const confirmDelete = () => {
      setShowDeleteConfirm(false);
      if (existingTask && onDiscard) {
          onDiscard(); // Trigger task deletion/move to history
      } else {
          setStep('selection'); 
          setIsSaved(false);
      }
  };

  const toggleRecording = () => {
      if (isRecording) {
          setIsRecording(false);
          // Skip 'uploading' state for camera as requested, go straight to confirming
          setStep('confirming'); 
      } else {
          setIsRecording(true);
      }
  };

  const formatTimer = (secs: number) => {
      const m = Math.floor(secs / 60).toString().padStart(2, '0');
      const s = (secs % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
  };

  // 1. SELECTION
  if (step === 'selection') {
    return (
      <div className="h-full bg-[#0C0C0C] text-white flex flex-col animate-in fade-in">
        <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex items-center sticky top-0 z-30 shadow-lg">
          <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
          <h2 className="ml-4 font-black text-xl tracking-tight uppercase">新建动作模拟</h2>
        </div>
        <div className="flex-1 flex flex-col justify-center p-8 space-y-6">
          <button onClick={() => setStep('uploading')} className="w-full bg-gradient-to-br from-[#D1E1E4] to-[#B8CED3] rounded-[2.5rem] p-10 flex flex-col items-center justify-center space-y-5 group active:scale-[0.97] transition-all overflow-hidden relative shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"></div>
            <div className="w-20 h-20 bg-black/5 border border-black/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><Upload className="w-10 h-10 text-[#1A1A1A]" strokeWidth={2} /></div>
            <div className="text-center"><h3 className="text-xl font-[1000] text-[#1A1A1A] uppercase tracking-tight">上传视频</h3><p className="text-cyan-900/60 text-[10px] font-black uppercase tracking-widest mt-1">从手机相册导入视频</p></div>
          </button>
          <button onClick={() => setStep('recording')} className="w-full bg-[#1A1A1A] border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center space-y-5 group active:scale-[0.97] transition-all overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl"><Video className="w-10 h-10 text-cyan-500" strokeWidth={2} /></div>
            <div className="text-center"><h3 className="text-xl font-[1000] text-white uppercase tracking-tight">相机捕捉</h3><p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">实时视觉动作捕捉</p></div>
          </button>
        </div>
      </div>
    );
  }

  // 2. RECORDING
  if (step === 'recording') {
      return (
          <div className="h-full bg-black flex flex-col relative animate-in fade-in">
              <div className="flex-1 relative overflow-hidden bg-slate-800">
                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <img src="https://picsum.photos/800/1200" alt="Camera" className="w-full h-full object-cover blur-[2px]" />
                  </div>
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                      {[...Array(9)].map((_, i) => <div key={i} className="border border-white/10"></div>)}
                  </div>
                  <div className="absolute top-0 left-0 right-0 p-6 pt-10 flex justify-between items-start z-20">
                      <button onClick={() => setStep('selection')} className="p-2 bg-black/40 rounded-full backdrop-blur"><X className="w-6 h-6 text-white" /></button>
                      {isRecording && (
                          <div className="flex items-center space-x-2 bg-red-500/80 px-3 py-1 rounded-full animate-pulse">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span className="text-xs font-mono font-bold text-white">{formatTimer(recordingTimer)}</span>
                          </div>
                      )}
                      <div className="w-10"></div>
                  </div>
                  <div className="absolute top-1/4 left-10 right-10 bottom-1/3 border-2 border-yellow-400/50 rounded-2xl flex items-center justify-center pointer-events-none">
                      <div className="bg-yellow-400/80 text-black text-[10px] font-bold px-2 py-0.5 rounded mt-auto mb-2">BODY DETECTED</div>
                  </div>
              </div>
              <div className="h-32 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center pb-safe">
                  <button onClick={toggleRecording} className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${isRecording ? 'border-red-500 scale-110' : 'border-white hover:scale-105'}`}>
                      {isRecording ? <div className="w-8 h-8 bg-red-500 rounded-md"></div> : <div className="w-16 h-16 bg-red-500 rounded-full"></div>}
                  </button>
              </div>
          </div>
      );
  }

  // 3. UPLOADING (Renamed text to "视频上传中")
  if (step === 'uploading') { setTimeout(() => setStep('confirming'), 1500); return <div className="h-full bg-[#0C0C0C] flex flex-col items-center justify-center text-white space-y-6"><RefreshCw className="w-12 h-12 text-cyan-500 animate-spin" /><span className="text-[10px] font-black uppercase tracking-widest">视频上传中...</span></div> }

  // 4. CONFIRMING
  if (step === 'confirming') {
    return (
      <div className="h-full bg-black flex flex-col animate-in fade-in">
        <div className="flex-1 bg-[#0C0C0C] flex flex-col items-center justify-center p-8">
            <div className="w-64 h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2.5rem] border-4 border-white/5 shadow-2xl relative overflow-hidden mb-10 group">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_#ffffff05_1px)] bg-[size:20px_20px]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                <div className="absolute inset-0 flex items-center justify-center transform scale-90 translate-y-4"><VirtualRobot isDancing={true} showStatus={false} /></div>
                <div className="absolute top-4 left-0 right-0 flex justify-center z-10"><div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div><span className="text-[9px] font-black text-white/80 uppercase tracking-widest">REC Playback</span></div></div>
            </div>
            <div className="text-center space-y-3">
               <h3 className="text-2xl font-[1000] text-white uppercase tracking-tight">准备好了吗？</h3>
               <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-8 leading-relaxed">AI 将提取视频中的动作关键帧<br/>并映射到 R1 机器人模型</p>
            </div>
        </div>
        <div className="pb-safe pt-6 px-10 bg-[#0C0C0C] border-t border-white/5">
             <div className="flex items-center justify-between mb-8">
                <button onClick={() => setStep('selection')} className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] active:scale-95 transition-all hover:text-white">重录</button>
                <button 
                    onClick={() => { 
                        if (onStartNewTask) onStartNewTask(); 
                        setStep('learning'); // Manually switch to learning view
                    }} 
                    className="bg-cyan-500 text-black px-10 py-4 rounded-full font-[1000] uppercase tracking-widest shadow-xl shadow-cyan-900/40 active:scale-95 transition-all hover:shadow-cyan-900/60"
                >
                    开始学习
                </button>
             </div>
        </div>
      </div>
    );
  }

  // 5. LEARNING (Only shown if viewing existing running task)
  if (step === 'learning') {
      const progress = existingTask?.progress || 0;
      return (
          <div className="h-full bg-[#0C0C0C] flex flex-col relative animate-in fade-in">
              <div className="px-5 pt-8 pb-3 flex items-center justify-between sticky top-0 z-30">
                  <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">AI 学习中</div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center px-10 relative">
                  <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
                      <div className="absolute inset-0 border-2 border-dashed border-cyan-900/50 rounded-full animate-[spin_10s_linear_infinite]"></div>
                      <div className="absolute inset-2 border border-white/5 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
                      <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-2xl animate-pulse"></div>
                      <div className="relative z-10 flex flex-col items-center justify-center">
                          <Cpu className="w-12 h-12 text-cyan-400 mb-2 animate-pulse" strokeWidth={1} />
                          <span className="text-3xl font-[1000] text-white font-mono tracking-tighter tabular-nums">{progress.toFixed(0)}%</span>
                      </div>
                  </div>
                  <div className="z-10 w-full max-w-xs text-center space-y-6">
                      <div className="space-y-2">
                          <h3 className="text-xl font-[1000] text-white uppercase tracking-tight">正在解析动作...</h3>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Extracting skeletal data from video source</p>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] transition-all duration-300 ease-linear" style={{ width: `${progress}%` }}></div>
                      </div>
                  </div>
              </div>
              <div className="pb-safe pt-4 px-10 bg-[#0C0C0C] h-32 flex items-center justify-center">
                  <button onClick={onMinimize} className="flex items-center space-x-3 py-4 px-10 bg-blue-600 rounded-full active:scale-95 transition-all shadow-lg shadow-blue-900/40 group hover:bg-blue-500">
                      <LayoutDashboard className="w-4 h-4 text-white" />
                      <span className="text-[11px] font-black text-white uppercase tracking-widest">后台学习</span>
                  </button>
              </div>
          </div>
      )
  }

  // 6. RESULT
  if (step === 'result') {
      return (
          <div className="h-full bg-[#0C0C0C] text-white flex flex-col relative animate-in fade-in">
              <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-20 sticky top-0 shadow-lg">
                  <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
                  <span className="text-[10px] font-black uppercase tracking-widest">捕捉完成</span>
                  <button onClick={() => setShowDeviceSelector(true)} className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center bg-cyan-500 text-black active:scale-95 shadow-lg shadow-cyan-900/40"><Cpu className="w-3 h-3 mr-1.5" strokeWidth={3} /> 部署</button>
              </div>
              <div className="flex-1 relative"><VirtualRobot isDancing={true} showStatus={true} /></div>
              <div className="h-28 bg-[#0C0C0C] border-t border-white/5 flex items-center justify-center space-x-4 px-8 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                   <button onClick={() => setShowDeleteConfirm(true)} className="w-14 h-14 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center text-red-500 active:scale-90"><Trash2 className="w-6 h-6" /></button>
                   <button onClick={() => {setMotionName(`动作模仿 ${new Date().toLocaleTimeString()}`); setShowSaveModal(true);}} disabled={isSaved} className={`flex-1 h-14 rounded-full flex items-center justify-center font-[1000] uppercase tracking-widest text-[11px] shadow-2xl transition-all ${isSaved ? 'bg-white/5 text-slate-600' : 'bg-cyan-500 text-black shadow-cyan-900/40'}`}><Move className="w-4 h-4 mr-2" strokeWidth={3} /> {isSaved ? '已保存' : '保存到动作库'}</button>
              </div>
              {showDeleteConfirm && (
                  <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in"><div className="bg-[#1A1A1A] border border-white/10 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl text-center"><div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500"><Trash2 className="w-8 h-8" /></div><h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">放弃该动作？</h3><p className="text-[10px] font-black text-slate-500 mb-8 uppercase tracking-widest">捕捉到的动作数据将被永久移除。</p><div className="flex gap-4"><button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-4 bg-white/5 rounded-full text-slate-500 font-black uppercase text-[10px]">取消</button><button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 rounded-full text-white font-black uppercase text-[10px] shadow-lg shadow-red-900/40">确认放弃</button></div></div></div>
              )}
              {showSaveModal && (
                  <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in"><div className="bg-[#1A1A1A] border border-white/10 w-full max-w-xs rounded-[2.5rem] p-8 shadow-2xl text-center"><h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">保存动作</h3><input type="text" value={motionName} onChange={(e) => setMotionName(e.target.value)} placeholder="输入动作名称" autoFocus className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-black uppercase mb-8 outline-none text-white transition-all"/><div className="flex gap-4"><button onClick={() => setShowSaveModal(false)} className="flex-1 py-4 bg-white/5 rounded-full text-slate-500 font-black uppercase text-[10px]">取消</button><button onClick={confirmSave} className="flex-1 py-4 bg-cyan-500 text-black font-black uppercase text-[10px] shadow-lg shadow-cyan-900/40 rounded-full">确认保存</button></div></div></div>
              )}
          </div>
      )
  }
  return null;
};

export default MimicFlow;
