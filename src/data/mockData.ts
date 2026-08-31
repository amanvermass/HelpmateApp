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
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
  date: string;
  timeSlot: string;
  otpCode: string;
  isOtpVerified?: boolean;
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
    payoutDate: '27 Jul 2026 (Weekly Settlement)',
    completedJobsCount: 18,
    grossAmount: 16400,
    commissionCut: 4100,
    netPayoutAmount: 12300,
    bankAccount: 'HDFC Bank (•••• 4910)',
    status: 'Settled',
  },
  {
    id: 'PO-VAR-844',
    payoutDate: '20 Jul 2026 (Weekly Settlement)',
    completedJobsCount: 16,
    grossAmount: 14200,
    commissionCut: 3550,
    netPayoutAmount: 10650,
    bankAccount: 'HDFC Bank (•••• 4910)',
    status: 'Settled',
  },
  {
    id: 'PO-VAR-788',
    payoutDate: '13 Jul 2026 (Weekly Settlement)',
    completedJobsCount: 20,
    grossAmount: 18800,
    commissionCut: 4700,
    netPayoutAmount: 14100,
    bankAccount: 'HDFC Bank (•••• 4910)',
    status: 'Settled',
  },
];

export const partnerServicesList: PartnerService[] = [
  {
    id: 'ps-1',
    category: 'AC Servicing & Repair',
    title: 'Power Jet AC Servicing (Split/Window 1.5 Ton)',
    fixedRate: 699,
    partnerShare: 524,
    status: 'Authorized',
  },
  {
    id: 'ps-2',
    category: 'AC Servicing & Repair',
    title: 'AC Gas Leakage Repair & Refilling (R32/R410a)',
    fixedRate: 2499,
    partnerShare: 1874,
    status: 'Authorized',
  },
  {
    id: 'ps-3',
    category: 'AC Servicing & Repair',
    title: 'AC PCB Circuit Board Diagnostic & Repair',
    fixedRate: 1499,
    partnerShare: 1124,
    status: 'Authorized',
  },
  {
    id: 'ps-4',
    category: 'AC Servicing & Repair',
    title: 'Master Deep Foam Jet Wash Cleaning (Split 2 Ton)',
    fixedRate: 899,
    partnerShare: 674,
    status: 'Authorized',
  },
  {
    id: 'ps-5',
    category: 'AC Servicing & Repair',
    title: 'Inverter AC Dual Capacitor & Motor Replacement',
    fixedRate: 450,
    partnerShare: 338,
    status: 'Authorized',
  },
  {
    id: 'ps-6',
    category: 'Smart Home Electrician',
    title: '3-Phase MCB & Fuse Distribution Repair',
    fixedRate: 499,
    partnerShare: 374,
    status: 'Authorized',
  },
  {
    id: 'ps-7',
    category: 'Smart Home Electrician',
    title: 'Smart Home Switchboard & Socket Rewiring',
    fixedRate: 399,
    partnerShare: 299,
    status: 'Authorized',
  },
];

export const partnerProfileData = {
  id: 'HM-TECH-901',
  name: 'Ramesh Kumar Yadav',
  avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&auto=format&fit=crop&q=80',
  role: 'Senior AC Servicing & Power-Jet HVAC Specialist',
  category: 'AC Service & Repair',
  phone: '+91 98390 11220',
  rawPhone: '9839011220',
  email: 'ramesh.yadav@helpmate.in',
  address: 'H.No 42/B, Sigra-Rathyatra Main Road, Sigra, Varanasi, UP - 221002',
  pincodes: ['221001 (Bhelupur)', '221002 (Sigra)', '221005 (Lanka)', '221010 (Mahmoorganj)'],
  joiningDate: '14 Jan 2025',
  rating: 4.9,
  totalJobs: 128,
  commissionRate: '25%',
  partnerSharePercent: '75%',
  status: 'Active & Verified',

  // Bank Account Payout
  bankName: 'HDFC Bank Ltd',
  branch: 'Sigra Main Branch, Varanasi',
  accountNumber: '50100299182711',
  ifscCode: 'HDFC0001820',
  upiId: 'ramesh.yadav@okaxis',

  // Aadhaar KYC Details
  aadhaarNumber: '9823 4102 9831',
  aadhaarVerified: true,

  // Emergency Guarantor
  guarantorName: 'Suresh Chandra Yadav',
  guarantorRelation: 'Father / Next of Kin',
  guarantorPhone: '+91 94150 09821',

  // Police Clearance
  policeStatus: 'Cleared & Approved',
  policeThana: 'Sigra Police Station (Varanasi Zone)',
  policeNocNumber: 'UP-VAR-POL-2026-99210',

  // Documents
  uploadedDocs: [
    {
      id: 'doc-1',
      title: 'Current Passport Size Photo',
      fileName: 'Ramesh_Yadav_Passport_Photo.png',
      type: 'ID Badge Photo',
      dateUploaded: '14 Jan 2025',
      status: 'Verified ✓',
      url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'doc-2',
      title: 'Aadhaar Card (Front & Back)',
      fileName: 'Aadhaar_Both_Sides_Color_Scan.pdf',
      type: 'Government ID Proof',
      dateUploaded: '14 Jan 2025',
      status: 'Verified e-KYC ✓',
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'doc-3',
      title: 'Police Clearance NOC Certificate',
      fileName: 'Sigra_Thana_Police_Verification_NOC.pdf',
      type: 'Background Check',
      dateUploaded: '12 Jan 2026',
      status: 'Approved ✓',
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=80',
    },
  ],
};

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: 'Job' | 'Payout' | 'Rating' | 'System' | 'Bonus';
  read: boolean;
  targetTab?: 'bookings' | 'payouts' | 'profile' | 'services';
}

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Job Assigned',
    message: 'Power Jet AC Servicing assigned in Sigra! Customer: Aarav Sharma. Scheduled for 02:00 PM today.',
    time: '10 mins ago',
    category: 'Job',
    read: false,
    targetTab: 'bookings',
  },
  {
    id: 'notif-2',
    title: 'Weekly Payout Transferred',
    message: 'Weekly net settlement of ₹12,300 has been transferred to your HDFC Bank A/C (••••4910).',
    time: '2 hours ago',
    category: 'Payout',
    read: false,
    targetTab: 'payouts',
  },
  {
    id: 'notif-3',
    title: '5-Star Rating Received ⭐',
    message: 'Sunil Malhotra rated your electrician repair job 5 stars: "Punctual & excellent service!"',
    time: 'Yesterday',
    category: 'Rating',
    read: true,
    targetTab: 'profile',
  },
  {
    id: 'notif-4',
    title: 'Weekly Performance Bonus Alert 🎁',
    message: 'Complete 5 more AC jet services this week to earn an extra ₹1,500 bonus payout!',
    time: '2 days ago',
    category: 'Bonus',
    read: true,
    targetTab: 'services',
  },
  {
    id: 'notif-5',
    title: 'Police Clearance NOC Verified',
    message: 'Your Police Clearance NOC status (Sigra Thana) has been verified and active until Jan 2027.',
    time: '3 days ago',
    category: 'System',
    read: true,
    targetTab: 'profile',
  },
];

