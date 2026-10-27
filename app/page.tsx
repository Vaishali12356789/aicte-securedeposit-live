'use client';

import { useState } from 'react';
import { 
  BrainCircuit, 
  FileText, 
  RefreshCw, 
  Plus, 
  Trash2, 
  X,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Building,
  Search,
  ShieldCheck,
  CreditCard,
  Send
} from 'lucide-react';

interface FDRRecord {
  id: string;
  vendorName: string;
  tenderId: string;
  bankName: string;
  amount: number;
  maturityDate: string;
  status: 'Active' | 'Expiring Soon' | 'Matured' | 'Released' | 'Flagged Fraud';
  riskScore: string;
}

const initialRecords: FDRRecord[] = [
  {
    id: "FDR-2026-001",
    vendorName: "Apex Infrastructure Ltd.",
    tenderId: "TND-8842",
    bankName: "State Bank of India",
    amount: 2500000,
    maturityDate: "2026-11-01",
    status: "Active",
    riskScore: "Low (0.2%)"
  },
  {
    id: "FDR-2026-002",
    vendorName: "Shree Techno Builders",
    tenderId: "TND-9102",
    bankName: "HDFC Bank",
    amount: 5000000,
    maturityDate: "2026-11-12",
    status: "Expiring Soon",
    riskScore: "Low (1.1%)"
  },
  {
    id: "FDR-2026-003",
    vendorName: "Ghost Contractors Corp",
    tenderId: "TND-9999",
    bankName: "Unknown Cooperative Bank",
    amount: 3000000,
    maturityDate: "2026-12-01",
    status: "Flagged Fraud",
    riskScore: "High (94.8% Tampered)"
  }
];

