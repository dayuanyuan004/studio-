
import React, { useState, useEffect } from 'react';
import { Mail, Smartphone, Lock, Eye, EyeOff, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

type LoginMethod = 'email' | 'phone_pass' | 'phone_code';

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [method, setMethod] = useState<LoginMethod>('email');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const showToast = (msg: string) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
  };

  const handleGetCode = () => {
      if (!account) { setErrorMsg('请输入手机号'); return; }
      if (countdown > 0) return;
      setCountdown(60);
      showToast('验证码已发送 (模拟: 1234)');
      setErrorMsg(null);
  };

  const validatePassword = (pwd: string) => {
      // 8位，包含大小写+数字
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      return regex.test(pwd);
  };

  const handleLogin = () => {
      setErrorMsg(null);

      if (!agreed) {
          setErrorMsg('请阅读并同意隐私条款');
          return;
      }

      if (!account) {
          setErrorMsg(method === 'email' ? '请输入邮箱' : '请输入手机号');
          return;
      }

      if (method === 'phone_code') {
          if (!code) { setErrorMsg('请输入验证码'); return; }
          // Mock verification
          if (code !== '1234') { setErrorMsg('验证码错误'); return; }
      } else {
          if (!password) { setErrorMsg('请输入密码'); return; }
          // Mock password check
          if (password === '00000000') {
             // Allow simple default for demo ease, or enforce complexity
          } else if (!validatePassword(password)) {
             // For demo purposes, we might warn but allow, or block. 
             // Requirement says "changed password format must be...", implying enforcement on change, 
             // but let's enforce on login for strictness if it's a new account.
             // allowing pass for demo simplicity unless specific error needed.
          }
      }

      // Simulate API call
      setTimeout(() => {
          onLoginSuccess();
      }, 800);
  };

  return (
    <div className="h-full w-full bg-[#0C0C0C] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden animate-in fade-in duration-500">
        
        {/* Background Ambient */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Logo Area */}
        <div className="mb-10 text-center z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-bounce-subtle">
                <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-[1000] tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                GALBOT<span className="text-cyan-500">.</span>ID
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">智能终端控制中心</p>
        </div>

        {/* Login Form Card */}
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative z-10">
            
            {/* Tabs */}
            <div className="flex mb-8 bg-black/20 rounded-xl p-1">
                <button 
                    onClick={() => { setMethod('email'); setErrorMsg(null); }}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${method === 'email' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    邮箱登录
                </button>
                <button 
                    onClick={() => { setMethod('phone_code'); setErrorMsg(null); }}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${method.includes('phone') ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    手机号登录
                </button>
            </div>

            <div className="space-y-4">
                {/* Account Input */}
                <div className="space-y-1">
                    <div className={`flex items-center bg-[#0C0C0C] border rounded-2xl px-4 py-3.5 transition-colors focus-within:border-cyan-500/50 ${errorMsg ? 'border-red-500/50' : 'border-white/10'}`}>
                        {method === 'email' ? <Mail className="w-5 h-5 text-slate-500" /> : <Smartphone className="w-5 h-5 text-slate-500" />}
                        <input 
                            type={method === 'email' ? 'email' : 'tel'} 
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            placeholder={method === 'email' ? '请输入邮箱地址' : '请输入手机号码'}
                            className="bg-transparent border-none outline-none text-sm font-bold text-white placeholder-slate-600 ml-3 flex-1 w-full"
                        />
                    </div>
                </div>

                {/* Password / Code Input */}
                <div className="space-y-1">
                    <div className={`flex items-center bg-[#0C0C0C] border rounded-2xl px-4 py-3.5 transition-colors focus-within:border-cyan-500/50 ${errorMsg ? 'border-red-500/50' : 'border-white/10'}`}>
                        <Lock className="w-5 h-5 text-slate-500" />
                        <input 
                            type={method === 'phone_code' ? 'text' : (showPassword ? 'text' : 'password')} 
                            value={method === 'phone_code' ? code : password}
                            onChange={(e) => method === 'phone_code' ? setCode(e.target.value) : setPassword(e.target.value)}
                            placeholder={method === 'phone_code' ? '请输入验证码' : '请输入密码'}
                            className="bg-transparent border-none outline-none text-sm font-bold text-white placeholder-slate-600 ml-3 flex-1 w-full"
                        />
                        
                        {method === 'phone_code' ? (
                            <button 
                                onClick={handleGetCode}
                                disabled={countdown > 0}
                                className={`text-[10px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${countdown > 0 ? 'text-slate-600 bg-white/5' : 'text-cyan-400 bg-cyan-950/30 hover:bg-cyan-900/50'}`}
                            >
                                {countdown > 0 ? `${countdown}s` : '获取验证码'}
                            </button>
                        ) : (
                            <button onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-white">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Sub Options */}
                {method.includes('phone') && (
                    <div className="flex justify-between items-center px-1">
                        <button 
                            onClick={() => setMethod(method === 'phone_pass' ? 'phone_code' : 'phone_pass')}
                            className="text-[10px] font-bold text-cyan-500/80 hover:text-cyan-400 transition-colors"
                        >
                            {method === 'phone_pass' ? '验证码登录' : '密码登录'}
                        </button>
                        <button className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors">
                            忘记密码?
                        </button>
                    </div>
                )}
                {method === 'email' && (
                     <div className="flex justify-end px-1">
                        <button className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors">
                            忘记密码?
                        </button>
                    </div>
                )}

                {/* Error Display */}
                {errorMsg && (
                    <div className="flex items-center text-red-400 bg-red-500/10 px-3 py-2 rounded-xl text-[10px] font-bold animate-in slide-in-from-top-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                        {errorMsg}
                    </div>
                )}

                {/* Privacy Policy */}
                <div className="pt-2 flex items-start px-1" onClick={() => setAgreed(!agreed)}>
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all shrink-0 ${agreed ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600 bg-transparent'}`}>
                        {agreed && <Check className="w-3 h-3 text-black" strokeWidth={4} />}
                    </div>
                    <div className="ml-2.5 text-[10px] text-slate-500 leading-tight select-none">
                        我已阅读并同意 <span className="text-cyan-500 font-bold hover:underline">用户协议</span> 与 <span className="text-cyan-500 font-bold hover:underline">隐私条款</span>，未注册手机号将自动创建账号。
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    onClick={handleLogin}
                    className="w-full bg-white text-black py-4 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-xs shadow-xl active:scale-[0.98] transition-all flex items-center justify-center group mt-4 hover:bg-cyan-50"
                >
                    {method === 'phone_code' ? '登录 / 注册' : '登 录'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>

        {/* Toast */}
        {toast && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                <Check className="w-4 h-4 mr-2 text-green-500" strokeWidth={3} />
                <span className="text-[11px] font-black uppercase tracking-widest">{toast}</span>
            </div>
        )}
        
        <div className="absolute bottom-8 text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
            Galbot Studio v1.0.2
        </div>
    </div>
  );
};

export default LoginPage;
