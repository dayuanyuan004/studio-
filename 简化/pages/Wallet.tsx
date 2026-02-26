
import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, Zap, Gift } from 'lucide-react';

interface WalletProps {
  onBack: () => void;
}

const Wallet: React.FC<WalletProps> = ({ onBack }) => {
  const [balance, setBalance] = useState(1280);

  const transactions = [
    { id: 1, type: 'outcome', title: '购买动作: 机械舞步 A', date: '今天 10:23', amount: -50 },
    { id: 2, type: 'income', title: '账户充值', date: '昨天 18:45', amount: +500 },
    { id: 3, type: 'outcome', title: '解锁技能: 语音对话 Pro', date: '10月24日', amount: -200 },
    { id: 4, type: 'income', title: '新用户注册奖励', date: '10月20日', amount: +1000 },
  ];

  const rechargeOptions = [
    { id: 1, coins: 60, price: '¥6', bonus: '' },
    { id: 2, coins: 300, price: '¥30', bonus: '+15 币' },
    { id: 3, coins: 680, price: '¥68', bonus: '+40 币', recommend: true },
    { id: 4, coins: 1280, price: '¥128', bonus: '+100 币' },
    { id: 5, coins: 3280, price: '¥328', bonus: '+300 币' },
    { id: 6, coins: 6480, price: '¥648', bonus: '+800 币' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0C0C0C] text-white relative animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="px-5 pt-8 pb-3 bg-[#0C0C0C]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-20 shadow-lg">
        <div className="flex items-center">
            <button onClick={onBack} className="p-1 -ml-2 rounded-full hover:bg-white/5 active:scale-95 transition-all">
                <ChevronLeft className="w-6 h-6 text-slate-400" />
            </button>
            <h1 className="ml-2 font-black text-xl tracking-tight uppercase">我的钱包</h1>
        </div>
        <button className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors">账单明细</button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32 no-scrollbar">
          
          {/* Balance Card */}
          <div className="w-full bg-gradient-to-br from-cyan-900 to-blue-900 rounded-[2rem] p-6 mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                  <div className="flex items-center space-x-2 text-cyan-200/80 mb-2">
                      <WalletIcon className="w-4 h-4" />
                      <span className="text-xs font-bold tracking-widest uppercase">G-Coin 余额</span>
                  </div>
                  <div className="text-5xl font-[1000] text-white tracking-tighter tabular-nums mb-6">
                      {balance.toLocaleString()}
                  </div>
                  <div className="flex space-x-3">
                      <button className="flex-1 bg-white text-blue-900 py-3 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg flex items-center justify-center">
                          <ArrowDownLeft className="w-4 h-4 mr-1.5" /> 充值
                      </button>
                      <button className="flex-1 bg-black/20 text-white border border-white/10 py-3 rounded-xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all hover:bg-black/30 flex items-center justify-center">
                          <Gift className="w-4 h-4 mr-1.5" /> 兑换码
                      </button>
                  </div>
              </div>
          </div>

          {/* Recharge Grid */}
          <div className="mb-8">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <Zap className="w-3 h-3 mr-1.5" /> 快速充值
              </h2>
              <div className="grid grid-cols-3 gap-3">
                  {rechargeOptions.map(opt => (
                      <button key={opt.id} className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all active:scale-95 ${opt.recommend ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                          {opt.recommend && (
                              <div className="absolute -top-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                                  HOT
                              </div>
                          )}
                          <div className="text-lg font-black text-white mb-1">{opt.coins} <span className="text-[9px]">币</span></div>
                          <div className={`text-[10px] font-bold ${opt.recommend ? 'text-cyan-400' : 'text-slate-400'}`}>{opt.price}</div>
                          {opt.bonus && <div className="text-[8px] font-bold text-red-400 mt-1">{opt.bonus}</div>}
                      </button>
                  ))}
              </div>
          </div>

          {/* Transaction History */}
          <div>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <Clock className="w-3 h-3 mr-1.5" /> 最近交易
              </h2>
              <div className="space-y-3">
                  {transactions.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                  {t.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                              </div>
                              <div>
                                  <div className="text-xs font-bold text-slate-200">{t.title}</div>
                                  <div className="text-[9px] font-medium text-slate-500 mt-0.5">{t.date}</div>
                              </div>
                          </div>
                          <div className={`text-sm font-black font-mono ${t.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                              {t.amount > 0 ? '+' : ''}{t.amount}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

      </div>
    </div>
  );
};

export default Wallet;
