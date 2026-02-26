
import React, { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Studio from './components/Studio';
import Works from './pages/Works';
import Devices from './pages/Devices';
import Profile from './pages/Profile';
import CameraView from './components/CameraView';
import MimicFlow from './components/MimicFlow';
import WorkPreview from './components/WorkPreview';
import MyMotions from './pages/MyMotions';
import MyVoice from './pages/MyVoice';
import MyMusic from './pages/MyMusic';
import VoiceCreation from './pages/VoiceCreation';
import CreativeSquare from './pages/CreativeSquare';
import Collections from './pages/Collections';
import Comments from './pages/Comments';
import PublishEditor from './pages/PublishEditor';
import TaskCenter from './pages/TaskCenter'; 
import MaterialSquare from './pages/MaterialSquare'; 
import Skills from './pages/Skills';
import Remote from './pages/Remote';
import Wallet from './pages/Wallet';
import ConnectRobot from './pages/ConnectRobot';
import LoginPage from './pages/LoginPage';
import { Work, WorkStatus, FeedItem, TimelineClip, Device, RobotModel, DeploymentStatus, BackgroundTask } from './types';
import { Check, Loader2, Maximize2, Activity, ChevronRight, GripHorizontal, ArrowDown } from 'lucide-react';

const INITIAL_VOICES = [
  { id: 'v_local_1', title: '我的录音 01', text: '自定义录音内容...', duration: '00:10', type: 'local', subType: 'custom', tags: [] },
  { id: 'v_local_2', title: 'TTS 生成语音 02', text: '欢迎光临体验店...', duration: '00:05', type: 'local', subType: 'custom', tags: [] },
  { id: 'v_local_3', title: '会议记录摘要', text: '关于下季度产品规划...', duration: '01:20', type: 'local', subType: 'custom', tags: [] },
  { id: 'v_online_1', title: '欢迎光临', text: '欢迎光临 Galbot 体验店', duration: '00:03', type: 'online', tags: ['推荐', '迎宾', '热门'] },
  { id: 'v_online_2', title: '介绍产品', text: '这是我们最新的 R1 机器人...', duration: '00:15', type: 'online', tags: ['解说', '商务'] },
];

const INITIAL_MUSIC = [
  { id: 'm_local_1', title: '我的录音 001', author: '我', duration: '00:45', type: 'local', subType: 'custom', tags: [] },
  { id: 'm_online_2', title: '舒缓背景音', author: 'System', duration: '02:10', type: 'online', tags: ['推荐', '氛围', '热门'] },
  { id: 'm_online_3', title: '赛博朋克节奏', author: 'FutureSound', duration: '03:45', type: 'online', tags: ['电子', '热门'] },
];

const INITIAL_MOTIONS = [
    { id: 'mo_local_1', name: 'R1 热情挥手', duration: '00:04', date: '2023-10-27', type: 'local', format: 'bvh', tags: [] },
    { id: 'mo_local_2', name: '伸懒腰', duration: '00:06', date: '2023-10-26', type: 'local', format: 'bvh', tags: [] },
    { id: 'mo_online_1', name: '蹲下观察', duration: '00:05', date: '2023-10-25', type: 'online', format: 'bvh', tags: ['常用', '剧情'] },
    { id: 'mo_online_2', name: '机械舞步 A', duration: '00:12', date: '2023-10-20', type: 'online', format: 'bvh', tags: ['推荐', '舞蹈', '热门'] },
];

// Start EMPTY to force new user flow
const INITIAL_DEVICES: Device[] = [];

const INITIAL_TIMELINE_1: TimelineClip[] = [
    { id: 'c1', trackId: 'motion', startTime: 0, duration: 4, name: 'R1 热情挥手', color: 'bg-blue-500', materialId: 'mo_local_1' },
    { id: 'c2', trackId: 'audio', startTime: 0, duration: 10, name: '舒缓背景音', color: 'bg-purple-500', materialId: 'm_online_2' }
];

const INITIAL_WORKS: Work[] = [
  { id: '1', title: 'Galbot Dance 981', thumbnail: '', status: WorkStatus.Completed, lastModified: '1天前', publishTime: '2023-10-28', duration: '01:20', author: '用户', timeline: INITIAL_TIMELINE_1, isDeployed: true, style: 'wave' },
  { id: '2', title: '迎宾动作草稿', thumbnail: '', status: WorkStatus.Draft, lastModified: '2天前', createTime: '2023-10-26', duration: '00:30', author: '用户', timeline: [], isDeployed: false, style: 'groove' },
  { id: '3', title: '迎宾接待标准流程', thumbnail: '', status: WorkStatus.Completed, lastModified: '3天前', publishTime: '2023-10-25', duration: '00:45', author: '用户', timeline: [], isDeployed: false, style: 'groove' },
  { id: '4', title: '复杂抓取路径测试', thumbnail: '', status: WorkStatus.Draft, lastModified: '4天前', createTime: '2023-10-24', duration: '02:15', author: '用户', timeline: [], isDeployed: false, style: 'wave' },
  { id: '5', title: '万圣节惊吓表演', thumbnail: '', status: WorkStatus.Completed, lastModified: '1周前', publishTime: '2023-10-20', duration: '00:15', author: '用户', timeline: [], isDeployed: false, style: 'weird' },
  { id: '6', title: '儿童节温情互动', thumbnail: '', status: WorkStatus.Completed, lastModified: '2周前', publishTime: '2023-10-15', duration: '03:00', author: '用户', timeline: [], isDeployed: false, style: 'cute' },
];

const INITIAL_FEED: FeedItem[] = [
    { 
        id: 'f1', title: 'Galbot 迎宾舞蹈', author: '官方', likes: 12000, comments: '320', desc: '最新的迎宾动作模版。', music: 'Galbot Theme', duration: '00:45', isLiked: false, tags: ['推荐', '迎宾', '热门'],
        timeline: [
            { id: 'ft1', trackId: 'motion', startTime: 0, duration: 5, name: '鞠躬致意', color: 'bg-blue-500', materialId: 'mo_online_3' },
            { id: 'ft2', trackId: 'audio', startTime: 0, duration: 15, name: '欢迎光临', color: 'bg-purple-500', materialId: 'v_online_1' }
        ]
    },
    { 
        id: 'f2', title: '机械舞步教学', author: 'RobotMaster', likes: 8500, comments: '150', desc: '分解动作教学。', music: 'Robo Funk', duration: '01:10', isLiked: false, tags: ['推荐', '舞蹈', '热门'],
        timeline: [
            { id: 'ft3', trackId: 'motion', startTime: 0, duration: 12, name: '机械舞步 A', color: 'bg-blue-500', materialId: 'mo_online_2' },
            { id: 'ft4', trackId: 'audio', startTime: 0, duration: 12, name: '赛博朋克节奏', color: 'bg-purple-500', materialId: 'm_online_3' }
        ]
    },
    { id: 'f3', title: '太极拳演示', author: '实验室', likes: 5400, comments: '88', desc: '慢动作展现极致平衡能力。', music: '高山流水', duration: '02:30', isLiked: true, tags: ['推荐', '科技'], timeline: [] },
    { id: 'f4', title: 'R1 赛博朋克蹦迪', author: '未来派', likes: 15400, comments: '500', desc: '跟随节奏一起摇摆！', music: 'Cyber Beats', duration: '00:50', isLiked: false, tags: ['推荐', '舞蹈', '热门'], timeline: [] },
    { id: 'f5', title: '展厅智能引导模版', author: '官方', likes: 7200, comments: '120', desc: '专业商务引导话术与动作。', music: 'Business Soft', duration: '01:45', isLiked: false, tags: ['推荐', '迎宾'], timeline: [] },
    { id: 'f6', title: '搞怪语音连发', author: '整活达人', likes: 21000, comments: '999', desc: '让人忍俊不禁的互动逻辑。', music: 'Funny SFX', duration: '00:20', isLiked: true, tags: ['推荐', '整活'], timeline: [] },
];

const INITIAL_SENT_COMMENTS = [
    { id: 's1', targetUser: 'OfficialGalbot', content: '期待更新更多官方模版！', time: '昨天', workTitle: 'R1 标准动作库', workId: 'f1' },
    { id: 's2', targetUser: 'DanceKing', content: '大神，可以互关一下吗？', time: '3天前', workTitle: '街舞挑战', workId: 'f4' },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('login'); // START AT LOGIN
  const [lastPage, setLastPage] = useState('profile');
  const [currentWorkId, setCurrentWorkId] = useState<string | null>(null);
  
  const [globalToast, setGlobalToast] = useState<string | null>(null);
  const [backgroundTasks, setBackgroundTasks] = useState<BackgroundTask[]>([]);

  const [floatPos, setFloatPos] = useState({ x: 280, y: 100 }); 
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: floatPos.x, y: floatPos.y });
  const appContainerRef = useRef<HTMLDivElement>(null);

  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [activeDeviceIds, setActiveDeviceIds] = useState<string[]>([]);
  const [deviceDeployments, setDeviceDeployments] = useState<Record<string, DeploymentStatus>>({});
  const [allVoices, setAllVoices] = useState<any[]>(INITIAL_VOICES);
  const [allMusic, setAllMusic] = useState<any[]>(INITIAL_MUSIC);
  const [allMotions, setAllMotions] = useState<any[]>(INITIAL_MOTIONS);
  const [myWorks, setMyWorks] = useState<Work[]>(INITIAL_WORKS);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(INITIAL_FEED);
  const [collectedFeedIds, setCollectedFeedIds] = useState<string[]>([]);
  
  const [sentComments, setSentComments] = useState(INITIAL_SENT_COMMENTS);
  
  // New state to globally track the selected robot for control (Profile <-> Remote)
  const [currentRobotId, setCurrentRobotId] = useState<string | null>(null);

  const commentsBackTarget = useRef('profile');

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const mainNavPages = ['creative', 'dashboard', 'skills', 'remote', 'profile', 'login'];

  // Initialize selected robot
  useEffect(() => {
      if (!currentRobotId && devices.length > 0) {
          const online = devices.find(d => d.status === '在线');
          setCurrentRobotId(online ? online.id : devices[0].id);
      }
  }, [devices]);

  useEffect(() => {
      const interval = setInterval(() => {
          setBackgroundTasks(prevTasks => {
              const active = prevTasks.some(t => t.status === 'processing');
              if (!active) return prevTasks;
              return prevTasks.map(task => {
                  if (task.status === 'processing') {
                      const increment = 0.167; 
                      const newProgress = Math.min(100, task.progress + increment);
                      if (newProgress >= 100) {
                          showToast(`任务完成: ${task.name}`);
                          return { ...task, progress: 100, status: 'done' };
                      }
                      return { ...task, progress: newProgress };
                  }
                  return task;
              });
          });
      }, 100);
      return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
      setGlobalToast(msg);
      setTimeout(() => setGlobalToast(null), 3000);
  };

  const handleAddComment = (comment: { targetUser: string, content: string, workTitle: string }) => {
      const newComment = {
          id: `c_${Date.now()}`,
          targetUser: comment.targetUser,
          content: comment.content,
          time: '刚刚',
          workTitle: comment.workTitle,
          workId: currentWorkId || 'f1'
      };
      setSentComments([newComment, ...sentComments]);
  };

  const handleStopTask = (deviceId: string) => {
      setDeviceDeployments(prev => {
          const next = { ...prev };
          delete next[deviceId];
          return next;
      });
      showToast('任务已终止，手动控制激活');
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
      e.stopPropagation(); 
      isDragging.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      dragStart.current = { x: clientX, y: clientY };
      dragOffset.current = { x: floatPos.x, y: floatPos.y };
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
      if (!isDragging.current) return;
      e.stopPropagation();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      let newX = dragOffset.current.x + (clientX - dragStart.current.x);
      let newY = dragOffset.current.y + (clientY - dragStart.current.y);
      const containerWidth = appContainerRef.current?.clientWidth || window.innerWidth;
      const containerHeight = appContainerRef.current?.clientHeight || window.innerHeight;
      newX = Math.max(10, Math.min(containerWidth - 90, newX));
      newY = Math.max(60, Math.min(containerHeight - 100, newY));
      setFloatPos({ x: newX, y: newY });
  };

  const handleDragEnd = () => { isDragging.current = false; };
  const handleFloatingClick = () => { handleNavigate('task-center'); }; 

  const handleNavigate = (page: string, id?: string) => {
      // Capture origin for Comments page to ensure correct Back behavior
      if (page === 'comments' && currentPage !== 'creative-preview') {
          commentsBackTarget.current = currentPage;
      }

      setLastPage(currentPage);
      setCurrentPage(page);
      if (id !== undefined) setCurrentWorkId(id); 
      else if ((page === 'studio' || page === 'mimic-flow' || page === 'creative') && !id) setCurrentWorkId(null); 
  };

  const handleBack = () => {
      if (currentPage === 'studio') {
          if (lastPage === 'creative-preview') { handleNavigate('creative-preview', currentWorkId || undefined); return; }
          if (lastPage === 'creative') { handleNavigate('creative', currentWorkId || undefined); return; }
          if (currentWorkId) { handleNavigate('works'); return; }
          handleNavigate('dashboard'); return;
      }
      if (currentPage === 'creative-preview') {
          // If we came from comments (e.g. clicking "From: xxx"), go back to comments
          if (lastPage === 'comments') { handleNavigate('comments'); return; }
          handleNavigate('creative'); 
          return; 
      }
      if (currentPage === 'works-published') {
          if (lastPage === 'creative' || lastPage === 'creative-preview') { handleNavigate('creative'); return; }
          handleNavigate('profile');
          return;
      }
      if (currentPage === 'comments') {
          handleNavigate(commentsBackTarget.current);
          return;
      }
      if (currentPage === 'collections') {
          if (lastPage === 'creative' || lastPage === 'creative-preview') {
              handleNavigate(lastPage);
              return;
          }
          handleNavigate('profile');
          return;
      }
      if (['works', 'my-motions', 'my-music', 'my-voice', 'task-center', 'mimic-flow', 'wallet', 'connect-robot'].includes(currentPage)) {
          handleNavigate('dashboard');
          return;
      }
      if (lastPage) handleNavigate(lastPage); else handleNavigate('dashboard');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).closest('.floating-capsule')) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).closest('.floating-capsule')) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX.current;
      const deltaY = Math.abs(touchEndY - touchStartY.current);
      if (!mainNavPages.includes(currentPage) && touchStartX.current < 40 && deltaX > 40 && deltaY < 40) {
          handleBack();
      }
  };

  const activeProcessingTasks = backgroundTasks.filter(t => t.status === 'processing');

  const renderPage = () => {
    const pageContent = (() => {
      switch (currentPage) {
        case 'login': return <LoginPage onLoginSuccess={() => handleNavigate('profile')} />;
        case 'creative': return <CreativeSquare onNavigate={handleNavigate} feedItems={feedItems} onToggleLike={id => setFeedItems(p => p.map(f => f.id === id ? {...f, isLiked: !f.isLiked, likes: f.isLiked ? f.likes-1 : f.likes+1} : f))} collectedIds={collectedFeedIds} onToggleCollect={id => setCollectedFeedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])} myWorks={myWorks} onAddComment={handleAddComment} />;
        case 'creative-preview': return <CreativeSquare onNavigate={handleNavigate} onBack={handleBack} feedItems={feedItems} onToggleLike={id => setFeedItems(p => p.map(f => f.id === id ? {...f, isLiked: !f.isLiked, likes: f.isLiked ? f.likes-1 : f.likes+1} : f))} collectedIds={collectedFeedIds} onToggleCollect={id => setCollectedFeedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])} initialPreviewId={currentWorkId || undefined} myWorks={myWorks} onAddComment={handleAddComment} />;
        case 'dashboard': return <Dashboard onNavigate={handleNavigate} activeDeviceIds={activeDeviceIds} devices={devices} />;
        case 'skills': return <Skills onNavigate={handleNavigate} />;
        case 'remote': return <Remote onBack={() => handleNavigate(lastPage || 'dashboard')} onNavigate={handleNavigate} devices={devices} deviceDeployments={deviceDeployments} onStopTask={handleStopTask} currentRobotId={currentRobotId || undefined} />;
        case 'profile': 
            const sidebarOriginPages = ['collections', 'works-published', 'comments', 'wallet', 'settings', 'help', 'devices'];
            const shouldOpenSidebar = sidebarOriginPages.includes(lastPage);
            return <Profile onNavigate={handleNavigate} initialShowSidebar={shouldOpenSidebar} devices={devices} deviceDeployments={deviceDeployments} currentRobotId={currentRobotId || undefined} onRobotSelect={setCurrentRobotId} motionList={allMotions} onDeleteDevice={(id) => setDevices(p => p.filter(d => d.id !== id))} />;
        case 'comments': return <Comments onBack={handleBack} onNavigate={handleNavigate} sentComments={sentComments} />;
        case 'collections': return <Collections onBack={handleBack} onNavigate={handleNavigate} feedItems={feedItems} collectedIds={collectedFeedIds} onToggleCollect={id => setCollectedFeedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])} />;
        case 'works-published': return <Works onBack={handleBack} onNavigate={handleNavigate} works={myWorks} viewMode='published' onDelete={ids => setMyWorks(p => p.filter(w => Array.isArray(ids) ? !ids.includes(w.id) : w.id !== ids))} onToggleDeploy={id => setMyWorks(p => p.map(w => w.id === id ? {...w, isDeployed: !w.isDeployed} : w))} />;
        case 'wallet': return <Wallet onBack={() => handleNavigate('profile')} />;
        case 'studio':
          const workToEdit = myWorks.find(w => w.id === currentWorkId) || feedItems.find(f => f.id === currentWorkId) as any; 
          const isFromSquare = lastPage === 'creative' || lastPage === 'creative-preview' || (!!currentWorkId && !myWorks.find(w => w.id === currentWorkId));
          return <Studio onBack={handleBack} workId={currentWorkId || undefined} isTemplate={isFromSquare} initialClips={workToEdit?.timeline} availableMotions={allMotions.filter(m => m.type === 'local')} availableMusic={allMusic.filter(m => m.type === 'local')} availableVoices={allVoices.filter(v => v.type === 'local')} onSave={(id, cl, t) => {
                const newWork: Work = { id: id || `w_${Date.now()}`, title: t || '新作品', thumbnail: '', status: WorkStatus.Draft, lastModified: '刚刚', createTime: new Date().toLocaleDateString(), duration: '00:30', author: '用户', timeline: cl, isDeployed: false, style: 'wave' };
                if (id && !feedItems.some(f => f.id === id)) setMyWorks(p => p.map(w => w.id === id ? newWork : w));
                else setMyWorks(p => [newWork, ...p]);
                showToast('保存成功');
                handleBack();
            }} activeDeviceCount={activeDeviceIds.length} availableDevices={devices.filter(d => d.status === '在线')} deviceDeployments={deviceDeployments} onDeploy={(ids) => {
              ids.forEach(id => {
                  setDeviceDeployments(p => ({...p, [id]: { workId: currentWorkId || 'temp', title: workToEdit?.title || '作品', type: 'work', timestamp: Date.now() }}));
              });
              if (currentWorkId) {
                  setMyWorks(prev => prev.map(w => w.id === currentWorkId ? { ...w, isDeployed: true } : w));
              }
            }} />;
        case 'devices': 
            const devicesReturnPage = lastPage === 'profile' ? 'profile' : 'dashboard';
            return <Devices onBack={() => handleNavigate(devicesReturnPage)} onNavigate={handleNavigate} activeDeviceIds={activeDeviceIds} onToggleConnect={(id) => setActiveDeviceIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])} onSetAll={setActiveDeviceIds} deviceList={devices} onAddDevice={d => setDevices(p => [...p, d])} onDeleteDevice={id => setDevices(p => p.filter(x => x.id !== id))} deviceDeployments={deviceDeployments} onSelectDevice={(id) => {
                    setCurrentRobotId(id);
                    if (lastPage === 'profile') { handleNavigate('profile'); }
                }} />;
        case 'connect-robot': 
            const connectReturnPage = lastPage === 'devices' ? 'devices' : 'profile';
            return <ConnectRobot onBack={() => handleNavigate(connectReturnPage)} onConnectSuccess={(device) => { setDevices(prev => [...prev, device]); showToast('机器人连接成功'); handleNavigate(connectReturnPage); }} />;
        case 'my-voice': return <MyVoice onBack={() => handleNavigate('dashboard')} onNavigate={handleNavigate} voiceList={allVoices} onDelete={ids => setAllVoices(p => p.filter(v => !ids.includes(v.id)))} onDownload={i => setAllVoices(p => [{...i, id: i.id+'_dl', type: 'local'}, ...p])} onRename={(id, n) => setAllVoices(p => p.map(v => v.id === id ? {...v, title: n} : v))} />;
        case 'voice-creation': return <VoiceCreation onBack={() => handleNavigate('my-voice')} onSave={v => { setAllVoices(p => [v, ...p]); handleNavigate('my-voice'); }} />;
        case 'my-music': return <MyMusic onBack={() => handleNavigate('dashboard')} musicList={allMusic} onDelete={ids => setAllMusic(p => p.filter(m => !ids.includes(m.id)))} onDownload={i => setAllMusic(p => [{...i, id: i.id+'_dl', type: 'local'}, ...p])} onRename={(id, n) => setAllMusic(p => p.map(m => m.id === id ? {...m, title: n} : m))} />;
        case 'my-motions': return <MyMotions onBack={() => handleNavigate('dashboard')} onNavigate={handleNavigate} motionList={allMotions} onDelete={id => setAllMotions(p => p.filter(m => Array.isArray(id) ? !id.includes(m.id) : m.id !== id))} devices={devices} activeDeviceIds={activeDeviceIds} initialSelectedId={currentWorkId} onDownload={i => setAllMotions(p => [{...i, id: i.id+'_dl', type: 'local'}, ...p])} onRename={(id, n) => setAllMotions(p => p.map(m => m.id === id ? {...m, name: n} : m))} />;
        case 'mimic-flow': 
            const existingTask = backgroundTasks.find(t => t.id === currentWorkId);
            return <MimicFlow onBack={handleBack} existingTask={existingTask} onSave={m => { setAllMotions(p => [m, ...p]); if (existingTask) { setBackgroundTasks(prev => prev.map(t => t.id === existingTask.id ? { ...t, status: 'saved' } : t)); } showToast('动作动作保存成功'); handleNavigate('dashboard'); }} onDiscard={() => { if (existingTask) { setBackgroundTasks(prev => prev.map(t => t.id === existingTask.id ? { ...t, status: 'deleted' } : t)); } handleNavigate('dashboard'); }} activeDeviceCount={activeDeviceIds.length} availableDevices={devices.filter(d => d.status === '在线')} onStartNewTask={(name) => { const newId = `task_${Date.now()}`; const newTask: BackgroundTask = { id: newId, type: 'mimic', name: name || `动作模仿 ${Date.now()}`, progress: 0, status: 'processing', startTime: '刚刚' }; setBackgroundTasks(prev => [newTask, ...prev]); setCurrentWorkId(newId); }} onMinimize={() => { showToast('后台任务已开始'); handleNavigate('dashboard'); }} />;
        case 'works': return <Works onBack={handleBack} onNavigate={handleNavigate} works={myWorks} viewMode='all' onDelete={ids => setMyWorks(p => p.filter(w => Array.isArray(ids) ? !ids.includes(w.id) : w.id !== ids))} onToggleDeploy={id => setMyWorks(p => p.map(w => w.id === id ? {...w, isDeployed: !w.isDeployed} : w))} />;
        case 'task-center': return <TaskCenter onBack={() => handleNavigate('dashboard')} onNavigate={handleNavigate} tasks={backgroundTasks} onDeleteTask={(id) => { setBackgroundTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'deleted' } : t)); }} />;
        case 'work-preview': 
            const work = myWorks.find(w => w.id === currentWorkId);
            return <WorkPreview onBack={handleBack} workId={currentWorkId || '1'} workStatus={work?.status} workTitle={work?.title} animationStyle={work?.style} onPublish={id => handleNavigate('publish-editor', id)} onNavigate={handleNavigate} onDelete={id => { setMyWorks(p => p.filter(w => w.id !== id)); handleBack(); }} availableDevices={devices.filter(d => d.status === '在线')} onDeploy={ids => { ids.forEach(id => setDeviceDeployments(p => ({...p, [id]: { workId: currentWorkId || 'preview', title: '预览作品', type: 'work', timestamp: Date.now() }}))); if (currentWorkId) { setMyWorks(prev => prev.map(w => w.id === currentWorkId ? { ...w, isDeployed: true } : w)); } }} />;
        case 'publish-editor': return <PublishEditor onBack={() => handleNavigate(lastPage === 'creative' ? 'creative' : 'works')} workId={currentWorkId || ''} initialTitle={myWorks.find(w => w.id === currentWorkId)?.title || ''} onPublish={(id, d) => { setMyWorks(prev => { const originalIndex = prev.findIndex(w => w.id === id); if (originalIndex === -1) return prev; const originalWork = prev[originalIndex]; const publishedWork: Work = { ...originalWork, title: d.title, status: WorkStatus.Completed, publishTime: new Date().toLocaleDateString(), isDeployed: false }; const draftCopy: Work = { ...originalWork, id: `copy_${Date.now()}`, title: `${originalWork.title} (备份)`, status: WorkStatus.Draft, createTime: new Date().toLocaleDateString(), lastModified: '刚刚', isDeployed: false }; const newWorks = [...prev]; newWorks[originalIndex] = publishedWork; newWorks.unshift(draftCopy); return newWorks; }); setFeedItems(p => [{ id: `pub_${Date.now()}`, title: d.title, author: '我', likes: 0, comments: '0', desc: d.desc, music: 'Original', duration: '00:30', isLiked: false, tags: d.tags || [] }, ...p]); showToast('发布成功'); handleNavigate('works'); }} />;
        case 'material-square': return <MaterialSquare onBack={() => handleNavigate('dashboard')} voiceList={allVoices} musicList={allMusic} motionList={allMotions} onDownload={(item, type) => { if(type === 'voice') setAllVoices(p => [{...item, id: item.id+'_dl', type: 'local'}, ...p]); if(type === 'music') setAllMusic(p => [{...item, id: item.id+'_dl', type: 'local'}, ...p]); if(type === 'motion') setAllMotions(p => [{...item, id: item.id+'_dl', type: 'local'}, ...p]); showToast('下载成功'); }} />;
        case 'camera-mode': case 'camera-selection': return <CameraView onClose={() => handleNavigate('dashboard')} onCapture={() => handleNavigate('studio')} />;
        default: return <Dashboard onNavigate={handleNavigate} activeDeviceIds={activeDeviceIds} devices={devices} />;
      }
    })();
    return <div key={currentPage} className="h-full w-full animate-page-enter">{pageContent}</div>;
  };

  const isFullScreenPage = ['login', 'studio', 'camera-mode', 'camera-selection', 'mimic-flow', 'work-preview', 'my-voice', 'my-music', 'my-motions', 'voice-creation', 'comments', 'publish-editor', 'creative-preview', 'task-center', 'material-square', 'remote', 'devices', 'wallet', 'connect-robot'].includes(currentPage);

  return (
    <div className="w-full flex justify-center items-center h-screen bg-black font-sans">
      <div ref={appContainerRef} className="relative bg-[#0C0C0C] w-full h-full md:h-[92vh] md:max-h-[920px] md:max-w-[425px] md:my-auto md:rounded-[3.2rem] md:border-[10px] md:border-[#1A1A1A] md:shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {globalToast && (<div className="absolute top-16 left-1/2 -translate-x-1/2 z-[150] bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none"><Check className="w-4 h-4 mr-2 text-green-500" strokeWidth={3} /><span className="text-[11px] font-black uppercase tracking-widest">{globalToast}</span></div>)}
        {activeProcessingTasks.length > 0 && currentPage !== 'mimic-flow' && currentPage !== 'task-center' && (
            <div className="absolute z-[100] floating-capsule touch-none" style={{ top: floatPos.y, left: floatPos.x }} onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd} onMouseDown={handleDragStart} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onClick={handleFloatingClick}>
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl flex flex-col items-center w-24 relative overflow-hidden group cursor-grab active:cursor-grabbing">
                    <div className="relative z-10 flex flex-col items-center text-center"><span className="text-[9px] font-black text-white/90 uppercase tracking-tight mb-1 leading-tight">{activeProcessingTasks.length > 1 ? `${activeProcessingTasks.length} 个任务` : '分析中...'}</span><span className="text-xl font-black text-cyan-400 font-mono tracking-tighter">{activeProcessingTasks[0].progress.toFixed(0)}%</span></div>
                </div>
            </div>
        )}
        <div className="h-full w-full">{isFullScreenPage ? renderPage() : (<Layout activePage={currentPage} onNavigate={handleNavigate} hasDevices={devices.length > 0}>{renderPage()}</Layout>)}</div>
      </div>
    </div>
  );
};

export default App;
