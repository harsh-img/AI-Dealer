import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  Calculator,
  Check,
  PhoneCall,
  DollarSign,
} from "lucide-react";

const Wallet = () => {
  const { wallet, topUpWallet, transferToVoip } = useApp();
  const [topUpAmount, setTopUpAmount] = useState("500");
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // VOIP Calculation State (Matches input_file_3.png requirement)
  const [calcCalls, setCalcCalls] = useState(5000);
  const [calcAvgMins, setCalcAvgMins] = useState(1.5);
  const [calcRatePerMin, setCalcRatePerMin] = useState(0.015);
  const [calcConcurrency, setCalcConcurrency] = useState(20);

  // Calculations
  const estimatedTotalMins = Math.round(calcCalls * calcAvgMins);
  const calculatedVoipNeed = (estimatedTotalMins * calcRatePerMin).toFixed(2);

  const handleTopUpSubmit = (e) => {
    e.preventDefault();
    if (!topUpAmount || Number(topUpAmount) <= 0) return;
    topUpWallet(Number(topUpAmount));
    setShowTopUpModal(false);
  };

  const handleAllocateToVoip = () => {
    const success = transferToVoip(Number(calculatedVoipNeed));
    if (success) {
      setTransferSuccess(true);
      setTimeout(() => setTransferSuccess(false), 2000);
    } else {
      alert("Insufficient wallet balance. Please top up your wallet first!");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Client Wallet & Balance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Self-service top-up wallet and carrier balance calculator.
          </p>
        </div>
        <button
          onClick={() => setShowTopUpModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Top Up Wallet Balance</span>
        </button>
      </div>

      {/* 1. WALLET SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Primary Wallet Balance (Blue Gradient with pure white text) */}
        <div className="p-6 rounded-xl bg-blue-600 text-white shadow-sm flex flex-col justify-between border border-blue-700">
          <div>
            <div className="flex items-center justify-between text-blue-100 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                PRIMARY CLIENT WALLET
              </span>
              <WalletIcon className="w-5 h-5 text-white" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-white tracking-tight">
                $
                {wallet.balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-blue-500/60 flex items-center justify-between text-xs text-blue-100">
            <span className="font-medium text-blue-100">Unified Balance</span>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-3 py-1 rounded bg-white text-blue-700 font-bold transition text-xs shadow-xs hover:bg-blue-50 cursor-pointer"
            >
              + Instant Add
            </button>
          </div>
        </div>

        {/* Card 2: VOIP Carrier Account Balance */}
        {/* <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">VOIP Account Trunk Balance</span>
              <PhoneCall className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                ${wallet.voipBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-4 pt-3 border-t border-slate-100">
            Allocated for active call minutes & SIP trunks.
          </p>
        </div> */}

        {/* Card 3: Standard VOIP Tariff */}
        {/* <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                VOIP Call Rate
              </span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                ${wallet.ratePerMin}
                <span className="text-xs font-semibold text-slate-500">
                  {" "}
                  / min
                </span>
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-4 pt-3 border-t border-slate-100">
            Standard outbound trunk rate per answered minute.
          </p>
        </div> */}
      </div>

      {/* 2. VOIP BALANCE CALCULATOR (Matches input_file_3.png requirement) */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Account Balance Calculator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculate exact account balance needed for upcoming campaign
              volumes.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            Auto Calculation
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Inputs (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Total Calls
                </label>
                <input
                  type="number"
                  value={calcCalls}
                  onChange={(e) => setCalcCalls(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Avg. Call Duration (minutes)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={calcAvgMins}
                  onChange={(e) => setCalcAvgMins(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Rate per Minute ($)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={calcRatePerMin}
                  onChange={(e) => setCalcRatePerMin(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Concurrent Lines Needed
                </label>
                <input
                  type="number"
                  value={calcConcurrency}
                  onChange={(e) => setCalcConcurrency(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right Summary & Action (Col 5) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                Calculation Output
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">Estimated Total Minutes:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {estimatedTotalMins.toLocaleString()} mins
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">Target Concurrency:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {calcConcurrency} lines
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-xs">
                    Required Balance:
                  </span>
                  <span className="text-2xl font-black text-blue-600 font-mono">
                    ${calculatedVoipNeed}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAllocateToVoip}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {transferSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Funds Allocated to VOIP!</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Allocate ${calculatedVoipNeed} to Account</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. TRANSACTIONS LOG TABLE */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Wallet Transactions History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wallet.transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 text-slate-600 font-mono font-medium">
                    {tx.date}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        tx.type === "Credit"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-800 font-semibold">
                    {tx.description}
                  </td>
                  <td className="p-3 text-right font-black font-mono text-slate-900 text-sm">
                    ${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Self Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Top Up Wallet Balance
            </h3>
            <form onSubmit={handleTopUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Amount ($)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {["100", "500", "1000"].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                        topUpAmount === amt
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(false)}
                  className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-xs cursor-pointer"
                >
                  Confirm Instant Top-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
