import { ShieldCheck, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { FDRRecord } from "@/lib/data";

export default function StatsCards({ records }: { records: FDRRecord[] }) {
  const totalAmount = records.reduce((acc, curr) => acc + curr.amount, 0);
  const activeCount = records.filter(r => r.status === 'Active').length;
  const expiringCount = records.filter(r => r.status === 'Expiring Soon').length;
  const maturedCount = records.filter(r => r.status === 'Matured').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase">Total Deposits</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">₹{totalAmount.toLocaleString('en-IN')}</h3>
        </div>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase">Active FDRs</p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{activeCount}</h3>
        </div>
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase">Expiring Soon</p>
          <h3 className="text-xl font-bold text-amber-600 mt-1">{expiringCount}</h3>
        </div>
        <div className="p-2 bg-amber-50 text-amber-600 rounded-md">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase">Pending Release</p>
          <h3 className="text-xl font-bold text-rose-600 mt-1">{maturedCount}</h3>
        </div>
        <div className="p-2 bg-rose-50 text-rose-600 rounded-md">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}