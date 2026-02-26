

export enum RobotModel {
  R1 = 'Galbot R1',
}

export enum RobotVersion {
  Flagship = '旗舰版',
  Youth = '青春版',
}

export enum WorkStatus {
  Draft = '草稿',
  Completed = '已发布',
}

export interface Work {
  id: string;
  title: string;
  thumbnail: string;
  status: WorkStatus;
  lastModified: string;
  createTime?: string; // Added: Creation timestamp
  publishTime?: string; // Added: Publish timestamp
  duration: string;
  author: '官方' | '用户';
  timeline?: TimelineClip[]; 
  isDeployed?: boolean; 
  // Fix: Expand supported styles to include all robot animation styles to resolve type errors in App.tsx
  style?: 'wave' | 'groove' | 'cute' | 'wild' | 'elegant' | 'weird'; 
}

export interface FeedItem {
  id: string;
  title: string;
  author: string;
  likes: number; 
  comments: string;
  desc: string;
  music: string;
  duration: string;
  isLiked?: boolean;
  tags?: string[]; // Added tags for filtering
  timeline?: TimelineClip[]; // Added timeline for templates
}

export interface Material {
  id: string;
  name: string; 
  title?: string; 
  type: 'motion' | 'audio' | 'voice' | 'expression' | 'music' | 'local' | 'online'; 
  subType?: string;
  thumbnail?: string;
  duration?: string | number;
  source?: '官方' | '用户';
  text?: string; 
  author?: string; 
  format?: string;
  date?: string;
  isCollected?: boolean;
  color?: string; 
  tags?: string[]; // Added tags for filtering
}

export interface Device {
  id: string;
  name: string;
  serialNumber: string;
  status: '在线' | '离线' | '忙碌';
  model: RobotModel;
  battery: number;
}

export type TrackType = 'audio' | 'motion' | 'voice' | 'expression';

export interface TimelineClip {
  id: string;
  materialId?: string; 
  trackId: TrackType;
  startTime: number;
  duration: number;
  name: string;
  color: string;
}

export interface DeploymentStatus {
    workId: string;
    title: string;
    type: 'work' | 'motion';
    timestamp: number;
}

export interface BackgroundTask {
    id: string;
    type: 'mimic';
    name: string;
    progress: number;
    status: 'idle' | 'processing' | 'done' | 'failed' | 'saved' | 'deleted'; 
    startTime: string;
}