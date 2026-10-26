import { InvoiceData } from '../types/invoice';

export const defaultPdfSampleInvoice: InvoiceData = {
  invoiceTitle: 'Tax Invoice',
  copyType: '(ORIGINAL FOR RECIPIENT)',
  invoiceNo: 'FZ/26-27/105',
  invoiceDate: '2026-11-26',
  dueDate: '2026-12-10',
  currencySymbol: '₹',
  currencyCode: 'INR',

  seller: {
    name: 'F Z SURGICAL (ZAID)',
    address: 'First Floor, Building No. E-117/191, Jhuggi, Near Shani Bazar, Sunder Nagri, New Delhi - 110093',
    gstin: '07AEYPZ3220R1ZD',
    state: 'Delhi',
    stateCode: '07',
    email: 'info@fzsurgical.com',
    phone: '+91 98765 43210',
    pan: 'AEYPZ3220R',
  },

  consignee: {
    name: 'SKYWEAR',
    address: 'E-57/D-165, Jhuggi, Sunder Nagri, New Delhi, North East Delhi',
    gstin: '07BZPPV5409J1ZM',
    state: 'Delhi',
    stateCode: '07',
    phone: '+91 98111 22334',
  },

  buyer: {
    name: 'SKYWEAR',
    address: 'E-57/D-165, Jhuggi, Sunder Nagri, New Delhi, North East Delhi',
    gstin: '07BZPPV5409J1ZM',
    state: 'Delhi',
    stateCode: '07',
    phone: '+91 98111 22334',
  },

  sameAsBuyer: true,

  transport: {
    deliveryNote: '',
    modeOfPayment: 'Net Banking / Immediate',
    buyerOrderNo: 'PO-2026/89',
    buyerOrderDate: '2026-11-25',
    dispatchDocNo: 'FZ/26-27/105',
    deliveryNoteDate: '2026-11-26',
    dispatchedThrough: 'By Road',
    destination: 'Delhi',
    billOfLadingNo: 'dt. 26-Nov-26',
    vehicleNo: 'DL-01-AB-1234',
    termsOfDelivery: 'Door Delivery',
  },

  items: [
    {
      id: 'item-1',
      description: 'BACK REST LONG (U)',
      hsn: '90211000',
      quantity: 100,
      unit: 'pcs',
      rate: 157.0,
      discountPercent: 0,
      taxRatePercent: 5, // 2.5% CGST + 2.5% SGST
    },
    {
      id: 'item-2',
      description: 'COCCYX CUSHION DONUT (U)',
      hsn: '90211000',
      quantity: 200,
      unit: 'pcs',
      rate: 138.0,
      discountPercent: 0,
      taxRatePercent: 5, // 2.5% CGST + 2.5% SGST
    },
  ],

  taxMode: 'cgst_sgst',
  roundOff: 0.0,

  bank: {
    accountHolder: 'Zaid',
    bankName: 'INDIAN OVERSEAS BANK',
    accountNumber: '279301000012201',
    branch: 'Delhi',
    ifscCode: 'IOBA0002793',
    upiId: 'zaid@indianbk',
  },

  declaration:
    'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
  termsAndConditions:
    '1. Goods once sold will not be taken back without prior approval.\n2. Interest @18% p.a. will be charged if payment is not made within the due date.\n3. Subject to Delhi jurisdiction only.',
  signatoryTitle: 'Authorised Signatory',
  accentColor: '#e2c072',
  notes: 'Thank you for your business with PrimeAstra Workspace network!',
};

export const emptyInvoice: InvoiceData = {
  invoiceTitle: 'Tax Invoice',
  copyType: '(ORIGINAL FOR RECIPIENT)',
  invoiceNo: 'INV-' + new Date().getFullYear() + '-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  currencySymbol: '₹',
  currencyCode: 'INR',

  seller: {
    name: 'Your Company Name',
    address: 'Shop No. 1, Main Road, New Delhi - 110001',
    gstin: '07AAAAA0000A1Z5',
    state: 'Delhi',
    stateCode: '07',
    email: 'contact@yourbrand.com',
    phone: '+91 98000 00000',
  },

  consignee: {
    name: 'Client / Buyer Name',
    address: 'Customer Address, City, State - Pin Code',
    gstin: '',
    state: 'Delhi',
    stateCode: '07',
  },

  buyer: {
    name: 'Client / Buyer Name',
    address: 'Customer Address, City, State - Pin Code',
    gstin: '',
    state: 'Delhi',
    stateCode: '07',
  },

  sameAsBuyer: true,

  transport: {
    deliveryNote: '',
    modeOfPayment: 'Net Banking / UPI',
    buyerOrderNo: '',
    buyerOrderDate: '',
    dispatchDocNo: '',
    deliveryNoteDate: '',
    dispatchedThrough: 'By Road',
    destination: '',
    billOfLadingNo: '',
    vehicleNo: '',
    termsOfDelivery: 'Standard Delivery',
  },

  items: [
    {
      id: 'item-1',
      description: 'Product or Service Description',
      hsn: '998311',
      quantity: 1,
      unit: 'nos',
      rate: 5000,
      discountPercent: 0,
      taxRatePercent: 18,
    },
  ],

  taxMode: 'cgst_sgst',
  roundOff: 0.0,

  bank: {
    accountHolder: 'Account Holder Name',
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '50100012345678',
    branch: 'Connaught Place, New Delhi',
    ifscCode: 'HDFC0001234',
    upiId: 'account@upi',
  },

  declaration:
    'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.',
  termsAndConditions: '1. Payment due within 15 days.\n2. Subject to local jurisdiction.',
  signatoryTitle: 'Authorised Signatory',
  accentColor: '#e2c072',
  notes: 'Thank you for your business!',
};
