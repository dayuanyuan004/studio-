import React, { useState, useEffect } from 'react';
import { Search, Play, Pause, Star, Mic, Music, Volume2, Filter, Move, Download, CheckCircle, Loader2 } from 'lucide-react';
import VirtualRobot from '../components/VirtualRobot';

interface MaterialSquareProps {
  onBack: () => void;
  voiceList: any[];
  musicList: any[];
  motionList: any[];
  onDownload: (item: any, type: 'music' | 'voice' | 'motion') => void;
}

const MaterialSquare: React.FC<MaterialSquareProps> = ({ 
    onBack, 
    voiceList, 
    musicList, 
    motionList,
    onDownload
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'music' | 'motion'>('voice');
  const [activeTag, setActiveTag] = useState('推荐');
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  const [downloadingItems, setDownloadingItems] = useState<Record<string, number>>({});
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  const tagsMap = {
      voice: ['推荐', '热门', '情感', '解说', '角色', '方言'],
      motion: ['推荐', '热门', '舞蹈', '剧情', '常用', '战斗'],
      music: ['推荐', '热门', '流行', '电子', '氛围', '古典']
  };

  useEffect(() => {
      setActiveTag('推荐');
  }, [activeTab]);

  const filterByTag = (list: any[]) => {
      return list.filter(item => {
          const isOnline = item.type === 'online';
          const matchesTag = item.tags && item.tags.includes(activeTag);
          return isOnline && matchesTag;
      });
  };

  const displayVoices = filterByTag(voiceList);
  const displayMusic = filterByTag(musicList);
  const displayMotions = filterByTag(motionList);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const handleDownloadClick = (e: React.MouseEvent, item: any, type: 'music' | 'voice' | 'motion') => {
      e.stopPropagation();
      if (downloadingItems[item.id] !== undefined || downloadedIds.includes(item.id)) return;
      setDownloadingItems(prev => ({ ...prev, [item.id]: 0 }));
      const interval = setInterval(() => {
          setDownloadingItems(prev => {
              const currentProgress = prev[item.id];
              if (currentProgress >= 100) {
                  clearInterval(interval);
                  onDownload(item, type);
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

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white relative">
      <div className="px-5 pt-12 pb-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-30">
         <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">素材广场</h1>
         <button className="p-2 bg-slate-800 rounded-full border border-white/5 text-slate-400 hover:text-white"><Search className="w-5 h-5" /></button>
      </div>

      <div className="flex p-1 mx-5 mt-4 bg-slate-900 border border-white/5 rounded-lg">
         <button onClick={() => setActiveTab('voice')} className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center ${activeTab === 'voice' ? 'bg-slate-800 shadow text-green-400 border border-white/10' : 'text-slate-500'}`}><Mic className="w-3 h-3 mr-1.5" /> 语音</button>
         <button onClick={() => setActiveTab('motion')} className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center ${activeTab === 'motion' ? 'bg-slate-800 shadow text-blue-400 border border-white/10' : 'text-slate-500'}`}><Move className="w-3 h-3 mr-1.5" /> 动作</button>
         <button onClick={() => setActiveTab('music')} className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center ${activeTab === 'music' ? 'bg-slate-800 shadow text-purple-400 border border-white/10' : 'text-slate-500'}`}><Music className="w-3 h-3 mr-1.5" /> 音乐</button>
      </div>

      <div className="px-5 pb-2 pt-4 bg-transparent sticky top-[120px] z-20 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2">
              {tagsMap[activeTab].map(tag => (
                  <button key={tag} onClick={() => setActiveTag(tag)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeTag === tag ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-transparent hover:bg-white/10'}`}>{tag}</button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 no-scrollbar">
          {activeTab === 'voice' && (
             <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4 duration-300">
                {displayVoices.map(item => (
                    <button key={item.id} onClick={() => togglePlay(item.id)} className={`relative aspect-square rounded-2xl overflow-hidden group text-left border-2 transition-all ${playingId === item.id ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border-transparent hover:border-white/10'}`}>
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center"><div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${playingId === item.id ? 'bg-green-500/20 text-green-400 scale-110' : 'bg-slate-700 text-slate-500'}`}><Volume2 className="w-8 h-8" /></div></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90">
                           <div className="absolute top-2 right-2 flex space-x-2 z-10"><div onClick={(e) => handleDownloadClick(e, item, 'voice')} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-all overflow-hidden relative">{downloadingItems[item.id] !== undefined ? (<><div className="absolute bottom-0 left-0 right-0 bg-green-500/30 transition-all" style={{ height: `${downloadingItems[item.id]}%` }}></div><span className="text-[8px] font-bold z-10">{downloadingItems[item.id]}%</span></>) : downloadedIds.includes(item.id) ? (<CheckCircle className="w-4 h-4 text-green-400" />) : (<Download className="w-4 h-4 text-white/70" />)}</div></div>
                           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30 transition-all ${playingId === item.id ? 'bg-green-500 border-green-400 text-white' : 'opacity-0 group-hover:opacity-100 scale-90'}`}>{playingId === item.id ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}</div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3"><h3 className="font-bold text-sm truncate text-white">{item.title}</h3><div className="flex justify-between items-center text-xs text-slate-400 mt-1"><span className="truncate pr-2">{item.text}</span><span>{item.duration}</span></div></div>
                    </button>
                ))}
             </div>
          )}

           {activeTab === 'motion' && (
             <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4 duration-300">
                {displayMotions.map(item => (
                    <button key={item.id} className="relative aspect-[4/5] bg-slate-900 rounded-2xl overflow-hidden group text-left border border-white/5 hover:border-blue-500/50 shadow-sm">
                        <div className="absolute inset-0 flex items-center justify-center transform scale-[0.55] translate-y-[-10px]"><VirtualRobot isDancing={false} /></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90">
                           <div className="absolute top-2 right-2 flex space-x-2 z-10"><div onClick={(e) => handleDownloadClick(e, item, 'motion')} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 transition-all overflow-hidden relative">{downloadingItems[item.id] !== undefined ? (<><div className="absolute bottom-0 left-0 right-0 bg-blue-500/30 transition-all" style={{ height: `${downloadingItems[item.id]}%` }}></div><span className="text-[8px] font-bold z-10">{downloadingItems[item.id]}%</span></>) : downloadedIds.includes(item.id) ? (<CheckCircle className="w-4 h-4 text-blue-400" />) : (<Download className="w-4 h-4 text-white/70" />)}</div></div>
                           <div className="absolute bottom-0 left-0 right-0 p-3"><h3 className="font-bold text-sm text-white truncate">{item.name}</h3><div className="flex items-center justify-between mt-1.5"><div className="flex items-center space-x-2"><span className="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase">{item.format}</span><span className="text-[10px] text-slate-500 font-mono">{item.duration}</span></div></div></div>
                        </div>
                    </button>
                ))}
             </div>
          )}

          {activeTab === 'music' && (
             <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4 duration-300">
                 {displayMusic.map(item => (
                      <button key={item.id} onClick={() => togglePlay(item.id)} className={`relative aspect-square rounded-2xl overflow-hidden group text-left border-2 transition-all ${playingId === item.id ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-transparent hover:border-white/10'}`}>
                          <img src={`https://picsum.photos/seed/${item.id}music/300/300`} alt={item.title} className={`w-full h-full object-cover transition-transform duration-700 ${playingId === item.id ? 'scale-110' : 'group-hover:scale-105'}`} />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90">
                               <div className="absolute top-2 right-2 flex space-x-2 z-10"><div onClick={(e) => handleDownloadClick(e, item, 'music')} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center hover:bg-black/60 active:scale-90 transition-all overflow-hidden relative">{downloadingItems[item.id] !== undefined ? (<><div className="absolute bottom-0 left-0 right-0 bg-purple-500/30 transition-all" style={{ height: `${downloadingItems[item.id]}%` }}></div><span className="text-[8px] font-bold z-10">{downloadingItems[item.id]}%</span></>) : downloadedIds.includes(item.id) ? (<CheckCircle className="w-4 h-4 text-purple-400" />) : (<Download className="w-4 h-4 text-white/70" />)}</div></div>
                               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30 transition-all ${playingId === item.id ? 'bg-purple-500 border-purple-400 text-white' : 'opacity-0 group-hover:opacity-100 scale-90'}`}>{playingId === item.id ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}</div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3"><h3 className="font-bold text-sm truncate text-white">{item.title}</h3><div className="flex justify-between items-center text-xs text-slate-400 mt-1"><span>{item.author}</span><span>{item.duration}</span></div></div>
                      </button>
                  ))}
             </div>
          )}
      </div>
    </div>
  );
};

export default MaterialSquare;