export interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;
  discountPercent?: number;
  taxRatePercent: number; // e.g. 5, 12, 18, 28
}

export interface BankDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  branch: string;
  ifscCode: string;
  upiId?: string;
}

export interface PartyDetails {
  name: string;
  address: string;
  gstin: string;
  state: string;
  stateCode: string;
  email?: string;
  phone?: string;
  pan?: string;
}

export interface TransportDetails {
  deliveryNote: string;
  modeOfPayment: string;
  buyerOrderNo: string;
  buyerOrderDate: string;
  dispatchDocNo: string;
  deliveryNoteDate: string;
  dispatchedThrough: string; // e.g. "By Road"
  destination: string;
  billOfLadingNo: string;
  vehicleNo: string;
  termsOfDelivery: string;
}

export type TaxMode = 'cgst_sgst' | 'igst' | 'none';

export type InvoiceTemplate = 'gst_official' | 'modern_gold' | 'clean_minimal';

export interface InvoiceData {
  invoiceTitle: string; // e.g. "Tax Invoice"
  copyType: string; // e.g. "(ORIGINAL FOR RECIPIENT)"
  invoiceNo: string;
  invoiceDate: string; // YYYY-MM-DD or DD-MMM-YY
  dueDate?: string;
  currencySymbol: string; // e.g. '₹', '$', '€'
  currencyCode: string; // e.g. 'INR', 'USD'

  seller: PartyDetails;
  consignee: PartyDetails; // Ship to
  buyer: PartyDetails; // Bill to
  sameAsBuyer: boolean;

  transport: TransportDetails;
  items: InvoiceItem[];
  taxMode: TaxMode; // Intra-state (CGST+SGST) or Inter-state (IGST)
  roundOff: number;

  bank: BankDetails;
  declaration: string;
  termsAndConditions: string;
  signatoryTitle: string;
  signatureImage?: string;
  companyLogo?: string;
  accentColor?: string;
  notes?: string;
}
