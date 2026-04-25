import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useStore(state => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">S</div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">Solvorr Agency OS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500">Enter your credentials to access the demo dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <Input 
                type="email" 
                placeholder="admin@solvorr.tech" 
                defaultValue="admin@solvorr.tech"
                className="h-12 rounded-xl border-slate-200 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <button type="button" className="text-xs text-indigo-600 hover:underline">Forgot password?</button>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                defaultValue="password"
                className="h-12 rounded-xl border-slate-200 focus:ring-indigo-500"
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-base font-semibold shadow-lg shadow-indigo-200 transition-all">
              Enter Demo Dashboard
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <button className="text-indigo-600 font-semibold hover:underline">Contact Sales</button>
          </p>
        </div>
      </div>

      {/* Right Side - Marketing/Trust */}
      <div className="hidden lg:flex flex-1 bg-slate-50 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl -mr-48 -mt-48 opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl -ml-48 -mb-48 opacity-50" />

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">
              The operating system for <span className="text-indigo-600">modern agencies.</span>
            </h2>

            <div className="space-y-6">
              {[
                { icon: Zap, title: "Operational Clarity", desc: "Centralize your clients, tasks, and revenue in one unified view." },
                { icon: ShieldCheck, title: "Reduced Chaos", desc: "Replace scattered spreadsheets with automated workflows." },
                { icon: BarChart3, title: "Real-time Visibility", desc: "Track MRR, pipeline health, and team workload instantly." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Card className="mt-12 border-none shadow-2xl shadow-indigo-100 rounded-3xl overflow-hidden bg-indigo-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(s => <CheckCircle2 key={s} className="w-4 h-4 text-indigo-200" />)}
                </div>
                <p className="text-lg font-medium italic mb-6">
                  "Solvorr transformed how we manage our 40+ retainers. We've seen a 30% increase in team efficiency since switching."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-indigo-400">
                    <AvatarImage src="https://i.pravatar.cc/150?u=ceo" />
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm">Jonathan Wick</p>
                    <p className="text-indigo-200 text-xs">CEO, Apex Marketing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
