import { FDRRecord } from "@/lib/data";

interface Props {
  records: FDRRecord[];
  onRelease: (id: string) => void;
}

export default function FDRTable({ records, onRelease }: Props) {
  const getBadgeClass = (status: FDRRecord['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Expiring Soon': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Matured': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Released': return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-semibold text-slate-800">Security Deposit / FDR Ledger</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">FDR ID / Tender</th>
              <th className="px-6 py-3">Vendor Name</th>
              <th className="px-6 py-3">Bank Details</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Maturity Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {row.id}
                  <span className="block text-xs text-slate-400 font-normal">{row.tenderId}</span>
                </td>
                <td className="px-6 py-4">{row.vendorName}</td>
                <td className="px-6 py-4">{row.bankName}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">₹{row.amount.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">{row.maturityDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getBadgeClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {row.status !== 'Released' ? (
                    <button
                      onClick={() => onRelease(row.id)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
                    >
                      Release Deposit
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}