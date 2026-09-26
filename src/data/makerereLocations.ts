export interface LocationOption {
  id: string;
  name: string;
  zone: 'hall' | 'hostel' | 'kikoni' | 'kikumi' | 'other';
  isFreeDelivery: boolean;
  notes?: string;
}

export const MAKERERE_HALLS: LocationOption[] = [
  { id: 'mitchell', name: 'Mitchell Hall', zone: 'hall', isFreeDelivery: true, notes: 'Main Campus' },
  { id: 'lumumba', name: 'Lumumba Hall', zone: 'hall', isFreeDelivery: true, notes: 'Main Campus' },
  { id: 'mary_stuart', name: 'Mary Stuart Hall (Box)', zone: 'hall', isFreeDelivery: true, notes: 'Main Campus' },
  { id: 'complex', name: 'Complex Hall (CCE)', zone: 'hall', isFreeDelivery: true, notes: 'Main Campus' },
  { id: 'africa', name: 'Africa Hall', zone: 'hall', isFreeDelivery: true, notes: 'Main Campus' },
  { id: 'livingstone', name: 'Livingstone Hall', zone: 'hall', isFreeDelivery: true, notes: 'Main Campus' },
  { id: 'nsibirwa', name: 'Nsibirwa Hall (Northcote)', zone: 'hall', isFreeDelivery: true, notes: 'Main Campus' },
  { id: 'university_hall', name: 'University Hall (UH)', zone: 'hall', isFreeDelivery: true, notes: 'Main Campus' },
  { id: 'nkrumah', name: 'Nkrumah Hall', zone: 'hall', isFreeDelivery: true, notes: 'Main Campus' },
  { id: 'dag_hamm', name: 'Dag Hammarskjöld Hall', zone: 'hall', isFreeDelivery: true, notes: 'Postgraduate Hall' },
  { id: 'galloway', name: 'Galloway Hall', zone: 'hall', isFreeDelivery: true, notes: 'Mulago Campus' },
  { id: 'kabanyolo', name: 'Kabanyolo Hostel/Hall', zone: 'hall', isFreeDelivery: true, notes: 'Agricultural Campus' }
];

export const MAKERERE_HOSTELS: LocationOption[] = [
  { id: 'olympia', name: 'Olympia Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikoni' },
  { id: 'douglas_villa', name: 'Douglas Villa Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikoni' },
  { id: 'nana', name: 'Nana Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Old Kampala / LDC' },
  { id: 'akamwesi', name: 'Akamwesi Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Wandegeya / Nakawa' },
  { id: 'baskon', name: 'Baskon Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikoni' },
  { id: 'sunset', name: 'Sunset Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikoni' },
  { id: 'dreamworld', name: 'Dreamworld Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikoni' },
  { id: 'jj_hostel', name: 'JJ Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikoni' },
  { id: 'jb_hostel', name: 'JB Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikumi Kikumi' },
  { id: 'braetans', name: 'Braetans Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikoni' },
  { id: 'new_nana', name: 'New Nana Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Near LDC' },
  { id: 'prince_hostel', name: 'Prince Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikoni' },
  { id: 'mariana', name: 'Mariana Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Makerere West' },
  { id: 'muhika', name: 'Muhika Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikumi Kikumi' },
  { id: 'prime_hostel', name: 'Prime Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikoni' },
  { id: 'emerald', name: 'Emerald Hostel', zone: 'hostel', isFreeDelivery: true, notes: 'Kikoni' },
  { id: 'kikoni_centre', name: 'Kikoni Trading Centre / Environs', zone: 'kikoni', isFreeDelivery: true },
  { id: 'kikumi_centre', name: 'Kikumi-Kikumi Business Area', zone: 'kikumi', isFreeDelivery: true },
  { id: 'wandegeya', name: 'Wandegeya Market & Commercial Plaza', zone: 'other', isFreeDelivery: true },
  { id: 'other_kampala', name: 'Other Kampala Location (Outside Makerere)', zone: 'other', isFreeDelivery: false, notes: 'Standard Delivery Fee Applies' }
];

export const ALL_LOCATIONS = [...MAKERERE_HALLS, ...MAKERERE_HOSTELS];
