import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar,
  ExternalLink,
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useStore, Client, ClientStatus, PipelineStage, PaymentStatus } from '@/lib/store';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency, cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { toast } from "sonner";

export default function CRMPage() {
  const { clients, addClient, updateClient, deleteClient, team } = useStore();
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Client>>({});

  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    manager: team[0]?.name || '',
    retainer: 2000,
    status: 'Lead' as ClientStatus,
    stage: 'Lead' as PipelineStage,
    startDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'Paid' as PaymentStatus,
    email: '',
    phone: '',
    notes: ''
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Lead': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Proposal': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'On Hold': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Closed': return 'bg-slate-50 text-slate-600 border-slate-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const openDetails = (client: Client) => {
    setSelectedClient(client);
    setEditForm(client);
    setIsEditing(false);
    setIsDetailOpen(true);
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.company) {
      toast.error("Please fill in the required fields");
      return;
    }
    addClient(newClient);
    setIsAddDialogOpen(false);
    setNewClient({
      name: '',
      company: '',
      manager: team[0]?.name || '',
      retainer: 2000,
      status: 'Lead',
      stage: 'Lead',
      startDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Paid',
      email: '',
      phone: '',
      notes: ''
    });
    toast.success("Client added successfully");
  };

  const handleUpdateClient = () => {
    if (selectedClient) {
      updateClient(selectedClient.id, editForm);
      setSelectedClient({ ...selectedClient, ...editForm } as Client);
      setIsEditing(false);
      toast.success("Client updated successfully");
    }
  };

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
    setIsDetailOpen(false);
    toast.success("Client deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients & CRM</h1>
          <p className="text-slate-500">Manage your agency relationships and pipeline.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2 shadow-lg shadow-indigo-100">
              <Plus className="w-4 h-4" /> Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" value={newClient.company} onChange={(e) => setNewClient({...newClient, company: e.target.value})} placeholder="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Contact Name</Label>
                  <Input id="name" value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})} placeholder="John Doe" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={newClient.phone} onChange={(e) => setNewClient({...newClient, phone: e.target.value})} placeholder="555-0100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Manager</Label>
                  <Select value={newClient.manager} onValueChange={(v) => setNewClient({...newClient, manager: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {team.map(m => (
                        <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retainer">Monthly Retainer ($)</Label>
                  <Input id="retainer" type="number" value={newClient.retainer} onChange={(e) => setNewClient({...newClient, retainer: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddClient} className="bg-indigo-600">Create Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by name or company..." 
            className="pl-10 border-none bg-slate-50 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl gap-2 border-slate-200">
          <Filter className="w-4 h-4" /> Filters
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold">Client / Company</TableHead>
              <TableHead className="font-bold">Manager</TableHead>
              <TableHead className="font-bold">Retainer</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Start Date</TableHead>
              <TableHead className="font-bold">Payment</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id} className="hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => openDetails(client)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-slate-100">
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">{client.company.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-slate-900">{client.company}</p>
                      <p className="text-xs text-slate-500">{client.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${client.manager}`} />
                    </Avatar>
                    <span className="text-sm text-slate-600">{client.manager}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-slate-900">{formatCurrency(client.retainer)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("rounded-lg font-medium", getStatusColor(client.status))}>
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-500">{client.startDate}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn(
                    "rounded-lg font-medium",
                    client.paymentStatus === 'Paid' ? "text-emerald-600 bg-emerald-50" : 
                    client.paymentStatus === 'Overdue' ? "text-red-600 bg-red-50" : "text-orange-600 bg-orange-50"
                  )}>
                    {client.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => openDetails(client)}><Edit className="w-4 h-4 mr-2" /> Edit Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); handleDeleteClient(client.id); }}><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Client Detail Drawer */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-xl rounded-l-[32px] border-none shadow-2xl p-0">
          {selectedClient && (
            <div className="h-full flex flex-col">
              <div className="p-8 bg-slate-50 border-b border-slate-200">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-indigo-600 text-white text-2xl font-bold">{selectedClient.company.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      {isEditing ? (
                        <Input 
                          value={editForm.company} 
                          onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                          className="text-2xl font-bold h-auto py-1 px-2 border-indigo-200"
                        />
                      ) : (
                        <h2 className="text-2xl font-bold text-slate-900">{selectedClient.company}</h2>
                      )}
                      <p className="text-slate-500">{selectedClient.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isEditing ? (
                      <Select value={editForm.status} onValueChange={(v: ClientStatus) => setEditForm({...editForm, status: v})}>
                        <SelectTrigger className="w-32 h-8 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Lead', 'Proposal', 'Active', 'On Hold', 'Closed'].map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={cn("rounded-lg px-3 py-1", getStatusColor(selectedClient.status))}>
                        {selectedClient.status}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button onClick={handleUpdateClient} className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700">
                        <Save className="w-4 h-4" /> Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl gap-2">
                        <X className="w-4 h-4" /> Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="rounded-xl gap-2 bg-white"><Mail className="w-4 h-4" /> Email</Button>
                      <Button variant="outline" className="rounded-xl gap-2 bg-white"><Phone className="w-4 h-4" /> Call</Button>
                      <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-xl gap-2 bg-white ml-auto">
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                <div className="px-8 border-b border-slate-200">
                  <TabsList className="bg-transparent h-12 gap-8">
                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent shadow-none px-0">Overview</TabsTrigger>
                    <TabsTrigger value="tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent shadow-none px-0">Tasks</TabsTrigger>
                    <TabsTrigger value="payments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent shadow-none px-0">Payments</TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                  <TabsContent value="overview" className="mt-0 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-xs text-slate-500 mb-1">Monthly Retainer</p>
                        {isEditing ? (
                          <Input 
                            type="number" 
                            value={editForm.retainer} 
                            onChange={(e) => setEditForm({...editForm, retainer: parseInt(e.target.value)})}
                            className="h-8 border-indigo-200"
                          />
                        ) : (
                          <p className="text-xl font-bold text-slate-900">{formatCurrency(selectedClient.retainer)}</p>
                        )}
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-xs text-slate-500 mb-1">Account Manager</p>
                        {isEditing ? (
                          <Select value={editForm.manager} onValueChange={(v) => setEditForm({...editForm, manager: v})}>
                            <SelectTrigger className="h-8 border-indigo-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {team.map(m => (
                                <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-xl font-bold text-slate-900">{selectedClient.manager}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-slate-900">Contact Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {isEditing ? (
                            <Input value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="h-8 flex-1" />
                          ) : (
                            <span className="text-slate-600">{selectedClient.email}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {isEditing ? (
                            <Input value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="h-8 flex-1" />
                          ) : (
                            <span className="text-slate-600">{selectedClient.phone}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Started on {selectedClient.startDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-slate-900">Internal Notes</h3>
                      {isEditing ? (
                        <textarea 
                          value={editForm.notes} 
                          onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                          className="w-full p-4 bg-white border border-indigo-200 rounded-2xl text-sm min-h-[100px]"
                        />
                      ) : (
                        <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-sm text-slate-700 leading-relaxed">
                          {selectedClient.notes}
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="pt-6 border-t border-slate-100">
                        <Button 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl w-full justify-start gap-2"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this client?")) {
                              handleDeleteClient(selectedClient.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" /> Delete Client
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="tasks" className="mt-0">
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500">Active tasks for this client.</p>
                      <div className="p-12 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Plus className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm">No active tasks found.</p>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
