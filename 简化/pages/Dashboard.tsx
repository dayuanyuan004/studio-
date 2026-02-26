
import React from 'react';
import { Move, Mic, Music, Plus, MoreHorizontal, Clock, ListChecks, Clapperboard, ChevronRight, Film } from 'lucide-react';
import VirtualRobot from '../components/VirtualRobot';
import { Device } from '../types';

interface DashboardProps {
  onNavigate: (page: string, id?: string) => void;
  activeDeviceIds?: string[];
  devices?: Device[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, activeDeviceIds = [], devices = [] }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#0C0C0C] text-white selection:bg-cyan-500/30">
      {/* Top Header - Unified Style */}
      <header className="px-5 pt-8 pb-3 flex justify-between items-center bg-[#0C0C0C] sticky top-0 z-20 border-b border-white/5 shadow-lg">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-900/20">
                <Clapperboard className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
                PERFORM<span className="text-purple-500">.</span>
            </h1>
        </div>
        <button 
            onClick={() => onNavigate('task-center')}
            className="p-2 bg-white/5 rounded-full border border-white/10 text-slate-400 hover:text-white transition-all active:scale-90"
        >
            <ListChecks className="w-5 h-5" />
        </button>
      </header>

      <div className="px-5 space-y-8 pb-32 pt-6">
        
        {/* Section 1: Hero Cards (Creation Tools) */}
        <section className="space-y-4">
          <button 
            onClick={() => onNavigate('mimic-flow')}
            className="w-full bg-gradient-to-br from-[#D1E1E4] to-[#B8CED3] rounded-[2.5rem] p-6 flex justify-between items-center group active:scale-[0.97] transition-all overflow-hidden relative h-32 shadow-[0_15px_35px_rgba(0,0,0,0.3)]"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="text-left relative z-10">
              <h2 className="text-[#1A1A1A] text-3xl font-black tracking-normal leading-none mb-1.5 uppercase">动作模拟</h2>
              <p className="text-cyan-900/60 text-[10px] font-black uppercase tracking-[1px]">AI 视觉动作捕捉生成</p>
              <div className="mt-3 inline-flex px-3 py-1 bg-cyan-600 rounded-full shadow-lg shadow-cyan-900/20">
                 <span className="text-[9px] font-black text-white italic uppercase tracking-tighter">AI Motion Capture</span>
              </div>
            </div>
            <div className="relative z-10">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-cyan-900/30 flex items-center justify-center group-hover:border-cyan-900/50 group-hover:rotate-90 transition-all duration-500">
                    <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white shadow-xl">
                        <Plus className="w-5 h-5" strokeWidth={3} />
                    </div>
                </div>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('studio')}
            className="w-full bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 flex justify-between items-center group active:scale-[0.97] transition-all overflow-hidden relative h-32 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.4)]"
          >
            <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-cyan-500/10 rounded-full blur-[60px] group-hover:bg-cyan-500/20 transition-colors duration-700"></div>
            <div className="text-left relative z-10">
              <h2 className="text-white text-3xl font-black tracking-normal leading-none mb-1.5 uppercase">动作编排</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[1px]">多轨道专业精细化编辑</p>
              <div className="mt-3 inline-flex px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                 <span className="text-[9px] font-black text-cyan-400 italic uppercase tracking-tighter">Keyframe Track</span>
              </div>
            </div>
            <div className="relative z-10">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:rotate-90 transition-all duration-500">
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <Plus className="w-5 h-5" strokeWidth={3} />
                    </div>
                </div>
            </div>
          </button>
        </section>

        {/* Section 2: Management Icons */}
        <section className="grid grid-cols-4 gap-3">
          {[
            { id: 'my-motions', label: '动作库', icon: Move },
            { id: 'my-voice', label: '语音库', icon: Mic },
            { id: 'my-music', label: '音乐库', icon: Music },
            { id: 'works', label: '本地作品', icon: Film },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="w-full aspect-square bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.25rem] flex items-center justify-center transition-all active:scale-90 active:bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:border-white/20">
                <item.icon className={`w-5 h-5 text-slate-400 group-hover:text-white group-hover:scale-110 transition-all duration-300`} strokeWidth={1.5} />
              </div>
              <span className="text-[9px] text-slate-500 font-bold group-hover:text-slate-300 transition-colors whitespace-nowrap uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </section>

        {/* Section 3: Recent Works Preview */}
        <section className="pt-2">
           <div className="flex justify-between items-end mb-5 px-1">
              <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center">
                  最近编辑
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full ml-1.5 mb-0.5"></div>
              </h2>
              <button 
                  onClick={() => onNavigate('works')}
                  className="flex items-center text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                  查看全部 <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
           </div>
           
           <div className="space-y-3">
              {[
                { id: '1', title: 'Galbot Dance 981', tag: '娱乐', style: 'wave' as const, date: '22 Jan', time: '01:12' },
                { id: '3', title: '迎宾接待标准流程', tag: '商务', style: 'groove' as const, date: '20 Jan', time: '00:45' },
                { id: '4', title: '展厅巡逻逻辑', tag: '安防', style: 'wave' as const, date: '18 Jan', time: '02:00' },
                { id: '5', title: '儿童节特辑表演', tag: '节日', style: 'cute' as const, date: '15 Jan', time: '03:15' },
                { id: '6', title: '错误报警反馈', tag: '系统', style: 'weird' as const, date: '12 Jan', time: '00:05' },
              ].map((work) => (
                  <button 
                    key={work.id} 
                    onClick={() => onNavigate('work-preview', work.id)}
                    className="w-full text-left bg-white/5 backdrop-blur-xl rounded-[2rem] p-3 border border-white/10 flex items-center active:scale-95 transition-all group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-white/20"
                  >
                      <div className="w-16 h-16 bg-black/40 rounded-[1.25rem] overflow-hidden shrink-0 relative flex items-center justify-center border border-white/5">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                          <div className="transform scale-[0.28] group-hover:scale-[0.32] transition-transform duration-500">
                             <VirtualRobot isDancing={true} animationStyle={work.style} showStatus={false} /> 
                          </div>
                      </div>

                      <div className="flex-1 ml-4 min-w-0">
                          <div className="flex justify-between items-start">
                              <h4 className="font-bold text-slate-200 text-xs truncate pr-2 group-hover:text-white transition-colors">{work.title}</h4>
                              <MoreHorizontal className="w-4 h-4 text-slate-600 shrink-0 group-hover:text-slate-400" />
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                                <span className="text-[9px] font-black bg-cyan-900/30 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase tracking-wider">{work.tag}</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide truncate">
                                    {work.style === 'wave' ? '能量波风格' : '律动节奏'}
                                </span>
                          </div>
                          
                          <div className="flex items-center space-x-3 mt-2 opacity-40 group-hover:opacity-60 transition-opacity">
                              <span className="text-[9px] font-black text-slate-400 uppercase">{work.date}</span>
                          </div>
                      </div>
                  </button>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
