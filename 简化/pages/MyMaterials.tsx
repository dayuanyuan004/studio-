import React, { useState } from 'react';
import { ChevronLeft, Music, Mic, Upload, Play, Pause, FileAudio, Wand2, Keyboard, MoreHorizontal } from 'lucide-react';

interface MyMaterialsProps {
  onBack: () => void;
}

const MyMaterials: React.FC<MyMaterialsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'music'>('voice');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [ttsText, setTtsText] = useState('');

  // Mock Data
  const [voiceList] = useState([
    { id: 'v5', title: '我的录音 01', text: '自定义录音内容...', duration: '00:10', type: 'local', mood: '默认' },
    { id: 'v6', title: 'TTS 生成语音 02', text: '欢迎光临体验店...', duration: '00:05', type: 'local', mood: '甜美' },
    { id: 'v7', title: '已收藏: 欢迎光临', text: '欢迎光临 Galbot 体验店', duration: '00:03', type: 'online', mood: '热情' },
  ]);

  const [musicList] = useState([
    { id: 'm5', title: '我的录音 001', author: '我', duration: '00:45', type: 'local', category: '录音' },
    { id: 'm6', title: '导入的 MP3', author: '我', duration: '03:30', type: 'local', category: '导入' },
    { id: 'm7', title: '已收藏: 舒缓背景音', author: 'System', duration: '02:10', type: 'online', category: '氛围' },
  ]);

  const togglePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white relative">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
            <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/10">
            <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="ml-2 font-bold text-lg">我的素材</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-4 pb-0 bg-slate-900 sticky top-[57px] z-20 gap-6">
         <button 
           onClick={() => setActiveTab('voice')}
           className={`pb-2 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'voice' ? 'text-green-400 border-green-400' : 'text-slate-500 border-transparent'}`}
         >
           <Mic className="w-4 h-4 mr-1.5" /> 语音
         </button>
         <button 
           onClick={() => setActiveTab('music')}
           className={`pb-2 text-sm font-bold border-b-2 transition-colors flex items-center ${activeTab === 'music' ? 'text-purple-400 border-purple-400' : 'text-slate-500 border-transparent'}`}
         >
           <Music className="w-4 h-4 mr-1.5" /> 音乐
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
          
          {/* === VOICE TAB === */}
          {activeTab === 'voice' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  
                  {/* Top: Creation Tools */}
                  <div className="space-y-4">
                      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                          <Wand2 className="w-3 h-3 mr-1" /> 语音创作
                      </h2>
                      
                      {/* TTS Input */}
                      <div className="bg-slate-900 rounded-2xl p-4 border border-white/10 shadow-sm">
                          <div className="flex items-center mb-3 text-cyan-400">
                              <Keyboard className="w-5 h-5 mr-2" />
                              <h3 className="font-bold text-sm">文字转语音 (TTS)</h3>
                          </div>
                          <textarea 
                            value={ttsText}
                            onChange={(e) => setTtsText(e.target.value)}
                            placeholder="输入您想让机器人说的话..." 
                            className="w-full h-24 bg-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                          />
                          <div className="flex justify-between items-center mt-3">
                              <div className="flex space-x-2">
                                  <button className="text-[10px] bg-slate-800 px-2 py-1 rounded border border-white/10 text-slate-300 hover:text-white">音色: 甜美</button>
                              </div>
                              <button className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center hover:bg-cyan-600 hover:text-white transition-colors">
                                  生成
                              </button>
                          </div>
                      </div>

                      {/* Audio Recorder Compact */}
                      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                          <div className="flex items-center">
                               <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                                   <Mic className="w-5 h-5 text-red-500" />
                               </div>
                               <div>
                                   <h3 className="text-sm font-bold text-white">录制新语音</h3>
                                   <p className="text-[10px] text-slate-500">点击开始录制</p>
                               </div>
                          </div>
                          <button className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center">
                              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          </button>
                      </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/5 w-full"></div>

                  {/* Bottom: Local List */}
                  <div>
                      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                          <span><FileAudio className="w-3 h-3 mr-1 inline" /> 我的语音库</span>
                      </h2>

                      {/* Upload Button */}
                      <button className="w-full mb-3 bg-white/5 border border-dashed border-white/20 rounded-xl p-3 flex items-center justify-center space-x-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-[0.99]">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm font-medium">上传语音文件</span>
                      </button>

                      <div className="space-y-3">
                        {voiceList.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => togglePlay(item.id)}
                                className={`w-full bg-slate-900 rounded-xl p-3 border flex items-center justify-between group active:scale-[0.99] transition-all ${playingId === item.id ? 'border-green-500/50 bg-green-900/10' : 'border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${playingId === item.id ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                                        {playingId === item.id ? (
                                            <Pause className="w-3 h-3 fill-current" />
                                        ) : (
                                            <Play className="w-3 h-3 fill-current ml-0.5" />
                                        )}
                                    </div>
                                    <div className="text-left min-w-0">
                                        <div className="flex items-center">
                                            <h4 className={`font-bold text-sm truncate max-w-[120px] ${playingId === item.id ? 'text-green-400' : 'text-slate-200'}`}>{item.title}</h4>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{item.text}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-xs text-slate-500 font-mono">{item.duration}</span>
                                    <MoreHorizontal className="w-4 h-4 text-slate-600" />
                                </div>
                            </button>
                        ))}
                      </div>
                  </div>
              </div>
          )}

          {/* === MUSIC TAB === */}
          {activeTab === 'music' && (
             <div className="animate-in slide-in-from-right-4 duration-300">
                  {/* Upload Button */}
                  <button className="w-full mb-4 bg-white/5 border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-[0.99]">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">上传本地音乐</span>
                      <span className="text-[10px] text-slate-600">支持 MP3/WAV/AAC</span>
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                      {musicList.map(item => (
                          <button 
                            key={item.id}
                            onClick={() => togglePlay(item.id)}
                            className={`relative aspect-square rounded-2xl overflow-hidden group text-left border-2 transition-all ${playingId === item.id ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-transparent hover:border-white/10'}`}
                          >
                              <img 
                                src={`https://picsum.photos/seed/${item.id}music/300/300`} 
                                alt={item.title} 
                                className={`w-full h-full object-cover transition-transform duration-700 ${playingId === item.id ? 'scale-110' : 'group-hover:scale-105'}`}
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90">
                                   <div className="absolute top-2 right-2 bg-black/40 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white/80 border border-white/10">
                                       {item.category}
                                   </div>
                                   <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30 transition-all ${playingId === item.id ? 'bg-purple-500 border-purple-400 text-white' : 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'}`}>
                                       {playingId === item.id ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
                                   </div>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <h3 className="font-bold text-sm truncate">{item.title}</h3>
                                  <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                                      <span>{item.author}</span>
                                      <span>{item.duration}</span>
                                  </div>
                              </div>
                          </button>
                      ))}
                  </div>
             </div>
          )}
      </div>
    </div>
  );
};

export default MyMaterials;