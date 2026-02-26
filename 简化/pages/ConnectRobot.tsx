
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Wifi, Router, ScanLine, Loader2, Check, Smartphone, Lock, Eye, EyeOff, Radio } from 'lucide-react';
import { RobotModel, Device } from '../types';

interface ConnectRobotProps {
    onBack: () => void;
    onConnectSuccess: (device: Device) => void;
}

type Step = 'scanning' | 'device-list' | 'mode-select' | 'credentials' | 'connecting';

const ConnectRobot: React.FC<ConnectRobotProps> = ({ onBack, onConnectSuccess }) => {
    const [step, setStep] = useState<Step>('scanning');
    const [scannedDevices, setScannedDevices] = useState<string[]>([]);
    const [selectedDeviceName, setSelectedDeviceName] = useState<string | null>(null);
    const [connectionMode, setConnectionMode] = useState<'wifi' | 'ap' | null>(null);
    const [password, setPassword] = useState('');
    const [ssid, setSsid] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [progress, setProgress] = useState(0);

    // Mock Scanning Effect
    useEffect(() => {
        if (step === 'scanning') {
            const timer = setTimeout(() => {
                setScannedDevices(['Galbot-R1-2049', 'Galbot-R1-8848']);
                setStep('device-list');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Mock Connecting Effect
    useEffect(() => {
        if (step === 'connecting') {
            setProgress(0);
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        handleFinish();
                        return 100;
                    }
                    return prev + 1; // 100 ticks * interval
                });
            }, 50); // 5 seconds total
            return () => clearInterval(interval);
        }
    }, [step]);

    const handleFinish = () => {
        const newDevice: Device = {
            id: `d_${Date.now()}`,
            name: selectedDeviceName || 'New Robot',
            serialNumber: `SN-${Math.floor(Math.random()*10000)}`,
            status: '在线',
            model: RobotModel.R1,
            battery: 100
        };
        onConnectSuccess(newDevice);
    };

    const renderScanning = () => (
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in">
            <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-ping [animation-duration:3s]"></div>
                <div className="absolute inset-8 border-2 border-cyan-500/40 rounded-full animate-ping [animation-duration:2s]"></div>
                <div className="w-48 h-48 bg-cyan-900/10 rounded-full border border-cyan-500/50 flex items-center justify-center backdrop-blur-sm relative overflow-hidden">
                    <ScanLine className="w-16 h-16 text-cyan-400 animate-pulse" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/50 shadow-[0_0_20px_#22d3ee] animate-[scan_2s_linear_infinite]"></div>
                </div>
            </div>
            <p className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] animate-pulse">正在搜索附近的机器人...</p>
        </div>
    );

    const renderDeviceList = () => (
        <div className="p-6 space-y-6 animate-in slide-in-from-right">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">选择要连接的设备</h2>
            <div className="space-y-3">
                {scannedDevices.map((name) => (
                    <button
                        key={name}
                        onClick={() => { setSelectedDeviceName(name); setStep('mode-select'); }}
                        className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 active:scale-[0.98] transition-all group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-cyan-900/20 rounded-full flex items-center justify-center text-cyan-400">
                                <Radio className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm text-white">{name}</span>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                    </button>
                ))}
            </div>
            <button onClick={() => setStep('scanning')} className="w-full py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                重新扫描
            </button>
        </div>
    );

    const renderModeSelect = () => (
        <div className="p-6 h-full flex flex-col animate-in slide-in-from-right">
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6">选择连接模式</h2>
            
            <div className="grid gap-4"> {/* Reduced gap */}
                {/* Wi-Fi Mode (Prominent) */}
                <button
                    onClick={() => { setConnectionMode('wifi'); setStep('credentials'); }}
                    className="p-6 bg-gradient-to-br from-cyan-900/40 to-cyan-900/10 border border-cyan-500/50 rounded-[2rem] text-left hover:border-cyan-400 transition-all active:scale-[0.98] shadow-lg shadow-cyan-900/10 group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-3 opacity-50">
                        <Wifi className="w-24 h-24 text-cyan-500/10 -mr-4 -mt-4" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-cyan-500/20">
                                <Wifi className="w-6 h-6" />
                            </div>
                            <span className="bg-cyan-500 text-black text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider">推荐</span>
                        </div>
                        <h3 className="font-black text-lg text-white mb-1">Wi-Fi 网络模式</h3>
                        <p className="text-[10px] text-cyan-200/60 font-bold">支持所有功能</p>
                    </div>
                </button>

                {/* AP Mode (Secondary, Smaller) */}
                <button
                    onClick={() => { setConnectionMode('ap'); setStep('credentials'); }}
                    className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-left hover:bg-white/10 transition-all active:scale-[0.98] flex items-center justify-between group"
                >
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 mr-3 group-hover:scale-110 transition-transform">
                            <Router className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-black text-xs text-slate-300">AP 直连模式</h3>
                            <p className="text-[9px] text-slate-600 mt-0.5">仅支持人机交互、遥控运动功能</p>
                        </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-700 rotate-180" />
                </button>
            </div>
        </div>
    );

    const renderCredentials = () => (
        <div className="p-6 flex flex-col h-full animate-in slide-in-from-right">
            <div className="flex-1 space-y-8">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                        {connectionMode === 'wifi' ? '配置 Wi-Fi 网络' : '连接设备热点'}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold">
                        {connectionMode === 'wifi' ? '请输入当前环境 Wi-Fi 信息' : '请输入机器人初始密码'}
                    </p>
                </div>

                {/* Schematic Diagram (Same for both as requested) */}
                <div className="w-full h-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                    <div className="flex items-center space-x-8 opacity-80">
                        <Smartphone className="w-10 h-10 text-slate-400" />
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-cyan-500 rounded-full animate-ping"></div>
                            <div className="w-1 h-1 bg-cyan-500 rounded-full animate-ping delay-75"></div>
                            <div className="w-1 h-1 bg-cyan-500 rounded-full animate-ping delay-150"></div>
                        </div>
                        <div className="relative">
                            <div className="w-12 h-12 border-2 border-cyan-500 rounded-xl flex items-center justify-center">
                                {connectionMode === 'wifi' ? <Wifi className="w-6 h-6 text-cyan-400" /> : <Router className="w-6 h-6 text-purple-400" />}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {connectionMode === 'wifi' ? (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Wi-Fi 名称</label>
                            <input 
                                type="text" 
                                value={ssid}
                                onChange={(e) => setSsid(e.target.value)}
                                placeholder="输入 Wi-Fi 名称"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-cyan-500/50 transition-all"
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">机器人热点</label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-300">
                                {selectedDeviceName}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">密码</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                <Lock className="w-4 h-4" />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="输入密码"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3.5 text-sm font-bold text-white outline-none focus:border-cyan-500/50 transition-all"
                            />
                            <button 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setStep('connecting')}
                disabled={connectionMode === 'wifi' && !ssid}
                className="w-full py-5 bg-cyan-500 text-black rounded-full font-[1000] uppercase tracking-[0.2em] text-xs shadow-xl shadow-cyan-900/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                开始连接
            </button>
        </div>
    );

    const renderConnecting = () => (
        <div className="flex flex-col items-center justify-center h-full px-10 animate-in fade-in">
            {/* Schematic Diagram (Same for both as requested) - Reused here for consistency or visual cue */}
            <div className="relative w-full max-w-[240px] mb-12">
                 <div className="flex items-center justify-between opacity-80 mb-8">
                        <Smartphone className="w-8 h-8 text-slate-400" />
                        <div className="flex-1 mx-4 h-0.5 bg-white/10 relative overflow-hidden">
                             <div className="absolute inset-0 bg-cyan-500 animate-[shimmer_1.5s_infinite] w-1/2"></div>
                        </div>
                        <div className="w-10 h-10 border-2 border-cyan-500 rounded-lg flex items-center justify-center">
                             {connectionMode === 'wifi' ? <Wifi className="w-5 h-5 text-cyan-400" /> : <Router className="w-5 h-5 text-purple-400" />}
                        </div>
                 </div>
                 
                 {/* Linear Progress Bar */}
                 <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4] transition-all duration-100 ease-linear" 
                        style={{ width: `${progress}%` }}
                     ></div>
                 </div>
                 <div className="flex justify-between mt-2">
                     <span className="text-[9px] font-mono text-cyan-400">{progress}%</span>
                 </div>
            </div>

            <h2 className="text-lg font-black text-white uppercase tracking-tight mb-3">连接中...</h2>
            <p className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-widest leading-relaxed">
                正在与机器人建立安全通道<br/>请勿移动设备并耐心等待
            </p>
            
            <button 
                onClick={() => setStep('credentials')}
                className="mt-12 px-8 py-3 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            >
                取消连接
            </button>
        </div>
    );

    return (
        <div className="h-full w-full bg-[#0C0C0C] text-white flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-8 pb-3 flex items-center bg-[#0C0C0C] z-20">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all">
                    <ChevronLeft className="w-6 h-6 text-slate-400" />
                </button>
                {step !== 'scanning' && <span className="ml-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">添加机器人</span>}
            </div>

            <div className="flex-1 relative">
                {step === 'scanning' && renderScanning()}
                {step === 'device-list' && renderDeviceList()}
                {step === 'mode-select' && renderModeSelect()}
                {step === 'credentials' && renderCredentials()}
                {step === 'connecting' && renderConnecting()}
            </div>
        </div>
    );
};

export default ConnectRobot;
