
import React, { useRef, useEffect, useState } from 'react';
import { Search, Heart, Share2, ChevronLeft, User, Star, Wand2, X, Sparkles, LayoutGrid, MessageCircle, Plus, FileText, ChevronRight as ChevronRightIcon, Inbox, MessageSquare, ThumbsUp, Send as SendIcon } from 'lucide-react';
import VirtualRobot from '../components/VirtualRobot';
import { FeedItem, Work, WorkStatus } from '../types';

interface CreativeSquareProps {
  onNavigate?: (page: string, id?: string) => void;
  onBack?: () => void;
  feedItems: FeedItem[];
  onToggleLike: (id: string) => void;
  collectedIds: string[];
  onToggleCollect: (id: string) => void;
  initialPreviewId?: string;
  myWorks?: Work[]; 
  // Unused props kept for compatibility
  voiceList?: any[];
  musicList?: any[];
  motionList?: any[];
  onToggleVoiceCollect?: (id: string) => void;
  onToggleMusicCollect?: (id: string) => void;
  onToggleMotionCollect?: (id: string) => void;
  onDownload?: (item: any, type: 'music' | 'voice' | 'motion') => void;
  onAddComment?: (comment: { targetUser: string, content: string, workTitle: string }) => void;
}

const CreativeSquare: React.FC<CreativeSquareProps> = ({ 
    onNavigate, 
    onBack,
    feedItems,
    onToggleLike,
    collectedIds,
    onToggleCollect,
    initialPreviewId,
    myWorks = [],
    onAddComment
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'feed'>('grid');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTag, setActiveTag] = useState('推荐');
  
  // Publish Modal State
  const [showPublishSelect, setShowPublishSelect] = useState(false);

  // Comment Drawer State
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
      { id: 1, user: 'MotionMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', content: '这个动作编排太流畅了，特别是转身那个细节！', time: '10分钟前', likes: 24 },
      { id: 2, user: 'GalbotFan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', content: '求教，语音部分是怎么卡点的？', time: '1小时前', likes: 5 },
      { id: 3, user: 'TechGeek', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', content: '很有创意的结合，下载试试。', time: '3小时前', likes: 12 },
      { id: 4, user: 'DanceLover', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mila', content: 'BGM 配得刚刚好！', time: '5小时前', likes: 8 },
  ]);

  const tags = ['推荐', '热门', '迎宾', '舞蹈', '剧情', '整活', '节日', '科技'];

  const filterList = (list: FeedItem[]) => {
      const query = searchQuery.toLowerCase();
      return list.filter(item => {
         const matchesSearch = (item.title ? item.title.toLowerCase().includes(query) : false) || 
                               (item.author ? item.author.toLowerCase().includes(query) : false);
         const matchesTag = item.tags && item.tags.includes(activeTag);
         return matchesSearch && matchesTag;
      });
  };

  const displayFeed = filterList(feedItems);
  
  const draftWorks = myWorks.filter(w => w.status === WorkStatus.Draft);

  useEffect(() => {
      if (initialPreviewId) {
          const index = displayFeed.findIndex(item => item.id === initialPreviewId);
          if (index !== -1) {
              setActiveIndex(index);
              setViewMode('feed');
          }
      } else {
          setViewMode('grid');
      }
  }, [initialPreviewId]);

  const openFeed = (id: string) => {
      if (onNavigate) {
          onNavigate('creative-preview', id);
      }
  };

  useEffect(() => {
      if (viewMode === 'feed' && feedContainerRef.current) {
          feedContainerRef.current.scrollTop = activeIndex * feedContainerRef.current.clientHeight;
      }
  }, [viewMode, activeIndex]);

  const handleUseTemplate = (e: React.MouseEvent, templateId: string) => {
      e.stopPropagation();
      if (onNavigate) {
          onNavigate('studio', templateId);
      }
  };

  const handleBackToGrid = () => {
      if (onBack) {
          onBack();
      } else if (onNavigate) {
          onNavigate('creative');
      } else {
          setViewMode('grid');
      }
  };

  const handleSelectDraft = (workId: string) => {
      if (onNavigate) {
          onNavigate('publish-editor', workId);
          setShowPublishSelect(false);
      }
  };

  const handleSendComment = () => {
      if (!commentText.trim()) return;
      
      const currentItem = displayFeed[activeIndex];
      const newComment = {
          id: Date.now(),
          user: '我',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eden',
          content: commentText,
          time: '刚刚',
          likes: 0
      };
      setComments([newComment, ...comments]);
      
      if (onAddComment && currentItem) {
          onAddComment({
              targetUser: currentItem.author,
              content: commentText,
              workTitle: currentItem.title
          });
      }
      
      setCommentText('');
  };

  return (
    <div className="flex-1 bg-[#0C0C0C] flex flex-col h-full overflow-hidden text-white relative animate-in fade-in duration-300">
      {viewMode === 'grid' ? (
          <>
            {/* Combined Sticky Header */}
            <div className="bg-[#0C0C0C]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30 shadow-2xl">
                {/* Top Bar */}
                <div className="px-5 pt-8 pb-2 flex items-center justify-between">
                    {isSearching ? (
                        <div className="flex-1 flex items-center bg-white/5 border border-cyan-500/50 rounded-full px-4 py-1.5 animate-in fade-in slide-in-from-right-2 duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                             <Search className="w-4 h-4 text-cyan-400 mr-2" />
                             <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="搜索模版..."
                                autoFocus
                                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 flex-1 min-w-0"
                             />
                             <button onClick={() => { setSearchQuery(''); setIsSearching(false); }} className="p-1 -mr-2 text-slate-500 hover:text-white transition-colors">
                                 <X className="w-4 h-4" />
                             </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-black shadow-lg shadow-orange-900/20">
                                    <Sparkles className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <h1 className="text-xl font-black tracking-tighter uppercase italic">
                                  INSPIRATION<span className="text-orange-500">.</span>
                                </h1>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => setShowPublishSelect(true)} className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black active:scale-95 transition-all shadow-lg shadow-cyan-900/20">
                                    <Plus className="w-5 h-5" strokeWidth={3} />
                                </button>
                                <div className="w-px h-4 bg-white/10"></div>
                                <button onClick={() => setIsSearching(true)} className="p-2 text-slate-400 hover:text-white transition-all active:scale-90">
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Tag Tabs with transparent background */}
                <div className="px-5 pb-3 pt-2 overflow-x-auto no-scrollbar bg-transparent">
                    <div className="flex space-x-2">
                        {tags.map(tag => (
                            <button 
                              key={tag}
                              onClick={() => setActiveTag(tag)}
                              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeTag === tag ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-transparent hover:bg-white/10 hover:text-slate-300'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 pb-32 no-scrollbar">
                
                {/* --- MY SOCIAL ACTIVITY GRID --- */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <button 
                        onClick={() => onNavigate && onNavigate('works-published')}
                        className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 active:scale-[0.97] transition-all hover:bg-white/10 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-cyan-900/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                            <LayoutGrid className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white">已发布</span>
                    </button>

                    <button 
                        onClick={() => onNavigate && onNavigate('collections')}
                        className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 active:scale-[0.97] transition-all hover:bg-white/10 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                            <Star className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white">收藏夹</span>
                    </button>

                    <button 
                        onClick={() => onNavigate && onNavigate('comments')}
                        className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center space-y-2 active:scale-[0.97] transition-all hover:bg-white/10 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform relative">
                            <MessageCircle className="w-5 h-5" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1A1A1A]"></div>
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white">消息</span>
                    </button>
                </div>

                {/* --- FEED GRID --- */}
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-2 duration-300">
                    {displayFeed.length > 0 ? displayFeed.map((item, idx) => {
                        const isCollected = collectedIds.includes(item.id);
                        return (
                        <button 
                            key={item.id}
                            onClick={() => openFeed(item.id)}
                            className="relative aspect-[4/5] bg-white/5 backdrop-blur-xl rounded-[2.25rem] overflow-hidden group active:scale-95 transition-all border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-white/20"
                        >
                            <div className="absolute inset-0 bg-black/40 flex items-start pt-6 justify-center">
                                <div className="transform scale-[0.50] group-hover:scale-[0.53] transition-transform duration-[2s]">
                                    <VirtualRobot isDancing={false} playbackMode="loop" showStatus={false} />
                                </div>
                            </div>
                            
                            {/* Grid View Collect Button */}
                            <div 
                                onClick={(e) => { e.stopPropagation(); onToggleCollect(item.id); }}
                                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-75 transition-all"
                            >
                                <Star className={`w-4 h-4 ${isCollected ? 'fill-yellow-400 text-yellow-400' : 'text-white/70'}`} />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 p-5 flex flex-col justify-end text-left pointer-events-none">
                                <div className="flex items-center text-[9px] font-black text-white/50 mb-1.5 uppercase tracking-widest">
                                    <User className="w-2.5 h-2.5 mr-1.5" strokeWidth={3} /> {item.author}
                                </div>
                                <h3 className="font-black text-sm text-slate-200 line-clamp-2 leading-tight group-hover:text-white transition-colors">{item.title}</h3>
                                <div className="flex justify-between items-center mt-4 text-[9px] font-black text-slate-500">
                                    <span className={`flex items-center ${item.isLiked ? 'text-red-400' : ''}`}>
                                        <Heart className={`w-3 h-3 mr-1 ${item.isLiked ? 'fill-current' : ''}`} strokeWidth={3} /> 
                                        {item.likes > 1000 ? (item.likes/1000).toFixed(1) + 'k' : item.likes}
                                    </span>
                                    <span className="bg-white/5 px-1.5 py-0.5 rounded">{item.duration}</span>
                                </div>
                            </div>
                        </button>
                    )}) : (
                        <div className="col-span-2 py-20 flex flex-col items-center justify-center text-slate-600">
                            <Star className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-[10px] font-black uppercase tracking-widest">暂无{activeTag}相关作品</p>
                        </div>
                    )}
                </div>
            </div>
          </>
      ) : (
          /* FEED VIEW MODE (PREVIEW) */
          <div className="h-full bg-[#0C0C0C] flex flex-col relative animate-in fade-in duration-500 overflow-hidden">
              <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between absolute top-0 left-0 right-0 z-50">
                  <button onClick={handleBackToGrid} className="p-1 -ml-2 rounded-full hover:bg-white/10 active:scale-90 transition-all">
                      <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">模板预览</div>
                  <div className="w-8"></div>
              </div>

              <div 
                ref={feedContainerRef}
                className="flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar h-full"
              >
                  {displayFeed.map((item, idx) => (
                      <div key={item.id} className="h-full w-full snap-start relative flex items-center justify-center overflow-hidden">
                           <div className="absolute inset-0 bg-black">
                                <VirtualRobot isDancing={idx === activeIndex} playbackMode="loop" showStatus={false} />
                                <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C] via-transparent to-[#0C0C0C]/80"></div>
                           </div>

                           <div className="absolute right-4 bottom-32 z-30 flex flex-col items-center space-y-5 animate-in slide-in-from-right-4 duration-500 delay-200">
                                {/* Comment Button (Replaces Like) */}
                                <button onClick={() => setShowComments(true)} className="flex flex-col items-center space-y-1 group">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-2xl border border-white/10 transition-all active:scale-75 group-hover:bg-white/10">
                                        <MessageSquare className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-[9px] font-black text-white/40 tracking-widest">{item.comments}</span>
                                </button>

                                <button onClick={() => onToggleCollect(item.id)} className="flex flex-col items-center space-y-1 group">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-2xl border border-white/10 transition-all active:scale-75 group-hover:bg-yellow-500/10 ${collectedIds.includes(item.id) ? 'bg-yellow-500/10' : ''}`}>
                                        <Star className={`w-6 h-6 ${collectedIds.includes(item.id) ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`} />
                                    </div>
                                    <span className="text-[9px] font-black text-white/40 tracking-widest">收藏</span>
                                </button>

                                <button className="flex flex-col items-center space-y-1 group active:scale-75 transition-all">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-2xl border border-white/10">
                                        <Share2 className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-[9px] font-black text-white/40 tracking-widest">分享</span>
                                </button>
                           </div>

                           <div className="absolute bottom-0 left-0 right-0 p-8 pb-36 z-20 pointer-events-none">
                               <div className="animate-in slide-in-from-bottom-4 duration-500">
                                   <div className="flex items-center space-x-2 mb-3">
                                       <span className="bg-cyan-500 text-black px-2 py-0.5 rounded text-[9px] font-[1000] uppercase tracking-[0.1em]">官方模版</span>
                                       <h4 className="font-black text-slate-300 text-xs tracking-wider uppercase opacity-60">@{item.author}</h4>
                                   </div>
                                   <h2 className="text-xl font-[1000] text-white mb-2 leading-tight pr-20 uppercase tracking-tight">{item.title}</h2>
                                   <p className="text-[10px] text-slate-500 line-clamp-2 pr-20 mb-3 font-bold leading-relaxed">{item.desc}</p>
                                   
                                   <div className="flex flex-wrap gap-2 mb-4">
                                       {item.tags?.map(tag => (
                                           <span key={tag} className="text-[9px] font-black text-cyan-400">#{tag}</span>
                                       ))}
                                   </div>
                               </div>
                           </div>
                      </div>
                  ))}
              </div>

              <div className="absolute bottom-24 left-6 right-6 z-50 pointer-events-auto">
                   <button 
                      onClick={(e) => handleUseTemplate(e, displayFeed[activeIndex].id)}
                      className="w-full bg-cyan-500 py-4 rounded-full font-[1000] uppercase tracking-[0.2em] text-black text-[11px] shadow-2xl shadow-cyan-900/40 active:scale-[0.98] transition-all flex items-center justify-center group"
                   >
                       <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" strokeWidth={3} />
                       立即使用此模版
                   </button>
              </div>

              {/* Comment Drawer */}
              {showComments && (
                  <div className="absolute inset-0 z-[60] flex flex-col justify-end">
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowComments(false)}></div>
                      <div className="bg-[#1A1A1A] rounded-t-[2.5rem] border-t border-white/10 h-[70%] relative flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                          {/* Drawer Header */}
                          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
                              <span className="text-sm font-black text-white uppercase tracking-widest">评论 ({comments.length})</span>
                              <button onClick={() => setShowComments(false)} className="p-1 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors active:scale-90">
                                  <X className="w-5 h-5"/>
                              </button>
                          </div>
                          
                          {/* Comment List */}
                          <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
                              {comments.map(c => (
                                  <div key={c.id} className="flex space-x-3">
                                      <img src={c.avatar} className="w-8 h-8 rounded-full bg-black border border-white/10 shrink-0" alt="avatar" />
                                      <div className="flex-1">
                                          <div className="flex justify-between items-start">
                                              <span className="text-[11px] font-bold text-slate-400">{c.user}</span>
                                              <span className="text-[9px] text-slate-600">{c.time}</span>
                                          </div>
                                          <p className="text-xs text-white mt-1 leading-relaxed">{c.content}</p>
                                          <div className="flex items-center space-x-4 mt-2">
                                              <button className="flex items-center space-x-1 text-slate-500 hover:text-slate-300 transition-colors">
                                                  <ThumbsUp className="w-3 h-3" />
                                                  <span className="text-[9px]">{c.likes}</span>
                                              </button>
                                              <button className="text-[9px] text-slate-500 font-bold hover:text-slate-300 transition-colors">回复</button>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>

                          {/* Input Area */}
                          <div className="p-4 border-t border-white/5 bg-[#1A1A1A] pb-safe">
                              <div className="flex items-center space-x-3 bg-white/5 rounded-full px-4 py-2 border border-white/5 focus-within:border-cyan-500/30 transition-colors">
                                  <input 
                                      type="text" 
                                      value={commentText}
                                      onChange={e => setCommentText(e.target.value)}
                                      placeholder="说点什么..." 
                                      className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none"
                                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                                  />
                                  <button 
                                      onClick={handleSendComment}
                                      className={`p-1.5 rounded-full transition-all active:scale-90 ${commentText.trim() ? 'bg-cyan-500 text-black' : 'bg-white/10 text-slate-500'}`}
                                  >
                                      <SendIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* Select Work Modal */}
      {showPublishSelect && (
          <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowPublishSelect(false)}>
              <div className="bg-[#1A1A1A] w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 p-6 shadow-2xl flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-black text-white uppercase tracking-tight">选择发布作品</h2>
                      <button onClick={() => setShowPublishSelect(false)} className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white transition-colors active:scale-90">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 mb-4">
                      {draftWorks.length > 0 ? draftWorks.map(work => (
                          <button 
                            key={work.id} 
                            onClick={() => handleSelectDraft(work.id)}
                            className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-white/10 hover:border-white/20"
                          >
                              <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                                      <FileText className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                  </div>
                                  <div className="text-left min-w-0">
                                      <h3 className="font-bold text-sm text-white truncate">{work.title}</h3>
                                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider mt-0.5">{work.lastModified}</p>
                                  </div>
                              </div>
                              <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-white" />
                          </button>
                      )) : (
                          <div className="py-12 text-center text-slate-500 flex flex-col items-center">
                              <Inbox className="w-12 h-12 mb-3 opacity-20" />
                              <p className="text-[10px] font-black uppercase tracking-widest">暂无草稿可发布</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CreativeSquare;
