import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus,
  Settings,
  History,
  Workflow,
  Sparkles
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AutomationPage() {
  const { automationLogs, simulateLead } = useStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setActiveStep(0);
    
    const steps = [
      "Capturing lead from public form...",
      "Routing lead to Alex Rivera...",
      "Creating deal in Pipeline...",
      "Generating follow-up task...",
      "Sending welcome email sequence..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      toast.info(steps[i], { duration: 1500 });
      await new Promise(r => setTimeout(r, 1500));
    }

    await simulateLead({
      name: 'John Wick',
      company: 'Continental Services',
      email: 'john@continental.com',
      budget: 5000,
      notes: 'Interested in full-service SEO and PPC.'
    });

    setIsSimulating(false);
    setActiveStep(null);
    toast.success("Automation flow completed successfully!");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Automation Engine</h1>
          <p className="text-slate-500">Visual workflows and automated agency operations.</p>
        </div>
        <Button 
          onClick={handleSimulate} 
          disabled={isSimulating}
          className="bg-indigo-600 hover:bg-indigo-700 rounded-xl gap-2 shadow-lg shadow-indigo-100 h-11 px-6"
        >
          {isSimulating ? (
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Zap className="w-4 h-4" />
            </motion.div>
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          Simulate New Lead Flow
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflow Diagram */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Workflow className="w-5 h-5 text-indigo-600" />
                Active Workflow: Inbound Lead Capture
              </CardTitle>
              <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-none rounded-lg">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-12">
            <div className="relative flex flex-col items-center gap-12">
              {/* Connector Line */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-slate-100 left-1/2 -translate-x-1/2" />
              
              {[
                { icon: Sparkles, label: 'Form Submission', desc: 'Public Lead Form' },
                { icon: Zap, label: 'Lead Routing', desc: 'Assign to Account Manager' },
                { icon: Workflow, label: 'Pipeline Entry', desc: 'Create Deal in "Lead" stage' },
                { icon: Clock, label: 'Task Creation', desc: 'Auto-generate follow-up' },
                { icon: CheckCircle2, label: 'Email Sequence', desc: 'Send Welcome Kit' },
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  animate={activeStep === i ? { scale: 1.05 } : { scale: 1 }}
                  className={cn(
                    "relative z-10 flex items-center gap-6 w-full max-w-md p-4 rounded-2xl border-2 transition-all duration-300",
                    activeStep === i 
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200" 
                      : "bg-white border-slate-100 text-slate-900"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    activeStep === i ? "bg-white/20" : "bg-indigo-50 text-indigo-600"
                  )}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">{step.label}</h4>
                    <p className={cn("text-xs", activeStep === i ? "text-indigo-100" : "text-slate-500")}>{step.desc}</p>
                  </div>
                  {activeStep === i && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" 
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automation Stats & Logs */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-3xl bg-indigo-600 text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <Settings className="w-5 h-5 opacity-40" />
              </div>
              <h3 className="text-3xl font-bold mb-1">1,284</h3>
              <p className="text-indigo-100 text-sm mb-6">Automations triggered this month</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="opacity-60">Efficiency Gain</span>
                  <span className="font-bold">+32%</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '72%' }} 
                    className="h-full bg-white" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                Execution Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  {automationLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50/50 border-none">
                      <TableCell className="pl-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{log.event}</p>
                        <p className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none rounded-lg text-[10px]">
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-3xl bg-slate-900 text-white p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center text-xs">OLD</span>
            Manual Process
          </h3>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2" />
              Leads sit in email inbox for 24-48 hours.
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2" />
              Manual data entry into spreadsheets.
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2" />
              Account managers forget to follow up.
            </li>
            <li className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mt-2" />
              Zero visibility into pipeline conversion.
            </li>
          </ul>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl bg-indigo-600 text-white p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center text-xs">NEW</span>
            Solvorr Automation
          </h3>
          <ul className="space-y-4 text-indigo-100 text-sm">
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-200" />
              Instant lead capture and routing ({"<"} 1 min).
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-200" />
              Auto-created deals and tasks in CRM.
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-200" />
              Automated welcome email sequences.
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-200" />
              Real-time reporting and conversion tracking.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
