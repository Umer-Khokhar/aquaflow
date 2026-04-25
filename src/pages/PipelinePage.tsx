import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreHorizontal, 
  Plus, 
  DollarSign, 
  User, 
  ArrowRight,
  GripVertical,
  Pencil,
  Trash2
} from 'lucide-react';
import { useStore, Client, PipelineStage } from '@/lib/store';
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
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
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

const STAGES: PipelineStage[] = ['Lead', 'Qualified', 'Proposal', 'Won', 'Lost'];

export default function PipelinePage() {
  const { clients, updateClient, addClient, deleteClient } = useStore();
  const [selectedDeal, setSelectedDeal] = useState<Client | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    company: '',
    name: '',
    retainer: '',
    stage: 'Lead' as PipelineStage,
  });

  const getStageClients = (stage: PipelineStage) => {
    return clients.filter(c => c.stage === stage);
  };

  const getStageValue = (stage: PipelineStage) => {
    return getStageClients(stage).reduce((sum, c) => sum + c.retainer, 0);
  };

  const handleAddDeal = () => {
    if (!formData.company || !formData.retainer) {
      toast.error("Please fill in all required fields");
      return;
    }

    addClient({
      company: formData.company,
      name: formData.name || 'Contact Person',
      retainer: Number(formData.retainer),
      stage: formData.stage,
      status: formData.stage === 'Won' ? 'Active' : 'Lead',
      manager: 'Alex Rivera',
      startDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Paid',
      email: '',
      phone: '',
      notes: 'New deal created from Pipeline page'
    });

    setIsAddDialogOpen(false);
    setFormData({ company: '', name: '', retainer: '', stage: 'Lead' });
    toast.success("Deal added to pipeline");
  };

  const handleEditDeal = () => {
    if (!editingDeal || !formData.company || !formData.retainer) return;

    updateClient(editingDeal.id, {
      company: formData.company,
      name: formData.name,
      retainer: Number(formData.retainer),
      stage: formData.stage,
      status: formData.stage === 'Won' ? 'Active' : 'Lead',
    });

    setIsEditDialogOpen(false);
    setEditingDeal(null);
    setFormData({ company: '', name: '', retainer: '', stage: 'Lead' });
    toast.success("Deal updated successfully");
  };

  const openEditDialog = (deal: Client) => {
    setEditingDeal(deal);
    setFormData({
      company: deal.company,
      name: deal.name,
      retainer: deal.retainer.toString(),
      stage: deal.stage,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteDeal = (id: string) => {
    deleteClient(id);
    toast.success("Deal removed from pipeline");
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sales Pipeline</h1>
          <p className="text-slate-500">Track and manage your active deals across stages.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Total Value:</span>
              <span className="text-slate-900 font-bold">{formatCurrency(clients.reduce((sum, c) => sum + c.retainer, 0))}</span>
            </div>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2 shadow-lg shadow-indigo-100"
          >
            <Plus className="w-4 h-4" /> New Deal
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 h-full min-w-[1200px]">
          {STAGES.map((stage) => (
            <div key={stage} className="flex-1 flex flex-col min-w-[250px]">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{stage}</h3>
                  <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-600 px-2 py-0">
                    {getStageClients(stage).length}
                  </Badge>
                </div>
                <span className="text-xs font-bold text-indigo-600">{formatCurrency(getStageValue(stage))}</span>
              </div>

              <div className="flex-1 bg-slate-50/50 rounded-2xl p-3 space-y-3 border border-slate-100 border-dashed">
                {getStageClients(stage).map((client) => (
                  <motion.div
                    key={client.id}
                    layoutId={client.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -2 }}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer group hover:border-indigo-300 transition-all"
                    onClick={() => setSelectedDeal(client)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-slate-100">
                        {client.company.split(' ')[0]}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button 
                            className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-200">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(client);
                            }}
                            className="gap-2 text-slate-600 cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" /> Edit Deal
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDeal(client.id);
                            }}
                            className="gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Deal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 mb-1 leading-tight">{client.company}</h4>
                    <p className="text-xs text-slate-500 mb-4">{client.name}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm">
                        <DollarSign className="w-3 h-3" />
                        {client.retainer.toLocaleString()}
                      </div>
                      <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${client.manager}`} />
                        </Avatar>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full rounded-xl border border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 hover:border-indigo-200 h-10"
                  onClick={() => {
                    setFormData({ ...formData, stage });
                    setIsAddDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deal Detail Modal */}
      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="sm:max-w-lg rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
          {selectedDeal && (
            <div className="flex flex-col">
              <div className="p-8 bg-slate-50 border-b border-slate-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge className="mb-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-100 border-none rounded-lg">
                      {selectedDeal.stage} Stage
                    </Badge>
                    <DialogTitle className="text-2xl font-bold text-slate-900">{selectedDeal.company}</DialogTitle>
                    <DialogDescription className="text-slate-500">Deal managed by {selectedDeal.manager}</DialogDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Value</p>
                    <p className="text-2xl font-bold text-indigo-600">{formatCurrency(selectedDeal.retainer)}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">Contact</p>
                    <p className="text-sm font-medium text-slate-900">{selectedDeal.name}</p>
                    <p className="text-xs text-slate-500">{selectedDeal.email || 'sarah@brightdental.com'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">Next Step</p>
                    <p className="text-sm font-medium text-slate-900">Send updated proposal</p>
                    <p className="text-xs text-slate-500">Due in 2 days</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase">Move to Stage</p>
                  <div className="flex flex-wrap gap-2">
                    {STAGES.map(s => (
                      <Button 
                        key={s} 
                        variant={selectedDeal.stage === s ? 'default' : 'outline'}
                        size="sm"
                        className={cn("rounded-xl h-9", selectedDeal.stage === s && "bg-indigo-600")}
                        onClick={() => {
                          updateClient(selectedDeal.id, { stage: s });
                          setSelectedDeal({ ...selectedDeal, stage: s });
                        }}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setSelectedDeal(null)}>Close</Button>
                <Button className="flex-1 rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700">View Full Profile</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Deal Dialog */}
      <Dialog 
        open={isAddDialogOpen || isEditDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setEditingDeal(null);
            setFormData({ company: '', name: '', retainer: '', stage: 'Lead' });
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
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
              <Label htmlFor="amount">Deal Value ($)</Label>
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
              <Label htmlFor="stage">Pipeline Stage</Label>
              <Select 
                value={formData.stage} 
                onValueChange={(value: PipelineStage) => setFormData({ ...formData, stage: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {STAGES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
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
              onClick={isEditDialogOpen ? handleEditDeal : handleAddDeal}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              {isEditDialogOpen ? 'Save Changes' : 'Add Deal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
