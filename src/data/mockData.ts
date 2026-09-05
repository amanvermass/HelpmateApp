export interface AddOnItem {
  id: string;
  name: string;
  category: string;
  price: number; // base price in INR
  gstRate: number; // e.g. 0.18 for 18%
}

export interface SelectedAddOnItem extends AddOnItem {
  gstAmount: number;
  totalWithGst: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceTitle: string;
  category: string;
  locality: string;
  address: string;
  totalAmount: number;
  partnerEarnings: number;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled' | 'Declined';
  date: string;
  timeSlot: string;
  otpCode: string;
  isOtpVerified?: boolean;
  dispatchTimerSeconds?: number;
  completedAddOns?: SelectedAddOnItem[];
  addOnsBaseTotal?: number;
  addOnsGstTotal?: number;
  addOnsFinalTotal?: number;
}

export interface PayoutRecord {
  id: string;
  payoutDate: string;
  completedJobsCount: number;
  grossAmount: number;
  commissionCut: number;
  netPayoutAmount: number;
  bankAccount: string;
  status: 'Settled' | 'Processing';
}

export interface PartnerService {
  id: string;
  category: string;
  title: string;
  fixedRate: number;
  partnerShare: number;
  status: 'Authorized' | 'Inactive';
}

export interface KycDoc {
  id: string;
  title: string;
  fileName: string;
  type: string;
  dateUploaded: string;
  status: string;
  url: string;
}

export const addOnInventory: AddOnItem[] = [
  { id: 'ao-1', name: 'Dual Capacitor (36 MFD / 45 MFD)', category: 'AC Parts', price: 450, gstRate: 0.18 },
  { id: 'ao-2', name: 'R32 / R410a Gas Top-Up (up to 30%)', category: 'AC Gas', price: 1200, gstRate: 0.18 },
  { id: 'ao-3', name: 'Copper Pipe Extension (Per Meter with Insulation)', category: 'Piping', price: 650, gstRate: 0.18 },
  { id: 'ao-4', name: 'AC Outdoor Unit Rubber Anti-Vibration Pads', category: 'Accessories', price: 250, gstRate: 0.18 },
  { id: 'ao-5', name: 'Heavy Duty 16A Smart Socket & Plug Fitting', category: 'Electrical', price: 380, gstRate: 0.18 },
];

export const initialBookings: Booking[] = [
  {
    id: 'HM-BKG-2026-901',
    customerName: 'Karan Malhotra',
    customerPhone: '+91 97920 11223',
    serviceTitle: 'Emergency AC Copper Gas Leak Repair & Refill',
    category: 'AC Repair',
    locality: 'Sigra Main Road',
    address: 'B-14, Sigra Main Road, Near Sigra Stadium, Varanasi',
    totalAmount: 1899,
    partnerEarnings: 1424,
    status: 'Assigned',
    dispatchTimerSeconds: 45,
    date: 'Today',
    timeSlot: 'Immediate Dispatch',
    otpCode: '8821',
  },
  {
    id: 'HM-BKG-2026-891',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    serviceTitle: 'Power Jet AC Servicing (Split 1.5 Ton)',
    category: 'AC Servicing',
    locality: 'Sigra',
    address: 'Flat 302, Green Valley Apartments, Near Sigra Stadium, Varanasi',
    totalAmount: 699,
    partnerEarnings: 524,
    status: 'Pending',
    date: '31 Aug 2026',
    timeSlot: '02:00 PM - 04:00 PM',
    otpCode: '1234',
  },
  {
    id: 'HM-BKG-2026-894',
    customerName: 'Priya Verma',
    customerPhone: '+91 91234 56789',
    serviceTitle: 'AC Gas Leakage Repair & Refilling (R32)',
    category: 'AC Repair',
    locality: 'Lanka',
    address: 'Plot 14, BHU Gate Road, Opposite Lanka Police Outpost, Varanasi',
    totalAmount: 2499,
    partnerEarnings: 1874,
    status: 'Assigned',
    dispatchTimerSeconds: 60,
    date: '31 Aug 2026',
    timeSlot: '04:30 PM - 06:30 PM',
    otpCode: '4920',
  },
  {
    id: 'HM-BKG-2026-880',
    customerName: 'Rajesh Agrawal',
    customerPhone: '+91 94150 99881',
    serviceTitle: 'AC PCB Circuit Board Diagnostic & Repair',
    category: 'AC Repair',
    locality: 'Bhelupur',
    address: 'House 88/C, Kamachha Road, Near IP Vijaya Mall, Varanasi',
    totalAmount: 1499,
    partnerEarnings: 1124,
    status: 'In Progress',
    date: '31 Aug 2026',
    timeSlot: '11:00 AM - 01:00 PM',
    otpCode: '5812',
  },
  {
    id: 'HM-BKG-2026-865',
    customerName: 'Sunil Malhotra',
    customerPhone: '+91 99351 22334',
    serviceTitle: '3-Phase MCB & Fuse Distribution Repair',
    category: 'Smart Electrician',
    locality: 'Mahmoorganj',
    address: 'Shanti Kunj, Lane 4, Mahmoorganj, Varanasi',
    totalAmount: 499,
    partnerEarnings: 374,
    status: 'Completed',
    date: '30 Aug 2026',
    timeSlot: '03:00 PM - 05:00 PM',
    otpCode: '7721',
    isOtpVerified: true,
  },
  {
    id: 'HM-BKG-2026-850',
    customerName: 'Vikram Sethi',
    customerPhone: '+91 98399 77112',
    serviceTitle: 'Master Deep Foam AC Jet Cleaning',
    category: 'AC Servicing',
    locality: 'Sigra',
    address: 'C-21, Vidyapeeth Road, Sigra, Varanasi',
    totalAmount: 899,
    partnerEarnings: 674,
    status: 'Completed',
    date: '29 Aug 2026',
    timeSlot: '10:00 AM - 12:00 PM',
    otpCode: '9041',
    isOtpVerified: true,
  },
];

