
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Share2, Heart, Send, Check, FileEdit, Cpu, Loader2, X, CheckSquare, Square, Battery, Radio, Trash2 } from 'lucide-react';
import VirtualRobot from './VirtualRobot';
import { WorkStatus, Device } from '../types';

interface WorkPreviewProps {
    onBack: () => void;
    workId: string;
    workStatus?: WorkStatus;
    workTitle?: string;
    // Fix: Expand animationStyle to include all robot animation styles supported by VirtualRobot
    animationStyle?: 'wave' | 'groove' | 'cute' | 'wild' | 'elegant' | 'weird'; // Added Prop
    onPublish: (id: string) => void;
    onNavigate: (page: string, id?: string) => void;
    onDelete?: (id: string) => void;
    availableDevices?: Device[];
    onDeploy?: (deviceIds: string[]) => void;
}

const WorkPreview: React.FC<WorkPreviewProps> = ({ 
    onBack, 
    workId, 
    workStatus, 
    workTitle, 
    animationStyle = 'wave',
    onPublish, 
    onNavigate,
    onDelete,
    availableDevices = [],
    onDeploy
}) => {
    
    const [showDeviceSelector, setShowDeviceSelector] = useState(false);
    const [selectedDevicesForApply, setSelectedDevicesForApply] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (showDeviceSelector) {
            setSelectedDevicesForApply([]); 
        }
    }, [showDeviceSelector]);

    const showToastMsg = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };

    const toggleDeviceSelection = (id: string) => {
        setSelectedDevicesForApply(prev => 
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const confirmApply = () => {
        if (selectedDevicesForApply.length > 0) {
            if (onDeploy) onDeploy(selectedDevicesForApply);
            showToastMsg(`已部署指令至 ${selectedDevicesForApply.length} 台机器人`);
            setShowDeviceSelector(false);
        } else {
            alert('请至少选择一台机器人');
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(workId);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#0C0C0C] text-white relative select-none animate-in fade-in slide-in-from-right-4">
            {toast && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-5 py-2.5 rounded-full shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
                    <Check className="w-4 h-4 mr-2 text-green-500" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{toast}</span>
                </div>
            )}

            {/* Header synced with Dashboard/Studio */}
            <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-30 shadow-lg">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all">
                        <ChevronLeft className="w-6 h-6 text-slate-400" />
                    </button>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">预览编排</div>
                </div>
                <button 
                    onClick={() => setShowDeviceSelector(true)}
                    className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center bg-cyan-900/20 border border-cyan-500/40 text-cyan-400 active:scale-95 transition-all shadow-lg shadow-cyan-900/10"
                >
                    <Cpu className="w-3.5 h-3.5 mr-1.5" strokeWidth={3} /> 部署
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                <div className="transform scale-[0.9]">
                    <VirtualRobot isDancing={true} animationStyle={animationStyle} showStatus={false} />
                </div>
                
                {/* Information Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-32 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/50 to-transparent pointer-events-none z-10">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${workStatus === WorkStatus.Draft ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                            {workStatus === WorkStatus.Draft ? '未发布' : '已发布'}
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">时长 00:45</span>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-60">
                             | {animationStyle === 'wave' ? '能量波风格' : '律动节奏'}
                         </span>
                    </div>
                    <h2 className="text-2xl font-[1000] text-white mb-2 tracking-tight uppercase leading-tight">{workTitle || '未命名作品'}</h2>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed line-clamp-2 pr-12">
                        这是基于 R1 旗舰版骨架捕捉生成的自定义动作，包含同步语音演艺与表情联动效果。
                    </p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="px-8 pb-10 pt-4 bg-[#0C0C0C] border-t border-white/5 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex gap-4">
                    {/* Always show edit button for flexibility, but publish button changes state */}
                    <button 
                        onClick={() => onNavigate('studio', workId)}
                        className="flex-1 py-4 bg-white/5 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-all border border-white/5"
                    >
                        <FileEdit className="w-4 h-4 mb-1 mx-auto" />
                        <span>编辑修改</span>
                    </button>

                    {workStatus === WorkStatus.Draft ? (
                        <button 
                            onClick={() => onPublish(workId)}
                            className="flex-[1.5] py-4 bg-cyan-500 rounded-2xl text-black font-[1000] uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-all shadow-2xl shadow-cyan-900/40"
                        >
                            <Send className="w-4 h-4 mb-1 mx-auto" strokeWidth={3} />
                            <span>发布至广场</span>
                        </button>
                    ) : (
                        <button 
                            disabled
                            className="flex-[1.5] py-4 bg-white/10 rounded-2xl text-slate-500 font-[1000] uppercase text-[10px] tracking-[0.2em] cursor-not-allowed border border-white/5"
                        >
                            <Check className="w-4 h-4 mb-1 mx-auto" strokeWidth={3} />
                            <span>已发布</span>
                        </button>
                    )}
                    
                    {/* Show delete only if published (to remove from list) or handle in Works.tsx? Requirements usually allow deleting drafts too. Keeping delete in preview for published works makes sense. */}
                    {workStatus === WorkStatus.Completed && (
                        <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-14 h-14 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center text-red-500 active:scale-90 transition-all hover:bg-red-500/10 hover:border-red-500/20 shrink-0"
                        >
                            <Trash2 className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Device Selection Modal */}
            {showDeviceSelector && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-[#1A1A1A] border border-white/10 w-full sm:w-96 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col pointer-events-auto">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">选择部署设备</h2>
                            <button onClick={() => setShowDeviceSelector(false)} className="p-2 rounded-full hover:bg-white/5 active:scale-75 transition-all">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto mb-8 space-y-3 no-scrollbar pr-1">
                            {availableDevices.length > 0 ? availableDevices.map(device => {
                                const isSelected = selectedDevicesForApply.includes(device.id);
                                return (
                                <button 
                                    key={device.id} 
                                    onClick={() => toggleDeviceSelection(device.id)}
                                    className={`w-full p-5 rounded-[1.75rem] border flex items-center justify-between transition-all active:scale-[0.98] 
                                        ${isSelected 
                                            ? 'bg-gradient-to-br from-[#D1E1E4] to-[#B8CED3] border-white' 
                                            : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors 
                                            ${isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-slate-500'}`}>
                                            <Cpu className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className={`font-black text-[11px] uppercase tracking-widest ${isSelected ? 'text-[#1A1A1A]' : 'text-white'}`}>
                                                {device.name}
                                            </div>
                                            <div className={`flex items-center space-x-2 text-[9px] font-black uppercase mt-0.5 ${isSelected ? 'text-cyan-900/60' : 'text-slate-600'}`}>
                                                <span>{device.serialNumber}</span>
                                                <div className="flex items-center">
                                                    <Battery className="w-2.5 h-2.5 mr-1" />
                                                    {device.battery}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {isSelected ? <CheckSquare className="w-5 h-5 text-cyan-900" strokeWidth={2.5} /> : <Square className="w-5 h-5 text-slate-700" />}
                                </button>
                            )}) : (
                                <div className="text-center py-10">
                                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">暂无在线机器人</p>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={confirmApply}
                            disabled={selectedDevicesForApply.length === 0}
                            className={`w-full py-5 rounded-full font-[1000] uppercase tracking-[0.2em] transition-all shadow-2xl ${selectedDevicesForApply.length > 0 ? 'bg-cyan-500 text-black shadow-cyan-900/40' : 'bg-white/5 text-slate-700 border border-white/5 cursor-not-allowed'}`}
                        >
                            确认部署 ({selectedDevicesForApply.length})
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-xs rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-3 tracking-tight uppercase">删除发布作品?</h3>
                        <p className="text-[10px] font-bold text-slate-500 mb-10 leading-relaxed uppercase tracking-widest px-4">
                            此操作将永久删除该已发布作品。
                        </p>
                        
                        <div className="flex w-full gap-4">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-5 bg-white/5 rounded-full text-slate-500 font-black uppercase text-[10px] active:scale-95 transition-all border border-white/5">取消</button>
                            <button 
                                onClick={handleDelete}
                                className="flex-1 py-5 bg-red-600 rounded-full text-white font-black uppercase text-[10px] active:scale-95 transition-all shadow-xl shadow-red-900/40"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkPreview;