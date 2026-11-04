export type TillStatus = 'Active' | 'Inactive';
export type ShiftStatus = 'Active' | 'Completed';
export type ClosureType = 'Manual' | 'Automatic';
export type TransactionStatus = 'Successful' | 'Pending' | 'Failed';

export interface TillAccount {
  id: string;
  name: string;
  number: string;
  business: string;
  createdAt: string;
  status: TillStatus;
  balance: number;
  assignedUserIds: string[];
  activeUserId: string | null;
}

export interface TillUser {
  id: string;
  name: string;
  username: string;
  email: string;
  tillId: string | null;
  createdAt: string;
}

export interface TillShift {
  id: string;
  reference: string;
  tillId: string;
  userId: string;
  startAt: string;
  endAt: string | null;
  openingBalance: number;
  closingBalance: number | null;
  totalCollections: number;
  amountSwept: number | null;
  closureType: ClosureType | null;
  status: ShiftStatus;
}

export interface TillTransaction {
  id: string;
  reference: string;
  tillId: string;
  userId: string;
  shiftId: string;
  senderName?: string;
  description?: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
}

export interface TillSweep {
  id: string;
  reference: string;
  tillId: string;
  userId: string;
  shiftId: string;
  amount: number;
  openingBalance: number;
  closingBalance: number;
  totalCollections: number;
  createdAt: string;
  closureType: ClosureType;
}

export interface TillState {
  accounts: TillAccount[];
  users: TillUser[];
  shifts: TillShift[];
  transactions: TillTransaction[];
  sweeps: TillSweep[];
}

const sampleDate = '2026-11-04';
export const TILL_STORAGE_KEY = 'till-account-management-phase-2';

export function isTillState(value: unknown): value is TillState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.accounts) &&
    Array.isArray(candidate.users) &&
    Array.isArray(candidate.shifts) &&
    Array.isArray(candidate.transactions) &&
    Array.isArray(candidate.sweeps)
  );
}