export const initialPayouts: PayoutRecord[] = [
  {
    id: 'PO-VAR-901',
    payoutDate: '27 Jul 2026 (Mon)',
    completedJobsCount: 18,
    grossAmount: 16400,
    commissionCut: 4100,
    netPayoutAmount: 12300,
    bankAccount: 'HDFC Bank Ltd (A/C: •••• 4910)',
    status: 'Settled',
  },
  {
    id: 'PO-VAR-884',
    payoutDate: '20 Jul 2026 (Mon)',
    completedJobsCount: 22,
    grossAmount: 21800,
    commissionCut: 5450,
    netPayoutAmount: 16350,
    bankAccount: 'HDFC Bank Ltd (A/C: •••• 4910)',
    status: 'Settled',
  },
  {
    id: 'PO-VAR-871',
    payoutDate: '13 Jul 2026 (Mon)',
    completedJobsCount: 15,
    grossAmount: 14200,
    commissionCut: 3550,
    netPayoutAmount: 10650,
    bankAccount: 'HDFC Bank Ltd (A/C: •••• 4910)',
    status: 'Settled',
  },
];

export const partnerServicesList: PartnerService[] = [
  { id: 'ps-1', category: 'AC Servicing & Repair', title: 'Power Jet Split AC Servicing', fixedRate: 699, partnerShare: 524, status: 'Authorized' },
  { id: 'ps-2', category: 'AC Servicing & Repair', title: 'Window AC Anti-Bacterial Servicing', fixedRate: 599, partnerShare: 449, status: 'Authorized' },
  { id: 'ps-3', category: 'AC Servicing & Repair', title: 'AC Gas Refill R32/R410a (Full Pack)', fixedRate: 2499, partnerShare: 1874, status: 'Authorized' },
  { id: 'ps-4', category: 'AC Servicing & Repair', title: 'AC PCB Board Repair & Fitting', fixedRate: 1499, partnerShare: 1124, status: 'Authorized' },
  { id: 'ps-5', category: 'Smart Home Electrician', title: '3-Phase Main Switchboard Repair', fixedRate: 499, partnerShare: 374, status: 'Authorized' },
  { id: 'ps-6', category: 'Smart Home Electrician', title: 'Inverter Wiring & MCB Installation', fixedRate: 799, partnerShare: 599, status: 'Authorized' },
];

