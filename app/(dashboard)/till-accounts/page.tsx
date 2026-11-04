'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Clock3, MoreVertical, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  closeEndOfDayShifts,
  closeTillShift,
  initialTillState,
  activateTillUser,
  isTillState,
  recordTillPayment,
  TILL_STORAGE_KEY,
  type ClosureType,
  type TillAccount,
  type TillState,
  type TillUser
} from './model';

type ViewTab = 'accounts' | 'transactions' | 'shifts' | 'sweeps';
type Filters = {
  search: string;
  tillId: string;
  userId: string;
  from: string;
  to: string;
  type: string;
};

const EMPTY_FILTERS: Filters = {
  search: '',
  tillId: 'all',
  userId: 'all',
  from: '',
  to: '',
  type: 'all'
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2
  }).format(value);

const formatDateTime = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat('en-NG', {
        timeZone: 'Africa/Lagos',
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(value))
    : '—';

const getLagosDate = (value: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date(value));
  const dateParts = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
};

const formatShiftDuration = (startAt: string, endAt: string | null) => {
  const start = new Date(startAt);
  const end = new Date(endAt ?? startAt);
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(start);
  const formatTime = (value: Date) =>
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Lagos',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
      .format(value)
      .replace(/\s/g, '')
      .toLowerCase();
  return `${date}, ${formatTime(start)} - ${formatTime(end)}`;
};

const normalize = (value: string) => value.trim().toLowerCase();
const inputClass =
  'h-11 w-full rounded-[8px] border border-[#EBEBEB] bg-white px-3 text-sm text-black outline-none placeholder:text-[#A4A4A4] focus:border-[#009148] focus:ring-2 focus:ring-[#E5F4ED]';
const primaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-[5px] bg-[#009148] px-[40px] py-[20px] text-[14px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50';
const secondaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-[5px] border border-[#EBEBEB] bg-white px-[40px] py-[20px] text-[14px] font-semibold text-black transition hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-50';

function getUserName(state: TillState, userId: string | null) {
  return state.users.find((user) => user.id === userId)?.name ?? 'Unassigned';
}

function getAccount(state: TillState, tillId: string) {
  return state.accounts.find((account) => account.id === tillId);
}

function getUser(state: TillState, userId: string) {
  return state.users.find((user) => user.id === userId);
}

function StatusPill({
  children,
  tone = 'neutral',
  showIcon = true
}: {
  children: string;
  tone?: 'neutral' | 'green' | 'amber';
  showIcon?: boolean;
}) {
  const styles = {
    neutral: 'border-[#EBEBEB] bg-[#F7F7F7] text-black',
    green: 'border-[#99D3B6] bg-[#E5F4ED] text-[#009148]',
    amber: 'border-[#FF9900] bg-[#FFF5E5] text-[#FF9900]'
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}
    >
      {showIcon && tone === 'green' && <CheckCircle2 className="h-3.5 w-3.5" />}
      {showIcon && tone === 'amber' && <Clock3 className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-[10px] border-b-4 border-[#E5E7E9] bg-white p-5">
      <p className="text-sm font-semibold text-[#A4A4A4]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-black [font-variant-numeric:tabular-nums]">
        {value}
      </p>
    </section>
  );
}

function FilterBar({
  filters,
  setFilters,
  accounts,
  users,
  typeMode,
  showTillAndDateFilters = true
}: {
  filters: Filters;
  setFilters: (next: Filters) => void;
  accounts: TillAccount[];
  users: TillUser[];
  typeMode?: 'closure' | 'status';
  showTillAndDateFilters?: boolean;
}) {
  const update = (key: keyof Filters, value: string) => setFilters({ ...filters, [key]: value });
  return (
    <div className="grid gap-3 border-b border-[#EBEBEB] p-4 sm:grid-cols-2 xl:grid-cols-6">
      <label className="relative sm:col-span-2 xl:col-span-2">
        <span className="sr-only">Search records</span>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A4A4A4]" />
        <input
          className={`${inputClass} pl-9`}
          placeholder="Search till, account number or user"
          value={filters.search}
          onChange={(event) => update('search', event.target.value)}
        />
      </label>
      {showTillAndDateFilters && (
        <label>
          <span className="sr-only">Filter by till account</span>
          <select
            className={inputClass}
            value={filters.tillId}
            onChange={(event) => update('tillId', event.target.value)}
          >
            <option value="all">All till accounts</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>
      )}
      <label>
        <span className="sr-only">Filter by assigned user</span>
        <select
          className={inputClass}
          value={filters.userId}
          onChange={(event) => update('userId', event.target.value)}
        >
          <option value="all">All users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>
      {showTillAndDateFilters && (
        <>
          <label>
            <span className="sr-only">Filter from date</span>
            <input
              aria-label="From date"
              className={inputClass}
              type="date"
              value={filters.from}
              onChange={(event) => update('from', event.target.value)}
            />
          </label>
          <div className="flex gap-2">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Filter to date</span>
              <input
                aria-label="To date"
                className={inputClass}
                type="date"
                value={filters.to}
                onChange={(event) => update('to', event.target.value)}
              />
            </label>
          </div>
        </>
      )}
      {typeMode && (
        <label>
          <span className="sr-only">
            {typeMode === 'status' ? 'Filter by transaction status' : 'Filter by closure type'}
          </span>
          <select
            className={inputClass}
            value={filters.type}
            onChange={(event) => update('type', event.target.value)}
          >
            <option value="all">All types</option>
            {typeMode === 'status' ? (
              <>
                <option value="Successful">Successful</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </>
            ) : (
              <>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                {typeMode === 'closure' && <option value="Active">Active</option>}
              </>
            )}
          </select>
        </label>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-6 py-12 text-center">
      <AlertCircle className="mx-auto h-8 w-8 text-[#A4A4A4]" />
      <p className="mt-3 text-sm font-semibold text-black">{message}</p>
      <p className="mt-1 text-xs text-[#A4A4A4]">Try changing your search or filters.</p>
    </div>
  );
}

function TableText({ value }: { value: string }) {
  return (
    <span className="block max-w-[220px] truncate" title={value} tabIndex={0}>
      {value}
    </span>
  );
}

export default function TillAccountsPage() {
  const router = useRouter();
  const [state, setState] = useState<TillState>(initialTillState);
  const stateRef = useRef(state);
  const isLoadedRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tab, setTab] = useState<ViewTab>('accounts');
  const [transactionShiftId, setTransactionShiftId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [isCreateTillOpen, setIsCreateTillOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [createUserTillId, setCreateUserTillId] = useState('');
  const [selectedTillId, setSelectedTillId] = useState<string | null>(null);
  const [activationTillId, setActivationTillId] = useState<string | null>(null);
  const [activationUserId, setActivationUserId] = useState('');
  const [closingTillId, setClosingTillId] = useState<string | null>(null);
  const [paymentTillId, setPaymentTillId] = useState<string | null>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentSenderName, setPaymentSenderName] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [accountName, setAccountName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const commit = useCallback(
    (operation: (current: TillState) => TillState, successMessage?: string) => {
      try {
        const next = operation(stateRef.current);
        stateRef.current = next;
        setState(next);
        if (successMessage) toast.success(successMessage);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'The requested action could not be completed.'
        );
      }
    },
    []
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(TILL_STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (isTillState(parsed)) {
          stateRef.current = parsed;
          setState(parsed);
        } else {
          toast.error(
            'Saved till data has an invalid format. Sample data is available for this session.'
          );
        }
      }
    } catch {
      toast.error(
        'Saved till data could not be loaded. The sample data is available for this session.'
      );
    } finally {
      isLoadedRef.current = true;
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(TILL_STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast.error('Till changes could not be saved in this browser.');
    }
  }, [isLoaded, state]);

  useEffect(() => {
    const checkForEndOfDay = () => {
      if (!isLoadedRef.current) return;
      const current = stateRef.current;
      const next = closeEndOfDayShifts(current);
      if (next !== current) {
        stateRef.current = next;
        setState(next);
        toast.success('An active shift was closed and swept automatically at end of day.');
      }
    };
    checkForEndOfDay();
    const intervalId = window.setInterval(checkForEndOfDay, 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const selectedTill = state.accounts.find((account) => account.id === selectedTillId) ?? null;
  const assignedUsers = (tillId: string) => state.users.filter((user) => user.tillId === tillId);

  const filteredAccounts = useMemo(
    () =>
      state.accounts.filter((account) => {
        const text = normalize(`${account.name} ${account.number} ${account.business}`);
        return (
          (!filters.search || text.includes(normalize(filters.search))) &&
          (filters.tillId === 'all' || account.id === filters.tillId) &&
          (filters.userId === 'all' || account.assignedUserIds.includes(filters.userId)) &&
          (!filters.type || filters.type === 'all')
        );
      }),
    [filters, state.accounts]
  );

  const matchesRecord = useCallback(
    (record: {
      tillId: string;
      userId: string;
      createdAt?: string;
      startAt?: string;
      endAt?: string | null;
      reference: string;
    }) => {
      const account = getAccount(state, record.tillId);
      const user = getUser(state, record.userId);
      const searchValue =
        `${record.reference} ${account?.name ?? ''} ${account?.number ?? ''} ${user?.name ?? ''}`.toLowerCase();
      const dateValue = record.createdAt ?? record.startAt ?? record.endAt;
      const date = dateValue ? getLagosDate(dateValue) : '';
      return (
        (!filters.search || searchValue.includes(normalize(filters.search))) &&
        (filters.tillId === 'all' || record.tillId === filters.tillId) &&
        (filters.userId === 'all' || record.userId === filters.userId) &&
        (!filters.from || date >= filters.from) &&
        (!filters.to || date <= filters.to)
      );
    },
    [filters, state]
  );
  const filteredTransactions = state.transactions.filter((transaction) =>
    matchesRecord(transaction)
  );
  const filteredStatusTransactions = filteredTransactions.filter(
    (transaction) =>
      (!transactionShiftId || transaction.shiftId === transactionShiftId) &&
      (filters.type === 'all' || transaction.status === filters.type)
  );
  const filteredShifts = state.shifts.filter(
    (shift) =>
      matchesRecord(shift) &&
      (filters.type === 'all' ||
        shift.closureType === filters.type ||
        (filters.type === 'Active' && shift.status === 'Active'))
  );
  const filteredSweeps = state.sweeps.filter(
    (sweep) =>
      matchesRecord(sweep) && (filters.type === 'all' || sweep.closureType === filters.type)
  );

  const handleCreateTill = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accountName.trim() || !businessName.trim()) {
      toast.error('Enter a till name and associated business.');
      return;
    }
    const account: TillAccount = {
      id: `till-${Date.now()}`,
      name: accountName.trim(),
      number: `31${String(Date.now()).slice(-8)}`,
      business: businessName.trim(),
      createdAt: new Date().toISOString(),
      status: 'Active',
      balance: 0,
      assignedUserIds: [],
      activeUserId: null
    };
    commit(
      (current) => ({ ...current, accounts: [account, ...current.accounts] }),
      'Till account created.'
    );
    setAccountName('');
    setBusinessName('');
    setIsCreateTillOpen(false);
    setSelectedTillId(account.id);
  };

  const handleCreateUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const till = getAccount(stateRef.current, createUserTillId);
    if (!till || !newUserName.trim() || !newUserEmail.trim()) {
      toast.error('Enter the user details and select a till account.');
      return;
    }
    const baseUsername = normalize(newUserName)
      .replace(/[^a-z0-9]+/g, '.')
      .replace(/^\.+|\.+$/g, '');
    const existing = new Set(stateRef.current.users.map((user) => user.username));
    let username = baseUsername || `till.user.${Date.now().toString().slice(-4)}`;
    let suffix = 1;
    while (existing.has(username)) {
      username = `${baseUsername}.${suffix}`;
      suffix += 1;
    }
    const randomBytes = new Uint32Array(2);
    window.crypto.getRandomValues(randomBytes);
    const password = `Till@${Array.from(randomBytes, (part) => part.toString(36))
      .join('')
      .slice(0, 8)}9!`;
    const user: TillUser = {
      id: `user-${Date.now()}`,
      name: newUserName.trim(),
      username,
      email: newUserEmail.trim(),
      tillId: till.id,
      createdAt: new Date().toISOString()
    };
    commit(
      (current) => ({
        ...current,
        users: [user, ...current.users],
        accounts: current.accounts.map((account) =>
          account.id === till.id
            ? { ...account, assignedUserIds: [...account.assignedUserIds, user.id] }
            : account
        )
      }),
      'Till user created and assigned.'
    );
    setNewUserName('');
    setNewUserEmail('');
    setIsCreateUserOpen(false);
    setGeneratedCredentials({ username, password });
  };

  const handlePayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!paymentTillId || !paymentAmount.trim()) {
      toast.error('Enter a payment amount.');
      return;
    }
    const amount = Number(paymentAmount);
    commit(
      (current) =>
        recordTillPayment(current, paymentTillId, amount, {
          senderName: paymentSenderName,
          description: paymentDescription
        }),
      'Payment recorded and attributed to the active shift.'
    );
    setPaymentAmount('');
    setPaymentSenderName('');
    setPaymentDescription('');
    setPaymentTillId(null);
  };

  const confirmShiftClosure = (closureType: ClosureType = 'Manual') => {
    if (!closingTillId) return;
    const tillId = closingTillId;
    commit(
      (current) => closeTillShift(current, tillId, closureType),
      closureType === 'Manual' ? 'Shift closed and balance swept.' : 'Shift closed automatically.'
    );
    setClosingTillId(null);
  };

  const handleUnassign = (user: TillUser) => {
    if (selectedTill?.activeUserId === user.id) {
      toast.error('Close this user’s active shift before removing their assignment.');
      return;
    }
    commit(
      (current) => ({
        ...current,
        users: current.users.map((item) =>
          item.id === user.id ? { ...item, tillId: null } : item
        ),
        accounts: current.accounts.map((account) =>
          account.id === user.tillId
            ? {
                ...account,
                assignedUserIds: account.assignedUserIds.filter((id) => id !== user.id)
              }
            : account
        )
      }),
      'Till user unassigned.'
    );
  };

  const renderFilters = (typeMode?: 'closure' | 'status', showTillAndDateFilters = true) => (
    <FilterBar
      filters={filters}
      setFilters={setFilters}
      accounts={state.accounts}
      users={state.users}
      typeMode={typeMode}
      showTillAndDateFilters={showTillAndDateFilters}
    />
  );

  const renderAccounts = () => (
    <section className="overflow-hidden rounded-[10px] border-b-4 border-[#E5E7E9] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBEBEB] px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-black">
            All till accounts ({filteredAccounts.length})
          </h2>
          <p className="mt-1 text-xs text-[#A4A4A4]">
            Manage till users, active shifts and collections.
          </p>
        </div>
      </div>
      {renderFilters(undefined, false)}
      {filteredAccounts.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] whitespace-nowrap text-left text-sm">
            <thead className="bg-[#F7F7F7] text-xs font-bold text-black">
              <tr>
                <th className="px-5 py-4">Till name</th>
                <th className="px-5 py-4">Date created</th>
                <th className="px-5 py-4">Account number</th>
                <th className="px-5 py-4">Business</th>
                <th className="px-5 py-4">Available balance</th>
                <th className="px-5 py-4">Assigned users</th>
                <th className="px-5 py-4">Status</th>
                <th className="sticky right-0 z-10 bg-[#F7F7F7] px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => {
                const activeUser = getUser(state, account.activeUserId ?? '');
                return (
                  <tr className="border-t border-[#EBEBEB] align-top" key={account.id}>
                    <td className="px-5 py-4">
                      <TableText value={account.name} />
                    </td>
                    <td className="px-5 py-4">
                      <TableText value={formatDateTime(account.createdAt)} />
                    </td>
                    <td className="px-5 py-4 font-medium [font-variant-numeric:tabular-nums]">
                      <TableText value={account.number} />
                    </td>
                    <td className="px-5 py-4">
                      <TableText value={account.business} />
                    </td>
                    <td className="px-5 py-4 font-semibold [font-variant-numeric:tabular-nums]">
                      <TableText value={formatCurrency(account.balance)} />
                    </td>
                    <td className="px-5 py-4">
                      <TableText
                        value={`${account.assignedUserIds.length} assigned · ${activeUser ? `Active: ${activeUser.name}` : 'No active shift'}`}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill
                        tone={account.status === 'Active' ? 'green' : 'neutral'}
                        showIcon={false}
                      >
                        {account.status}
                      </StatusPill>
                    </td>
                    <td className="sticky right-0 z-10 bg-white px-5 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            aria-label={`Actions for ${account.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-[5px] text-black hover:bg-[#F7F7F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009148]"
                            title="Actions"
                          >
                            <MoreVertical aria-hidden="true" className="h-5 w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[180px]">
                          <DropdownMenuItem
                            onSelect={() => router.push(`/till-accounts/${account.id}`)}
                          >
                            Manage till
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setCreateUserTillId(account.id);
                              setIsCreateUserOpen(true);
                            }}
                          >
                            Add user
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              if (account.activeUserId) {
                                toast.error(
                                  'Close the active shift before deactivating this till account.'
                                );
                                return;
                              }
                              commit(
                                (current) => ({
                                  ...current,
                                  accounts: current.accounts.map((item) =>
                                    item.id === account.id
                                      ? {
                                          ...item,
                                          status: item.status === 'Active' ? 'Inactive' : 'Active'
                                        }
                                      : item
                                  )
                                }),
                                account.status === 'Active'
                                  ? 'Till account deactivated.'
                                  : 'Till account activated.'
                              );
                            }}
                          >
                            {account.status === 'Active' ? 'Deactivate till' : 'Activate till'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No till accounts found" />
      )}
    </section>
  );

  const renderTransactions = () => (
    <section className="overflow-hidden rounded-[10px] border-b-4 border-[#E5E7E9] bg-white">
      <div className="border-b border-[#EBEBEB] px-5 py-4">
        <h2 className="text-sm font-bold text-black">
          Transaction history ({filteredTransactions.length})
        </h2>
        <p className="mt-1 text-xs text-[#A4A4A4]">
          Transactions are attributed to the active till user when received.
        </p>
      </div>
      {renderFilters('status')}
      {filteredStatusTransactions.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] whitespace-nowrap text-left text-sm">
            <thead className="bg-[#F7F7F7] text-xs font-bold text-black">
              <tr>
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Date and time</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Till account</th>
                <th className="px-5 py-4">Active user</th>
                <th className="px-5 py-4">Sender name</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStatusTransactions.map((transaction) => (
                <tr className="border-t border-[#EBEBEB]" key={transaction.id}>
                  <td className="px-5 py-4 font-semibold">
                    <TableText value={transaction.reference} />
                  </td>
                  <td className="px-5 py-4">
                    <TableText value={formatDateTime(transaction.createdAt)} />
                  </td>
                  <td className="px-5 py-4 font-semibold [font-variant-numeric:tabular-nums]">
                    <TableText value={formatCurrency(transaction.amount)} />
                  </td>
                  <td className="px-5 py-4">
                    <TableText value={getAccount(state, transaction.tillId)?.name ?? ''} />
                  </td>
                  <td className="px-5 py-4">
                    <TableText value={getUserName(state, transaction.userId)} />
                  </td>
                  <td className="px-5 py-4">
                    <TableText value={transaction.senderName ?? 'Unknown sender'} />
                  </td>
                  <td className="px-5 py-4">
                    <TableText value={transaction.description ?? 'Till payment'} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill
                      tone={
                        transaction.status === 'Successful'
                          ? 'green'
                          : transaction.status === 'Pending'
                            ? 'amber'
                            : 'neutral'
                      }
                    >
                      {transaction.status}
                    </StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No transactions found" />
      )}
    </section>
  );

  const renderShifts = () => (
    <section className="overflow-hidden rounded-[10px] border-b-4 border-[#E5E7E9] bg-white">
      <div className="border-b border-[#EBEBEB] px-5 py-4">
        <h2 className="text-sm font-bold text-black">Shift history ({filteredShifts.length})</h2>
        <p className="mt-1 text-xs text-[#A4A4A4]">
          Inspect active and completed collection periods.
        </p>
      </div>
      {renderFilters('closure')}
      {filteredShifts.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] whitespace-nowrap text-left text-sm">
            <thead className="bg-[#F7F7F7] text-xs font-bold text-black">
              <tr>
                <th className="px-5 py-4">Shift reference</th>
                <th className="px-5 py-4">Till / user</th>
                <th className="px-5 py-4">Start / end</th>
                <th className="px-5 py-4">Opening balance</th>
                <th className="px-5 py-4">Closing balance</th>
                <th className="px-5 py-4">Collections</th>
                <th className="px-5 py-4">Swept</th>
                <th className="px-5 py-4">Closure / status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredShifts.map((shift) => (
                <tr className="border-t border-[#EBEBEB]" key={shift.id}>
                  <td className="px-5 py-4 font-semibold">
                    <TableText value={shift.reference} />
                  </td>
                  <td className="px-5 py-4">
                    <TableText
                      value={`${getAccount(state, shift.tillId)?.name ?? ''} · ${getUserName(state, shift.userId)}`}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <TableText value={formatShiftDuration(shift.startAt, shift.endAt)} />
                  </td>
                  <td className="px-5 py-4 [font-variant-numeric:tabular-nums]">
                    <TableText value={formatCurrency(shift.openingBalance)} />
                  </td>
                  <td className="px-5 py-4 [font-variant-numeric:tabular-nums]">
                    <TableText
                      value={
                        shift.closingBalance === null ? '—' : formatCurrency(shift.closingBalance)
                      }
                    />
                  </td>
                  <td className="px-5 py-4 [font-variant-numeric:tabular-nums]">
                    <TableText value={formatCurrency(shift.totalCollections)} />
                  </td>
                  <td className="px-5 py-4 [font-variant-numeric:tabular-nums]">
                    <TableText
                      value={shift.amountSwept === null ? '—' : formatCurrency(shift.amountSwept)}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div
                      className="flex items-center gap-2"
                      title={`${shift.closureType ?? '—'} · ${shift.status}`}
                      tabIndex={0}
                    >
                      <span>{shift.closureType ?? '—'}</span>
                      <StatusPill tone={shift.status === 'Active' ? 'amber' : 'green'}>
                        {shift.status}
                      </StatusPill>
                    </div>
                  </td>
                  <td className="sticky right-0 z-10 bg-white px-5 py-4">
                    <button
                      className="whitespace-nowrap font-semibold text-[#009148] underline"
                      title="View transactions for this shift"
                      onClick={() => {
                        setTransactionShiftId(shift.id);
                        setTab('transactions');
                        setFilters({
                          ...EMPTY_FILTERS,
                          tillId: shift.tillId,
                          userId: shift.userId
                        });
                      }}
                    >
                      Transactions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No shifts found" />
      )}
    </section>
  );

  const renderSweeps = () => (
    <section className="overflow-hidden rounded-[10px] border-b-4 border-[#E5E7E9] bg-white">
      <div className="border-b border-[#EBEBEB] px-5 py-4">
        <h2 className="text-sm font-bold text-black">Sweep history ({filteredSweeps.length})</h2>
        <p className="mt-1 text-xs text-[#A4A4A4]">
          A permanent record of manual and automatic shift closures.
        </p>
      </div>
      {renderFilters('closure')}
      {filteredSweeps.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] whitespace-nowrap text-left text-sm">
            <thead className="bg-[#F7F7F7] text-xs font-bold text-black">
              <tr>
                <th className="px-5 py-4">Sweep reference</th>
                <th className="px-5 py-4">Till account</th>
                <th className="px-5 py-4">User name</th>
                <th className="px-5 py-4">Amount before shift</th>
                <th className="px-5 py-4">Balance before sweep</th>
                <th className="px-5 py-4">Collection during shift</th>
                <th className="px-5 py-4">Sweep timestamp</th>
                <th className="px-5 py-4">Sweep type</th>
              </tr>
            </thead>
            <tbody>
              {filteredSweeps.map((sweep) => {
                const shift = state.shifts.find((item) => item.id === sweep.shiftId);
                return (
                  <tr className="border-t border-[#EBEBEB]" key={sweep.id}>
                    <td className="px-5 py-4">
                      <TableText value={sweep.reference} />
                    </td>
                    <td className="px-5 py-4">
                      <TableText
                        value={`${getAccount(state, sweep.tillId)?.name ?? ''} · ${getAccount(state, sweep.tillId)?.number ?? ''}`}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <TableText value={getUserName(state, sweep.userId)} />
                    </td>
                    <td className="px-5 py-4">
                      <TableText
                        value={formatCurrency(sweep.openingBalance ?? shift?.openingBalance ?? 0)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <TableText value={formatCurrency(sweep.closingBalance ?? sweep.amount)} />
                    </td>
                    <td className="px-5 py-4">
                      <TableText
                        value={formatCurrency(
                          sweep.totalCollections ?? shift?.totalCollections ?? 0
                        )}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <TableText
                        value={
                          shift
                            ? formatShiftDuration(shift.startAt, shift.endAt ?? sweep.createdAt)
                            : formatDateTime(sweep.createdAt)
                        }
                      />
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill tone={sweep.closureType === 'Automatic' ? 'amber' : 'green'}>
                        {sweep.closureType === 'Automatic' ? 'End of day auto sweep' : 'Manual'}
                      </StatusPill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No sweep records found" />
      )}
    </section>
  );

  const activeUsers = activationTillId ? assignedUsers(activationTillId) : [];
  const shiftToClose = closingTillId
    ? state.shifts.find((shift) => shift.tillId === closingTillId && shift.status === 'Active')
    : null;
  const userToClose = shiftToClose ? getUser(state, shiftToClose.userId) : undefined;
  const closingAccount = closingTillId ? getAccount(state, closingTillId) : undefined;
  const activeTillTransactions = selectedTill
    ? state.transactions.filter((transaction) => transaction.tillId === selectedTill.id)
    : [];

  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-5 px-1 pb-10 sm:px-2">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-[#009148]">Operations / Till management</p>
          <h1 className="mt-1 text-lg font-extrabold text-black">Till accounts</h1>
          <p className="mt-1 text-sm text-[#A4A4A4]">
            Manage tills, collection shifts and balance sweeps.
          </p>
        </div>
        <button className={primaryButton} onClick={() => setIsCreateTillOpen(true)}>
          <Plus className="h-4 w-4" /> Create till account
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Till accounts" value={String(state.accounts.length)} />
        <MetricCard
          label="Assigned users"
          value={String(state.users.filter((user) => user.tillId).length)}
        />
        <MetricCard
          label="Active shifts"
          value={String(state.shifts.filter((shift) => shift.status === 'Active').length)}
        />
        <MetricCard
          label="Total swept"
          value={formatCurrency(state.sweeps.reduce((total, sweep) => total + sweep.amount, 0))}
        />
      </div>

      <p className="text-xs text-[#A4A4A4]">
        Any shift left open at 11:59 PM Africa/Lagos is automatically closed and swept.
      </p>

      <nav
        aria-label="Till management views"
        className="flex gap-2 overflow-x-auto border-b border-[#EBEBEB]"
      >
        {(
          [
            ['accounts', 'Till accounts'],
            ['transactions', 'Transactions'],
            ['shifts', 'Shift history'],
            ['sweeps', 'Sweep history']
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => {
              setTab(id);
              setTransactionShiftId(null);
              setFilters(EMPTY_FILTERS);
            }}
            className={`min-h-11 shrink-0 border-b-2 px-4 text-sm font-semibold ${
              tab === id
                ? 'border-[#009148] text-[#009148]'
                : 'border-transparent text-[#A4A4A4] hover:text-black'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === 'accounts' && renderAccounts()}
      {tab === 'transactions' && renderTransactions()}
      {tab === 'shifts' && renderShifts()}
      {tab === 'sweeps' && renderSweeps()}

      <Dialog open={isCreateTillOpen} onOpenChange={setIsCreateTillOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[12px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create till account</DialogTitle>
            <DialogDescription>
              Add a collection till for a business. Its shift balance starts at ₦0.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateTill}>
            <label className="block space-y-1.5 text-sm font-semibold">
              Till name
              <input
                className={inputClass}
                value={accountName}
                onChange={(event) => setAccountName(event.target.value)}
                placeholder="e.g. Lekki Station"
                required
              />
            </label>
            <label className="block space-y-1.5 text-sm font-semibold">
              Associated business
              <input
                className={inputClass}
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Business name"
                required
              />
            </label>
            <p className="text-xs text-[#A4A4A4]">
              A unique account number will be generated when the till is created.
            </p>
            <DialogFooter>
              <button className={primaryButton} type="submit">
                Create till
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[12px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create till user</DialogTitle>
            <DialogDescription>
              Login credentials are generated once and shown after creation.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateUser}>
            <label className="block space-y-1.5 text-sm font-semibold">
              Full name
              <input
                className={inputClass}
                value={newUserName}
                onChange={(event) => setNewUserName(event.target.value)}
                placeholder="Full name"
                required
              />
            </label>
            <label className="block space-y-1.5 text-sm font-semibold">
              Email address
              <input
                className={inputClass}
                type="email"
                value={newUserEmail}
                onChange={(event) => setNewUserEmail(event.target.value)}
                placeholder="user@business.com"
                required
              />
            </label>
            <label className="block space-y-1.5 text-sm font-semibold">
              Assigned till
              <select
                className={inputClass}
                value={createUserTillId}
                onChange={(event) => setCreateUserTillId(event.target.value)}
                required
              >
                <option value="">Select a till account</option>
                {state.accounts
                  .filter(
                    (account) => account.status === 'Active' || account.id === createUserTillId
                  )
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} · {account.number}
                    </option>
                  ))}
              </select>
            </label>
            <p className="text-xs text-[#A4A4A4]">
              The user will not be able to collect payments until activated for a shift.
            </p>
            <DialogFooter>
              <button className={primaryButton} type="submit">
                Create user
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!activationTillId}
        onOpenChange={(open) => {
          if (!open) setActivationTillId(null);
        }}
      >
        <DialogContent className="rounded-[12px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Activate till user</DialogTitle>
            <DialogDescription>
              Starting this shift gives the selected user exclusive collection access to the till.
            </DialogDescription>
          </DialogHeader>
          <label className="block space-y-1.5 text-sm font-semibold">
            Assigned user
            <select
              className={inputClass}
              value={activationUserId}
              onChange={(event) => setActivationUserId(event.target.value)}
            >
              {activeUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-[8px] bg-[#F7F7F7] p-3 text-sm text-black">
            The shift will start with the till’s current available balance of{' '}
            {formatCurrency(
              activationTillId ? (getAccount(state, activationTillId)?.balance ?? 0) : 0
            )}
            .
          </div>
          <DialogFooter>
            <button className={secondaryButton} onClick={() => setActivationTillId(null)}>
              Cancel
            </button>
            <button
              className={primaryButton}
              onClick={() => {
                if (!activationTillId || !activationUserId) return;
                const tillId = activationTillId;
                commit(
                  (current) => activateTillUser(current, tillId, activationUserId),
                  'Till user activated. Shift started.'
                );
                setActivationTillId(null);
              }}
            >
              Start shift
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!closingTillId}
        onOpenChange={(open) => {
          if (!open) setClosingTillId(null);
        }}
      >
        <DialogContent className="rounded-[12px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Close shift and sweep balance?</DialogTitle>
            <DialogDescription>
              This action closes the current user’s shift and makes the till available for another
              assigned user.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-[8px] border border-[#EBEBEB] p-4 text-sm">
            <p>
              <span className="text-[#A4A4A4]">Till user</span>
              <span className="float-right font-semibold">{userToClose?.name ?? '—'}</span>
            </p>
            <p className="mt-3">
              <span className="text-[#A4A4A4]">Available balance to sweep</span>
              <span className="float-right font-semibold [font-variant-numeric:tabular-nums]">
                {formatCurrency(closingAccount?.balance ?? 0)}
              </span>
            </p>
          </div>
          <p className="text-xs text-[#A4A4A4]">
            The swept amount is recorded in history and the available till balance resets to ₦0.
          </p>
          <DialogFooter>
            <button className={secondaryButton} onClick={() => setClosingTillId(null)}>
              Keep shift open
            </button>
            <button className={primaryButton} onClick={() => confirmShiftClosure()}>
              Confirm close & sweep
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!paymentTillId}
        onOpenChange={(open) => {
          if (!open) setPaymentTillId(null);
        }}
      >
        <DialogContent className="rounded-[12px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record a till payment</DialogTitle>
            <DialogDescription>
              The payment will be attributed to the active user and shift.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handlePayment}>
            <label className="block space-y-1.5 text-sm font-semibold">
              Payment amount (₦)
              <input
                className={inputClass}
                type="number"
                min="0.01"
                step="0.01"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                placeholder="0.00"
                required
              />
            </label>
            <label className="block space-y-1.5 text-sm font-semibold">
              Sender name
              <input
                className={inputClass}
                value={paymentSenderName}
                onChange={(event) => setPaymentSenderName(event.target.value)}
                placeholder="Enter sender name"
              />
            </label>
            <label className="block space-y-1.5 text-sm font-semibold">
              Description
              <input
                className={inputClass}
                value={paymentDescription}
                onChange={(event) => setPaymentDescription(event.target.value)}
                placeholder="Add payment description"
              />
            </label>
            {paymentTillId && (
              <p className="text-xs text-[#A4A4A4]">
                Active operator:{' '}
                {getUserName(state, getAccount(state, paymentTillId)?.activeUserId ?? null)}
              </p>
            )}
            <DialogFooter>
              <button className={primaryButton} type="submit">
                Record payment
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedTillId}
        onOpenChange={(open) => {
          if (!open) setSelectedTillId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[12px] sm:max-w-2xl">
          {selectedTill && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTill.name}</DialogTitle>
                <DialogDescription>
                  {selectedTill.business} · {selectedTill.number}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 rounded-[8px] bg-[#F7F7F7] p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-[#A4A4A4]">Available balance</p>
                  <p className="mt-1 font-bold [font-variant-numeric:tabular-nums]">
                    {formatCurrency(selectedTill.balance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#A4A4A4]">Created</p>
                  <p className="mt-1 font-semibold">{formatDateTime(selectedTill.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#A4A4A4]">Status</p>
                  <div className="mt-1">
                    <StatusPill tone={selectedTill.status === 'Active' ? 'green' : 'neutral'}>
                      {selectedTill.status}
                    </StatusPill>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold">
                  Assigned users ({assignedUsers(selectedTill.id).length})
                </h3>
                <button
                  className={secondaryButton}
                  onClick={() => {
                    setCreateUserTillId(selectedTill.id);
                    setSelectedTillId(null);
                    setIsCreateUserOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" /> Add user
                </button>
              </div>
              {assignedUsers(selectedTill.id).length ? (
                <div className="divide-y divide-[#EBEBEB] rounded-[8px] border border-[#EBEBEB]">
                  {assignedUsers(selectedTill.id).map((user) => (
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 p-3"
                      key={user.id}
                    >
                      <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-[#A4A4A4]">
                          {user.username} · {user.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusPill
                          tone={selectedTill.activeUserId === user.id ? 'green' : 'neutral'}
                        >
                          {selectedTill.activeUserId === user.id ? 'Active' : 'Inactive'}
                        </StatusPill>
                        {selectedTill.activeUserId !== user.id && (
                          <button
                            className="text-xs font-semibold text-[#009148] underline"
                            onClick={() => handleUnassign(user)}
                          >
                            Unassign
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState message="No users assigned to this till" />
              )}
              <div>
                <h3 className="mb-2 font-bold">
                  Recent transactions ({activeTillTransactions.length})
                </h3>
                {activeTillTransactions.length ? (
                  <div className="space-y-2">
                    {activeTillTransactions.slice(0, 4).map((transaction) => (
                      <div
                        className="flex flex-wrap justify-between gap-2 rounded-[8px] border border-[#EBEBEB] p-3 text-sm"
                        key={transaction.id}
                      >
                        <div>
                          <p className="font-semibold">{transaction.reference}</p>
                          <p className="text-xs text-[#A4A4A4]">
                            {getUserName(state, transaction.userId)} ·{' '}
                            {formatDateTime(transaction.createdAt)}
                          </p>
                        </div>
                        <p className="font-semibold [font-variant-numeric:tabular-nums]">
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#A4A4A4]">No transactions recorded for this till.</p>
                )}
              </div>
              <DialogFooter>
                <button
                  className={secondaryButton}
                  onClick={() => {
                    if (selectedTill.activeUserId) {
                      toast.error('Close the active shift before deactivating this till account.');
                      return;
                    }
                    commit(
                      (current) => ({
                        ...current,
                        accounts: current.accounts.map((account) =>
                          account.id === selectedTill.id
                            ? {
                                ...account,
                                status: account.status === 'Active' ? 'Inactive' : 'Active'
                              }
                            : account
                        )
                      }),
                      selectedTill.status === 'Active'
                        ? 'Till account deactivated.'
                        : 'Till account activated.'
                    );
                  }}
                >
                  {selectedTill.status === 'Active' ? 'Deactivate till' : 'Activate till'}
                </button>
                <button className={primaryButton} onClick={() => setSelectedTillId(null)}>
                  Done
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!generatedCredentials}
        onOpenChange={(open) => {
          if (!open) setGeneratedCredentials(null);
        }}
      >
        <DialogContent className="rounded-[12px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Till user created</DialogTitle>
            <DialogDescription>
              Share these default login credentials securely. The password will not be shown again.
            </DialogDescription>
          </DialogHeader>
          {generatedCredentials && (
            <div className="space-y-3 rounded-[8px] bg-[#F7F7F7] p-4 text-sm">
              <p>
                <span className="text-[#A4A4A4]">Username</span>
                <span className="float-right font-semibold">{generatedCredentials.username}</span>
              </p>
              <p>
                <span className="text-[#A4A4A4]">Temporary password</span>
                <span className="float-right font-semibold">{generatedCredentials.password}</span>
              </p>
            </div>
          )}
          <DialogFooter>
            <button className={primaryButton} onClick={() => setGeneratedCredentials(null)}>
              Done
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
