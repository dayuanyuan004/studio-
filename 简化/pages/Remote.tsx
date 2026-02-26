
import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, ChevronLeft, RotateCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand, Heart, User, Activity, StopCircle, Zap, MessageSquare, Signal, ChevronDown, Lock, Play, WifiOff, AlertTriangle, X, ShieldAlert, Ban, Power, Eye, ScanLine, ScreenShare, Minimize, Maximize } from 'lucide-react';
import { Device, DeploymentStatus } from '../types';

interface RemoteProps {
    onNavigate: (page: string) => void;
    onBack?: () => void;
    devices?: Device[];
    deviceDeployments?: Record<string, DeploymentStatus>;
    onStopTask?: (deviceId: string) => void;
    currentRobotId?: string; // New Prop
}

const DPad = ({ label, className = "", disabled = false, small = false }: { label?: string, className?: string, disabled?: boolean, small?: boolean }) => (
    <div className={`${small ? 'w-24 h-24' : 'w-28 h-28'} relative flex items-center justify-center ${className} ${disabled ? 'opacity-20' : ''}`}>
        <div className="absolute inset-0 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm"></div>
        {/* Up */}
        <button disabled={disabled} className={`absolute ${small ? 'top-0.5' : 'top-1'} left-1/2 -translate-x-1/2 p-2 active:scale-90 transition-transform text-white/40 hover:text-cyan-400 active:text-cyan-400 disabled:pointer-events-none`}>
            <ArrowUp className={`${small ? 'w-4 h-4' : 'w-5 h-5'} fill-current`} />
        </button>
        {/* Down */}
        <button disabled={disabled} className={`absolute ${small ? 'bottom-0.5' : 'bottom-1'} left-1/2 -translate-x-1/2 p-2 active:scale-90 transition-transform text-white/40 hover:text-cyan-400 active:text-cyan-400 disabled:pointer-events-none`}>
            <ArrowDown className={`${small ? 'w-4 h-4' : 'w-5 h-5'} fill-current`} />
        </button>
        {/* Left */}
        <button disabled={disabled} className={`absolute ${small ? 'left-0.5' : 'left-1'} top-1/2 -translate-y-1/2 p-2 active:scale-90 transition-transform text-white/40 hover:text-cyan-400 active:text-cyan-400 disabled:pointer-events-none`}>
            <ArrowLeft className={`${small ? 'w-4 h-4' : 'w-5 h-5'} fill-current`} />
        </button>
        {/* Right */}
        <button disabled={disabled} className={`absolute ${small ? 'right-0.5' : 'right-1'} top-1/2 -translate-y-1/2 p-2 active:scale-90 transition-transform text-white/40 hover:text-cyan-400 active:text-cyan-400 disabled:pointer-events-none`}>
            <ArrowRight className={`${small ? 'w-4 h-4' : 'w-5 h-5'} fill-current`} />
        </button>
        
        <div className={`${small ? 'w-8 h-8' : 'w-10 h-10'} bg-white/10 rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] flex items-center justify-center backdrop-blur-md`}>
            {label && <span className="text-[7px] font-black text-white/30 uppercase tracking-tighter">{label === 'MOVE' ? '移动' : '视角'}</span>}
        </div>
    </div>
);

interface ActionBtnProps {
    label: string;
    icon: any;
    id: string;
    isActive: boolean;
    onTrigger: (id: string) => void;
    disabled?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ label, icon: Icon, id, isActive, onTrigger, disabled = false }) => (
    <button 
        onClick={() => onTrigger(id)}
        disabled={disabled}
        className={`flex flex-col items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-xl w-full h-11 transition-all active:scale-90 
        ${isActive ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-slate-300 hover:bg-white/10'}
        ${disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}`}
    >
        <Icon className="w-3 h-3 mb-0.5" strokeWidth={2} />
        <span className="text-[7px] font-black transform scale-90 uppercase tracking-widest">{label}</span>
    </button>
);