export const partnerProfileData = {
  id: 'VAR-EXPERT-8812',
  name: 'Ramesh Yadav',
  phone: '+91 98765 00112',
  email: 'ramesh.yadav.expert@helpmate.com',
  role: 'Senior Authorized HVAC & Smart Electrical Expert',
  rating: '4.92 ★',
  totalJobs: 148,
  totalJobsDone: 148,
  partnerSharePercent: 75,
  partnerId: 'VAR-EXPERT-8812',
  avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&auto=format&fit=crop&q=80',
  address: 'H.No 12/B, Sigra-Rathyatra Main Road, Varanasi - 221002',
  pincodes: ['221001 (Bhelupur)', '221002 (Sigra)', '221005 (Lanka)', '221010 (Mahmoorganj)'],
  bankName: 'HDFC Bank Ltd',
  branch: 'Sigra Branch, Varanasi',
  accountNumber: '•••• •••• 4910',
  ifscCode: 'HDFC0001820',
  upiId: 'ramesh.yadav@hdfcbank',
  aadhaarNumber: '•••• •••• 4912',
  policeThana: 'Sigra Thana, Varanasi',
  policeNocNumber: 'UP-POL-VAR-2026-9912',
  guarantorName: 'Vijay Yadav',
  guarantorRelation: 'Brother',
  guarantorPhone: '+91 98390 11223',
  bankDetails: {
    bankName: 'HDFC Bank Ltd',
    accountNumber: '50100293844910',
    ifsc: 'HDFC0001820',
    branch: 'Sigra Branch, Varanasi',
  },
  kycDocs: [
    { id: 'kyc-1', title: 'Aadhaar Card (Verified)', fileName: 'aadhaar_ramesh_yadav.pdf', type: 'PDF', dateUploaded: '12 Jan 2026', status: 'VERIFIED', url: '#' },
    { id: 'kyc-2', title: 'PAN Card (Verified)', fileName: 'pan_ramesh_yadav.jpg', type: 'JPG', dateUploaded: '12 Jan 2026', status: 'VERIFIED', url: '#' },
    { id: 'kyc-3', title: 'HVAC & Electrical Master Certificate', fileName: 'hvac_cert_2025.pdf', type: 'PDF', dateUploaded: '14 Jan 2026', status: 'VERIFIED', url: '#' },
    { id: 'kyc-4', title: 'Police NOC Character Certificate', fileName: 'police_noc_varanasi.pdf', type: 'PDF', dateUploaded: '15 Jan 2026', status: 'VERIFIED', url: '#' },
  ] as KycDoc[],
  uploadedDocs: [
    { id: 'kyc-1', title: 'Aadhaar Card (Verified)', fileName: 'aadhaar_ramesh_yadav.pdf', type: 'PDF', dateUploaded: '12 Jan 2026', status: 'VERIFIED', url: '#' },
    { id: 'kyc-2', title: 'PAN Card (Verified)', fileName: 'pan_ramesh_yadav.jpg', type: 'JPG', dateUploaded: '12 Jan 2026', status: 'VERIFIED', url: '#' },
    { id: 'kyc-3', title: 'HVAC & Electrical Master Certificate', fileName: 'hvac_cert_2025.pdf', type: 'PDF', dateUploaded: '14 Jan 2026', status: 'VERIFIED', url: '#' },
    { id: 'kyc-4', title: 'Police NOC Character Certificate', fileName: 'police_noc_varanasi.pdf', type: 'PDF', dateUploaded: '15 Jan 2026', status: 'VERIFIED', url: '#' },
  ],
};

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'Job' | 'Payout' | 'Rating' | 'Bonus' | 'System';
  category: 'Job' | 'Payout' | 'Rating' | 'Bonus' | 'System';
  targetTab?: 'dashboard' | 'bookings' | 'payouts' | 'services' | 'profile';
}

export const initialNotifications: AppNotification[] = [
  {
    id: 'n-1',
    title: '⚡ New Job Assigned',
    message: 'Emergency AC Copper Gas Leak Repair assigned in Sigra area. Accept within 45s.',
    time: '2 mins ago',
    read: false,
    type: 'Job',
    category: 'Job',
    targetTab: 'dashboard',
  },
  {
    id: 'n-2',
    title: '💰 Weekly Payout Credited!',
    message: '₹12,300 has been transferred to HDFC Bank A/C •••• 4910 for 18 completed jobs.',
    time: 'Yesterday',
    read: false,
    type: 'Payout',
    category: 'Payout',
    targetTab: 'payouts',
  },
  {
    id: 'n-3',
    title: '⭐ 5-Star Customer Rating!',
    message: 'Customer Aarav Sharma gave you 5 Stars with feedback: "Excellent jet servicing!"',
    time: '2 days ago',
    read: true,
    type: 'Rating',
    category: 'Rating',
    targetTab: 'dashboard',
  },
  {
    id: 'n-4',
    title: '🛡️ Police NOC Certificate Verified',
    message: 'Your Varanasi Police Character NOC has been approved. Account status 100% active.',
    time: '3 days ago',
    read: true,
    type: 'System',
    category: 'System',
    targetTab: 'profile',
  },
];
