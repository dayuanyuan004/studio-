
import React, { useState } from 'react';
import { ChevronLeft, MapPin, Image as ImageIcon, Send, Check, Sparkles, Hash } from 'lucide-react';
import VirtualRobot from '../components/VirtualRobot';

interface PublishEditorProps {
    onBack: () => void;
    workId: string;
    initialTitle: string;
    onPublish: (workId: string, data: { title: string, desc: string, location?: string, cover?: string, tags: string[] }) => void;
}

const PublishEditor: React.FC<PublishEditorProps> = ({ onBack, workId, initialTitle, onPublish }) => {
    const [title, setTitle] = useState(initialTitle);
    const [desc, setDesc] = useState('');
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>(['娱乐']);

    const tags = ['娱乐', '舞蹈', '剧情', '商务', '科技', '整活', '迎宾', '生活'];

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag) 
                : [...prev, tag]
        );
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            alert("请输入标题");
            return;
        }
        setIsPublishing(true);
        // Simulate network request
        setTimeout(() => {
            onPublish(workId, {
                title,
                desc,
                location: locationEnabled ? '上海市·Galbot 创新中心' : undefined,
                cover: 'default',
                tags: selectedTags
            });
        }, 1500);
    };

    return (
        <div className="h-full bg-[#0C0C0C] text-white flex flex-col relative">
            {/* Header synced */}
            <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-20 shadow-lg">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                    <ChevronLeft className="w-6 h-6 text-slate-400" />
                </button>
                <h1 className="font-black text-lg uppercase tracking-tight ml-1 text-white">发布作品</h1>
                <div className="w-8"></div> 
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-32">
                
                {/* Preview Card */}
                <div className="mb-8 p-1 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10">
                    <div className="bg-[#1A1A1A] rounded-[1.8rem] overflow-hidden flex shadow-2xl">
                         {/* Cover */}
                        <div className="w-1/3 relative bg-black/50 border-r border-white/5">
                            <div className="absolute inset-0 flex items-center justify-center transform scale-[0.6]">
                                <VirtualRobot isDancing={false} showStatus={false} />
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white/80 border border-white/10 backdrop-blur">
                                COVER
                            </div>
                        </div>
                        {/* Info Preview */}
                        <div className="flex-1 p-5 flex flex-col justify-center">
                            <h2 className="text-xl font-[1000] text-white leading-none mb-2 line-clamp-2">{title || '未命名作品'}</h2>
                            <p className="text-[10px] font-bold text-slate-500 line-clamp-2 leading-relaxed">{desc || '暂无描述...'}</p>
                            <div className="mt-3 flex flex-wrap gap-1">
                                {selectedTags.map(tag => (
                                    <span key={tag} className="text-[9px] font-black bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 uppercase tracking-wider">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">作品标题</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="给作品起个响亮的名字"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all shadow-inner"
                        />
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">描述 / 文案</label>
                        <textarea 
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="分享你的创作灵感..."
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-[1.5rem] px-5 py-4 text-sm font-bold text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all resize-none shadow-inner leading-relaxed"
                        />
                    </div>
                    
                    {/* Tags */}
                    <div className="space-y-3">
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">分类标签 (可多选)</label>
                         <div className="flex flex-wrap gap-2">
                             {tags.map(tag => (
                                 <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedTags.includes(tag) ? 'bg-cyan-500 text-black border-cyan-500 shadow-lg shadow-cyan-900/20' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'}`}
                                 >
                                     {tag}
                                 </button>
                             ))}
                         </div>
                    </div>

                    {/* Location Toggle */}
                    <button 
                        onClick={() => setLocationEnabled(!locationEnabled)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.99] mt-4 ${locationEnabled ? 'bg-cyan-950/30 border-cyan-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`p-2.5 rounded-xl transition-colors ${locationEnabled ? 'bg-cyan-500 text-black shadow-lg' : 'bg-white/5 text-slate-600'}`}>
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <div className={`text-sm font-black ${locationEnabled ? 'text-white' : 'text-slate-500'}`}>
                                    {locationEnabled ? '上海市·Galbot 创新中心' : '添加位置信息'}
                                </div>
                            </div>
                        </div>
                        {locationEnabled && <Check className="w-5 h-5 text-cyan-400" strokeWidth={3} />}
                    </button>
                </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/5 bg-[#0C0C0C] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-30">
                <button 
                    onClick={handleSubmit}
                    disabled={isPublishing}
                    className={`w-full py-5 rounded-full font-[1000] uppercase tracking-[0.2em] flex items-center justify-center text-[11px] shadow-2xl active:scale-[0.98] transition-all ${isPublishing ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' : 'bg-cyan-500 text-black shadow-cyan-900/40'}`}
                >
                    {isPublishing ? (
                        <>
                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                            发布中...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4 mr-2" strokeWidth={3} /> 确认发布作品
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PublishEditor;
