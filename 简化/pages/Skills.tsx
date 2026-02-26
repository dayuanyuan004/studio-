import React from 'react';
import { Zap, Search, Hand, Layers, Sparkles, LayoutGrid, Cpu, Check, ChevronRight } from 'lucide-react';

interface SkillsProps {
    onNavigate: (page: string) => void;
}

const Skills: React.FC<SkillsProps> = ({ onNavigate }) => {
    const installedSkills = [
        { id: '1', name: '抓取水瓶', desc: '识别并稳定抓取标准矿泉水瓶', icon: Hand, active: true },
        { id: '2', name: '分类水果', desc: '智能识别水果种类并归类放置', icon: LayoutGrid, active: true },
        { id: '3', name: '堆叠积木', desc: '精细力控实现多层积木堆叠', icon: Layers, active: false },
        { id: '4', name: '擦拭桌子', desc: '自主规划路径完成桌面清洁', icon: Sparkles, active: false },
    ];

    return (
        <div className="flex-1 h-full bg-[#0C0C0C] text-white overflow-hidden flex flex-col selection:bg-cyan-500/30">
            <header className="px-5 pt-8 pb-3 flex justify-between items-center bg-[#0C0C0C] sticky top-0 z-20 border-b border-white/5 shadow-lg">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-black shadow-lg shadow-cyan-900/20">
                        <Zap className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter uppercase italic">
                        SKILLS<span className="text-cyan-500">.</span>
                    </h1>
                </div>
                <button className="p-2 bg-white/5 rounded-full border border-white/10 text-slate-400 hover:text-white transition-all active:scale-90">
                    <Search className="w-5 h-5" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 pb-32 no-scrollbar">
                <div className="mb-8">
                    <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-5 px-1 flex items-center">
                        <Cpu className="w-3.5 h-3.5 mr-2" /> 已安装能力库
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {installedSkills.map(skill => (
                            <div key={skill.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-5 flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                <div className="flex items-center space-x-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${skill.active ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-slate-900 text-slate-700'}`}>
                                        <skill.icon className="w-7 h-7" strokeWidth={1.5} />
                                    </div>
                                    <div className="pr-4">
                                        <h3 className="font-black text-[15px] text-slate-200 tracking-tight uppercase group-hover:text-white transition-colors">{skill.name}</h3>
                                        <p className="text-[10px] text-slate-500 font-bold mt-0.5 leading-relaxed">{skill.desc}</p>
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center justify-center">
                                    {skill.active ? (
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                                    ) : (
                                        <div className="w-2.5 h-2.5 bg-slate-800 rounded-full border border-white/5"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hero Card for Discovery */}
                <div className="p-8 rounded-[2.8rem] bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-white/10 text-center relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-[60px] -mr-10 -mt-10"></div>
                     <div className="relative z-10">
                        <div className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                            <Zap className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-[1000] text-white uppercase tracking-tight mb-3 italic">探索更多 AI 能力</h3>
                        <p className="text-[11px] text-slate-400 font-bold px-10 leading-relaxed mb-8 uppercase tracking-widest">
                            前往技能训练中心部署高阶任务应用<br/>持续进化您的 Galbot
                        </p>
                        <button 
                            onClick={() => {}}
                            className="w-full py-4 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center group-hover:bg-cyan-50"
                        >
                            前往训练中心 <ChevronRight className="w-4 h-4 ml-1" strokeWidth={3} />
                        </button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Skills;