export const initialTillState: TillState = {
  accounts: [
    {
      id: 'till-001',
      name: 'Lekki Station',
      number: '3100458216',
      business: 'Taiye Alabi Enterprises',
      createdAt: `${sampleDate}T07:14:00.000Z`,
      status: 'Active',
      balance: 186500,
      assignedUserIds: ['user-001', 'user-002', 'user-003'],
      activeUserId: 'user-001'
    },
    {
      id: 'till-002',
      name: 'Ikeja Supermarket',
      number: '3100458268',
      business: 'Taiye Alabi Enterprises',
      createdAt: '2026-11-02T09:22:00.000Z',
      status: 'Active',
      balance: 0,
      assignedUserIds: ['user-004', 'user-005'],
      activeUserId: null
    },
    {
      id: 'till-003',
      name: 'Yaba Outlet',
      number: '3100458304',
      business: 'Akinyele Retail Group',
      createdAt: '2026-10-28T13:06:00.000Z',
      status: 'Inactive',
      balance: 0,
      assignedUserIds: [],
      activeUserId: null
    }
  ],
  users: [
    {
      id: 'user-001',
      name: 'Kemi Adebayo',
      username: 'kemi.adebayo',
      email: 'kemi@example.com',
      tillId: 'till-001',
      createdAt: '2026-10-10T09:00:00.000Z'
    },
    {
      id: 'user-002',
      name: 'Chidi Okafor',
      username: 'chidi.okafor',
      email: 'chidi@example.com',
      tillId: 'till-001',
      createdAt: '2026-10-11T09:00:00.000Z'
    },
    {
      id: 'user-003',
      name: 'Sola Bello',
      username: 'sola.bello',
      email: 'sola@example.com',
      tillId: 'till-001',
      createdAt: '2026-10-12T09:00:00.000Z'
    },
    {
      id: 'user-004',
      name: 'Tunde James',
      username: 'tunde.james',
      email: 'tunde@example.com',
      tillId: 'till-002',
      createdAt: '2026-10-14T09:00:00.000Z'
    },
    {
      id: 'user-005',
      name: 'Amaka Nwosu',
      username: 'amaka.nwosu',
      email: 'amaka@example.com',
      tillId: 'till-002',
      createdAt: '2026-10-15T09:00:00.000Z'
    }
  ],
  shifts: [
    {
      id: 'shift-001',
      reference: 'SHF-2026-0042',
      tillId: 'till-001',
      userId: 'user-001',
      startAt: '2026-11-04T08:00:00.000Z',
      endAt: null,
      openingBalance: 0,
      closingBalance: null,
      totalCollections: 186500,
      amountSwept: null,
      closureType: null,
      status: 'Active'
    },
    {
      id: 'shift-002',
      reference: 'SHF-2026-0041',
      tillId: 'till-001',
      userId: 'user-002',
      startAt: '2026-11-03T08:00:00.000Z',
      endAt: '2026-11-03T14:00:00.000Z',
      openingBalance: 0,
      closingBalance: 94200,
      totalCollections: 94200,
      amountSwept: 94200,
      closureType: 'Manual',
      status: 'Completed'
    },
    {
      id: 'shift-003',
      reference: 'SHF-2026-0038',
      tillId: 'till-002',
      userId: 'user-004',
      startAt: '2026-11-02T07:00:00.000Z',
      endAt: '2026-11-02T15:00:00.000Z',
      openingBalance: 0,
      closingBalance: 127500,
      totalCollections: 127500,
      amountSwept: 127500,
      closureType: 'Automatic',
      status: 'Completed'
    }
  ],
  transactions: [
    {
      id: 'txn-001',
      reference: 'TXN-983402',
      tillId: 'till-001',
      userId: 'user-001',
      shiftId: 'shift-001',
      senderName: 'Amina Yusuf',
      description: 'Fuel purchase',
      amount: 125000,
      status: 'Successful',
      createdAt: '2026-11-04T09:14:00.000Z'
    },
    {
      id: 'txn-002',
      reference: 'TXN-983417',
      tillId: 'till-001',
      userId: 'user-001',
      shiftId: 'shift-001',
      senderName: 'Emeka Obi',
      description: 'Diesel purchase',
      amount: 61500,
      status: 'Successful',
      createdAt: '2026-11-04T09:48:00.000Z'
    },
    {
      id: 'txn-003',
      reference: 'TXN-982104',
      tillId: 'till-001',
      userId: 'user-002',
      shiftId: 'shift-002',
      senderName: 'Bola Ajayi',
      description: 'Fuel purchase',
      amount: 94200,
      status: 'Successful',
      createdAt: '2026-11-03T12:15:00.000Z'
    },
    {
      id: 'txn-004',
      reference: 'TXN-981720',
      tillId: 'till-002',
      userId: 'user-004',
      shiftId: 'shift-003',
      senderName: 'Chika Eze',
      description: 'Grocery payment',
      amount: 127500,
      status: 'Successful',
      createdAt: '2026-11-02T11:30:00.000Z'
    },
    {
      id: 'txn-005',
      reference: 'TXN-981701',
      tillId: 'till-002',
      userId: 'user-004',
      shiftId: 'shift-003',
      senderName: 'Tola James',
      description: 'Store purchase',
      amount: 4500,
      status: 'Pending',
      createdAt: '2026-11-02T10:52:00.000Z'
    },
    {
      id: 'txn-006',
      reference: 'TXN-981698',
      tillId: 'till-002',
      userId: 'user-004',
      shiftId: 'shift-003',
      senderName: 'Unknown sender',
      description: 'Till payment',
      amount: 2500,
      status: 'Failed',
      createdAt: '2026-11-02T10:34:00.000Z'
    }
  ],
  sweeps: [
    {
      id: 'sweep-001',
      reference: 'SWP-2026-0149',
      tillId: 'till-001',
      userId: 'user-002',
      shiftId: 'shift-002',
      amount: 94200,
      openingBalance: 0,
      closingBalance: 94200,
      totalCollections: 94200,
      createdAt: '2026-11-03T14:00:00.000Z',
      closureType: 'Manual'
    },
    {
      id: 'sweep-002',
      reference: 'SWP-2026-0145',
      tillId: 'till-002',
      userId: 'user-004',
      shiftId: 'shift-003',
      amount: 127500,
      openingBalance: 0,
      closingBalance: 127500,
      totalCollections: 127500,
      createdAt: '2026-11-02T15:00:00.000Z',
      closureType: 'Automatic'
    }
  ]
};

