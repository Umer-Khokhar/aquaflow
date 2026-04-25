import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  CheckCircle2, 
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  DollarSign,
  MessageSquare,
  User,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

export default function PublicLeadFormPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const simulateLead = useStore(state => state.simulateLead);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    
    const formData = new FormData(e.target as HTMLFormElement);
    await simulateLead({
      name: formData.get('name'),
      company: formData.get('company'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      budget: parseInt(formData.get('budget') as string) || 2000,
      notes: formData.get('notes')
    });

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl shadow-indigo-100 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Application Received!</h1>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Thank you for your interest in working with us. Our team will review your details and get back to you within 24 hours.
          </p>
          <Button 
            onClick={() => navigate('/login')}
            className="w-full h-14 bg-slate-900 hover:bg-slate-800 rounded-2xl text-lg font-bold"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Left Side - Content */}
      <div className="hidden lg:flex flex-1 bg-indigo-600 p-24 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 border-4 border-white rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border-4 border-white rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 font-bold text-2xl">S</div>
            <span className="font-bold text-2xl tracking-tight">Solvorr Tech</span>
          </div>

          <h1 className="text-6xl font-bold mb-8 leading-tight">
            Let's scale your <br />
            <span className="text-indigo-200">agency operations.</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-lg leading-relaxed">
            Join 50+ high-growth agencies using Solvorr to automate their workflows and increase profitability.
          </p>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Fast Onboarding</h3>
              <p className="text-indigo-200 text-sm">Get your dashboard live in under 48 hours.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Dedicated Support</h3>
              <p className="text-indigo-200 text-sm">24/7 access to your account manager.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 py-24 overflow-y-auto">
        <div className="max-w-xl w-full mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Work with us</h2>
            <p className="text-slate-500">Fill out the form below and we'll be in touch shortly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Full Name
                </label>
                <Input name="name" placeholder="John Doe" required className="h-12 rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" /> Business Name
                </label>
                <Input name="company" placeholder="Acme Agency" required className="h-12 rounded-xl border-slate-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Email Address
                </label>
                <Input name="email" type="email" placeholder="john@example.com" required className="h-12 rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> Phone Number
                </label>
                <Input name="phone" placeholder="+1 (555) 000-0000" required className="h-12 rounded-xl border-slate-200" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" /> Monthly Budget
                </label>
                <Select name="budget" defaultValue="2500">
                  <SelectTrigger className="h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="1000">$1,000 - $2,500</SelectItem>
                    <SelectItem value="2500">$2,500 - $5,000</SelectItem>
                    <SelectItem value="5000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10000">$10,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-400" /> Primary Interest
                </label>
                <Select name="interest" defaultValue="full">
                  <SelectTrigger className="h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select interest" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="full">Full Agency OS</SelectItem>
                    <SelectItem value="crm">CRM & Pipeline</SelectItem>
                    <SelectItem value="automation">Automation Only</SelectItem>
                    <SelectItem value="reporting">Reporting & BI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" /> Additional Notes
              </label>
              <Textarea 
                name="notes" 
                placeholder="Tell us about your current challenges..." 
                className="min-h-[120px] rounded-xl border-slate-200"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-100 transition-all"
            >
              {loading ? "Submitting..." : "Submit Application"}
              {!loading && <Send className="w-5 h-5 ml-2" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
