import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Download,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import { useStore, Client, PaymentStatus } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { formatCurrency, cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

const serviceData = [
  { name: 'Meta Ads', value: 18500 },
  { name: 'Google Ads', value: 14200 },
  { name: 'SEO', value: 9800 },
  { name: 'Content', value: 5400 },
  { name: 'Reporting', value: 2100 },
];

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export default function RevenuePage() {
  const { clients, updateClient, addClient, deleteClient } = useStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    retainer: '',
    paymentStatus: 'Due Soon' as PaymentStatus,
  });

  const totalRevenue = clients.reduce((sum, c) => sum + c.retainer, 0);
  const overdueRevenue = clients
    .filter(c => c.paymentStatus === 'Overdue')
    .reduce((sum, c) => sum + c.retainer, 0);
  const dueSoonRevenue = clients
    .filter(c => c.paymentStatus === 'Due Soon')
    .reduce((sum, c) => sum + c.retainer, 0);

  const handleMarkAsPaid = (id: string) => {
    updateClient(id, { paymentStatus: 'Paid' });
    toast.success("Invoice marked as paid");
  };

  const handleAddInvoice = () => {
    if (!formData.company || !formData.retainer) {
      toast.error("Please fill in all required fields");
      return;
    }

    addClient({
      company: formData.company,
      name: formData.name || 'Contact Person',
      retainer: Number(formData.retainer),
      paymentStatus: formData.paymentStatus,
      status: 'Active',
      stage: 'Won',
      manager: 'Alex Rivera',
      startDate: new Date().toISOString().split('T')[0],
      email: '',
      phone: '',
      notes: 'New invoice created from Revenue page'
    });

    setIsAddDialogOpen(false);
    setFormData({ company: '', name: '', retainer: '', paymentStatus: 'Due Soon' });
    toast.success("Invoice created successfully");
  };

  const handleEditInvoice = () => {
    if (!editingInvoice || !formData.company || !formData.retainer) return;

    updateClient(editingInvoice.id, {
      company: formData.company,
      name: formData.name,
      retainer: Number(formData.retainer),
      paymentStatus: formData.paymentStatus,
    });

    setIsEditDialogOpen(false);
    setEditingInvoice(null);
    setFormData({ company: '', name: '', retainer: '', paymentStatus: 'Due Soon' });
    toast.success("Invoice updated successfully");
  };

  const openEditDialog = (invoice: Client) => {
    setEditingInvoice(invoice);
    setFormData({
      company: invoice.company,
      name: invoice.name,
      retainer: invoice.retainer.toString(),
      paymentStatus: invoice.paymentStatus,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteInvoice = (id: string) => {
    deleteClient(id);
    toast.success("Invoice deleted successfully");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revenue & Payments</h1>
          <p className="text-slate-500">Track your agency's financial health and invoice status.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 border-slate-200">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2 shadow-lg shadow-indigo-100"
          >
            <Plus className="w-4 h-4" /> New Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total MRR', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'indigo', trend: '+8.2%' },
          { label: 'Overdue Payments', value: formatCurrency(overdueRevenue), icon: AlertCircle, color: 'red', trend: '-12%' },
          { label: 'Due Soon', value: formatCurrency(dueSoonRevenue), icon: CheckCircle2, color: 'orange', trend: '4 invoices' },
        ].map((stat, i) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2 rounded-xl", {
                  'bg-indigo-50 text-indigo-600': stat.color === 'indigo',
                  'bg-red-50 text-red-600': stat.color === 'red',
                  'bg-orange-50 text-orange-600': stat.color === 'orange',
                })}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="rounded-lg bg-slate-50 text-slate-500">
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-white">
            <CardTitle className="text-lg font-bold">Recent Invoices</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="rounded-lg h-8"><Filter className="w-3 h-3 mr-2" /> Filter</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold pl-6">Client</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Due Date</TableHead>
                  <TableHead className="text-right pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-slate-100 text-[10px] font-bold">{client.company.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-slate-900">{client.company}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{formatCurrency(client.retainer)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn(
                        "rounded-lg font-medium",
                        client.paymentStatus === 'Paid' ? "text-emerald-600 bg-emerald-50" : 
                        client.paymentStatus === 'Overdue' ? "text-red-600 bg-red-50" : "text-orange-600 bg-orange-50"
                      )}>
                        {client.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">Apr 15, 2024</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {client.paymentStatus !== 'Paid' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg h-8 font-bold"
                            onClick={() => handleMarkAsPaid(client.id)}
                          >
                            Mark as Paid
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-slate-200">
                            <DropdownMenuItem 
                              onClick={() => openEditDialog(client)}
                              className="gap-2 text-slate-600 cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" /> Edit Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteInvoice(client.id)}
                              className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" /> Delete Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue by Service</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} width={80} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(v) => formatCurrency(v as number)}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-indigo-600 rounded-2xl text-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium opacity-80">Projected Next Month</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue * 1.15)}</p>
                <p className="text-[10px] opacity-60 mt-1">Based on current pipeline conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Invoice Dialog */}
      <Dialog 
        open={isAddDialogOpen || isEditDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setEditingInvoice(null);
            setFormData({ company: '', name: '', retainer: '', paymentStatus: 'Due Soon' });
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="e.g. Acme Corp"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Contact Name</Label>
              <Input
                id="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.retainer}
                onChange={(e) => setFormData({ ...formData, retainer: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.paymentStatus} 
                onValueChange={(value: PaymentStatus) => setFormData({ ...formData, paymentStatus: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Due Soon">Due Soon</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={isEditDialogOpen ? handleEditInvoice : handleAddInvoice}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              {isEditDialogOpen ? 'Save Changes' : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
