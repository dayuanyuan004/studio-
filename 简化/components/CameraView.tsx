import React, { useState } from 'react';
import { X, RefreshCw, Zap, Image as ImageIcon, Video, CheckCircle, Mic } from 'lucide-react';

interface CameraViewProps {
  onClose: () => void;
  onCapture: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onClose, onCapture }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);

  const toggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      onCapture(); // Finish
    } else {
      setIsRecording(true);
      // Simulate recording
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
       {/* Camera Viewfinder (Simulated) */}
       <div className="flex-1 relative bg-slate-800 overflow-hidden">
          {/* Simulated Camera Feed */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
             <img src="https://picsum.photos/800/1200" alt="Camera Feed" className="w-full h-full object-cover blur-sm" />
          </div>
          
          {/* Virtual Grid & Face Detection Box */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              {[...Array(9)].map((_, i) => <div key={i} className="border border-white/10"></div>)}
          </div>
          <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/3 border-2 border-yellow-400/70 rounded-lg flex flex-col items-center justify-center">
              <span className="bg-yellow-400/80 text-black text-[10px] px-1 rounded mt-2">人体识别中...</span>
          </div>

          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex justify-between items-start">
             <button onClick={onClose} className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white">
                <X className="w-6 h-6" />
             </button>
             <div className="bg-black/30 backdrop-blur-md rounded-full px-3 py-1 flex items-center space-x-4">
                <button className="text-white"><Zap className="w-5 h-5 fill-current" /></button>
                <button className="text-white"><RefreshCw className="w-5 h-5" /></button>
             </div>
          </div>

          {/* Recording Timer */}
          {isRecording && (
             <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center space-x-2">
                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                 <span className="text-white font-mono text-xl shadow-black drop-shadow-md">00:04.2</span>
             </div>
          )}
       </div>

       {/* Bottom Controls */}
       <div className="h-40 bg-black text-white px-6 py-4 flex flex-col justify-end pb-8">
          <div className="flex justify-between items-center mb-6 px-8">
              <span className="text-xs font-medium text-white/50">照片</span>
              <span className="text-sm font-bold text-yellow-400">视频</span>
              <span className="text-xs font-medium text-white/50">直播</span>
          </div>
          
          <div className="flex justify-between items-center">
             <button className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                <ImageIcon className="w-6 h-6 text-white" />
             </button>
             
             {/* Shutter Button */}
             <button 
               onClick={toggleRecord}
               className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${isRecording ? 'border-red-500 scale-110' : 'border-white'}`}
             >
                <div className={`rounded-full transition-all duration-300 ${isRecording ? 'w-8 h-8 rounded bg-red-500' : 'w-16 h-16 bg-white'}`}></div>
             </button>

             <button className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <CheckCircle className="w-6 h-6 text-white" />
             </button>
          </div>
       </div>
    </div>
  );
};

export default CameraView;