const makeReference = (prefix: string, count: number) =>
  `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

export function activateTillUser(
  state: TillState,
  tillId: string,
  userId: string,
  now: Date = new Date()
): TillState {
  const account = state.accounts.find((item) => item.id === tillId);
  const user = state.users.find((item) => item.id === userId && item.tillId === tillId);
  const activeShift = state.shifts.find(
    (item) => item.tillId === tillId && item.status === 'Active'
  );

  if (!account || !user) throw new Error('Select a user assigned to this till account.');
  if (account.status !== 'Active') throw new Error('This till account is inactive.');
  if (account.activeUserId || activeShift) {
    const activeUser = state.users.find(
      (item) => item.id === (activeShift?.userId ?? account.activeUserId)
    );
    throw new Error(
      `${activeUser?.name ?? 'The current user'} is on an active shift. Close that shift before activating another user.`
    );
  }

  const shiftId = `shift-${Date.now()}`;
  const shift: TillShift = {
    id: shiftId,
    reference: makeReference('SHF', state.shifts.length + 42),
    tillId,
    userId,
    startAt: now.toISOString(),
    endAt: null,
    openingBalance: account.balance,
    closingBalance: null,
    totalCollections: 0,
    amountSwept: null,
    closureType: null,
    status: 'Active'
  };

  return {
    ...state,
    accounts: state.accounts.map((item) =>
      item.id === tillId ? { ...item, activeUserId: userId } : item
    ),
    shifts: [shift, ...state.shifts]
  };
}

export function recordTillPayment(
  state: TillState,
  tillId: string,
  amount: number,
  details: { senderName?: string; description?: string } = {},
  now: Date = new Date()
): TillState {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Enter a payment amount greater than zero.');
  }
  const account = state.accounts.find((item) => item.id === tillId);
  const activeShift = state.shifts.find(
    (item) => item.tillId === tillId && item.status === 'Active'
  );
  if (
    !account ||
    account.status !== 'Active' ||
    !activeShift ||
    account.activeUserId !== activeShift.userId
  ) {
    throw new Error('Activate an assigned user before recording a payment.');
  }

  const transaction: TillTransaction = {
    id: `txn-${Date.now()}`,
    reference: `TXN-${String(Date.now()).slice(-6)}`,
    tillId,
    userId: activeShift.userId,
    shiftId: activeShift.id,
    senderName: details.senderName?.trim() || 'Unknown sender',
    description: details.description?.trim() || 'Till payment',
    amount,
    status: 'Successful',
    createdAt: now.toISOString()
  };

  return {
    ...state,
    accounts: state.accounts.map((item) =>
      item.id === tillId ? { ...item, balance: item.balance + amount } : item
    ),
    shifts: state.shifts.map((item) =>
      item.id === activeShift.id
        ? { ...item, totalCollections: item.totalCollections + amount }
        : item
    ),
    transactions: [transaction, ...state.transactions]
  };
}

export function closeTillShift(
  state: TillState,
  tillId: string,
  closureType: ClosureType = 'Manual',
  now: Date = new Date()
): TillState {
  const account = state.accounts.find((item) => item.id === tillId);
  const activeShift = state.shifts.find(
    (item) => item.tillId === tillId && item.status === 'Active'
  );
  if (!account || !activeShift || !account.activeUserId) {
    throw new Error('There is no active shift to close for this till.');
  }

  const shift = {
    ...activeShift,
    endAt: now.toISOString(),
    closingBalance: account.balance,
    amountSwept: account.balance,
    closureType,
    status: 'Completed' as const
  };
  const sweep: TillSweep = {
    id: `sweep-${Date.now()}`,
    reference: makeReference('SWP', state.sweeps.length + 149),
    tillId,
    userId: activeShift.userId,
    shiftId: activeShift.id,
    amount: account.balance,
    openingBalance: activeShift.openingBalance,
    closingBalance: account.balance,
    totalCollections: activeShift.totalCollections,
    createdAt: now.toISOString(),
    closureType
  };

  return {
    ...state,
    accounts: state.accounts.map((item) =>
      item.id === tillId ? { ...item, balance: 0, activeUserId: null } : item
    ),
    shifts: state.shifts.map((item) => (item.id === shift.id ? shift : item)),
    sweeps: [sweep, ...state.sweeps]
  };
}

function getLagosDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

export function closeEndOfDayShifts(state: TillState, now: Date = new Date()): TillState {
  const localNow = getLagosDateParts(now);
  const localDate = `${localNow.year}-${localNow.month}-${localNow.day}`;
  const atOrAfterEndOfDay = Number(localNow.hour) === 23 && Number(localNow.minute) >= 59;
  let nextState = state;

  for (const shift of state.shifts) {
    if (shift.status !== 'Active') continue;
    const shiftDateParts = getLagosDateParts(new Date(shift.startAt));
    const shiftDate = `${shiftDateParts.year}-${shiftDateParts.month}-${shiftDateParts.day}`;
    if (localDate > shiftDate || (localDate === shiftDate && atOrAfterEndOfDay)) {
      nextState = closeTillShift(nextState, shift.tillId, 'Automatic', now);
    }
  }

  return nextState;
}
