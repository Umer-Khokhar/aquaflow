import { create } from 'zustand';
import { subDays, format } from 'date-fns';

export type ClientStatus = 'Lead' | 'Proposal' | 'Active' | 'On Hold' | 'Closed';
export type PaymentStatus = 'Paid' | 'Due Soon' | 'Overdue';
export type TaskStatus = 'To Do' | 'In Progress' | 'Waiting' | 'Completed';
export type TaskType = 'Meta Ads' | 'Google Ads' | 'SEO' | 'Content' | 'Reporting' | 'Follow-up';
export type PipelineStage = 'Lead' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface Client {
  id: string;
  name: string;
  company: string;
  manager: string;
  retainer: number;
  status: ClientStatus;
  stage: PipelineStage;
  startDate: string;
  paymentStatus: PaymentStatus;
  email: string;
  phone: string;
  notes: string;
}

export interface Task {
  id: string;
  clientId: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  assignee: string;
}

export interface Deal {
  id: string;
  clientId: string;
  amount: number;
  stage: PipelineStage;
  owner: string;
  nextStep: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  assignedClients: number;
  activeTasks: number;
  revenueManaged: number;
}

export interface Activity {
  id: string;
  type: 'client' | 'task' | 'payment' | 'automation';
  message: string;
  timestamp: string;
  user: string;
}

export interface AutomationLog {
  id: string;
  event: string;
  status: 'Success' | 'Processing' | 'Failed';
  timestamp: string;
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Sarah Johnson', company: 'Bright Dental', manager: 'Alex Rivera', retainer: 2500, status: 'Active', stage: 'Won', startDate: '2023-10-15', paymentStatus: 'Paid', email: 'sarah@brightdental.com', phone: '555-0101', notes: 'Focus on local SEO and Meta Ads.' },
  { id: '2', name: 'Mark Thompson', company: 'Elite Renovations', manager: 'Sarah Chen', retainer: 3500, status: 'Active', stage: 'Won', startDate: '2023-11-01', paymentStatus: 'Due Soon', email: 'mark@elitereno.com', phone: '555-0102', notes: 'High-end kitchen leads needed.' },
  { id: '3', name: 'Elena Rodriguez', company: 'Luna Skincare', manager: 'Alex Rivera', retainer: 1800, status: 'Active', stage: 'Won', startDate: '2024-01-10', paymentStatus: 'Paid', email: 'elena@lunaskin.co', phone: '555-0103', notes: 'E-commerce scaling project.' },
  { id: '4', name: 'David Chen', company: 'Chen & Associates Law', manager: 'Sarah Chen', retainer: 5000, status: 'Active', stage: 'Won', startDate: '2023-08-20', paymentStatus: 'Overdue', email: 'david@chenlaw.com', phone: '555-0104', notes: 'Personal injury lead gen.' },
  { id: '5', name: 'Jessica Miller', company: 'Urban Real Estate', manager: 'Marcus Bell', retainer: 3000, status: 'Proposal', stage: 'Proposal', startDate: '2024-03-01', paymentStatus: 'Paid', email: 'jess@urbanre.com', phone: '555-0105', notes: 'Waiting on contract signature.' },
  { id: '6', name: 'Robert Wilson', company: 'Wilson Plumbing', manager: 'Marcus Bell', retainer: 1500, status: 'Active', stage: 'Won', startDate: '2023-12-05', paymentStatus: 'Paid', email: 'rob@wilsonplumbing.com', phone: '555-0106', notes: 'Emergency service ads.' },
  { id: '7', name: 'Amy Zhang', company: 'Zen Yoga Studio', manager: 'Sarah Chen', retainer: 1200, status: 'On Hold', stage: 'Won', startDate: '2023-09-15', paymentStatus: 'Paid', email: 'amy@zenyoga.com', phone: '555-0107', notes: 'Paused for studio renovation.' },
  { id: '8', name: 'Tom Baker', company: 'Baker Financial', manager: 'Alex Rivera', retainer: 4000, status: 'Lead', stage: 'Qualified', startDate: '2024-03-15', paymentStatus: 'Paid', email: 'tom@bakerfin.com', phone: '555-0108', notes: 'Interested in LinkedIn outreach.' },
];

const MOCK_TASKS: Task[] = [
  { id: '1', clientId: '1', title: 'Monthly SEO Audit', type: 'SEO', status: 'Completed', priority: 'Medium', dueDate: '2024-03-20', assignee: 'Alex Rivera' },
  { id: '2', clientId: '2', title: 'Meta Ads Creative Refresh', type: 'Meta Ads', status: 'In Progress', priority: 'High', dueDate: '2024-03-27', assignee: 'Sarah Chen' },
  { id: '3', clientId: '4', title: 'Google Ads Budget Review', type: 'Google Ads', status: 'To Do', priority: 'High', dueDate: '2024-03-28', assignee: 'Sarah Chen' },
  { id: '4', clientId: '3', title: 'Email Campaign Setup', type: 'Content', status: 'Waiting', priority: 'Medium', dueDate: '2024-03-30', assignee: 'Alex Rivera' },
  { id: '5', clientId: '6', title: 'Reporting Dashboard Update', type: 'Reporting', status: 'To Do', priority: 'Low', dueDate: '2024-04-01', assignee: 'Marcus Bell' },
];

