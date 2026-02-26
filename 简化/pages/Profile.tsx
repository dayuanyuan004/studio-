
import React, { useState, useRef, useEffect } from 'react';
import { 
    Settings, ChevronRight, LogOut, CreditCard, HelpCircle, Star, MessageSquare, Send, 
    Battery, Zap, Music, Globe, Signal, Menu, X, Router, Wifi, Gamepad2, Activity, 
    Smartphone, Edit3, CheckCircle, AlertCircle, Trash2, RefreshCw, Link, ChevronLeft,
    Smile, Ghost, Sparkles, User as UserIcon, Plus, Mic, Palette, Tag, Sliders,
    ScanLine, Power, MessageCircle, MonitorSmartphone, LayoutGrid, Check, ChevronRight as ChevronRightIcon,
    Lock, Bell, Info, UserRound, Move, Users, Shield, UploadCloud, FileText, Mail, Phone, AlertTriangle, Camera,
    Cpu, RotateCw, FileClock, Unlink, Settings2, Thermometer, PlayCircle, Box, Layers, SlidersHorizontal, Brain,
    Wand2, MessageSquareQuote
} from 'lucide-react';
import VirtualRobot from '../components/VirtualRobot';
import { Device, DeploymentStatus } from '../types';

interface ProfileProps {
    onNavigate?: (page: string, id?: string) => void;
    initialShowSidebar?: boolean;
    devices?: Device[];
    deviceDeployments?: Record<string, DeploymentStatus>;
    currentRobotId?: string; // Renamed from previewDeviceId
    onRobotSelect?: (id: string) => void; // Added for sync
    motionList?: any[]; 
    onDeleteDevice?: (id: string) => void;
}

type SettingsView = 'root' | 'account' | 'family' | 'family_add' | 'firmware' | 'help' | 'feedback';
type RobotSettingsView = 'root' | 'basic' | 'remote' | 'connection' | 'motor' | 'calibration_1' | 'calibration_2' | 'calibration_3' | 'calibration_result' | 'logs' | 'upgrade';

