'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  activateTillUser,
  closeEndOfDayShifts,
  closeTillShift,
  initialTillState,
  isTillState,
  recordTillPayment,
  TILL_STORAGE_KEY,
  type TillState
} from '../model';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const primaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-[5px] bg-[#009148] px-[40px] py-[20px] text-[14px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50';
const secondaryButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-[5px] border border-[#EBEBEB] bg-white px-[40px] py-[20px] text-[14px] font-semibold text-black transition hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-50';
const inputClass =
  'h-11 w-full rounded-[8px] border border-[#EBEBEB] bg-white px-3 text-sm text-black outline-none focus:border-[#009148] focus:ring-2 focus:ring-[#E5F4ED]';

const currency = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 2
});

function dateTime(value: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function shiftDuration(startAt: string, endAt: string | null) {
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
}

function StatePill({ children }: { children: string }) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-full border border-[#99D3B6] bg-[#E5F4ED] px-2.5 py-1 text-xs font-semibold text-[#009148]">
      {children}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="px-6 py-10 text-center text-sm text-[#A4A4A4]">
      <AlertCircle className="mx-auto mb-2 h-6 w-6" />
      {label}
    </div>
  );
}

export default function TillAccountDetailPage() {
  const params = useParams<{ tillId: string }>();
  const tillId = params.tillId;
  const [state, setState] = useState<TillState>(initialTillState);
  const [loaded, setLoaded] = useState(false);
  const [activationOpen, setActivationOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [closeShiftOpen, setCloseShiftOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentSenderName, setPaymentSenderName] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'sweeps' | 'transactions'>('users');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(TILL_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isTillState(parsed)) {
          setState(parsed);
        } else {
          toast.error('Saved till data has an invalid format.');
        }
      }
    } catch {
      toast.error('Till account details could not be loaded from this browser.');
    } finally {
      setLoaded(true);
    }
  }, []);

  const account = state.accounts.find((item) => item.id === tillId);
  const users = useMemo(
    () => state.users.filter((user) => user.tillId === tillId),
    [state.users, tillId]
  );
  const transactions = useMemo(
    () => state.transactions.filter((item) => item.tillId === tillId),
    [state.transactions, tillId]
  );
  const sweeps = useMemo(
    () => state.sweeps.filter((item) => item.tillId === tillId),
    [state.sweeps, tillId]
  );

  useEffect(() => {
    if (!loaded || !account) return;
    try {
      window.localStorage.setItem(TILL_STORAGE_KEY, JSON.stringify(state));
    } catch {
      toast.error('Till account details could not be saved in this browser.');
    }
  }, [account, loaded, state]);

  useEffect(() => {
    if (!loaded) return;
    const checkForEndOfDay = () => {
      const next = closeEndOfDayShifts(state);
      if (next === state) return;
      try {
        window.localStorage.setItem(TILL_STORAGE_KEY, JSON.stringify(next));
        setState(next);
        toast.success('An active shift was closed and swept automatically at end of day.');
      } catch {
        toast.error('The automatic end-of-day sweep could not be saved in this browser.');
      }
    };
    checkForEndOfDay();
    const intervalId = window.setInterval(checkForEndOfDay, 30_000);
    return () => window.clearInterval(intervalId);
  }, [loaded, state]);

  if (!account) {
    return (
      <main className="mx-auto max-w-[1400px] px-1 pb-10 sm:px-2">
        <Link
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#009148]"
          href="/till-accounts"
        >
          <ArrowLeft className="h-4 w-4" /> Back to till accounts
        </Link>
        <section className="mt-5 rounded-[10px] border-b-4 border-[#E5E7E9] bg-white">
          <EmptyState label="Till account not found." />
        </section>
      </main>
    );
  }

  const activeShift = state.shifts.find(
    (shift) => shift.tillId === tillId && shift.status === 'Active'
  );
  const activeUser = users.find((user) => user.id === account.activeUserId);

  const updateState = (operation: (current: TillState) => TillState, success: string) => {
    try {
      const next = operation(state);
      window.localStorage.setItem(TILL_STORAGE_KEY, JSON.stringify(next));
      setState(next);
      toast.success(success);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'The requested action could not be completed.'
      );
    }
  };

  const handlePayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(paymentAmount);
    updateState(
      (current) =>
        recordTillPayment(current, tillId, amount, {
          senderName: paymentSenderName,
          description: paymentDescription
        }),
      'Payment recorded for the active shift.'
    );
    setPaymentAmount('');
    setPaymentSenderName('');
    setPaymentDescription('');
    setPaymentOpen(false);
  };

  return (
    <main className="mx-auto w-full max-w-[1400px] space-y-5 px-1 pb-10 sm:px-2">
      <Link
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#009148]"
        href="/till-accounts"
      >
        <ArrowLeft className="h-4 w-4" /> Back to till accounts
      </Link>

      <section className="rounded-[10px] border-b-4 border-[#E5E7E9] bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-extrabold text-black">{account.name}</h1>
          <StatePill>{account.status}</StatePill>
        </div>
        <div className="mt-5 grid gap-4 border-t border-[#EBEBEB] pt-4 sm:grid-cols-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#A4A4A4]">Business</p>
            <p className="mt-1 truncate text-sm font-semibold text-black" title={account.business}>
              {account.business}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#A4A4A4]">Account number</p>
            <p className="mt-1 truncate text-sm font-semibold text-black" title={account.number}>
              {account.number}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#A4A4A4]">Date created</p>
            <p
              className="mt-1 truncate text-sm font-semibold text-black"
              title={dateTime(account.createdAt)}
            >
              {dateTime(account.createdAt)}
            </p>
          </div>
        </div>
      </section>

      {activeShift && (
        <section className="rounded-[10px] border-b-4 border-[#E5E7E9] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-black">Current shift</h2>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span>{activeShift.reference}</span>
                <span>{activeUser?.name ?? 'Unassigned'}</span>
                <span>Started {dateTime(activeShift.startAt)}</span>
                <StatePill>Active</StatePill>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className={primaryButton} onClick={() => setCloseShiftOpen(true)}>
                Close shift & sweep
              </button>
            </div>
          </div>
        </section>
      )}

      <Dialog open={activationOpen} onOpenChange={setActivationOpen}>
        <DialogContent className="rounded-[12px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Activate till user</DialogTitle>
            <DialogDescription>
              Only one user can operate this till at a time. This starts a new shift.
            </DialogDescription>
          </DialogHeader>
          <label className="block space-y-1.5 text-sm font-semibold">
            Assigned user
            <select
              className={inputClass}
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
          <DialogFooter>
            <button className={secondaryButton} onClick={() => setActivationOpen(false)}>
              Cancel
            </button>
            <button
              className={primaryButton}
              onClick={() => {
                updateState(
                  (current) => activateTillUser(current, tillId, selectedUserId),
                  'Till user activated. Shift started.'
                );
                setActivationOpen(false);
              }}
            >
              Start shift
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeShiftOpen} onOpenChange={setCloseShiftOpen}>
        <DialogContent className="rounded-[12px] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Deactivate active user and sweep balance?</DialogTitle>
            <DialogDescription>
              {activeUser?.name ?? 'The active user'}’s shift will be closed, the till balance
              swept, and the available balance reset to ₦0.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button className={secondaryButton} onClick={() => setCloseShiftOpen(false)}>
              Cancel
            </button>
            <button
              className={primaryButton}
              onClick={() => {
                updateState(
                  (current) => closeTillShift(current, tillId),
                  'Shift closed and balance swept.'
                );
                setCloseShiftOpen(false);
              }}
            >
              Deactivate user & sweep
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
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
            <DialogFooter>
              <button className={primaryButton} type="submit">
                Record payment
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <nav
        aria-label="Till account records"
        className="flex gap-2 overflow-x-auto border-b border-[#EBEBEB]"
        role="tablist"
      >
        {(
          [
            ['users', `Assigned users (${users.length})`],
            ['sweeps', `Sweep history (${sweeps.length})`],
            ['transactions', `Transaction history (${transactions.length})`]
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            id={`till-tab-${id}`}
            aria-controls={`till-panel-${id}`}
            aria-selected={activeTab === id}
            onClick={() => setActiveTab(id)}
            onKeyDown={(event) => {
              const tabs = ['users', 'sweeps', 'transactions'] as const;
              const currentIndex = tabs.indexOf(id);
              if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault();
                const direction = event.key === 'ArrowRight' ? 1 : -1;
                const nextTab = tabs[(currentIndex + direction + tabs.length) % tabs.length];
                setActiveTab(nextTab);
                document.getElementById(`till-tab-${nextTab}`)?.focus();
              }
            }}
            role="tab"
            tabIndex={activeTab === id ? 0 : -1}
            className={`min-h-11 shrink-0 border-b-2 px-4 text-sm font-semibold ${
              activeTab === id
                ? 'border-[#009148] text-[#009148]'
                : 'border-transparent text-[#A4A4A4] hover:text-black'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 'users' && (
        <section
          id="till-panel-users"
          aria-labelledby="till-tab-users"
          role="tabpanel"
          className="overflow-hidden rounded-[10px] border-b-4 border-[#E5E7E9] bg-white"
        >
          <div className="border-b border-[#EBEBEB] px-5 py-4">
            <h2 className="text-sm font-bold text-black">Assigned users ({users.length})</h2>
          </div>
          {users.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] whitespace-nowrap text-left text-sm">
                <thead className="bg-[#F7F7F7] text-xs font-bold text-black">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Username</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Date assigned</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr className="border-t border-[#EBEBEB]" key={user.id}>
                      <td className="max-w-[220px] truncate px-5 py-4" title={user.name}>
                        {user.name}
                      </td>
                      <td className="max-w-[220px] truncate px-5 py-4" title={user.username}>
                        {user.username}
                      </td>
                      <td className="max-w-[240px] truncate px-5 py-4" title={user.email}>
                        {user.email}
                      </td>
                      <td className="px-5 py-4">
                        {account.activeUserId === user.id ? (
                          <StatePill>Active</StatePill>
                        ) : (
                          'Inactive'
                        )}
                      </td>
                      <td className="px-5 py-4">{dateTime(user.createdAt)}</td>
                      <td className="px-5 py-4">
                        {account.activeUserId === user.id ? (
                          <button
                            className="font-semibold text-[#D64545] hover:underline"
                            onClick={() => setCloseShiftOpen(true)}
                          >
                            Deactivate user
                          </button>
                        ) : (
                          <button
                            className="font-semibold text-[#009148] hover:underline"
                            onClick={() => {
                              if (account.status !== 'Active') {
                                toast.error('Activate this till account before activating a user.');
                                return;
                              }
                              if (activeShift || account.activeUserId) {
                                toast.error(
                                  `${activeUser?.name ?? 'The current user'} is on an active shift. Deactivate that user and close the shift before activating another user.`
                                );
                                return;
                              }
                              setSelectedUserId(user.id);
                              setActivationOpen(true);
                            }}
                          >
                            Activate user
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState label="No users are assigned to this till account." />
          )}
        </section>
      )}

      {activeTab === 'sweeps' && (
        <section
          id="till-panel-sweeps"
          aria-labelledby="till-tab-sweeps"
          role="tabpanel"
          className="overflow-hidden rounded-[10px] border-b-4 border-[#E5E7E9] bg-white"
        >
          <div className="border-b border-[#EBEBEB] px-5 py-4">
            <h2 className="text-sm font-bold text-black">Sweep history ({sweeps.length})</h2>
          </div>
          {sweeps.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] whitespace-nowrap text-left text-sm">
                <thead className="bg-[#F7F7F7] text-xs font-bold text-black">
                  <tr>
                    <th className="px-5 py-4">Sweep reference</th>
                    <th className="px-5 py-4">User name</th>
                    <th className="px-5 py-4">Amount before shift</th>
                    <th className="px-5 py-4">Balance before sweep</th>
                    <th className="px-5 py-4">Collection during shift</th>
                    <th className="px-5 py-4">Sweep timestamp</th>
                    <th className="px-5 py-4">Sweep type</th>
                  </tr>
                </thead>
                <tbody>
                  {sweeps.map((sweep) => (
                    <tr className="border-t border-[#EBEBEB]" key={sweep.id}>
                      <td className="px-5 py-4">{sweep.reference}</td>
                      <td className="px-5 py-4">
                        {state.users.find((user) => user.id === sweep.userId)?.name ?? 'Unassigned'}
                      </td>
                      {(() => {
                        const shift = state.shifts.find((item) => item.id === sweep.shiftId);
                        return (
                          <>
                            <td className="px-5 py-4">
                              {currency.format(sweep.openingBalance ?? shift?.openingBalance ?? 0)}
                            </td>
                            <td className="px-5 py-4">
                              {currency.format(sweep.closingBalance ?? sweep.amount)}
                            </td>
                            <td className="px-5 py-4">
                              {currency.format(
                                sweep.totalCollections ?? shift?.totalCollections ?? 0
                              )}
                            </td>
                            <td className="px-5 py-4">
                              {shift
                                ? shiftDuration(shift.startAt, shift.endAt ?? sweep.createdAt)
                                : dateTime(sweep.createdAt)}
                            </td>
                          </>
                        );
                      })()}
                      <td className="px-5 py-4">
                        {sweep.closureType === 'Automatic' ? 'End of day auto sweep' : 'Manual'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState label="No sweeps have been recorded for this till." />
          )}
        </section>
      )}

      {activeTab === 'transactions' && (
        <section
          id="till-panel-transactions"
          aria-labelledby="till-tab-transactions"
          role="tabpanel"
          className="overflow-hidden rounded-[10px] border-b-4 border-[#E5E7E9] bg-white"
        >
          <div className="border-b border-[#EBEBEB] px-5 py-4">
            <h2 className="text-sm font-bold text-black">
              Transaction history ({transactions.length})
            </h2>
          </div>
          {transactions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] whitespace-nowrap text-left text-sm">
                <thead className="bg-[#F7F7F7] text-xs font-bold text-black">
                  <tr>
                    <th className="px-5 py-4">Reference</th>
                    <th className="px-5 py-4">Date and time</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Active user</th>
                    <th className="px-5 py-4">Sender name</th>
                    <th className="px-5 py-4">Description</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr className="border-t border-[#EBEBEB]" key={transaction.id}>
                      <td className="px-5 py-4">{transaction.reference}</td>
                      <td className="px-5 py-4">{dateTime(transaction.createdAt)}</td>
                      <td className="px-5 py-4 font-semibold [font-variant-numeric:tabular-nums]">
                        {currency.format(transaction.amount)}
                      </td>
                      <td className="px-5 py-4">
                        {state.users.find((user) => user.id === transaction.userId)?.name ??
                          'Unassigned'}
                      </td>
                      <td className="px-5 py-4">{transaction.senderName ?? 'Unknown sender'}</td>
                      <td className="px-5 py-4">{transaction.description ?? 'Till payment'}</td>
                      <td className="px-5 py-4">{transaction.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState label="No transactions have been recorded for this till." />
          )}
        </section>
      )}
    </main>
  );
}
