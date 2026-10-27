export interface FDRRecord {
  id: string;
  vendorName: string;
  tenderId: string;
  bankName: string;
  amount: number;
  issueDate: string;
  maturityDate: string;
  status: 'Active' | 'Expiring Soon' | 'Matured' | 'Released';
}

export const initialFDRs: FDRRecord[] = [
  {
    id: "FDR-2026-001",
    vendorName: "Apex Infrastructure",
    tenderId: "TND-8842",
    bankName: "State Bank of India",
    amount: 250000,
    issueDate: "2025-11-01",
    maturityDate: "2026-11-01",
    status: "Active"
  },
  {
    id: "FDR-2026-002",
    vendorName: "Shree Builders",
    tenderId: "TND-9102",
    bankName: "HDFC Bank",
    amount: 500000,
    issueDate: "2025-05-10",
    maturityDate: "2026-11-15",
    status: "Expiring Soon"
  },
  {
    id: "FDR-2026-003",
    vendorName: "Nexus Dynamics",
    tenderId: "TND-7721",
    bankName: "Punjab National Bank",
    amount: 120000,
    issueDate: "2024-10-01",
    maturityDate: "2026-10-01",
    status: "Matured"
  }
];