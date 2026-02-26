
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Wand2, Play, Pause, Save, RefreshCw, Volume2, Mic, Type, Square, AudioWaveform, Sliders, Globe, Zap, Languages, User } from 'lucide-react';

interface VoiceCreationProps {
  onBack: () => void;
  onSave: (voiceData: any) => void;
}

const VoiceCreation: React.FC<VoiceCreationProps> = ({ onBack, onSave }) => {
  const [step, setStep] = useState<'config' | 'result'>('config');
  const [mode, setMode] = useState<'tts' | 'record'>('tts');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // TTS Form State
  const [text, setText] = useState('');
  const [filename, setFilename] = useState('');
  const [language, setLanguage] = useState('zh');
  const [voice, setVoice] = useState('sweet');
  const [speed, setSpeed] = useState('1.0');

  // Recording State
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'done'>('idle');
  const [recordDuration, setRecordDuration] = useState(0);

  // Visualizer bars
  const [bars, setBars] = useState<number[]>(new Array(20).fill(10));

  useEffect(() => {
    let interval: any;
    if (recordingStatus === 'recording') {
      interval = setInterval(() => {
        setRecordDuration(prev => prev + 1);
        // Randomize bars for effect
        setBars(prev => prev.map(() => Math.random() * 80 + 10));
      }, 100); // Faster update for visualizer
    } else {
      clearInterval(interval);
      setBars(new Array(20).fill(10));
    }
    return () => clearInterval(interval);
  }, [recordingStatus]);

  const formatDuration = (seconds: number) => {
    const totalSec = Math.floor(seconds / 10); // adjusting since interval is 100ms for visualizer logic
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = () => {
    if (recordingStatus === 'idle' || recordingStatus === 'done') {
      setRecordingStatus('recording');
      setRecordDuration(0);
    } else {
      setRecordingStatus('done');
    }
  };

  const handleProcess = () => {
    if (!filename) { alert('请输入作品名称'); return; }
    if (mode === 'tts' && !text) { alert('请输入语音内容'); return; }
    if (mode === 'record' && recordingStatus !== 'done') return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep('result');
    }, 1500);
  };

  const handleSave = () => {
    const newVoice = {
        id: `gen-${Date.now()}`,
        title: filename,
        text: mode === 'tts' ? text : '麦克风录制音频',
        duration: mode === 'tts' ? '00:12' : formatDuration(recordDuration),
        type: 'local',
        mood: mode === 'tts' ? 'AI生成' : '录音',
        isCollected: false
    };
    onSave(newVoice);
  };

  return (
    <div className="h-full bg-[#0C0C0C] text-white relative overflow-hidden flex flex-col selection:bg-cyan-500/30">
      
      {/* 1. Header */}
      <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-20 sticky top-0 shadow-lg">
        <div className="flex items-center">
            <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all">
                <ChevronLeft className="w-6 h-6 text-slate-400" />
            </button>
            <h1 className="ml-3 font-black text-xl tracking-tight uppercase">语音创作</h1>
        </div>
        {/* Removed English text 'AI Studio' */}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
         <div className="p-5">
            
            {/* Mode Switcher */}
            {step === 'config' && (
                <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/10">
                    <button 
                        onClick={() => setMode('tts')}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'tts' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-900/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Type className="w-4 h-4 mr-2" strokeWidth={2.5} /> 文字转语音
                    </button>
                    <button 
                        onClick={() => setMode('record')}
                        className={`flex-1 flex items-center justify-center py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'record' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-900/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Mic className="w-4 h-4 mr-2" strokeWidth={2.5} /> 录音室
                    </button>
                </div>
            )}

            {step === 'config' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    
                    {/* Filename */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center focus-within:border-cyan-500/50 transition-colors">
                        <div className="pl-4 pr-2 text-slate-500"><Square className="w-4 h-4" /></div>
                        <input 
                            type="text" 
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="给作品起个名字..." 
                            className="w-full bg-transparent border-none py-4 text-sm font-bold text-white placeholder-slate-600 outline-none"
                        />
                    </div>

                    {/* TTS Config */}
                    {mode === 'tts' && (
                        <>
                            {/* Text Input */}
                            <div className="relative group">
                                <textarea 
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="输入文字，AI 将为您生成语音..." 
                                    className="w-full h-40 bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm font-bold text-white placeholder-slate-700 outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] resize-none transition-all leading-relaxed"
                                />
                                <div className="absolute bottom-4 right-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    {text.length} chars
                                </div>
                            </div>

                            {/* Settings Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Voice Selector */}
                                <div className="col-span-2 bg-white/5 border border-white/10 rounded-[1.5rem] p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center"><User className="w-3 h-3 mr-1.5" /> 音色选择</label>
                                        <span className="text-[9px] text-cyan-500 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/20">PRO</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'sweet', label: '甜美亲和', icon: '🍬' },
                                            { id: 'calm', label: '沉稳男声', icon: '🎙️' },
                                            { id: 'tech', label: '未来科技', icon: '🤖' }
                                        ].map(v => (
                                            <button 
                                                key={v.id}
                                                onClick={() => setVoice(v.id)}
                                                className={`flex flex-col items-center justify-center py-3 rounded-2xl border transition-all active:scale-95 ${voice === v.id ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-black/20 border-white/5 text-slate-500 hover:bg-white/5'}`}
                                            >
                                                <span className="text-lg mb-1">{v.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-tight">{v.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Language */}
                                <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-5 flex flex-col justify-between">
                                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center"><Globe className="w-3 h-3 mr-1.5" /> 语种</label>
                                     <div className="flex bg-black/30 rounded-xl p-1 border border-white/5">
                                        {['zh', 'en'].map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => setLanguage(lang)}
                                                className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${language === lang ? 'bg-white/10 text-white shadow' : 'text-slate-600'}`}
                                            >
                                                {lang === 'zh' ? 'CN' : 'EN'}
                                            </button>
                                        ))}
                                     </div>
                                </div>

                                {/* Speed */}
                                <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-5 flex flex-col justify-between">
                                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center"><Zap className="w-3 h-3 mr-1.5" /> 语速</label>
                                     <div className="flex bg-black/30 rounded-xl p-1 border border-white/5">
                                        {['0.8', '1.0', '1.2'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setSpeed(s)}
                                                className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${speed === s ? 'bg-white/10 text-white shadow' : 'text-slate-600'}`}
                                            >
                                                {s}x
                                            </button>
                                        ))}
                                     </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* RECORD MODE UI */}
                    {mode === 'record' && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-10">
                             {/* Visualizer */}
                             <div className="h-24 flex items-end justify-center space-x-1">
                                {bars.map((height, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-1.5 rounded-full transition-all duration-100 ${recordingStatus === 'recording' ? 'bg-cyan-400' : 'bg-slate-800'}`}
                                        style={{ height: `${recordingStatus === 'recording' ? height : 10}%` }}
                                    ></div>
                                ))}
                             </div>

                             <div className="text-center">
                                 <h2 className="text-5xl font-mono font-black text-white tracking-tighter tabular-nums">
                                     {formatDuration(recordDuration)}
                                 </h2>
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Recording Duration</p>
                             </div>

                             <button 
                                onClick={toggleRecording}
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${recordingStatus === 'recording' ? 'bg-white text-red-600 scale-110 shadow-white/20' : 'bg-red-600 text-white hover:scale-105 shadow-red-900/40'}`}
                             >
                                 {recordingStatus === 'recording' ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-10 h-10" />}
                             </button>

                             {recordingStatus === 'done' && (
                                 <button onClick={() => { setRecordingStatus('idle'); setRecordDuration(0); }} className="flex items-center space-x-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/10 active:scale-95 transition-all">
                                     <RefreshCw className="w-3.5 h-3.5" /> <span>重新录制</span>
                                 </button>
                             )}
                        </div>
                    )}
                </div>
            ) : (
                /* RESULT VIEW */
                <div className="flex flex-col items-center justify-center space-y-6 animate-in slide-in-from-bottom-8 duration-700 pt-10">
                    <div className="w-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -mt-20 -mr-20 pointer-events-none"></div>
                         
                         <div className="relative z-10 text-center space-y-6">
                             <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 shadow-2xl rotate-3 border border-white/10 ${mode === 'record' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                 {mode === 'record' ? <AudioWaveform className="w-10 h-10" /> : <Wand2 className="w-10 h-10" />}
                             </div>
                             
                             <div>
                                 <h2 className="text-2xl font-[1000] text-white uppercase tracking-tight">{filename}</h2>
                                 <p className="text-[10px] font-black text-slate-400 mt-2 line-clamp-2 uppercase tracking-widest px-8">
                                    {mode === 'record' ? 'Studio Recording' : 'AI Generated Voice'} • {formatDuration(mode === 'tts' ? 120 : recordDuration)}
                                 </p>
                             </div>

                             {/* Fake Player Progress */}
                             <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                                 <div className="flex items-center space-x-3 mb-2">
                                    <button 
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center active:scale-90 transition-all"
                                    >
                                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                                    </button>
                                    <div className="flex-1 h-12 flex items-center space-x-1 px-2">
                                        {[...Array(30)].map((_, i) => (
                                           <div 
                                             key={i} 
                                             className={`flex-1 rounded-full transition-all duration-300 ${i % 2 === 0 ? 'bg-white/40' : 'bg-white/20'} ${isPlaying ? 'animate-pulse' : ''}`}
                                             style={{ 
                                                 height: isPlaying ? `${Math.random() * 80 + 20}%` : '20%',
                                             }}
                                           ></div>
                                       ))}
                                    </div>
                                 </div>
                             </div>
                         </div>
                    </div>

                    <div className="flex w-full space-x-4">
                        <button 
                          onClick={() => { setStep('config'); setIsPlaying(false); }}
                          className="flex-1 py-5 bg-white/5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-all active:scale-95 border border-white/5"
                        >
                            <RefreshCw className="w-4 h-4 mx-auto mb-1" />
                            重做
                        </button>
                        <button 
                          onClick={handleSave}
                          className="flex-[2] py-5 bg-cyan-500 rounded-[1.5rem] font-[1000] uppercase tracking-[0.2em] text-black text-[11px] shadow-2xl shadow-cyan-900/40 active:scale-95 transition-all flex items-center justify-center"
                        >
                            <Save className="w-4 h-4 mr-2" strokeWidth={3} />
                            保存到库
                        </button>
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* Action Footer (Only in Config) */}
      {step === 'config' && (
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0C0C0C] to-transparent z-30">
            <button 
                onClick={handleProcess}
                disabled={!filename || isGenerating || (mode === 'tts' && !text) || (mode === 'record' && recordingStatus !== 'done')}
                className={`w-full py-5 rounded-full font-[1000] uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center transition-all active:scale-[0.98] 
                ${(!filename || (mode === 'tts' && !text) || (mode === 'record' && recordingStatus !== 'done')) 
                    ? 'bg-[#333333] text-slate-500 cursor-not-allowed' 
                    : 'bg-cyan-500 text-black shadow-cyan-900/40 hover:bg-cyan-400'}`}
            >
                {isGenerating ? (
                    <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        AI 处理中...
                    </>
                ) : (
                    <>
                        <Wand2 className="w-4 h-4 mr-2" strokeWidth={3} />
                        {mode === 'tts' ? '生成语音' : '完成录制'}
                    </>
                )}
            </button>
        </div>
      )}
    </div>
  );
};

export default VoiceCreation;
