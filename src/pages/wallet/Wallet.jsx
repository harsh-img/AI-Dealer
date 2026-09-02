import React, { useState } from "react";
import walletData from "../../data/wallet.json";
import DataTable from "../../components/common/DataTable";
import ActionMenu from "../../components/common/ActionMenu";
import AddMoneyModal from "../../components/wallet/AddMoneyModal";
import TransactionDetailsModal from "../../components/wallet/TransactionDetailsModal";

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "successful":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Successful
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Pending
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Failed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
};

const Wallet = () => {
  const [summary, setSummary] = useState(walletData.summary || {});
  const [transactions, setTransactions] = useState(
    walletData.transactions || [],
  );
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Handle local state update when money is added via AddMoneyModal
  const handleAddMoneySuccess = (amount) => {
    const newTxn = {
      id: `TXN-${String(Date.now()).slice(-5)}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      type: "Credit",
      amount: Number(amount),
      description: "Wallet Recharge - Online Payment",
      status: "Successful",
      method: "UPI / Online Transfer",
    };

    setSummary((prev) => {
      const newBal = (prev.balance || 0) + Number(amount);
      return {
        ...prev,
        balance: newBal,
        totalAdded: (prev.totalAdded || 0) + Number(amount),
        estimatedRemainingMinutes: Math.round(
          newBal / (prev.ratePerMinute || 1.5),
        ),
      };
    });

    setTransactions((prev) => [newTxn, ...prev]);
  };

  // DataTable columns definition
  const columns = [
    {
      key: "date",
      label: "Date",
      render: (val) => (
        <span className="text-slate-600 font-medium whitespace-nowrap text-xs">
          {val}
        </span>
      ),
    },
    {
      key: "id",
      label: "Transaction ID",
      render: (val, row) => (
        <button
          type="button"
          onClick={() => setSelectedTransaction(row)}
          className="font-mono font-bold text-slate-900 hover:text-indigo-600 transition cursor-pointer"
        >
          {val}
        </button>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (val) => {
        const isCredit = val?.toLowerCase() === "credit";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
              isCredit
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {val}
          </span>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (val, row) => {
        const isCredit = row.type?.toLowerCase() === "credit";
        return (
          <span
            className={`font-bold ${
              isCredit ? "text-emerald-600" : "text-slate-900"
            }`}
          >
            {isCredit ? "+" : "-"}₹{Number(val || 0).toLocaleString()}
          </span>
        );
      },
    },
    {
      key: "description",
      label: "Description",
      render: (val) => (
        <span
          className="text-slate-700 font-medium line-clamp-1 max-w-xs sm:max-w-md"
          title={val}
        >
          {val}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => getStatusBadge(val),
    },
  ];

  const estimatedMins = Math.round(
    (summary.balance || 0) / (summary.ratePerMinute || 1.5),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-10">
      {/* 1. Page Header & Add Money Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Wallet & Billing
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Monitor real-time calling balance, usage breakdown, and billing
            transaction logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddMoneyOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <span>+ Add Money</span>
        </button>
      </div>

      {/* 2. Wallet Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Available Balance Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹
              {Number(summary.balance || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active & Ready for calls</span>
          </div>
        </div>

        {/* Total Added */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Added
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹{Number(summary.totalAdded || 0).toLocaleString("en-IN")}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Lifetime recharges credited
          </p>
        </div>

        {/* Total Used */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Used
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 13l-5 5m0 0l-5-5m5 5V6"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹{Number(summary.totalUsed || 0).toLocaleString("en-IN")}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Campaign & agent talk-time usage
          </p>
        </div>

        {/* Estimated Remaining Minutes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Remaining Talk-Time
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
              ~{estimatedMins.toLocaleString()}{" "}
              <span className="text-sm font-semibold text-slate-500">mins</span>
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Based on ₹{summary.ratePerMinute || 1.5}/min standard tariff
          </p>
        </div>
      </div>

      {/* 3. Transaction History DataTable */}
      <DataTable
        title="Transaction History"
        data={transactions}
        columns={columns}
        searchKeys={["id", "description", "type", "status"]}
        searchPlaceholder="Search by transaction ID, description..."
        statusFilter={{
          label: "STATUS",
          key: "status",
          options: [
            { label: "Successful", value: "Successful" },
            { label: "Pending", value: "Pending" },
            { label: "Failed", value: "Failed" },
          ],
        }}
        dropdownFilter={{
          label: "TYPE",
          key: "type",
          options: [
            { label: "All Types", value: "all" },
            { label: "Credit", value: "Credit" },
            { label: "Debit", value: "Debit" },
          ],
        }}
        showExport={true}
        exportFileName="wallet-transactions"
        actions={(row) => (
          <ActionMenu
            items={[
              {
                label: "View Details",
                icon: (
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ),
                onClick: () => setSelectedTransaction(row),
              },
            ]}
          />
        )}
        emptyState="No Transactions Found"
        pagination={{
          pageSize: 10,
        }}
      />

      {/* 4. Add Money Modal */}
      <AddMoneyModal
        open={isAddMoneyOpen}
        onClose={() => setIsAddMoneyOpen(false)}
        onAddSuccess={handleAddMoneySuccess}
      />

      {/* 5. Transaction Details Modal */}
      <TransactionDetailsModal
        open={Boolean(selectedTransaction)}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default Wallet;
