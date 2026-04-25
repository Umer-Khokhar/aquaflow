import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Target, 
  AlertCircle, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { formatCurrency, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const revenueData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 59000 },
  { name: 'Jun', revenue: 68000 },
];

const managerData = [
  { name: 'Alex Rivera', value: 35000 },
  { name: 'Sarah Chen', value: 42000 },
  { name: 'Marcus Bell', value: 28000 },
];

const pipelineData = [
  { name: 'Lead', value: 12 },
  { name: 'Qualified', value: 8 },
  { name: 'Proposal', value: 5 },
  { name: 'Won', value: 18 },
];

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

export default function DashboardPage() {
  const { clients, tasks, activities } = useStore();

  const mrr = clients
    .filter(c => c.status === 'Active')
    .reduce((sum, c) => sum + c.retainer, 0);
  
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const leadsInPipeline = clients.filter(c => c.status === 'Lead' || c.status === 'Proposal').length;
  const overdueInvoices = clients.filter(c => c.paymentStatus === 'Overdue').length;
  const tasksDue = tasks.filter(t => t.status !== 'Completed').length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agency Overview</h1>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-600">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-600">
            All Managers
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Monthly Revenue', value: formatCurrency(mrr), icon: TrendingUp, trend: '+12.5%', trendUp: true, color: 'indigo' },
          { label: 'Active Clients', value: activeClients, icon: Users, trend: '+2', trendUp: true, color: 'blue' },
          { label: 'Pipeline Leads', value: leadsInPipeline, icon: Target, trend: '+5', trendUp: true, color: 'purple' },
          { label: 'Overdue Invoices', value: overdueInvoices, icon: AlertCircle, trend: '-1', trendUp: true, color: 'red' },
          { label: 'Tasks Due', value: tasksDue, icon: Calendar, trend: '8 today', trendUp: false, color: 'orange' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-2 rounded-xl", {
                    'bg-indigo-50 text-indigo-600': kpi.color === 'indigo',
                    'bg-blue-50 text-blue-600': kpi.color === 'blue',
                    'bg-purple-50 text-purple-600': kpi.color === 'purple',
                    'bg-red-50 text-red-600': kpi.color === 'red',
                    'bg-orange-50 text-orange-600': kpi.color === 'orange',
                  })}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className={cn("rounded-lg font-medium", kpi.trendUp ? "text-emerald-600 bg-emerald-50" : "text-slate-500 bg-slate-50")}>
                    {kpi.trendUp && <ArrowUpRight className="w-3 h-3 mr-1" />}
                    {kpi.trend}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-500 mb-1">{kpi.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Revenue Trend</CardTitle>
            <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(v) => formatCurrency(v as number)}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue by Manager</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={managerData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} width={100} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(v) => formatCurrency(v as number)}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {managerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4 w-full">
              {pipelineData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-slate-500">{item.name}: <span className="font-bold text-slate-900">{item.value}</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
            <Button variant="link" className="text-indigo-600 font-semibold">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10 border border-slate-100">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${activity.user}`} />
                      <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">
                      <span className="font-bold">{activity.user}</span> {activity.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2",
                    activity.type === 'client' ? "bg-indigo-500" : 
                    activity.type === 'payment' ? "bg-emerald-500" : "bg-blue-500"
                  )} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