const Remote: React.FC<RemoteProps> = ({ onNavigate, onBack, devices = [], deviceDeployments = {}, onStopTask, currentRobotId }) => {
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [isLandscape, setIsLandscape] = useState(false);
    
    // Unlock Timer State (Blue Button)
    const [unlockProgress, setUnlockProgress] = useState(0);
    const unlockTimerRef = useRef<number | null>(null);
    const [stopToast, setStopToast] = useState(false);

    const onlineDevices = devices.filter(d => d.status === '在线');

    useEffect(() => {
        if (currentRobotId) {
             setSelectedDeviceId(currentRobotId);
        } else if (onlineDevices.length > 0 && !selectedDeviceId) {
             setSelectedDeviceId(onlineDevices[0].id);
        }
    }, [currentRobotId, devices]);

    const currentDevice = onlineDevices.find(d => d.id === selectedDeviceId);
    const currentDeployment = selectedDeviceId ? deviceDeployments[selectedDeviceId] : null;
    
    // Only lock if there is a deployment (task running)
    const isBusy = !!currentDeployment;
    
    const isOffline = currentDevice ? currentDevice.status !== '在线' : true;
    const onlineCount = onlineDevices.length;

    const triggerAction = (actionName: string) => {
        if (!currentDevice || isBusy) return;
        setActiveAction(actionName);
        setTimeout(() => setActiveAction(null), 600);
    };

    const handleBack = () => {
        if (onBack) onBack(); else onNavigate('dashboard');
    };

    const startUnlockTimer = () => {
        if (!currentDevice) return;
        setUnlockProgress(0);
        unlockTimerRef.current = window.setInterval(() => {
            setUnlockProgress(prev => {
                if (prev >= 100) {
                    triggerUnlock();
                    return 100;
                }
                return prev + 2.5; // Fill speed
            });
        }, 30);
    };

    const endUnlockTimer = () => {
        if (unlockTimerRef.current) {
            clearInterval(unlockTimerRef.current);
            unlockTimerRef.current = null;
        }
        setUnlockProgress(0);
    };

    const triggerUnlock = () => {
        if (unlockTimerRef.current) {
            clearInterval(unlockTimerRef.current);
            unlockTimerRef.current = null;
        }
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        setStopToast(true);
        setTimeout(() => setStopToast(false), 3000);
        if (onStopTask && selectedDeviceId) {
            onStopTask(selectedDeviceId);
        }
    };

    const allActions = [
        { id: 'hello', label: '招呼', icon: Hand },
        { id: 'bow', label: '鞠躬', icon: User },
        { id: 'heart', label: '比心', icon: Heart },
        { id: 'shake', label: '握手', icon: Activity },
    ];

    const toggleLandscape = () => {
        setIsLandscape(!isLandscape);
    };

    return (
        <div className="flex-1 h-full bg-[#0C0C0C] text-white overflow-hidden relative flex flex-col select-none animate-in fade-in duration-500">
            
            {/* PORTRAIT TOP BAR - Hidden in Landscape */}
            {!isLandscape && (
                <div className="relative flex items-center justify-between p-5 pt-10 z-[60] bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 shadow-lg">
                    <div className="flex items-center space-x-2">
                        <button onClick={handleBack} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all">
                            <ChevronLeft className="w-6 h-6 text-slate-400" />
                        </button>
                        <button 
                            onClick={toggleLandscape}
                            className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-cyan-500/10 text-cyan-400 active:scale-90 transition-all"
                            title="开启全屏控制"
                        >
                            <Maximize className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-md border border-white/10 pl-4 pr-3 py-2 rounded-full shadow-xl">
                        <div className="flex items-center space-x-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${onlineCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-white truncate max-w-[100px]">{currentDevice?.name || '未连接'}</span>
                        </div>
                        <div className="w-px h-4 bg-white/10"></div>
                        <div className={`flex items-center space-x-1 ${isOffline ? 'text-slate-500' : 'text-green-400'}`}>
                            <Battery className="w-3 h-3 fill-current" />
                            <span className="text-[10px] font-black font-mono">{isOffline ? '--' : `${currentDevice?.battery}%`}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTENT AREA WRAPPER FOR ROTATION */}
            <div className={`flex-1 flex flex-col relative transition-all duration-500 ${isLandscape ? 'landscape-mode-active' : ''}`}>
                
                {/* 1. LANDSCAPE NAV BAR - Reduced height h-12 */}
                {isLandscape && (
                    <div className="h-12 px-32 flex justify-between items-center shrink-0">
                         <div className="flex items-center space-x-4">
                            <button onClick={handleBack} className="w-9 h-9 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center active:scale-90 transition-all">
                                <ChevronLeft className="w-4 h-4 text-white" />
                            </button>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-full flex items-center space-x-2.5">
                                <div className={`w-1 h-1 rounded-full ${onlineCount > 0 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-500'}`}></div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-white">{currentDevice?.name || '机器人'}</span>
                                <div className="w-px h-2 bg-white/10 mx-0.5"></div>
                                <div className="flex items-center space-x-1 text-green-400">
                                    <Battery className="w-2 h-2 fill-current" />
                                    <span className="text-[8px] font-black font-mono">{isOffline ? '--' : `${currentDevice?.battery}%`}</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={toggleLandscape}
                            className="w-9 h-9 bg-white/10 text-cyan-400 border border-cyan-500/30 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-lg"
                            title="退出全屏"
                        >
                            <Minimize className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* 2. VIEWPORT AREA - Expanded with minimal padding py-2 */}
                <div className={`flex flex-col items-center justify-center relative transition-all duration-500 ${isLandscape ? 'flex-1 min-h-0 py-2 px-10' : 'p-6 flex-1'}`}>
                    <div className={`relative bg-slate-900 border-4 border-white/5 shadow-2xl overflow-hidden group transition-all duration-500 ${isLandscape ? 'h-full aspect-video rounded-2xl border-2' : 'w-full aspect-[4/3] max-w-[380px] rounded-[2.5rem]'}`}>
                        <img 
                            src="https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=1000" 
                            alt="Robot View" 
                            className={`w-full h-full object-cover transition-all duration-1000 ${isBusy ? 'grayscale brightness-[0.3] blur-sm' : 'brightness-110'}`}
                        />
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-4 left-4 bg-black/60 px-2 py-0.5 rounded flex items-center space-x-2">
                                <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-[7px] font-black text-white uppercase font-mono">直播回传</span>
                            </div>
                            <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                                <span className="text-[7px] font-black text-white/70 uppercase font-mono">R1_实时视觉_V2.1</span>
                            </div>
                        </div>
                        {isBusy && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center animate-in zoom-in duration-300">
                                <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/20 backdrop-blur-md">
                                    <Lock className="w-6 h-6 text-cyan-400" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. CONTROLS AREA (DPads Swapped in Landscape) */}
                {!isLandscape ? (
                    /* PORTRAIT CONTROLS */
                    <div className={`flex flex-col justify-end pb-12 px-6 space-y-10 relative z-20 transition-all duration-700 ${isBusy ? 'opacity-20 blur-md' : 'opacity-100'}`}>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 grid grid-cols-4 gap-2.5">
                                {allActions.map(action => (
                                    <ActionBtn key={action.id} {...action} isActive={activeAction === action.id} onTrigger={triggerAction} disabled={isBusy} />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between items-center px-4">
                            {/* MOVE is Left, LOOK is Right (Standard) */}
                            <DPad label="MOVE" disabled={isBusy} />
                            <div className="flex flex-col items-center space-y-2 opacity-20"><div className="w-1 h-1 bg-white rounded-full"></div><div className="w-1 h-1 bg-white rounded-full"></div><div className="w-1 h-1 bg-white rounded-full"></div></div>
                            <DPad label="LOOK" disabled={isBusy} />
                        </div>
                    </div>
                ) : (
                    /* LANDSCAPE CONTROLS - MOVE Left, LOOK Right */
                    <div className="h-28 px-32 bg-black/40 border-t border-white/5 backdrop-blur-md flex items-center justify-between shrink-0">
                         {/* MOVE DPad Left */}
                         <div className="w-32 flex justify-center">
                            <DPad label="MOVE" disabled={isBusy} small={true} />
                         </div>

                         {/* Action Keys Matrix */}
                         <div className="flex-1 max-w-[340px] px-4">
                             <div className="grid grid-cols-4 gap-2">
                                {allActions.map(action => (
                                    <ActionBtn key={action.id} {...action} isActive={activeAction === action.id} onTrigger={triggerAction} disabled={isBusy} />
                                ))}
                             </div>
                         </div>

                         {/* LOOK DPad Right */}
                         <div className="flex items-center space-x-6">
                            <DPad label="LOOK" disabled={isBusy} small={true} />
                         </div>
                    </div>
                )}
            </div>

            {/* FULL SCREEN LOCK OVERLAY */}
            {isBusy && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0C0C0C]/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="scanline"></div>
                    <div className="text-center px-10 mb-12">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] px-8 py-7 backdrop-blur-md mb-8 inline-block shadow-2xl">
                             <div className="flex items-center justify-center space-x-3 mb-2 opacity-60">
                                 <Play className="w-3 h-3 text-cyan-400 fill-current animate-pulse" />
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">正在执行任务</span>
                             </div>
                             <p className="text-lg font-black text-white uppercase tracking-widest leading-none">{currentDeployment?.title || "任务激活"}</p>
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] mb-4">控制权限已锁定</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-relaxed">任务执行中...<br/>如需接管请长按下方按钮</p>
                    </div>
                    
                    {/* Updated Unlock Button: Cyan Long Press */}
                    <div className="flex items-center space-x-8">
                        <div className="flex flex-col items-center space-y-3">
                            <button 
                                onMouseDown={startUnlockTimer} onMouseUp={endUnlockTimer} onMouseLeave={endUnlockTimer}
                                onTouchStart={(e) => { e.preventDefault(); startUnlockTimer(); }} onTouchEnd={endUnlockTimer}
                                className="w-24 h-24 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden transition-all active:scale-95 group"
                            >
                                <div className="absolute bottom-0 left-0 right-0 bg-cyan-500 transition-all duration-75 ease-linear opacity-80" style={{ height: `${unlockProgress}%` }}></div>
                                <Zap className={`w-10 h-10 relative z-10 transition-colors ${unlockProgress > 50 ? 'text-black' : 'text-cyan-400'}`} fill={unlockProgress > 50 ? "currentColor" : "none"} />
                            </button>
                            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em]">长按强制接管</span>
                        </div>
                    </div>
                </div>
            )}

            {/* STOP TOAST */}
            {stopToast && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] animate-in fade-in zoom-in duration-300">
                    <div className="bg-cyan-500 text-black px-8 py-5 rounded-[2.5rem] shadow-[0_0_60px_rgba(6,182,212,0.6)] flex items-center space-x-3 border-2 border-cyan-400/50">
                        <Zap className="w-6 h-6 fill-current animate-pulse" />
                        <span className="text-sm font-black uppercase tracking-[0.2em] italic">控制权已接管</span>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .landscape-mode-active {
                    transform: rotate(90deg);
                    transform-origin: center;
                    width: 920px;
                    height: 425px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -212.5px;
                    margin-left: -460px;
                    background: #050505;
                    display: flex;
                    flex-direction: column;
                    z-index: 70;
                }
            `}} />
        </div>
    );
};

export default Remote;