const Profile: React.FC<ProfileProps> = ({ 
    onNavigate, 
    initialShowSidebar = false, 
    devices = [],
    deviceDeployments = {},
    currentRobotId,
    onRobotSelect,
    motionList = [],
    onDeleteDevice
}) => {
  const [robotAction, setRobotAction] = useState<'idle' | 'wave' | 'groove' | 'cute' | 'wild' | 'elegant' | 'weird'>('idle');
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<'once' | 'triple'>('once');
  const [showSidebar, setShowSidebar] = useState(initialShowSidebar);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [roleMessage, setRoleMessage] = useState<string | null>(null);
  const [systemToast, setSystemToast] = useState<string | null>(null);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  
  const [deviceRoles, setDeviceRoles] = useState<Record<string, string>>({});
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  
  // Hardware States (Moved into Robot Settings Logic)
  const [connectionMode, setConnectionMode] = useState<'wifi' | 'ap'>('wifi');
  const [isRemoteBound, setIsRemoteBound] = useState(true);
  const [waistLocked, setWaistLocked] = useState(false);
  const [remoteId, setRemoteId] = useState('RC-8821');
  const [robotName, setRobotName] = useState(''); // Will init with device name

  // Modal States
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [showDeviceListModal, setShowDeviceListModal] = useState(false);
  const [showCapabilitiesDrawer, setShowCapabilitiesDrawer] = useState(false); 
  const [showRoleSettings, setShowRoleSettings] = useState(false); // New Role Settings Modal
  
  // Settings Modal State (User)
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsView, setSettingsView] = useState<SettingsView>('root');
  
  // Robot Settings Modal State
  const [showRobotSettingsModal, setShowRobotSettingsModal] = useState(false);
  const [robotSettingsView, setRobotSettingsView] = useState<RobotSettingsView>('root');
  // New state to track which device is being configured in the settings modal
  const [settingsTargetDevice, setSettingsTargetDevice] = useState<Device | null>(null);
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUnbindConfirm, setShowUnbindConfirm] = useState(false);

  // Feedback Form State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackContact, setFeedbackContact] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState<number | null>(null);
  const [feedbackContent, setFeedbackContent] = useState('');
  
  // Motion Selector State
  const [showMotionSelector, setShowMotionSelector] = useState(false);

  // Updated stable avatar URL
  const AVATAR_URL = "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoey&backgroundColor=ffdfbf";

  // Role Parameter Settings State
  const [editRoleName, setEditRoleName] = useState('小盖');
  const [editRoleGender, setEditRoleGender] = useState<'male' | 'female'>('female'); // Added Gender State
  const [editRoleTags, setEditRoleTags] = useState<string[]>(['正常', '感性']);
  const [editRoleZodiac, setEditRoleZodiac] = useState('天秤座');
  const [editRolePrompt, setEditRolePrompt] = useState('');
  const [editRoleGreeting, setEditRoleGreeting] = useState('你好，我是小盖。');
  const [editRoleVoice, setEditRoleVoice] = useState('sweet');
  const [editRoleAction, setEditRoleAction] = useState('wave');

  // Role Presets Configuration
  const rolePresets: Record<string, { name: string, gender: 'male'|'female', tags: string[], zodiac: string, prompt: string, greeting: string, voice: string, action: string }> = {
      'cute': { 
          name: '小盖', 
          gender: 'female',
          tags: ['正常', '感性'], 
          zodiac: '天秤座', 
          prompt: '喜欢倾听，语气温柔，总是优先考虑对方感受。', 
          greeting: '你好，我是小盖，有什么可以帮你的吗？', 
          voice: 'sweet', 
          action: 'cute' 
      },
      'elegant': { 
          name: '小盖', 
          gender: 'female',
          tags: ['活泼', '主动'], 
          zodiac: '狮子座', 
          prompt: '充满活力，喜欢社交，对新鲜事物充满好奇。', 
          greeting: '嘿！我是小盖！我们要不要一起去探险？', 
          voice: 'sweet', 
          action: 'elegant' 
      },
      'weird': { 
          name: '小盖', 
          gender: 'male',
          tags: ['寡言', '高冷', '理性'], 
          zodiac: '天蝎座', 
          prompt: '逻辑至上，不喜欢废话，偶尔会说出深刻的哲理。', 
          greeting: '我是小盖。有事说事，无事退朝。', 
          voice: 'calm', 
          action: 'weird' 
      },
      'wild': { 
          name: '小盖', 
          gender: 'female', // Default placeholder, UI hidden
          tags: ['主动', '奇怪'], 
          zodiac: '水瓶座', 
          prompt: '来自遥远星系的信号接收者，思维跳跃。', 
          greeting: '收到讯号... 小盖 就位。你的波长很独特。', 
          voice: 'tech', 
          action: 'wild' 
      },
  };

  const personalityOptions = ['话痨', '寡言', '正常', '活泼', '安静', '主动', '被动', '感性', '理性', '奇怪', '高冷'];
  const zodiacOptions = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];

  const toggleRoleTag = (tag: string) => {
      setEditRoleTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchCurrentX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchCurrentX.current !== null) {
      const deltaX = touchCurrentX.current - touchStartX.current;
      if (deltaX < -40) {
        setShowSidebar(false);
      }
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
  };

  const [roles, setRoles] = useState([
      { id: 'cute', name: '温柔引导型', icon: Smile, msg: '有什么我可以帮你的吗？', action: 'cute' },
      { id: 'elegant', name: '活泼外向型', icon: Sparkles, msg: '嘿！一起玩吧！', action: 'elegant' },
      { id: 'weird', name: '高冷毒舌型', icon: Ghost, msg: '哼，愚蠢的人类...', action: 'weird' },
      { id: 'wild', name: '天外来客型', icon: Zap, msg: '收到来自母星的信号...', action: 'wild' },
  ]);

  const floatingSkills = [
      { id: 'fs1', label: '和我讲英文试试', icon: Globe, action: 'elegant', response: 'Hello there! Nice to meet you.', pos: 'top-[26%] left-[8%]' },
      { id: 'fs2', label: '想和我握手吗', icon: HandIcon, action: 'wave', response: '很高兴认识你！(握手)', pos: 'top-[36%] right-[8%]' },
      { id: 'fs3', label: '展示一下开心', icon: Smile, action: 'cute', response: '今天心情超级棒！✨', pos: 'bottom-[30%] left-[10%]' },
  ];

  const capabilities = [
      { id: 'cap1', name: '视觉抓取', type: 'skill', status: 'ready', icon: HandIcon, desc: '智能识别并抓取物品' },
      { id: 'cap2', name: '自主巡逻', type: 'skill', status: 'ready', icon: Move, desc: '指定区域自动巡航' },
      { id: 'cap3', name: '迎宾接待', type: 'motion', status: 'ready', icon: UserIcon, desc: '标准商务接待流程' },
      { id: 'cap4', name: '随机舞蹈', type: 'skill', status: 'ready', icon: Music, desc: '流行舞步随机播放' },
      { id: 'cap5', name: '基础动作', type: 'skill', status: 'ready', icon: Zap, desc: '通用肢体语言库' },
  ];

  function HandIcon(props: any) {
      return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>;
  }

  // Filter only online devices for display cycling
  const onlineDevices = devices.filter(d => d.status === '在线');
  const hasOnlineDevices = onlineDevices.length > 0;
  const hasAnyDevices = devices.length > 0;

  // SAFETY CHECK: Ensure currentDeviceIndex is valid when devices change (e.g. after unbind)
  useEffect(() => {
      if (currentDeviceIndex >= onlineDevices.length) {
          setCurrentDeviceIndex(Math.max(0, onlineDevices.length - 1));
      }
  }, [onlineDevices.length, currentDeviceIndex]);

  useEffect(() => {
      if (devices.length > 0 && Object.keys(deviceRoles).length === 0) {
          const initialRoles: Record<string, string> = {};
          devices.forEach(d => { initialRoles[d.id] = 'cute'; });
          setDeviceRoles(initialRoles);
      }
  }, [devices]);

  useEffect(() => {
      // Sync prop ID to online devices index
      if (currentRobotId && hasOnlineDevices) {
          const index = onlineDevices.findIndex(d => d.id === currentRobotId);
          if (index !== -1 && index !== currentDeviceIndex) {
              setSlideDirection(index > currentDeviceIndex ? 'next' : 'prev');
              setCurrentDeviceIndex(index);
          }
      }
  }, [currentRobotId, hasOnlineDevices]);

  // Safe accessor for current device
  const currentDevice = (hasOnlineDevices && onlineDevices[currentDeviceIndex]) ? onlineDevices[currentDeviceIndex] : null;
  // Strictly meaning "No online connection", but UI handles "No Devices at all" separately
  const isOffline = !hasOnlineDevices; 
  
  // Determine which device is active in the settings modal
  const activeSettingsDevice = settingsTargetDevice || currentDevice;

  useEffect(() => {
      if (currentDevice) {
          // Only sync name if we are NOT in the settings modal (to avoid overwriting inputs)
          if (!showRobotSettingsModal) {
              setRobotName(currentDevice.name);
          }
          const savedRoleId = deviceRoles[currentDevice.id] || 'cute';
          const savedRole = roles.find(r => r.id === savedRoleId);
          setActiveRoleId(savedRoleId);
          
          if (savedRole) {
              setRobotAction(mapActionToStyle(savedRole.action));
              
              // Sync Role Settings Parameters based on active role
              const preset = rolePresets[savedRoleId];
              if (preset) {
                  setEditRoleName(preset.name);
                  setEditRoleGender(preset.gender); // Sync Gender
                  setEditRoleTags(preset.tags);
                  setEditRoleZodiac(preset.zodiac);
                  setEditRolePrompt(preset.prompt);
                  setEditRoleGreeting(preset.greeting);
                  setEditRoleVoice(preset.voice);
                  setEditRoleAction(preset.action);
              }
          } else {
              setRobotAction('idle');
          }
          setPlaybackMode('triple'); 
          setAnimationTrigger(prev => prev + 1); 
      }
  }, [currentDeviceIndex, currentDevice, deviceRoles]);

  // Sync settings inputs when opening modal for a specific device
  useEffect(() => {
      if (showRobotSettingsModal && activeSettingsDevice) {
          setRobotName(activeSettingsDevice.name);
          setRemoteId(`RC-${activeSettingsDevice.serialNumber.split('-').pop() || '8821'}`);
      }
  }, [showRobotSettingsModal, activeSettingsDevice]);

  const showSystemTip = (msg: string) => {
      setSystemToast(msg);
      setTimeout(() => setSystemToast(null), 2500);
  };

  const handleStartCalibration = () => {
      setRobotSettingsView('calibration_3');
      setTimeout(() => {
          setRobotSettingsView('calibration_result');
      }, 3000);
  };

  const handleReboot = () => {
      showSystemTip('正在强制重启机器人...');
      setTimeout(() => {
          setShowRobotSettingsModal(false);
          setRobotSettingsView('root');
      }, 2000);
  };

  const handleSidebarDeviceClick = (device: Device) => {
      // Open settings for specific device from sidebar
      setSettingsTargetDevice(device);
      setRobotSettingsView('root');
      setShowRobotSettingsModal(true);
      // Keep sidebar visible to prevent animation on close
  };

  const triggerRole = (roleId: string) => {
      const role = roles.find(r => r.id === roleId);
      if (!role) return;

      if (isOffline) { 
        showSystemTip('无在线设备，请先连接'); 
        return; 
      }
      if (currentDevice) { 
          setDeviceRoles(prev => ({ ...prev, [currentDevice.id]: roleId })); 
          setActiveRoleId(roleId);
          setRobotAction(mapActionToStyle(role.action));
          
          // Immediate sync for the settings modal if opened immediately after
          const preset = rolePresets[roleId];
          if (preset) {
              setEditRoleName(preset.name);
              setEditRoleGender(preset.gender); // Sync Gender
              setEditRoleTags(preset.tags);
              setEditRoleZodiac(preset.zodiac);
              setEditRolePrompt(preset.prompt);
              setEditRoleGreeting(preset.greeting);
              setEditRoleVoice(preset.voice);
              setEditRoleAction(preset.action);
          }
      }
      setPlaybackMode('triple'); 
      setAnimationTrigger(prev => prev + 1); 
      setRoleMessage(role.msg);
      setTimeout(() => setRoleMessage(null), 4000);
  };

  const triggerQuickSkill = (skill: typeof floatingSkills[0]) => {
      if (isOffline) return;
      setPlaybackMode('once'); 
      setRobotAction(skill.action as any);
      setAnimationTrigger(prev => prev + 1); 
      setRoleMessage(skill.response);
      setTimeout(() => {
          setRoleMessage(null);
          setRobotAction('idle');
      }, 3000);
  };

  const handleSwitchDevice = (index: number) => {
      // Safely switch device view and notify parent
      if (index >= 0 && index < onlineDevices.length) {
          setSlideDirection(index > currentDeviceIndex ? 'next' : 'prev');
          setCurrentDeviceIndex(index);
          setShowDeviceListModal(false);
          showSystemTip(`已切换至: ${onlineDevices[index].name}`);
          
          if (onRobotSelect) {
              onRobotSelect(onlineDevices[index].id);
          }
      }
  };

  const mapActionToStyle = (action: string): 'wave' | 'groove' | 'cute' | 'wild' | 'elegant' | 'weird' | 'idle' => {
      const validStyles = ['wave', 'groove', 'cute', 'wild', 'elegant', 'weird'];
      if (validStyles.includes(action)) return action as any;
      if (action.includes('wave')) return 'wave';
      return 'wave'; 
  };

  const handleSettingsBack = () => {
      if (settingsView === 'family_add') {
          setSettingsView('family');
          return;
      }
      // For all main views, close modal and return to sidebar
      setShowSettingsModal(false);
      // Removed setShowSidebar(true) since we keep it open now to avoid animation
  };

  const handleFeedbackSubmit = () => {
      if (!feedbackName || (!feedbackContact) || feedbackCategory === null || !feedbackContent || feedbackContent.length < 5) {
          showSystemTip('请完善必填信息');
          return;
      }
      showSystemTip('反馈已提交，感谢您的建议');
      handleSettingsBack();
      // Reset form
      setFeedbackName('');
      setFeedbackContact('');
      setFeedbackCategory(null);
      setFeedbackContent('');
  };

  const handleLogout = () => {
      setShowLogoutConfirm(false);
      setShowSettingsModal(false);
      setShowSidebar(false);
      showSystemTip('已退出登录 (模拟)');
      if(onNavigate) onNavigate('login');
  };

  const activeRole = roles.find(r => r.id === activeRoleId);

  return (
    <div className="h-full w-full bg-[#0C0C0C] overflow-hidden text-white selection:bg-cyan-500/30 relative flex flex-col">
      
      {/* 1. SIDEBAR BACKDROP */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm backdrop-transition ${showSidebar ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} 
        onClick={() => setShowSidebar(false)} 
      />
      
      {/* 2. SIDEBAR CARD */}
      <div 
        className={`fixed inset-y-0 left-0 w-[75%] max-w-[340px] bg-[#121212] z-[110] shadow-[25px_0_70px_rgba(0,0,0,0.9)] border-r border-white/5 rounded-r-[2.8rem] flex flex-col overflow-hidden sidebar-card-transition ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
          <div className="p-6 pt-14 border-b border-white/5 bg-gradient-to-b from-[#1A1A1A] to-[#121212]">
              <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 p-1.5 shadow-2xl transition-all hover:border-cyan-500/40">
                      <img src={AVATAR_URL} className="w-full h-full object-cover rounded-full bg-slate-800" alt="Avatar" />
                  </div>
                  <div>
                      <h2 className="text-base font-black text-white tracking-tight">Hi, 大圆圆</h2>
                  </div>
              </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 no-scrollbar">
              <div className="px-4 py-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.25em] flex justify-between items-center">
                  <span>控制台</span>
                  {devices.length > 0 && <span className="bg-white/10 text-slate-400 px-1.5 rounded text-[8px]">{devices.length}</span>}
              </div>
              
              {/* Direct Robot List */}
              {devices.map((device, idx) => {
                  const isOnline = device.status === '在线';
                  return (
                      <button 
                        key={device.id} 
                        onClick={() => handleSidebarDeviceClick(device)}
                        className={`w-full p-3.5 flex items-center justify-between rounded-2xl transition-all group text-left ${isOnline ? 'hover:bg-white/5 bg-white/[0.02]' : 'opacity-60 hover:bg-white/5'}`}
                      >
                          <div className="flex items-center space-x-3 min-w-0">
                              <div className={`p-2 rounded-xl shrink-0 transition-colors ${isOnline ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                                  {isOnline ? <Cpu className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                  <span className={`text-xs font-bold block truncate ${isOnline ? 'text-slate-200 group-hover:text-white' : 'text-slate-500'}`}>{device.name}</span>
                                  <div className="flex items-center space-x-1.5 mt-0.5">
                                      <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-slate-600'}`}></div>
                                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">{isOnline ? 'Online' : 'Offline'}</span>
                                  </div>
                              </div>
                          </div>
                          
                          {isOnline ? (
                              <div className="flex items-center text-green-400/80 bg-green-900/10 px-2 py-1 rounded-lg border border-green-500/10">
                                  <Battery className="w-3 h-3 mr-1" />
                                  <span className="text-[9px] font-black">{device.battery}%</span>
                              </div>
                          ) : (
                              <Settings2 className="w-4 h-4 text-slate-700" />
                          )}
                      </button>
                  )
              })}

              {/* Add Robot Button */}
              <button 
                onClick={() => { onNavigate && onNavigate('connect-robot'); setShowSidebar(false); }}
                className="w-full p-3.5 flex items-center justify-center rounded-2xl border border-dashed border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group mt-2"
              >
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 mr-2" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-cyan-400">绑定新设备</span>
              </button>

              <div className="my-4 h-px bg-white/5 mx-4"></div>
              <div className="px-4 py-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.25em]">用户设置</div>

              <button onClick={() => { setSettingsView('account'); setShowSettingsModal(true); }} className="w-full p-3.5 flex items-center justify-between rounded-2xl hover:bg-white/5 transition-all group">
                  <div className="flex items-center space-x-3 shrink-0"><Shield className={`w-4 h-4 text-blue-400 opacity-80 group-hover:scale-110 transition-transform`} /><span className="text-xs font-bold text-slate-300 group-hover:text-white">帐号与安全</span></div>
                  <ChevronRight className="w-3 h-3 text-slate-700" />
              </button>

              <button onClick={() => { setSettingsView('family'); setShowSettingsModal(true); }} className="w-full p-3.5 flex items-center justify-between rounded-2xl hover:bg-white/5 transition-all group">
                  <div className="flex items-center space-x-3 shrink-0"><Users className={`w-4 h-4 text-green-400 opacity-80 group-hover:scale-110 transition-transform`} /><span className="text-xs font-bold text-slate-300 group-hover:text-white">家庭成员</span></div>
                  <ChevronRight className="w-3 h-3 text-slate-700" />
              </button>

              <button onClick={() => { setSettingsView('firmware'); setShowSettingsModal(true); }} className="w-full p-3.5 flex items-center justify-between rounded-2xl hover:bg-white/5 transition-all group">
                  <div className="flex items-center space-x-3 shrink-0"><UploadCloud className={`w-4 h-4 text-purple-400 opacity-80 group-hover:scale-110 transition-transform`} /><span className="text-xs font-bold text-slate-300 group-hover:text-white">软件升级</span></div>
                  <ChevronRight className="w-3 h-3 text-slate-700" />
              </button>

              <button onClick={() => { setSettingsView('help'); setShowSettingsModal(true); }} className="w-full p-3.5 flex items-center justify-between rounded-2xl hover:bg-white/5 transition-all group">
                  <div className="flex items-center space-x-3 shrink-0"><HelpCircle className={`w-4 h-4 text-cyan-400 opacity-80 group-hover:scale-110 transition-transform`} /><span className="text-xs font-bold text-slate-300 group-hover:text-white">帮助与服务</span></div>
                  <ChevronRight className="w-3 h-3 text-slate-700" />
              </button>
          </div>
          <div className="p-5 border-t border-white/5"><button onClick={() => { setShowLogoutConfirm(true); setShowSidebar(false); }} className="w-full flex items-center justify-center space-x-2 text-red-500/80 font-black text-[10px] uppercase tracking-[0.2em] p-3 rounded-xl hover:bg-red-500/10 active:scale-95 transition-all"><LogOut className="w-3.5 h-3.5" /><span>退出登录</span></button></div>
      </div>
      
      {/* ... (Hero Section, etc. same as before) ... */}
      
      {/* --- UNIFIED SYSTEM TOAST --- */}
      {systemToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[150] bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none border border-black/5">
              <Check className="w-4 h-4 mr-2 text-green-500" strokeWidth={3} />
              <span className="text-[11px] font-black uppercase tracking-widest">{systemToast}</span>
          </div>
      )}

      {/* --- HERO SECTION --- */}
      <div 
        className="relative h-[78%] min-h-[480px] w-full bg-gradient-to-b from-[#1a1a1a] to-[#0C0C0C] flex flex-col items-center justify-center overflow-hidden shrink-0"
      >
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000 ${isOffline ? 'bg-white/5' : 'bg-cyan-500/5'}`}></div>
          <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_#ffffff05_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>

          {/* TOP BAR */}
          <div className="absolute top-0 left-0 right-0 p-5 pt-10 flex justify-between items-center z-30 bg-gradient-to-b from-[#050505]/60 to-transparent backdrop-blur-[2px]">
              <button 
                onClick={() => setShowSidebar(true)} 
                className="flex items-center space-x-4 group active:scale-90 transition-all duration-300"
              >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 p-1 bg-black/40 shadow-xl group-hover:border-cyan-500/50 transition-all">
                      <img src={AVATAR_URL} className="w-full h-full object-cover rounded-full bg-slate-800" alt="Avatar" />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                      <span className="text-base font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">Hi, 大圆圆</span>
                  </div>
              </button>

              <button 
                onClick={() => hasOnlineDevices ? setShowDeviceListModal(true) : (onNavigate && onNavigate('connect-robot'))} 
                className="flex items-center space-x-3 bg-black/40 backdrop-blur-md border border-white/10 pl-4 pr-3 py-2 rounded-full shadow-2xl transition-all active:scale-95"
              >
                  <div className="flex flex-col items-start mr-1 text-left">
                      <div className="flex items-center space-x-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${hasOnlineDevices ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-slate-500'}`}></div>
                          <span className="text-[10px] font-[1000] uppercase tracking-wider text-white">{hasOnlineDevices ? (currentDevice?.name || '我的设备') : '暂无设备'}</span>
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 uppercase ml-3">
                          {hasOnlineDevices ? `${(currentDeviceIndex !== -1 ? currentDeviceIndex + 1 : 1)} / ${onlineDevices.length} 在线` : '点击添加'}
                      </span>
                  </div>
                  <div className="w-px h-6 bg-white/10"></div>
                  <div className={`flex items-center space-x-1 ${!hasOnlineDevices ? 'text-slate-500' : 'text-green-400'}`}>
                      {hasOnlineDevices ? <Battery className="w-3 h-3 fill-current" /> : <Plus className="w-3 h-3" />}
                      <span className="text-[10px] font-black font-mono">{!hasOnlineDevices ? 'ADD' : `${currentDevice?.battery}%`}</span>
                  </div>
              </button>
          </div>

          {/* SPEECH BUBBLE */}
          {roleMessage && (
              <div className="absolute top-[22%] left-1/2 -translate-x-1/2 animate-in zoom-in slide-in-from-bottom-4 duration-300 z-[100] pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-2xl text-black px-6 py-4 rounded-[2rem] rounded-bl-none font-[1000] text-[13px] shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/50 max-w-[220px] text-center relative animate-bounce-subtle pointer-events-auto">
                      {roleMessage}
                      <div className="absolute bottom-[-6px] left-[15px] w-4 h-4 bg-white/90 backdrop-blur-2xl rotate-45 border-r border-b border-white/50"></div>
                  </div>
              </div>
          )}

          {!isOffline && activeRole && !roleMessage && (
              <button 
                  onClick={() => triggerRole(activeRole.id)}
                  className="absolute top-[28%] right-[15%] z-[90] animate-in zoom-in slide-in-from-right-4 duration-500 active:scale-95 transition-all"
              >
                  <div className="bg-cyan-500 text-black px-6 py-3 rounded-2xl rounded-bl-none font-[1000] text-xs shadow-2xl border border-cyan-400/50 uppercase tracking-wider relative animate-bounce-subtle">
                      我是{activeRole.name}
                      <div className="absolute bottom-[-6px] left-[12px] w-4 h-4 bg-cyan-500 rotate-45"></div>
                  </div>
              </button>
          )}

          {/* ROBOT VISUAL AREA */}
          <div className="relative z-10 w-full h-full flex items-center justify-center pb-8">
              {!isOffline && currentDevice && floatingSkills.map((skill, idx) => (
                  <button
                      key={skill.id}
                      onClick={() => triggerQuickSkill(skill)}
                      className={`absolute ${skill.pos} z-20 flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-xl hover:bg-cyan-500/10 hover:border-cyan-500/30 active:scale-95 transition-all animate-in zoom-in duration-500`}
                      style={{ animationDelay: `${idx * 200 + 500}ms` }}
                  >
                      <div className="p-1 bg-cyan-500/20 rounded-full">
                        <skill.icon className="w-3 h-3 text-cyan-300" />
                      </div>
                      <span className="text-[10px] font-[1000] text-white/90 uppercase tracking-tight">{skill.label}</span>
                  </button>
              ))}

              <div className={`transform transition-all duration-500 w-full h-full flex flex-col items-center justify-center ${slideDirection === 'next' ? 'anim-slide-next' : 'anim-slide-prev'}`}>
                  <div className="transform scale-[1.24] translate-y-24 transition-transform duration-500">
                      <VirtualRobot 
                        isDancing={robotAction !== 'idle' || !!(currentDevice && deviceDeployments[currentDevice.id])} 
                        animationStyle={robotAction === 'idle' ? undefined : robotAction} 
                        animationTrigger={animationTrigger}
                        playbackMode={playbackMode}
                        showStatus={false}
                        isOffline={isOffline}
                        key={`${currentDevice?.id}-${animationTrigger}`} // Force re-render on device switch
                      />
                  </div>
                  
                  {/* Empty State / No Devices */}
                  {!hasAnyDevices && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 z-50 flex flex-col items-center">
                          <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl mb-6 text-center border border-white/10 shadow-2xl">
                              <p className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">欢迎来到 Galbot Studio</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">请连接您的第一台机器人</p>
                          </div>
                          <button 
                            onClick={() => onNavigate && onNavigate('connect-robot')}
                            className="bg-cyan-500 text-black px-10 py-5 rounded-full font-[1000] uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(6,182,212,0.4)] active:scale-95 transition-all flex items-center animate-pulse hover:shadow-[0_0_60px_rgba(6,182,212,0.6)]"
                          >
                              <Plus className="w-5 h-5 mr-2" strokeWidth={3} />
                              立即添加机器人
                          </button>
                      </div>
                  )}
                  
                  {/* Offline State (Has devices but none online) */}
                  {hasAnyDevices && isOffline && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-10 z-50">
                          <button 
                            onClick={() => onNavigate && onNavigate('connect-robot')}
                            className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-[1000] uppercase tracking-[0.2em] border border-white/20 active:scale-95 transition-all flex items-center hover:bg-white/20"
                          >
                              <RefreshCw className="w-4 h-4 mr-2" strokeWidth={3} />
                              重连 / 添加设备
                          </button>
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="flex-1 bg-[#0C0C0C] relative z-20 -mt-20 rounded-t-[3rem] shadow-[0_-15px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden border-t border-white/5">
           <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2 shrink-0"></div>
           
           <div className="flex-1 px-8 flex flex-col justify-start pt-4 overflow-y-auto no-scrollbar pb-24">
                <div className="flex items-end justify-between mb-4">
                    <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] ml-1">Personality Console</h2>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setShowRoleSettings(true)}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setShowCapabilitiesDrawer(true)}
                            className="w-8 h-8 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 active:scale-90 transition-all"
                        >
                            <Box className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="w-full px-1 py-2 mb-6">
                   <div className="grid grid-cols-4 gap-2"> {/* Changed to grid to fit 4 in one row */}
                       {roles.map((role) => {
                           const isActive = activeRoleId === role.id;
                           return (
                           <button 
                             key={role.id} 
                             onClick={() => triggerRole(role.id)}
                             className={`flex flex-col items-center justify-center py-4 rounded-[1.2rem] transition-all active:scale-95 border 
                                 ${isOffline ? 'opacity-40 grayscale border-white/5 bg-white/5 text-slate-600' : 
                                   isActive ? 'bg-white text-black border-white shadow-xl shadow-white/20' : 
                                   'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                                 }`}
                           >
                               <role.icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-black' : 'text-current'}`} strokeWidth={isActive ? 2.5 : 2} />
                               <span className={`text-[9px] font-black tracking-tighter whitespace-nowrap scale-90`}>{role.name}</span>
                           </button>
                       )})}
                   </div>
               </div>
           </div>
      </div>

      {/* CAPABILITIES DRAWER */}
      {showCapabilitiesDrawer && (
          <div className="fixed inset-0 z-[160] bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCapabilitiesDrawer(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#121212] border-l border-white/10 shadow-2xl p-6 animate-in slide-in-from-right duration-300 flex flex-col" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-8 shrink-0">
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">能力库</h2>
                      <button onClick={() => setShowCapabilitiesDrawer(false)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors active:scale-90">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                      {/* Active Task */}
                      {currentDevice && deviceDeployments[currentDevice.id] && (
                          <div className="mb-6">
                              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 pl-1">当前运行</h3>
                              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                      <div className="p-2 bg-cyan-500 text-black rounded-lg"><Activity size={16} /></div>
                                      <div>
                                          <div className="text-xs font-black text-white">正在运行: {deviceDeployments[currentDevice.id].title}</div>
                                          <div className="text-[9px] text-cyan-400 font-bold mt-0.5">Active Task</div>
                                      </div>
                                  </div>
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                              </div>
                          </div>
                      )}

                      {/* List */}
                      <div>
                          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 pl-1">已安装能力</h3>
                          <div className="space-y-3">
                              {capabilities.map((cap) => (
                                  <div key={cap.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:border-white/20 transition-all">
                                      <div className="flex items-center space-x-4">
                                          <div className="p-2.5 bg-white/5 rounded-xl text-slate-400 group-hover:text-white transition-colors">
                                              <cap.icon size={18} strokeWidth={1.5} />
                                          </div>
                                          <div>
                                              <div className="text-xs font-black text-slate-200 uppercase group-hover:text-white transition-colors">{cap.name}</div>
                                              <div className="text-[9px] text-slate-500 font-bold mt-0.5">{cap.desc}</div>
                                          </div>
                                      </div>
                                      <div className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[8px] font-black text-slate-500 uppercase tracking-wider">Installed</div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* ROLE SETTINGS MODAL */}
      {showRoleSettings && (
          <div className="fixed inset-0 z-[170] bg-[#050505] flex flex-col animate-in slide-in-from-right duration-300">
              <div className="px-5 pt-12 pb-5 border-b border-white/5 flex items-center bg-[#0C0C0C] shrink-0">
                  <button onClick={() => setShowRoleSettings(false)} className="p-2 rounded-full bg-white/5 active:scale-90 transition-all mr-3">
                      <ChevronLeft className="w-6 h-6 text-slate-400" />
                  </button>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">角色参数设置</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-20">
                  {/* Name */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">角色名称</label>
                      <div className="relative">
                          <input 
                            type="text" 
                            value={editRoleName} 
                            readOnly
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-400 outline-none cursor-not-allowed"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                      </div>
                  </div>

                  {/* Gender Setting (Hidden for 'wild' role) */}
                  {activeRoleId !== 'wild' && (
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">性别设定 (联动音色)</label>
                          <div className="flex gap-4">
                              <button 
                                onClick={() => { setEditRoleGender('male'); setEditRoleVoice('calm'); }}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all border ${editRoleGender === 'male' ? 'bg-blue-500/20 text-blue-400 border-blue-500' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'}`}
                              >
                                  男生
                              </button>
                              <button 
                                onClick={() => { setEditRoleGender('female'); setEditRoleVoice('sweet'); }}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all border ${editRoleGender === 'female' ? 'bg-pink-500/20 text-pink-400 border-pink-500' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'}`}
                              >
                                  女生
                              </button>
                          </div>
                      </div>
                  )}

                  {/* Personality Tags */}
                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">性格标签 (影响风格/情绪/动作)</label>
                      <div className="flex flex-wrap gap-2">
                          {personalityOptions.map(tag => {
                              const isSelected = editRoleTags.includes(tag);
                              return (
                                  <button 
                                    key={tag}
                                    onClick={() => toggleRoleTag(tag)}
                                    className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all active:scale-95 border ${isSelected ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 text-slate-500 border-white/5 hover:bg-white/10'}`}
                                  >
                                      {tag}
                                  </button>
                              )
                          })}
                      </div>
                  </div>

                  {/* Zodiac */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">星座 (可选)</label>
                      <div className="flex flex-wrap gap-2">
                          {zodiacOptions.map(z => (
                              <button
                                key={z}
                                onClick={() => setEditRoleZodiac(z)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${editRoleZodiac === z ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-slate-500'}`}
                              >
                                  {z}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Prompt Supplement */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center"><Brain className="w-3 h-3 mr-1"/> Prompt 补充 (可选)</label>
                      <textarea 
                        value={editRolePrompt} 
                        onChange={(e) => setEditRolePrompt(e.target.value)} 
                        placeholder="例如：说话喜欢带口头禅，对科技产品很感兴趣..." 
                        className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-cyan-500/50 resize-none leading-relaxed"
                      />
                  </div>

                  {/* Greeting */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 flex items-center"><MessageSquareQuote className="w-3 h-3 mr-1"/> 问候语</label>
                      <div className="relative">
                          <input 
                            type="text" 
                            value={editRoleGreeting} 
                            readOnly 
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-400 outline-none cursor-not-allowed"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                      </div>
                  </div>

                  {/* Voice */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">音色</label>
                      <div className="grid grid-cols-3 gap-3">
                          {[
                              { id: 'sweet', label: '甜美亲和' }, { id: 'calm', label: '沉稳男声' }, { id: 'tech', label: '未来科技' }
                          ].map(v => (
                              <button 
                                key={v.id}
                                disabled
                                className={`py-3 rounded-xl border transition-all text-[10px] font-black uppercase cursor-not-allowed ${editRoleVoice === v.id ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/5 text-slate-600 opacity-50'}`}
                              >
                                  {v.label}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Signature Action */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">招牌动作</label>
                      <button 
                        disabled
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between group cursor-not-allowed"
                      >
                          <div className="flex items-center space-x-3 opacity-60">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                                  <Move className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                                  {editRoleAction === 'wave' ? '热情挥手' :
                                   editRoleAction === 'cute' ? '可爱卖萌' :
                                   editRoleAction === 'groove' ? '动感律动' :
                                   editRoleAction === 'wild' ? '狂野展示' :
                                   editRoleAction === 'elegant' ? '优雅致意' :
                                   editRoleAction === 'weird' ? '搞怪动作' : '自定义动作'}
                              </span>
                          </div>
                          <Lock className="w-3.5 h-3.5 text-slate-600" />
                      </button>
                  </div>
              </div>

              <div className="p-5 border-t border-white/5 bg-[#0C0C0C] pb-safe">
                  <button 
                    onClick={() => { setShowRoleSettings(false); showSystemTip('角色参数已更新'); }}
                    className="w-full py-4 bg-cyan-500 rounded-2xl text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-900/40 active:scale-95 transition-all"
                  >
                      保存设置
                  </button>
              </div>

              {/* Motion Selector Overlay (Nested) - Unreachable now but kept for code structure integrity */}
              {showMotionSelector && (
                  <div className="absolute inset-0 bg-[#121212] z-[180] flex flex-col animate-in slide-in-from-right duration-300">
                      <div className="px-5 pt-12 pb-5 border-b border-white/5 flex items-center bg-[#0C0C0C]">
                          <button onClick={() => setShowMotionSelector(false)} className="p-2 rounded-full bg-white/5 active:scale-90 transition-all mr-3">
                              <ChevronLeft className="w-6 h-6 text-slate-400" />
                          </button>
                          <span className="text-sm font-black text-white uppercase tracking-widest">选择招牌动作</span>
                      </div>
                      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-3">
                          {[
                              { id: 'wave', name: '热情挥手' },
                              { id: 'cute', name: '可爱卖萌' },
                              { id: 'groove', name: '动感律动' },
                              { id: 'wild', name: '狂野展示' },
                              { id: 'elegant', name: '优雅致意' },
                              { id: 'weird', name: '搞怪动作' },
                              ...motionList.map(m => ({ id: m.id, name: m.name }))
                          ].map(action => (
                              <button 
                                key={action.id}
                                onClick={() => { setEditRoleAction(action.id); setShowMotionSelector(false); }}
                                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all active:scale-[0.98] ${editRoleAction === action.id ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                              >
                                  <span className="font-bold text-sm">{action.name}</span>
                                  {editRoleAction === action.id && <Check className="w-4 h-4" />}
                              </button>
                          ))}
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* ... (Rest of the file remains unchanged) ... */}
      {/* --- ROBOT SETTINGS MODAL (New Implementation) --- */}
      {showRobotSettingsModal && (
          <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col animate-in slide-in-from-right duration-300">
              <div className="px-5 pt-12 pb-5 border-b border-white/5 flex items-center bg-[#0C0C0C]">
                  <button 
                    onClick={() => {
                        if (robotSettingsView === 'root') {
                            setShowRobotSettingsModal(false);
                            // Removed setShowSidebar(true) to keep sidebar mounted under modal and prevent animation
                        } else {
                            setRobotSettingsView('root');
                        }
                    }} 
                    className="p-2 rounded-full bg-white/5 active:scale-90 transition-all mr-3"
                  >
                      <ChevronLeft className="w-6 h-6 text-slate-400" />
                  </button>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                      {robotSettingsView === 'root' ? '机器人设置' : 
                       robotSettingsView === 'basic' ? '基础信息' :
                       robotSettingsView === 'remote' ? '绑定遥控器' :
                       robotSettingsView === 'connection' ? '连接模式' :
                       robotSettingsView === 'motor' ? '电机设置' : 
                       robotSettingsView.includes('calibration') ? '电机标定' :
                       robotSettingsView === 'logs' ? '报警信息' : '设备升级'}
                  </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-20">
                  {/* ROOT MENU */}
                  {robotSettingsView === 'root' && (
                      <>
                          {activeSettingsDevice && (
                              <div className="mb-4 flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                                  <div className={`p-2 rounded-xl ${activeSettingsDevice.status === '在线' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                                      <Smartphone className="w-5 h-5" />
                                  </div>
                                  <div>
                                      <div className="text-xs font-bold text-white uppercase">{activeSettingsDevice.name}</div>
                                      <div className="text-[9px] font-mono text-slate-500">{activeSettingsDevice.serialNumber}</div>
                                  </div>
                              </div>
                          )}

                          <div className="bg-white/5 border border-white/10 rounded-[2.25rem] overflow-hidden shadow-xl">
                              {[
                                { id: 'basic', label: '基础信息', icon: Info, color: 'text-blue-400', sub: 'SN, 型号, 版本' },
                                { id: 'remote', label: '绑定遥控器', icon: Gamepad2, color: 'text-purple-400', sub: 'ID: ' + remoteId },
                                { id: 'connection', label: '连接模式', icon: connectionMode === 'wifi' ? Wifi : Router, color: 'text-cyan-400', sub: 'AP模式、Wi-Fi' },
                                { id: 'logs', label: '报警信息', icon: AlertTriangle, color: 'text-red-400', sub: '查看设备警告' },
                              ].map((item, idx) => (
                                  <button 
                                    key={item.id} 
                                    onClick={() => setRobotSettingsView(item.id as RobotSettingsView)}
                                    className={`w-full p-5 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-all ${idx !== 0 ? 'border-t border-white/5' : ''}`}
                                  >
                                      <div className="flex items-center space-x-4">
                                          <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}><item.icon className="w-5 h-5" strokeWidth={2.5} /></div>
                                          <div className="text-left">
                                              <span className="text-sm font-black text-slate-200 uppercase tracking-wide block">{item.label}</span>
                                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{item.sub}</span>
                                          </div>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-slate-700" />
                                  </button>
                              ))}
                          </div>
                          
                          <button onClick={() => setShowUnbindConfirm(true)} className="w-full py-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-black text-xs uppercase tracking-[0.25em] active:scale-95 transition-all shadow-lg mt-auto">
                              解除绑定
                          </button>
                      </>
                  )}

                  {/* ... (Other Robot Settings Views remain unchanged) ... */}
                  {/* BASIC INFO */}
                  {robotSettingsView === 'basic' && (
                      <div className="space-y-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">机器人名称</label>
                              <div className="flex space-x-2">
                                  <input type="text" value={robotName} onChange={(e) => setRobotName(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-500/50" />
                                  <button onClick={() => showSystemTip('名称已修改')} className="bg-cyan-500/20 text-cyan-400 px-4 rounded-xl font-bold text-xs border border-cyan-500/30">修改</button>
                              </div>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 space-y-4">
                              <div className="flex justify-between border-b border-white/5 pb-3">
                                  <span className="text-xs font-bold text-slate-400">设备 SN</span>
                                  <span className="text-xs font-mono text-white">{activeSettingsDevice?.serialNumber || 'SN-XXXX'}</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-3">
                                  <span className="text-xs font-bold text-slate-400">产品型号</span>
                                  <span className="text-xs font-bold text-white">ET1 进阶版</span>
                              </div>
                              <div className="flex justify-between border-b border-white/5 pb-3">
                                  <span className="text-xs font-bold text-slate-400">硬件版本</span>
                                  <span className="text-xs font-mono text-white">HW 2.0</span>
                              </div>
                              <div className="flex justify-between">
                                  <span className="text-xs font-bold text-slate-400">软件版本</span>
                                  <span className="text-xs font-mono text-white">SW 2.1.0</span>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* REMOTE BINDING */}
                  {robotSettingsView === 'remote' && (
                      <div className="space-y-6">
                          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center">
                              <Gamepad2 className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-80" />
                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">当前绑定遥控器 ID</div>
                              <div className="text-2xl font-black text-white font-mono tracking-widest">{remoteId}</div>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">修改 ID</label>
                              <div className="flex space-x-2">
                                  <input type="text" value={remoteId} onChange={(e) => setRemoteId(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-purple-500/50 font-mono" />
                                  <button onClick={() => showSystemTip('遥控器 ID 已更新')} className="bg-purple-500/20 text-purple-400 px-4 rounded-xl font-bold text-xs border border-purple-500/30">保存</button>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* CONNECTION MODE */}
                  {robotSettingsView === 'connection' && (
                      <div className="space-y-4">
                          {/* Wi-Fi Mode (Prominent) */}
                          <button
                              onClick={() => { setConnectionMode('wifi'); showSystemTip('已切换至 Wi-Fi 模式'); }}
                              className={`w-full p-6 bg-gradient-to-br from-cyan-900/40 to-cyan-900/10 border rounded-[2rem] text-left transition-all active:scale-[0.98] shadow-lg shadow-cyan-900/10 group relative overflow-hidden ${connectionMode === 'wifi' ? 'border-cyan-500/50 ring-1 ring-cyan-500/50' : 'border-white/10 hover:border-cyan-500/30'}`}
                          >
                              <div className="absolute top-0 right-0 p-3 opacity-20">
                                  <Wifi className="w-24 h-24 text-cyan-500/10 -mr-4 -mt-4" />
                              </div>
                              <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-2">
                                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${connectionMode === 'wifi' ? 'bg-cyan-500 text-black' : 'bg-white/10 text-cyan-400'}`}>
                                          <Wifi className="w-6 h-6" />
                                      </div>
                                      {connectionMode === 'wifi' && <div className="bg-cyan-500 text-black text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider flex items-center"><CheckCircle className="w-3 h-3 mr-1" />当前模式</div>}
                                  </div>
                                  <h3 className="font-black text-lg text-white mb-1">Wi-Fi 网络模式</h3>
                                  <p className="text-[10px] text-cyan-200/60 font-bold">支持所有功能</p>
                              </div>
                          </button>

                          {/* AP Mode (Secondary) */}
                          <button
                              onClick={() => { setConnectionMode('ap'); showSystemTip('已切换至 AP 模式'); }}
                              className={`w-full p-4 bg-white/5 border rounded-[1.5rem] text-left transition-all active:scale-[0.98] flex items-center justify-between group ${connectionMode === 'ap' ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/10 hover:bg-white/10'}`}
                          >
                              <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-colors ${connectionMode === 'ap' ? 'bg-purple-500 text-white' : 'bg-purple-500/10 text-purple-400'}`}>
                                      <Router className="w-4 h-4" />
                                  </div>
                                  <div>
                                      <h3 className={`font-black text-xs ${connectionMode === 'ap' ? 'text-purple-300' : 'text-slate-300'}`}>AP 直连模式</h3>
                                      <p className={`text-[9px] mt-0.5 ${connectionMode === 'ap' ? 'text-purple-400/60' : 'text-slate-600'}`}>仅支持人机交互、遥控运动功能</p>
                                  </div>
                              </div>
                              {connectionMode === 'ap' && <CheckCircle className="w-4 h-4 text-purple-500" />}
                          </button>
                      </div>
                  )}

                  {/* MOTOR SETTINGS */}
                  {robotSettingsView === 'motor' && (
                      <div className="space-y-6">
                          {/* 1. Waist Motor Lock Control - Separated */}
                          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                  <div className="p-3 bg-white/5 rounded-2xl border border-white/5"><RotateCw className="w-6 h-6 text-blue-400" /></div>
                                  <div className="text-left">
                                      <span className="font-black text-sm text-white block uppercase tracking-wide">腰部关节</span>
                                      <span className="text-[10px] text-slate-500 font-bold mt-0.5">控制腰部电机锁定状态</span>
                                  </div>
                              </div>
                              <button 
                                onClick={() => { setWaistLocked(!waistLocked); showSystemTip(waistLocked ? '腰部电机已解锁' : '腰部电机已锁定'); }}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${waistLocked ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}
                              >
                                  {waistLocked ? '锁定' : '解锁'}
                              </button>
                          </div>

                          {/* 2. Calibration Section - Separated */}
                          <div className="space-y-3">
                              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-start space-x-3">
                                  <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                  <p className="text-[10px] text-orange-200/80 leading-relaxed font-bold">
                                      注意：标定后会影响运动性能，请勿频繁操作。标定过程中机器人将进行大幅度动作，请确保周围安全。
                                  </p>
                              </div>

                              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 text-center">
                                  <div className="w-16 h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center mb-4 text-slate-500 border border-white/5">
                                      <ScanLine className="w-8 h-8" />
                                  </div>
                                  <h3 className="font-black text-white text-lg mb-2">电机标定向导</h3>
                                  <p className="text-[10px] text-slate-500 mb-6 px-4 leading-relaxed">如发现机器人运动偏差，可进行重新标定。全过程约需 1 分钟。</p>
                                  <button onClick={() => setRobotSettingsView('calibration_1')} className="w-full py-4 bg-orange-500 rounded-2xl text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-900/20 active:scale-95 transition-all">
                                      开始标定
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}

                  {/* CALIBRATION STEPS */}
                  {robotSettingsView === 'calibration_1' && (
                      <div className="flex flex-col h-full">
                          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                              <div className="w-48 h-48 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center relative">
                                  {/* Schematic for Hanging */}
                                  <div className="w-20 h-32 border-2 border-slate-600 rounded-xl relative">
                                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-slate-500"></div>
                                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] text-slate-500 font-bold">悬挂</div>
                                  </div>
                              </div>
                              <div>
                                  <h3 className="text-xl font-black text-white mb-2">第一步：确认垂直悬挂</h3>
                                  <p className="text-xs text-slate-500 px-8">请确保机器人处于悬空状态，且身体自然垂直，无任何外力干涉。</p>
                              </div>
                          </div>
                          <div className="pb-safe w-full">
                              <button onClick={() => setRobotSettingsView('calibration_2')} className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                                  确认已悬挂
                              </button>
                          </div>
                      </div>
                  )}

                  {robotSettingsView === 'calibration_2' && (
                      <div className="flex flex-col h-full">
                          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                              <div className="w-48 h-48 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center relative">
                                  {/* Schematic for Limit */}
                                  <div className="relative">
                                      <RotateCw className="w-16 h-16 text-cyan-400 animate-spin-slow" />
                                      <div className="absolute inset-0 flex items-center justify-center font-black text-[10px] text-white">LIMIT</div>
                                  </div>
                              </div>
                              <div>
                                  <h3 className="text-xl font-black text-white mb-2">第二步：手动限位</h3>
                                  <p className="text-xs text-slate-500 px-8 leading-relaxed">
                                      面向机器，腰部电机逆时针转到限位，<br/>其他关节如图卡至限位（两边对称）。
                                  </p>
                              </div>
                          </div>
                          <div className="pb-safe w-full">
                              <button onClick={handleStartCalibration} className="w-full py-4 bg-orange-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-orange-900/40">
                                  完成并开始标定
                              </button>
                          </div>
                      </div>
                  )}

                  {robotSettingsView === 'calibration_3' && (
                      <div className="flex flex-col h-full items-center justify-center text-center space-y-8">
                          <div className="relative w-32 h-32">
                              <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                              <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin"></div>
                              <ScanLine className="absolute inset-0 m-auto w-12 h-12 text-cyan-400 animate-pulse" />
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-white mb-2">系统标定中...</h3>
                              <p className="text-xs text-slate-500">标定完成后机器人将强制重启，请勿断电。</p>
                          </div>
                          <div className="w-full max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div className="h-full bg-cyan-500 animate-[progress_3s_ease-in-out_forwards] w-0"></div>
                          </div>
                      </div>
                  )}

                  {robotSettingsView === 'calibration_result' && (
                      <div className="flex flex-col h-full">
                          <div className="flex-1 flex flex-col items-center pt-10 space-y-8">
                              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-in zoom-in duration-300">
                                  <Check className="w-10 h-10 text-black" strokeWidth={4} />
                              </div>
                              <h3 className="text-2xl font-black text-white uppercase tracking-tight">标定成功</h3>
                              
                              <div className="w-full space-y-3 px-2">
                                  {/* Joint Data Mockup */}
                                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex justify-between items-center">
                                      <div className="flex items-center space-x-3">
                                          <Move className="w-5 h-5 text-cyan-400" />
                                          <span className="text-xs font-bold text-slate-300">关节位置</span>
                                      </div>
                                      <span className="text-xs font-mono text-green-400">已归零</span>
                                  </div>
                                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex justify-between items-center">
                                      <div className="flex items-center space-x-3">
                                          <Thermometer className="w-5 h-5 text-orange-400" />
                                          <span className="text-xs font-bold text-slate-300">关节温度</span>
                                      </div>
                                      <span className="text-xs font-mono text-white">正常 (32°C)</span>
                                  </div>
                                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex justify-between items-center">
                                      <div className="flex items-center space-x-3">
                                          <Info className="w-5 h-5 text-blue-400" />
                                          <span className="text-xs font-bold text-slate-300">关节信息</span>
                                      </div>
                                      <span className="text-xs font-mono text-white">校准完成</span>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="space-y-3 mt-auto pb-safe">
                              <p className="text-[10px] text-slate-500 text-center px-4">
                                  强制关机重启后生效。App 不可去别的页面，机器人不可做任何其他动作，遥控器失效。
                              </p>
                              <button onClick={handleReboot} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-red-900/40">
                                  关机重启
                              </button>
                          </div>
                      </div>
                  )}

                  {/* LOGS */}
                  {robotSettingsView === 'logs' && (
                      <div className="flex flex-col h-full">
                          <div className="flex-1 space-y-3">
                              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                  <div>
                                      <div className="text-[10px] text-slate-500 font-mono mb-1">2023-10-27 10:23:45</div>
                                      <div className="font-bold text-xs text-red-400">E004: 腰部电机过热警告</div>
                                  </div>
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                              </div>
                              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                  <div>
                                      <div className="text-[10px] text-slate-500 font-mono mb-1">2023-10-26 14:10:22</div>
                                      <div className="font-bold text-xs text-yellow-400">W002: 网络连接不稳定</div>
                                  </div>
                                  <Wifi className="w-4 h-4 text-yellow-500" />
                              </div>
                          </div>
                          
                          <div className="mt-4 bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 text-center mb-4">
                              <p className="text-[9px] text-blue-300 font-bold mb-1">隐私提示</p>
                              <p className="text-[9px] text-slate-400">此处仅上传机器人工作状态信息，不会上传您的任何个人信息。</p>
                          </div>
                          
                          <button onClick={() => showSystemTip('日志上传成功')} className="w-full py-4 bg-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-widest active:scale-95 transition-all border border-white/10 hover:bg-white/20">
                              上传故障日志
                          </button>
                      </div>
                  )}

                  {/* UPGRADE */}
                  {robotSettingsView === 'upgrade' && (
                      <div className="flex flex-col h-full">
                          <div className="flex-1 flex flex-col items-center justify-center space-y-6 -mt-20">
                              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 animate-pulse">
                                  <RefreshCw className="w-10 h-10 text-green-400" />
                              </div>
                              <div className="text-center">
                                  <h3 className="text-2xl font-black text-white mb-2">V 2.1.0</h3>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">当前已是最新版本</p>
                                  <p className="text-[9px] text-slate-600 mt-2">上次检查: 10分钟前</p>
                              </div>
                          </div>
                          <button className="w-full py-4 bg-white/5 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest cursor-not-allowed opacity-50">
                              暂无更新
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* ... (User Settings Modal, Logout Confirm, Unbind Confirm, Device List Modal - kept same) ... */}
      
      {/* --- USER SETTINGS MODAL --- */}
      {showSettingsModal && (
          <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col animate-in slide-in-from-right duration-300">
              {/* Settings Header */}
              <div className="px-5 pt-12 pb-5 border-b border-white/5 flex items-center bg-[#0C0C0C]">
                  <button 
                    onClick={handleSettingsBack}
                    className="p-2 rounded-full bg-white/5 active:scale-90 transition-all mr-3"
                  >
                      <ChevronLeft className="w-6 h-6 text-slate-400" />
                  </button>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">
                      {settingsView === 'root' ? '用户设置' : 
                       settingsView === 'account' ? '帐号与安全' :
                       settingsView === 'family' || settingsView === 'family_add' ? '家庭成员设置' :
                       settingsView === 'firmware' ? '软件升级' : // Updated Name
                       settingsView === 'help' ? '帮助与服务' : '用户反馈'}
                  </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                  {/* ROOT MENU */}
                  {settingsView === 'root' && (
                      <>
                          <div className="bg-white/5 border border-white/10 rounded-[2.25rem] overflow-hidden shadow-xl">
                              {[
                                { id: 'account', label: '帐号与安全', icon: Shield, color: 'text-blue-400' },
                                { id: 'family', label: '家庭成员设置', icon: Users, color: 'text-green-400' },
                                { id: 'firmware', label: '软件升级', icon: UploadCloud, color: 'text-purple-400' }, // Updated Name
                                { id: 'help', label: '帮助与服务', icon: HelpCircle, color: 'text-cyan-400' },
                              ].map((item, idx) => (
                                  <button 
                                    key={item.id} 
                                    onClick={() => setSettingsView(item.id as SettingsView)}
                                    className={`w-full p-5 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-all ${idx !== 0 ? 'border-t border-white/5' : ''}`}
                                  >
                                      <div className="flex items-center space-x-4">
                                          <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}><item.icon className="w-5 h-5" strokeWidth={2.5} /></div>
                                          <span className="text-sm font-black text-slate-200 uppercase tracking-wide">{item.label}</span>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-slate-700" />
                                  </button>
                              ))}
                          </div>
                          
                          <button onClick={() => setShowLogoutConfirm(true)} className="w-full py-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-black text-xs uppercase tracking-[0.25em] active:scale-95 transition-all shadow-lg mt-auto">
                              退出登录
                          </button>
                      </>
                  )}

                  {/* ACCOUNT SETTINGS */}
                  {settingsView === 'account' && (
                      <div className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-[2.25rem] overflow-hidden p-6 space-y-6">
                              <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-slate-400">头像</span>
                                  <div className="flex items-center space-x-3">
                                      <img src={AVATAR_URL} className="w-12 h-12 rounded-full border border-white/10" alt="Avatar" />
                                      <button className="bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-300">修改</button>
                                  </div>
                              </div>
                              <div className="h-px bg-white/5"></div>
                              <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-slate-400">帐号名称</span>
                                  <span className="text-sm font-black text-white">大圆圆</span>
                              </div>
                              <div className="h-px bg-white/5"></div>
                              <button className="w-full text-left flex justify-between items-center group">
                                  <span className="text-sm font-bold text-slate-400">修改密码</span>
                                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
                              </button>
                          </div>
                          <button onClick={() => setShowLogoutConfirm(true)} className="w-full py-4 text-red-500 font-black text-xs uppercase tracking-widest text-center opacity-80">
                              退出登录
                          </button>
                      </div>
                  )}

                  {/* FAMILY SETTINGS */}
                  {settingsView === 'family' && (
                      <div className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-[2.25rem] overflow-hidden p-1">
                              {[
                                  { name: '妈妈', seed: 'Mom' }, 
                                  { name: 'Richard', seed: 'Rich' }
                              ].map((member, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer">
                                      <div className="flex items-center space-x-4">
                                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}`} className="w-10 h-10 rounded-full bg-slate-800" alt={member.name} />
                                          <span className="text-sm font-bold text-white">{member.name}</span>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-slate-700" />
                                  </div>
                              ))}
                          </div>
                          <button onClick={() => setSettingsView('family_add')} className="w-full py-4 bg-cyan-500 rounded-2xl text-black font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center">
                              <Plus className="w-4 h-4 mr-2" strokeWidth={3} /> 添加成员
                          </button>
                      </div>
                  )}

                  {/* FAMILY ADD */}
                  {settingsView === 'family_add' && (
                      <div className="space-y-6">
                          <div className="text-center py-6">
                              <div className="w-24 h-24 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/10 mb-4 cursor-pointer hover:bg-white/10 transition-all relative">
                                  <Camera className="w-8 h-8 text-slate-500" />
                                  <div className="absolute -bottom-2 bg-cyan-900/80 text-cyan-400 text-[9px] px-2 py-0.5 rounded font-bold">正面照</div>
                              </div>
                              <p className="text-[10px] text-slate-500">上传成员正面头部照片以便机器人识别</p>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">成员昵称</label>
                              <input type="text" placeholder="例如：爸爸" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:border-cyan-500/50 transition-all" />
                          </div>
                          <button onClick={() => { setSettingsView('family'); showSystemTip('成员已添加'); }} className="w-full py-4 bg-cyan-500 rounded-2xl text-black font-black text-xs uppercase tracking-widest shadow-lg mt-4">
                              确认添加
                          </button>
                      </div>
                  )}

                  {/* FIRMWARE UPDATE */}
                  {settingsView === 'firmware' && (
                      <div className="flex flex-col h-full">
                          <div className="flex-1 flex flex-col items-center justify-center space-y-6 -mt-20">
                              <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20 animate-pulse">
                                  <UploadCloud className="w-10 h-10 text-cyan-400" />
                              </div>
                              <div className="text-center">
                                  <h3 className="text-2xl font-black text-white mb-2">V 2.4.0</h3>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">更新时间: 2023-10-20</p>
                              </div>
                          </div>
                          <div className="pb-10 space-y-4 text-center">
                              <div className="text-xs font-bold text-green-400 flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 mr-2" /> 目前已为最新版本
                              </div>
                              <button className="w-full py-4 bg-white/5 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest cursor-not-allowed opacity-50">
                                  无需更新
                              </button>
                          </div>
                      </div>
                  )}

                  {/* HELP & SERVICES */}
                  {settingsView === 'help' && (
                      <div className="space-y-4">
                          <div className="bg-white/5 border border-white/10 rounded-[2.25rem] overflow-hidden">
                              {[
                                  { label: '开机与连接指南', icon: Power },
                                  { label: 'App 使用说明', icon: Smartphone },
                              ].map((item) => (
                                  <button key={item.label} className="w-full p-5 flex items-center justify-between hover:bg-white/5 active:bg-white/10 transition-all border-b border-white/5 last:border-0">
                                      <div className="flex items-center space-x-4">
                                          <div className="p-2 rounded-xl bg-white/5 text-slate-400"><item.icon className="w-5 h-5" /></div>
                                          <span className="text-sm font-bold text-slate-200">{item.label}</span>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-slate-700" />
                                  </button>
                              ))}
                          </div>
                          <button onClick={() => setSettingsView('feedback')} className="w-full p-5 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-white/10 rounded-2xl flex items-center justify-between group">
                              <div className="flex items-center space-x-4">
                                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400"><MessageCircle className="w-5 h-5" /></div>
                                  <div className="text-left">
                                      <span className="block text-sm font-black text-white">用户反馈</span>
                                      <span className="text-[9px] text-slate-500">提交问题与建议</span>
                                  </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white" />
                          </button>
                      </div>
                  )}

                  {/* FEEDBACK FORM */}
                  {settingsView === 'feedback' && (
                      <div className="space-y-6">
                          <div className="space-y-4">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">称呼 (必填)</label>
                                  <input type="text" value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} placeholder="怎么称呼您" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-500/50" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">联系方式 (选填一项)</label>
                                  <input type="text" value={feedbackContact} onChange={(e) => setFeedbackContact(e.target.value)} placeholder="邮箱或手机号码" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-500/50" />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">分类选择 (必选)</label>
                                  <div className="grid grid-cols-1 gap-2">
                                      <button onClick={() => setFeedbackCategory(1)} className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${feedbackCategory === 1 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>使用问题 / 优化建议</button>
                                      <button onClick={() => setFeedbackCategory(2)} className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${feedbackCategory === 2 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>硬件故障 / 其他问题</button>
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">问题描述 (必填)</label>
                                  <textarea value={feedbackContent} onChange={(e) => setFeedbackContent(e.target.value)} placeholder="请详细描述您遇到的问题 (最少5个字)..." className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-500/50 resize-none leading-relaxed" />
                              </div>
                          </div>
                          <button onClick={handleFeedbackSubmit} className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">提交反馈</button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default Profile;