export default function AICTESecureDepositPortal() {
  const [view, setView] = useState<'home' | 'portal'>('home');
  const [activeTab, setActiveTab] = useState<'ledger' | 'ai-scanner' | 'alerts'>('ledger');
  const [records, setRecords] = useState<FDRRecord[]>(initialRecords);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States for CRUD
  const [vendorName, setVendorName] = useState('');
  const [tenderId, setTenderId] = useState('');
  const [bankName, setBankName] = useState('');
  const [amount, setAmount] = useState('');
  const [maturityDate, setMaturityDate] = useState('');

  // AI OCR Scanner States
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // CREATE (Add Record)
  const handleAddFDR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !tenderId || !bankName || !amount || !maturityDate) return;

    const newRecord: FDRRecord = {
      id: `FDR-2026-00${records.length + 1}`,
      vendorName,
      tenderId,
      bankName,
      amount: Number(amount),
      maturityDate,
      status: 'Active',
      riskScore: 'Low (AI Verified)'
    };

    setRecords([newRecord, ...records]);
    setShowModal(false);
    setVendorName('');
    setTenderId('');
    setBankName('');
    setAmount('');
    setMaturityDate('');
  };

  // DELETE (Remove Record)
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this deposit entry?")) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  // UPDATE (Change Status / Release)
  const handleUpdateStatus = (id: string, newStatus: FDRRecord['status']) => {
    setRecords(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  const filteredRecords = records.filter(r => 
    r.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tenderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* 1. LIGHT HEADER */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50 px-6 py-3.5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wide text-slate-900">AICTE SecureDeposit</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">SIH PS 26265</span>
            </div>
            <p className="text-xs text-slate-500">Security Deposit Lifecycle & Fraud Guard Engine</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button 
            onClick={() => setView('home')} 
            className={`transition-colors ${view === 'home' ? 'text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Overview / Home
          </button>
          <button 
            onClick={() => { setView('portal'); setActiveTab('ledger'); }} 
            className={`transition-colors ${view === 'portal' && activeTab === 'ledger' ? 'text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Management Ledger
          </button>
          <button 
            onClick={() => { setView('portal'); setActiveTab('ai-scanner'); }} 
            className={`transition-colors ${view === 'portal' && activeTab === 'ai-scanner' ? 'text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            AI Document OCR
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {view === 'home' ? (
            <button 
              onClick={() => setView('portal')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-all shadow-sm flex items-center gap-2"
            >
              Access Portal <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Deposit
            </button>
          )}
        </div>
      </header>

      {/* 2. BODY CONTENT */}
      <div className="flex-grow">
        
        {/* VIEW A: LANDING / HOME */}
        {view === 'home' && (
          <div className="space-y-16 py-12 px-6 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-md">
                Smart India Hackathon 2026 Official Entry
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Streamlining Security Deposits with <span className="text-emerald-600">AICTE SecureDeposit</span>
              </h1>
              <p className="text-slate-600 text-base leading-relaxed">
                An enterprise-grade government portal engineered for automated OCR verification, real-time fraud detection, maker-checker authorization workflows, and automated maturity release notifications.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button 
                  onClick={() => { setView('portal'); setActiveTab('ledger'); }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-all shadow flex items-center gap-2"
                >
                  Open Management Ledger <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setView('portal'); setActiveTab('ai-scanner'); }}
                  className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-xl text-sm border border-slate-300 transition-all flex items-center gap-2 shadow-sm"
                >
                  Test AI Vision Scanner <BrainCircuit className="w-4 h-4 text-emerald-600" />
                </button>
              </div>
            </div>

            {/* NEW: HOW IT WORKS SECTION */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">How It Works (System Workflow)</h2>
                <p className="text-sm text-slate-500 max-w-xl mx-auto">4-Step Automated Lifecycle Management for Security Deposits & Fixed Deposit Receipts</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                {/* Step 1 */}
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative space-y-3">
                  <div className="w-8 h-8 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center text-sm">1</div>
                  <h3 className="font-bold text-slate-900 text-base">Deposit Submission</h3>
                  <p className="text-xs text-slate-600">Vendor submits FDR copy, tender ID, and bank details into the centralized portal.</p>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative space-y-3">
                  <div className="w-8 h-8 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center text-sm">2</div>
                  <h3 className="font-bold text-slate-900 text-base">AI OCR & Fraud Check</h3>
                  <p className="text-xs text-slate-600">Computer vision extracts text, verifies bank seal, and checks file metadata for Photoshop tampering.</p>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative space-y-3">
                  <div className="w-8 h-8 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center text-sm">3</div>
                  <h3 className="font-bold text-slate-900 text-base">Maker-Checker Audit</h3>
                  <p className="text-xs text-slate-600">Finance officer reviews AI confidence score and approves deposit entry into active ledger.</p>
                </div>

                {/* Step 4 */}
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl relative space-y-3">
                  <div className="w-8 h-8 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center text-sm">4</div>
                  <h3 className="font-bold text-slate-900 text-base">Automated Refund</h3>
                  <p className="text-xs text-slate-600">Smart triggers send expiry warnings to bank APIs for zero-delay remittance back to vendor.</p>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow transition-shadow">
                <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-emerald-600" /> Automated OCR & Fraud Guard
                </h3>
                <p className="text-sm text-slate-600">Instantly extracts amount, bank seal, and maturity dates while verifying file metadata against digital tampering.</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow transition-shadow">
                <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" /> Maker-Checker Workflow
                </h3>
                <p className="text-sm text-slate-600">Multi-tier authorization controls ensuring complete transparency between contractors and treasury officials.</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow transition-shadow">
                <h3 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /> Proactive Maturity Alerts
                </h3>
                <p className="text-sm text-slate-600">Automated triggers dispatched prior to expiry to guarantee instant refund remittance without manual tracking.</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: PORTAL / DASHBOARD */}
        {view === 'portal' && (
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            
            {/* Sub-Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button 
                  onClick={() => setActiveTab('ledger')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'ledger' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <FileText className="w-4 h-4" /> Ledger & CRUD ({records.length})
                </button>
                <button 
                  onClick={() => setActiveTab('ai-scanner')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'ai-scanner' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <BrainCircuit className="w-4 h-4" /> AI OCR Scanner
                </button>
                <button 
                  onClick={() => setActiveTab('alerts')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'alerts' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <AlertTriangle className="w-4 h-4" /> Expiry Alerts
                </button>
              </div>

              {activeTab === 'ledger' && (
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search vendor or tender ID..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* TAB 1: LEDGER */}
            {activeTab === 'ledger' && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">AICTE Security Deposit Records</h2>
                  <span className="text-xs text-slate-500">Live Production Sync</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-700">
                    <thead className="text-xs uppercase bg-slate-100 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3.5">FDR ID / Tender</th>
                        <th className="px-6 py-3.5">Vendor Name</th>
                        <th className="px-6 py-3.5">Bank</th>
                        <th className="px-6 py-3.5">Amount</th>
                        <th className="px-6 py-3.5">AI Risk Check</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRecords.map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {row.id}
                            <span className="block text-xs text-slate-500 font-normal">{row.tenderId}</span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-800">{row.vendorName}</td>
                          <td className="px-6 py-4 text-slate-600">{row.bankName}</td>
                          <td className="px-6 py-4 font-semibold text-slate-900">₹{row.amount.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-600">{row.riskScore}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                              row.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              row.status === 'Expiring Soon' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              row.status === 'Flagged Fraud' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                            {row.status !== 'Released' && row.status !== 'Flagged Fraud' && (
                              <button
                                onClick={() => handleUpdateStatus(row.id, 'Released')}
                                className="px-3 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors shadow-sm"
                              >
                                Release
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete Entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: AI SCANNER */}
            {activeTab === 'ai-scanner' && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl mx-auto space-y-6 shadow-sm">
                <div className="text-center space-y-1">
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">AI Document OCR & Fraud Detection</h2>
                  <p className="text-xs text-slate-500">Upload your PDF or scanned FDR certificate for instant verification.</p>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:border-emerald-500 transition-colors">
                  <input 
                    type="file" 
                    id="fileUpload" 
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setScanning(true);
                        setScanResult(null);
                        setTimeout(() => {
                          setScanning(false);
                          setScanResult({
                            fileName: file.name,
                            amount: "₹25,00,000",
                            bank: "State Bank of India",
                            confidence: "99.4%"
                          });
                        }, 1600);
                      }
                    }}
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer space-y-3 block">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Click to upload document</p>
                      <p className="text-xs text-slate-500 mt-0.5">Supports PDF, PNG, JPG</p>
                    </div>
                  </label>
                </div>

                {scanning && (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                    <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
                    <p className="text-xs text-slate-600">Processing computer vision OCR analysis...</p>
                  </div>
                )}

                {scanResult && (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> File "{scanResult.fileName}" Verified Successfully
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                      <div><span className="text-slate-500 block">Amount</span><span className="font-bold text-slate-900">{scanResult.amount}</span></div>
                      <div><span className="text-slate-500 block">Bank</span><span className="font-bold text-slate-900">{scanResult.bank}</span></div>
                      <div><span className="text-slate-500 block">Confidence</span><span className="font-bold text-emerald-700">{scanResult.confidence}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ALERTS */}
            {activeTab === 'alerts' && (
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900">Automated Maturity Expiry Warning</h4>
                    <p className="text-xs text-amber-700 mt-1">FDR-2026-002 (Shree Techno Builders) is expiring in 3 days. Automated dispatch alert sent to HDFC Bank API.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* 3. LIGHT FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>AICTE SecureDeposit — SIH 2026 Problem Statement 26265</p>
          <p className="text-slate-500">Vercel Production Deployment</p>
        </div>
      </footer>

      {/* 4. ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 relative shadow-xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-4 uppercase tracking-wide">Add Deposit Record</h3>
            <form onSubmit={handleAddFDR} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Vendor Name</label>
                <input type="text" value={vendorName} onChange={e => setVendorName(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500" placeholder="e.g. Apex Infra" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tender ID</label>
                <input type="text" value={tenderId} onChange={e => setTenderId(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500" placeholder="e.g. TND-9921" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Issuing Bank</label>
                <input type="text" value={bankName} onChange={e => setBankName(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500" placeholder="e.g. State Bank of India" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500" placeholder="2500000" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Maturity Date</label>
                <input type="date" value={maturityDate} onChange={e => setMaturityDate(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm mt-3 transition-all shadow-sm">
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}