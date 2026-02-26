
import React, { useState } from 'react';
import { ChevronLeft, CheckCircle, XCircle, Play, Pause, Activity, History, Trash2, Check } from 'lucide-react';
import { BackgroundTask } from '../types';

interface TaskCenterProps {
  onBack: () => void;
  tasks: BackgroundTask[]; // Changed to array
  onNavigate?: (page: string, id?: string) => void;
  onDeleteTask?: (id: string) => void;
}

const TaskCenter: React.FC<TaskCenterProps> = ({ onBack, tasks, onNavigate, onDeleteTask }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  // Filter tasks based on status logic
  // Current: idle, processing, and done (completed but NOT YET saved)
  const currentTasks = tasks.filter(t => t.status === 'processing' || t.status === 'idle' || t.status === 'done');
  
  // History: saved (as motion), failed, or deleted
  const historyTasks = tasks.filter(t => t.status === 'saved' || t.status === 'failed' || t.status === 'deleted');

  // Hardcoded mock history if empty, for display purposes
  const displayHistory = historyTasks.length > 0 ? historyTasks : [
      { id: 'h1', type: 'mimic', name: '动作分析：K-Pop Dance', progress: 100, status: 'saved', startTime: '1小时前' },
      { id: 'h4', type: 'mimic', name: '动作分析：Tai Chi Standard', progress: 100, status: 'deleted', startTime: '昨天' },
  ] as BackgroundTask[];

  const handleTaskClick = (task: BackgroundTask) => {
      // Only navigate if it's a current task (processing or done/ready to save)
      if (activeTab === 'current') {
          if (onNavigate) onNavigate('mimic-flow', task.id);
      }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (onDeleteTask) onDeleteTask(id);
  };

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] text-white relative">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center">
            <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
            <h1 className="ml-2 font-black text-xl tracking-tight uppercase">任务管理</h1>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-4">
          {(activeTab === 'current' ? currentTasks : displayHistory).map(task => {
              const isHistory = activeTab === 'history';
              return (
              <div key={task.id} onClick={() => handleTaskClick(task)} className={`bg-white/5 backdrop-blur-xl rounded-[2rem] p-5 border border-white/10 relative overflow-hidden group transition-all ${!isHistory ? 'active:scale-[0.98] cursor-pointer hover:bg-white/10' : 'cursor-default opacity-80'}`}>
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 ${!isHistory && task.status === 'processing' ? 'animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.2)]' : ''}`}>
                              <Activity className={`w-5 h-5 ${isHistory ? 'text-slate-600' : 'text-cyan-400'}`} />
                          </div>
                          <div>
                              <h3 className={`font-bold text-sm mb-0.5 ${isHistory ? 'text-slate-400' : 'text-white'}`}>{task.name}</h3>
                              <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                  <span>{task.startTime}</span>
                                  <span>•</span>
                                  <span className={
                                      task.status === 'processing' ? 'text-cyan-400' : 
                                      task.status === 'done' ? 'text-green-400' : 
                                      task.status === 'saved' ? 'text-blue-400' :
                                      task.status === 'deleted' ? 'text-red-400' :
                                      'text-slate-400'
                                  }>
                                      {task.status === 'done' ? '待保存' : task.status === 'saved' ? '已保存' : task.status === 'deleted' ? '已删除' : task.status.toUpperCase()}
                                  </span>
                              </div>
                          </div>
                      </div>
                      
                      {!isHistory ? (
                          <div className="flex items-center space-x-2">
                              {task.status === 'processing' ? (
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Pause className="w-4 h-4 fill-current text-yellow-500" /></div>
                              ) : (
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Play className="w-4 h-4 fill-current text-green-500 ml-0.5" /></div>
                              )}
                              {/* Only show delete if completed (done) but not saved yet */}
                              {task.status === 'done' && (
                                  <button 
                                    onClick={(e) => handleDeleteClick(e, task.id)}
                                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-white/10 transition-all active:scale-90"
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              )}
                          </div>
                      ) : (
                          <div className="flex items-center opacity-60">
                              {task.status === 'saved' ? <CheckCircle className="w-5 h-5 text-blue-500" /> : 
                               task.status === 'deleted' ? <Trash2 className="w-5 h-5 text-slate-600" /> :
                               <XCircle className="w-5 h-5 text-red-500" />}
                          </div>
                      )}
                  </div>

                  {!isHistory ? (
                      <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full transition-all duration-500 ${task.status === 'failed' ? 'bg-red-500' : (task.status === 'done' ? 'bg-green-500' : 'bg-cyan-500')}`} style={{ width: `${task.progress}%` }}></div>
                              </div>
                          </div>
                          <span className="text-[10px] font-black w-8 text-right font-mono text-cyan-400">{task.progress.toFixed(0)}%</span>
                      </div>
                  ) : (
                      <div className="grid grid-cols-3 gap-2 mt-2 bg-black/40 rounded-xl p-3 border border-white/5">
                          <div className="flex flex-col items-center"><span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">学习耗时</span><span className="text-[11px] font-mono font-black text-slate-400">01:00</span></div>
                          <div className="flex flex-col items-center border-l border-white/5"><span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">视频时长</span><span className="text-[11px] font-mono font-black text-slate-500">02:00</span></div>
                          <div className="flex flex-col items-center border-l border-white/5"><span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">状态</span><span className={`text-[9px] font-bold truncate ${task.status === 'saved' ? 'text-blue-400' : 'text-slate-600'}`}>{task.status === 'saved' ? 'SAVED' : 'DELETED'}</span></div>
                      </div>
                  )}
              </div>
          )})}

          {activeTab === 'current' && currentTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                  <Activity className="w-16 h-16 mb-4 opacity-10" />
                  <p className="text-[10px] font-black uppercase tracking-widest">暂无当前任务</p>
              </div>
          )}
      </div>

      {/* Bottom Tabs */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#0C0C0C]/90 backdrop-blur-xl border-t border-white/5 pb-safe z-40">
          <div className="flex justify-around items-center h-20 px-2">
             <button onClick={() => setActiveTab('current')} className={`flex-1 flex flex-col items-center space-y-1.5 transition-all ${activeTab === 'current' ? 'text-cyan-500' : 'text-slate-600'}`}>
               <Activity className={`w-5 h-5 ${activeTab === 'current' ? 'fill-current' : ''}`} />
               <span className="text-[10px] font-black uppercase tracking-widest">当前 ({currentTasks.length})</span>
             </button>
             <div className="w-px h-8 bg-white/5"></div>
             <button onClick={() => setActiveTab('history')} className={`flex-1 flex flex-col items-center space-y-1.5 transition-all ${activeTab === 'history' ? 'text-cyan-500' : 'text-slate-600'}`}>
               <History className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase tracking-widest">学习记录</span>
             </button>
          </div>
      </div>
    </div>
  );
};

export default TaskCenter;
