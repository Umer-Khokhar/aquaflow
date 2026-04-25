import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MoreVertical, 
  Plus, 
  Shield, 
  Briefcase, 
  CheckSquare, 
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency, cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function TeamPage() {
  const { team, addTeamMember } = useStore();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Account Manager',
    avatar: 'https://i.pravatar.cc/150?u=' + Math.random(),
    assignedClients: 0,
    activeTasks: 0,
    revenueManaged: 0
  });

  const handleInvite = () => {
    if (!newMember.name) {
      toast.error("Please enter a name");
      return;
    }
    addTeamMember(newMember);
    setIsInviteOpen(false);
    setNewMember({
      name: '',
      role: 'Account Manager',
      avatar: 'https://i.pravatar.cc/150?u=' + Math.random(),
      assignedClients: 0,
      activeTasks: 0,
      revenueManaged: 0
    });
    toast.success("Team member invited successfully");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agency Team</h1>
          <p className="text-slate-500">Manage roles, permissions, and workload distribution.</p>
        </div>
        
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2 shadow-lg shadow-indigo-100">
              <Plus className="w-4 h-4" /> Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Full Name</Label>
                <Input id="member-name" value={newMember.name} onChange={(e) => setNewMember({...newMember, name: e.target.value})} placeholder="e.g. Jane Cooper" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newMember.role} onValueChange={(v) => setNewMember({...newMember, role: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Account Manager', 'Operations Lead', 'Finance', 'Creative Director', 'Media Buyer'].map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-blue-900">Invitation Email</p>
                  <p className="text-[10px] text-blue-700">An invitation will be sent to their email to join the Solvorr OS.</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
              <Button onClick={handleInvite} className="bg-indigo-600">Send Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden group">
              <CardContent className="p-0">
                <div className="h-24 bg-slate-50 relative">
                  <div className="absolute -bottom-10 left-6">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full bg-white/50 hover:bg-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="pt-12 p-6 pb-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                    <p className="text-sm text-slate-500">{member.role}</p>
                    <Badge variant="secondary" className="mt-2 rounded-lg bg-indigo-50 text-indigo-600 border-none font-bold text-[10px]">
                      {member.role === 'Admin' ? <Shield className="w-3 h-3 mr-1" /> : <Briefcase className="w-3 h-3 mr-1" />}
                      {member.role}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-6">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Clients</p>
                      <p className="text-sm font-bold text-slate-900">{member.assignedClients}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tasks</p>
                      <p className="text-sm font-bold text-slate-900">{member.activeTasks}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Revenue</p>
                      <p className="text-sm font-bold text-slate-900">{member.revenueManaged > 0 ? `$${member.revenueManaged / 1000}k` : '-'}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-xl h-10 border-slate-200"><Mail className="w-4 h-4" /></Button>
                    <Button variant="outline" className="flex-1 rounded-xl h-10 border-slate-200"><Phone className="w-4 h-4" /></Button>
                    <Button className="flex-[2] rounded-xl h-10 bg-slate-900 hover:bg-slate-800">View Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Workload Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {team.filter(m => m.assignedClients > 0 || m.activeTasks > 0).map((member) => (
              <div key={member.id} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} />
                    </Avatar>
                    <span className="font-bold text-slate-700">{member.name}</span>
                  </div>
                  <span className="text-slate-500">{member.activeTasks} active tasks</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((member.activeTasks / 20) * 100, 100)}%` }}
                    className={cn(
                      "h-full rounded-full",
                      member.activeTasks > 15 ? "bg-red-500" : member.activeTasks > 10 ? "bg-orange-500" : "bg-indigo-500"
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl bg-slate-50/50 border border-slate-100 border-dashed flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
            <Plus className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Grow your team</h3>
          <p className="text-slate-500 max-w-xs mb-8">Add more account managers or operations specialists to scale your agency.</p>
          <Button onClick={() => setIsInviteOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 h-11 shadow-lg shadow-indigo-100">
            Invite New Member
          </Button>
        </Card>
      </div>
    </div>
  );
}
