import React from 'react';

interface VirtualRobotProps {
  isDancing: boolean;
  animationStyle?: 'wave' | 'groove' | 'cute' | 'wild' | 'elegant' | 'weird';
  animationTrigger?: number; // Used to force-restart animation via key
  className?: string;
  showStatus?: boolean;
  isOffline?: boolean;
  playbackMode?: 'once' | 'triple' | 'loop';
}

const VirtualRobot: React.FC<VirtualRobotProps> = ({ 
    isDancing, 
    animationStyle = 'wave', 
    animationTrigger = 0,
    className = '', 
    showStatus = true,
    isOffline = false,
    playbackMode = 'once'
}) => {
  // Determine animation class based on style
  let danceClass = '';
  switch (animationStyle) {
      case 'wave': danceClass = 'is-dancing-wave'; break;
      case 'groove': danceClass = 'is-dancing-groove'; break;
      case 'cute': danceClass = 'is-dancing-cute'; break;
      case 'wild': danceClass = 'is-dancing-wild'; break;
      case 'elegant': danceClass = 'is-dancing-elegant'; break;
      case 'weird': danceClass = 'is-dancing-weird'; break;
      default: danceClass = 'is-dancing-wave';
  }

  const iterationClass = playbackMode === 'triple' ? 'play-triple' : (playbackMode === 'loop' ? 'play-loop' : 'play-once');
  const stateClass = isOffline 
      ? 'is-offline' 
      : (isDancing ? `is-active ${danceClass} ${iterationClass}` : 'is-idle');

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        {/* Grid floor - Hide if offline to emphasize "dead" state */}
        {!isOffline && (
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(transparent_1px,_#ffffff10_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom"></div>
        )}
        
        {/* CSS Robot Character - Key forces animation restart on switch or re-trigger */}
        <div key={`${animationStyle}-${animationTrigger}-${playbackMode}`} className={`robot-wrapper z-10 ${stateClass}`}>
            <div className="robot-head">
                <div className="robot-antenna"></div>
                <div className="robot-ear left"></div>
                <div className="robot-ear right"></div>
                <div className="robot-eye"></div>
                <div className="robot-eye"></div>
            </div>
            <div className="robot-neck"></div>
            <div className="robot-torso">
                <div className="robot-arm left"><div className="robot-hand"></div></div>
                <div className="robot-arm right"><div className="robot-hand"></div></div>
                <div className="robot-leg left"><div className="robot-foot"></div></div>
                <div className="robot-leg right"><div className="robot-foot"></div></div>
                
                <div className="robot-chest-plate">
                    <div className="robot-core"></div>
                </div>
            </div>
        </div>

        {/* Active Effect when playing (Only online) */}
        {isDancing && !isOffline && (
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className={`w-64 h-64 ${animationStyle === 'wave' ? 'bg-green-500/10' : 'bg-pink-500/10'} rounded-full blur-3xl animate-pulse`}></div>
            </div>
        )}
        
        {/* Overlay Info */}
        {showStatus && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                <div className="flex items-center space-x-2 bg-black/40 backdrop-blur rounded-full px-3 py-1 border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-gray-500' : (isDancing ? 'bg-green-500 animate-pulse' : 'bg-slate-400')}`}></div>
                    <span className="text-white/80 text-[10px] font-mono">
                        Galbot R1 {isOffline ? '(OFFLINE)' : (isDancing ? `(${animationStyle.toUpperCase()})` : '(Standby)')}
                    </span>
                </div>
            </div>
        )}
    </div>
  );
};

export default VirtualRobot;