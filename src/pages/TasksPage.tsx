import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  Calendar,
  User,
  TrendingUp,
  Trash2,
  Edit
} from 'lucide-react';
import { useStore, Task, TaskStatus, TaskType } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const STATUS_CONFIG: Record<TaskStatus, { color: string, icon: any }> = {
  'To Do': { color: 'bg-slate-100 text-slate-600', icon: Clock },
  'In Progress': { color: 'bg-blue-50 text-blue-600', icon: TrendingUp },
  'Waiting': { color: 'bg-orange-50 text-orange-600', icon: AlertCircle },
  'Completed': { color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
};

export default function TasksPage() {
  const { tasks, clients, team, addTask, updateTask, deleteTask } = useStore();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [filter, setFilter] = useState<TaskStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // New Task Form State
  const [newTask, setNewTask] = useState({
    clientId: clients[0]?.id || '',
    title: '',
    type: 'Meta Ads' as TaskType,
    status: 'To Do' as TaskStatus,
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    dueDate: new Date().toISOString().split('T')[0],
    assignee: team[0]?.name || ''
  });

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'All' || t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.company || 'Unknown';

  const handleStatusChange = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
    toast.success(`Task marked as ${status}`);
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.clientId) {
      toast.error("Please fill in the required fields");
      return;
    }
    addTask(newTask);
    setIsAddDialogOpen(false);
    setNewTask({
      clientId: clients[0]?.id || '',
      title: '',
      type: 'Meta Ads',
      status: 'To Do',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      assignee: team[0]?.name || ''
    });
    toast.success("Task created successfully");
  };

  const handleUpdateTask = () => {
    if (editingTask) {
      updateTask(editingTask.id, editingTask);
      setEditingTask(null);
      toast.success("Task updated successfully");
    }
  };

  const handleDeleteTask = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(id);
      toast.success("Task deleted successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Operations</h1>
          <p className="text-slate-500">Manage tasks and project delivery across the team.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2 shadow-lg shadow-indigo-100">
              <Plus className="w-4 h-4" /> Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input id="task-title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Monthly SEO Audit" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Client</Label>
                  <Select value={newTask.clientId} onValueChange={(v) => setNewTask({...newTask, clientId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newTask.type} onValueChange={(v: TaskType) => setNewTask({...newTask, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Meta Ads', 'Google Ads', 'SEO', 'Content', 'Reporting', 'Follow-up'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Select value={newTask.assignee} onValueChange={(v) => setNewTask({...newTask, assignee: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {team.map(m => (
                        <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTask} className="bg-indigo-600">Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-title">Task Title</Label>
                <Input id="edit-task-title" value={editingTask.title} onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editingTask.status} onValueChange={(v: TaskStatus) => setEditingTask({...editingTask, status: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['To Do', 'In Progress', 'Waiting', 'Completed'].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={editingTask.priority} onValueChange={(v: any) => setEditingTask({...editingTask, priority: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Low', 'Medium', 'High'].map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
            <Button onClick={handleUpdateTask} className="bg-indigo-600">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-10 border-none bg-slate-50 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Tabs value={view} onValueChange={(v: any) => setView(v)}>
            <TabsList className="bg-slate-50 rounded-xl">
              <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">List</TabsTrigger>
              <TabsTrigger value="kanban" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Board</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
            {['All', 'To Do', 'In Progress', 'Waiting', 'Completed'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as any)}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                  filter === s ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group">
                <CardContent className="p-4 flex items-center gap-6">
                  <button 
                    onClick={() => handleStatusChange(task.id, task.status === 'Completed' ? 'To Do' : 'Completed')}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      task.status === 'Completed' 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-200 hover:border-indigo-500"
                    )}
                  >
                    {task.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className={cn("font-bold text-slate-900", task.status === 'Completed' && "line-through text-slate-400")}>
                        {task.title}
                      </h4>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase border-slate-100 text-slate-400">
                        {task.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {getClientName(task.clientId)}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.dueDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 border border-slate-100">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${task.assignee}`} />
                        <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-slate-600">{task.assignee}</span>
                    </div>

                    <Badge className={cn("rounded-lg font-bold text-[10px] px-2 py-0.5", STATUS_CONFIG[task.status].color)}>
                      {task.status}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => setEditingTask(task)}><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTask(task.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {(['To Do', 'In Progress', 'Waiting', 'Completed'] as TaskStatus[]).map((status) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-slate-900 text-sm">{status}</h3>
                <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-500">{tasks.filter(t => t.status === status).length}</Badge>
              </div>
              <div className="bg-slate-50/50 rounded-2xl p-3 space-y-3 min-h-[500px] border border-slate-100 border-dashed">
                {tasks.filter(t => t.status === status).map((task) => (
                  <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-all rounded-xl cursor-pointer" onClick={() => setEditingTask(task)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="text-[9px] font-bold uppercase border-slate-100 text-slate-400">
                          {task.type}
                        </Badge>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          task.priority === 'High' ? "bg-red-500" : task.priority === 'Medium' ? "bg-orange-500" : "bg-blue-500"
                        )} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-4">{task.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Calendar className="w-3 h-3" /> {task.dueDate}
                        </div>
                        <Avatar className="h-6 w-6 border border-white">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${task.assignee}`} />
                        </Avatar>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