const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Alex Rivera', role: 'Account Manager', avatar: 'https://i.pravatar.cc/150?u=alex', assignedClients: 5, activeTasks: 12, revenueManaged: 12500 },
  { id: '2', name: 'Sarah Chen', role: 'Operations Lead', avatar: 'https://i.pravatar.cc/150?u=sarah', assignedClients: 4, activeTasks: 18, revenueManaged: 15000 },
  { id: '3', name: 'Marcus Bell', role: 'Account Manager', avatar: 'https://i.pravatar.cc/150?u=marcus', assignedClients: 6, activeTasks: 8, revenueManaged: 9500 },
  { id: '4', name: 'Elena Vance', role: 'Finance', avatar: 'https://i.pravatar.cc/150?u=elena', assignedClients: 0, activeTasks: 4, revenueManaged: 0 },
];

interface AppState {
  clients: Client[];
  tasks: Task[];
  team: TeamMember[];
  activities: Activity[];
  automationLogs: AutomationLog[];
  isAuthenticated: boolean;
  
  // Actions
  login: () => void;
  logout: () => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  simulateLead: (leadData: any) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  clients: MOCK_CLIENTS,
  tasks: MOCK_TASKS,
  team: MOCK_TEAM,
  activities: [
    { id: '1', type: 'client', message: 'New client "Bright Dental" onboarded', timestamp: subDays(new Date(), 1).toISOString(), user: 'Alex Rivera' },
    { id: '2', type: 'payment', message: 'Invoice #882 paid by Luna Skincare', timestamp: subDays(new Date(), 2).toISOString(), user: 'System' },
    { id: '3', type: 'task', message: 'Sarah Chen completed "Meta Ads Refresh"', timestamp: subDays(new Date(), 0).toISOString(), user: 'Sarah Chen' },
  ],
  automationLogs: [
    { id: '1', event: 'Lead Routing', status: 'Success', timestamp: new Date().toISOString() },
    { id: '2', event: 'Welcome Email', status: 'Success', timestamp: subDays(new Date(), 1).toISOString() },
  ],
  isAuthenticated: false,

  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  
  addClient: (client) => set((state) => ({
    clients: [...state.clients, { ...client, id: Math.random().toString(36).substr(2, 9) }],
    activities: [{
      id: Math.random().toString(),
      type: 'client',
      message: `New client "${client.company}" added`,
      timestamp: new Date().toISOString(),
      user: 'Current User'
    }, ...state.activities]
  })),

  updateClient: (id, updatedClient) => set((state) => ({
    clients: state.clients.map((c) => (c.id === id ? { ...c, ...updatedClient } : c))
  })),

  deleteClient: (id) => set((state) => ({
    clients: state.clients.filter((c) => c.id !== id)
  })),

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9) }]
  })),

  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t))
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),

  addTeamMember: (member) => set((state) => ({
    team: [...state.team, { ...member, id: Math.random().toString(36).substr(2, 9) }]
  })),

  simulateLead: async (leadData) => {
    // 1. Lead appears in CRM
    const newClientId = Math.random().toString(36).substr(2, 9);
    const newClient: Client = {
      id: newClientId,
      name: leadData.name || 'New Lead',
      company: leadData.company || 'Unknown Corp',
      manager: 'Alex Rivera',
      retainer: leadData.budget || 2000,
      status: 'Lead',
      stage: 'Lead',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      paymentStatus: 'Paid',
      email: leadData.email || 'lead@example.com',
      phone: leadData.phone || '555-0000',
      notes: leadData.notes || 'Inbound lead from public form.'
    };

    set((state) => ({
      clients: [newClient, ...state.clients],
      automationLogs: [{
        id: Math.random().toString(),
        event: 'Inbound Lead Captured',
        status: 'Success',
        timestamp: new Date().toISOString()
      }, ...state.automationLogs]
    }));

    // Simulate delay
    await new Promise(r => setTimeout(r, 1000));

    // 2. Follow-up task created
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: newClientId,
      title: `Follow up with ${newClient.company}`,
      type: 'Follow-up',
      status: 'To Do',
      priority: 'High',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      assignee: 'Alex Rivera'
    };

    set((state) => ({
      tasks: [newTask, ...state.tasks],
      activities: [{
        id: Math.random().toString(),
        type: 'automation',
        message: `Automation: Follow-up task created for ${newClient.company}`,
        timestamp: new Date().toISOString(),
        user: 'System'
      }, ...state.activities],
      automationLogs: [{
        id: Math.random().toString(),
        event: 'Task Auto-Created',
        status: 'Success',
        timestamp: new Date().toISOString()
      }, ...state.automationLogs]
    }));
  }
}));
