
import React, { useState } from 'react';
import { Plus, Battery, Trash2, Cpu, ChevronLeft, Play, Activity, WifiOff } from 'lucide-react';
import { Device, DeploymentStatus } from '../types';

interface DevicesProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    activeDeviceIds: string[];
    onToggleConnect: (id: string) => void;
    onSetAll: (ids: string[]) => void;
    deviceList: Device[];
    onAddDevice: (device: Device) => void;
    onDeleteDevice: (id: string) => void;
    deviceDeployments?: Record<string, DeploymentStatus>;
    onSelectDevice?: (id: string) => void;
}

const Devices: React.FC<DevicesProps> = ({ 
    onBack, 
    onNavigate,
    activeDeviceIds, 
    onToggleConnect, 
    onSetAll,
    deviceList,
    onAddDevice,
    onDeleteDevice,
    deviceDeployments = {},
    onSelectDevice
}) => {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filter devices
  const onlineDevices = deviceList.filter(d => d.status === '在线');
  const offlineDevices = deviceList.filter(d => d.status !== '在线');

  const DeviceCard: React.FC<{ device: Device; isOffline?: boolean }> = ({ device, isOffline }) => {
    const deployment = deviceDeployments[device.id];

    return (
      <button
        onClick={() => onSelectDevice && onSelectDevice(device.id)}
        className={`w-full relative flex items-center p-4 rounded-[2rem] transition-all duration-500 border overflow-hidden animate-in slide-in-from-bottom-2 fade-in active:scale-[0.98] ${isOffline ? 'bg-white/5 border-white/5 opacity-60 grayscale cursor-default' : 'bg-white/5 border-white/10 hover:border-white/20 cursor-pointer'}`}
        disabled={!!isOffline && !onSelectDevice}
      >
        {/* Device Thumbnail */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mr-4 transition-colors ${deployment && !isOffline ? 'bg-cyan-900/20 text-cyan-400' : 'bg-white/10 text-slate-300'}`}>
          {isOffline ? <WifiOff className="w-6 h-6 opacity-50" /> : (deployment ? <Activity className="w-8 h-8 animate-pulse" strokeWidth={1.5} /> : <Cpu className="w-8 h-8" strokeWidth={1.5} />)}
        </div>

        {/* Device Info */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center space-x-2">
            <h3 className="font-black truncate tracking-tight text-slate-200">
              {device.name}
            </h3>
            {!isOffline && <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>}
          </div>
          
          {/* Deployment Status or Base Info */}
          {deployment && !isOffline ? (
              <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1.5 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      <Play className="w-2.5 h-2.5 text-cyan-400 fill-current" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400 truncate max-w-[120px]">正在运行：{deployment.title}</span>
                  </div>
              </div>
          ) : (
              <div className="flex items-center space-x-3 mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span className="font-mono opacity-60">{device.serialNumber}</span>
                <span className="opacity-20">•</span>
                <div className="flex items-center space-x-1">
                  {isOffline ? (
                      <span>离线</span>
                  ) : (
                      <>
                        <Battery className={`w-3 h-3 ${device.battery < 20 ? 'text-red-500' : ''}`} />
                        <span className={device.battery < 20 ? 'text-red-500' : ''}>{device.battery}%</span>
                      </>
                  )}
                </div>
              </div>
          )}
        </div>

        {/* Actions - Only Delete/Unbind */}
        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          <div 
            onClick={() => setDeleteTargetId(device.id)}
            className="p-3 bg-white/5 rounded-full text-slate-600 hover:text-red-500 active:scale-90 transition-all border border-transparent hover:border-white/5"
          >
            <Trash2 className="w-5 h-5" />
          </div>
        </div>
      </button>
    );
  };

  const SectionHeader: React.FC<{ title: string, count: number }> = ({ title, count }) => (
    <div className="flex justify-between items-center px-2 py-4 mt-2">
      <h2 className="text-[10px] font-[1000] text-slate-600 uppercase tracking-[0.3em]">{title} ({count})</h2>
      <div className="h-px bg-white/5 flex-1 ml-4"></div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#0C0C0C] flex flex-col h-full relative text-white selection:bg-cyan-500/30">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center z-20 sticky top-0 shadow-lg">
         <div className="flex items-center">
             <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/5 mr-2 active:scale-95 transition-all">
                 <ChevronLeft className="w-6 h-6 text-slate-400" />
             </button>
             <div>
                <h1 className="text-xl font-black tracking-tight text-white uppercase ml-1">我的设备</h1>
             </div>
         </div>
         <button 
            onClick={() => onNavigate('connect-robot')}
            className="bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full active:scale-95 transition-all shadow-md shadow-cyan-900/10"
         >
             <Plus className="w-4 h-4 mr-1.5 inline-block -mt-0.5" strokeWidth={3} /> 绑定设备
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-2 no-scrollbar">
        {/* Online Devices Section */}
        {onlineDevices.length > 0 && (
          <>
            <SectionHeader title="在线可用设备" count={onlineDevices.length} />
            <div className="space-y-3">
              {onlineDevices.map(d => <DeviceCard key={d.id} device={d} />)}
            </div>
          </>
        )}

        {/* Offline Devices Section */}
        {offlineDevices.length > 0 && (
          <>
            <SectionHeader title="离线设备" count={offlineDevices.length} />
            <div className="space-y-3">
              {offlineDevices.map(d => <DeviceCard key={d.id} device={d} isOffline={true} />)}
            </div>
          </>
        )}

        {/* Empty State */}
        {deviceList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-600">
            <WifiOff className="w-20 h-20 mb-6 opacity-10 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest">暂无绑定设备</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteTargetId && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-xs rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
                      <Trash2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 tracking-tight uppercase">解除绑定</h3>
                  <p className="text-[10px] font-bold text-slate-500 mb-10 leading-relaxed uppercase tracking-widest px-4">
                    解绑后您将无法远程操控此机器人，如需再次使用需重新扫描绑定。
                  </p>
                  
                  <div className="flex w-full gap-4">
                      <button onClick={() => setDeleteTargetId(null)} className="flex-1 py-5 bg-white/5 rounded-full text-slate-500 font-black uppercase text-[10px] active:scale-95 transition-all border border-white/5">取消</button>
                      <button 
                        onClick={() => {
                          if (deleteTargetId) onDeleteDevice(deleteTargetId);
                          setDeleteTargetId(null);
                        }} 
                        className="flex-1 py-5 bg-red-600 rounded-full text-white font-black uppercase text-[10px] active:scale-95 transition-all shadow-xl shadow-red-900/40"
                      >
                        确认解绑
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Devices;
