import React, { useState } from 'react';
import { ChevronLeft, Music, Upload, Search, Play, Pause, Heart, Star, CloudDownload } from 'lucide-react';

interface MusicCenterProps {
  onBack: () => void;
}

const MusicCenter: React.FC<MusicCenterProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'square' | 'mine'>('square');
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // Mock Data with collection state
  const [musicList, setMusicList] = useState([
    { id: '1', title: '赛博朋克节奏', author: 'System', duration: '03:45', type: 'online', category: '电子', isCollected: false },
    { id: '2', title: '舒缓背景音', author: 'System', duration: '02:10', type: 'online', category: '氛围', isCollected: true }, // Already collected
    { id: '3', title: '动感电音', author: 'DJ Galbot', duration: '01:55', type: 'online', category: '舞曲', isCollected: false },
    { id: '4', title: '紧张氛围', author: 'System', duration: '04:20', type: 'online', category: '影视', isCollected: false },
    { id: '5', title: '我的录音 001', author: '我', duration: '00:45', type: 'local', category: '录音', isCollected: false },
    { id: '6', title: '导入的 MP3', author: '我', duration: '03:30', type: 'local', category: '导入', isCollected: false },
  ]);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const toggleCollect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMusicList(prev => prev.map(item => 
        item.id === id ? { ...item, isCollected: !item.isCollected } : item
    ));
  };

  // Filter Logic
  // Square: Shows all 'online' type items
  // Mine: Shows 'local' type items OR 'online' items that are collected
  const displayList = musicList.filter(item => {
      if (activeTab === 'square') return item.type === 'online';
      if (activeTab === 'mine') return item.type === 'local' || item.isCollected;
      return false;
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white relative">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
            <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/10">
            <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="ml-2 font-bold text-lg">音乐中心</h1>
        </div>
        {/* Upload button only visible in 'My Materials' tab as per requirement, but header button is removed to use in-grid button */}
        <div className="w-8"></div> 
      </div>

      {/* Tabs */}
      <div className="flex p-4 pb-0 bg-slate-900">
         <button 
           onClick={() => setActiveTab('square')}
           className={`mr-6 pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'square' ? 'text-cyan-400 border-cyan-400' : 'text-slate-500 border-transparent'}`}
         >
           素材广场
         </button>
         <button 
           onClick={() => setActiveTab('mine')}
           className={`pb-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'mine' ? 'text-cyan-400 border-cyan-400' : 'text-slate-500 border-transparent'}`}
         >
           我的素材
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
          {/* Search */}
          <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder={activeTab === 'square' ? "搜索在线音乐..." : "搜索我的音乐..."}
                className="w-full bg-slate-900 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
          </div>

          <div className="grid grid-cols-2 gap-4">
              {/* Upload Button - Only in My Materials */}
              {activeTab === 'mine' && (
                  <button className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center hover:bg-white/10 hover:border-white/30 transition-all active:scale-95 group">
                      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                          <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-400 group-hover:text-white">上传音乐</span>
                      <span className="text-[10px] text-slate-600 mt-1">支持 MP3/WAV</span>
                  </button>
              )}

              {displayList.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => togglePlay(item.id)}
                    className={`relative aspect-square rounded-2xl overflow-hidden group text-left border-2 transition-all ${playingId === item.id ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-transparent hover:border-white/10'}`}
                  >
                      {/* Cover Image */}
                      <img 
                        src={`https://picsum.photos/seed/${item.id}music/300/300`} 
                        alt={item.title} 
                        className={`w-full h-full object-cover transition-transform duration-700 ${playingId === item.id ? 'scale-110' : 'group-hover:scale-105'}`}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90">
                           {/* Top Right Actions */}
                           <div className="absolute top-2 right-2 flex space-x-2">
                               {/* Category Tag */}
                               <div className="bg-black/40 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white/80 border border-white/10">
                                   {item.category}
                               </div>
                           </div>

                           {/* Star / Collect Button (Only needed if online, or to un-star in mine) */}
                           <div 
                             onClick={(e) => toggleCollect(e, item.id)}
                             className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/20 backdrop-blur flex items-center justify-center hover:bg-black/40 active:scale-90 transition-all z-10"
                           >
                               <Star 
                                 className={`w-4 h-4 ${item.isCollected ? 'text-yellow-400 fill-yellow-400' : 'text-white/70'}`} 
                               />
                           </div>

                           {/* Play Icon (Centered) */}
                           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30 transition-all ${playingId === item.id ? 'bg-purple-500 border-purple-400 text-white' : 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'}`}>
                               {playingId === item.id ? (
                                    <div className="flex space-x-1 h-4 items-end">
                                        <div className="w-1 bg-white animate-[bounce_0.5s_infinite]"></div>
                                        <div className="w-1 bg-white animate-[bounce_0.7s_infinite]"></div>
                                        <div className="w-1 bg-white animate-[bounce_0.6s_infinite]"></div>
                                    </div>
                               ) : (
                                   <Play className="w-5 h-5 ml-0.5 fill-current" />
                               )}
                           </div>
                      </div>

                      {/* Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="font-bold text-sm truncate">{item.title}</h3>
                          <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                              <span>{item.author}</span>
                              <div className="flex items-center">
                                  {/* Indication if it's an online item in 'Mine' tab */}
                                  {activeTab === 'mine' && item.type === 'online' && <CloudDownload className="w-3 h-3 mr-1 text-cyan-400" />}
                                  <span>{item.duration}</span>
                              </div>
                          </div>
                      </div>
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
};

export default MusicCenter;