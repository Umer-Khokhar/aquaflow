import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Zap, 
  Globe, 
  CreditCard, 
  Mail,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your agency profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-1">
          {[
            { name: 'General', icon: User },
            { name: 'Notifications', icon: Bell },
            { name: 'Security', icon: Shield },
            { name: 'Integrations', icon: Zap },
            { name: 'Billing', icon: CreditCard },
          ].map((item, i) => (
            <button
              key={item.name}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                i === 0 ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-white hover:text-slate-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Profile Section */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-bold">Agency Profile</CardTitle>
              <CardDescription>Public information about your agency.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
                  <AvatarImage src="https://i.pravatar.cc/150?u=agency" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl h-9">Change Logo</Button>
                    <Button variant="ghost" className="rounded-xl h-9 text-red-500 hover:bg-red-50">Remove</Button>
                  </div>
                  <p className="text-xs text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Agency Name</Label>
                  <Input defaultValue="Solvorr Tech" className="h-11 rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input defaultValue="solvorr.tech" className="pl-10 h-11 rounded-xl border-slate-200" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-bold text-slate-700">Support Email</Label>
                  <Input defaultValue="support@solvorr.tech" className="h-11 rounded-xl border-slate-200" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 h-11">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-bold">Preferences</CardTitle>
              <CardDescription>Control how you receive updates and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                {[
                  { title: 'Email Notifications', desc: 'Receive daily summaries and critical alerts.', icon: Mail },
                  { title: 'Push Notifications', desc: 'Get instant browser alerts for task updates.', icon: Smartphone },
                  { title: 'Slack Integration', desc: 'Sync activity feed to your #agency-ops channel.', icon: Zap },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <item.icon className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={i === 0} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Integrations Preview */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-lg font-bold">Connected Apps</CardTitle>
              <CardDescription>Manage your external service connections.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Meta Ads', status: 'Connected', icon: 'M' },
                  { name: 'Google Ads', status: 'Connected', icon: 'G' },
                  { name: 'Slack', status: 'Disconnected', icon: 'S' },
                  { name: 'Stripe', status: 'Connected', icon: 'S' },
                ].map((app) => (
                  <div key={app.name} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">
                        {app.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{app.name}</p>
                        <div className="flex items-center gap-1">
                          <div className={cn("w-1.5 h-1.5 rounded-full", app.status === 'Connected' ? "bg-emerald-500" : "bg-slate-300")} />
                          <span className="text-[10px] text-slate-500">{app.status}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600">
                      {app.status === 'Connected' ? 'Configure' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
