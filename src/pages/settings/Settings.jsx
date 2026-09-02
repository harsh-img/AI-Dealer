import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Building2, Mail, Phone, Globe, MapPin, Check, Save } from "lucide-react";
import initialSettings from "../../data/settings.json";

const Settings = () => {
  const [successMessage, setSuccessMessage] = useState("");

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  };

  // General Settings Formik
  const generalFormik = useFormik({
    initialValues: {
      companyName: initialSettings.general?.companyName || "AI Dialer Technologies Inc.",
      email: initialSettings.general?.email || "admin@aidialer.com",
      phone: initialSettings.general?.phone || "+1 (555) 890-1234",
      website: initialSettings.general?.website || "https://aidialer.com",
      timezone: initialSettings.general?.timezone || "EST (Eastern Standard Time)",
      address: initialSettings.general?.address || "100 Innovation Way, Suite 400, San Francisco, CA",
    },
    validationSchema: Yup.object({
      companyName: Yup.string()
        .trim()
        .min(2, "Company Name must be at least 2 characters")
        .required("Company Name is required"),
      email: Yup.string()
        .trim()
        .email("Please enter a valid email address")
        .required("Email address is required"),
      phone: Yup.string().trim().required("Phone Number is required"),
    }),
    onSubmit: (values) => {
      console.log("Saved General Settings:", values);
      showSuccess("Organization settings updated successfully!");
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* 1. Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          General Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Manage your business profile information, company contact details, and organization identity.
        </p>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs font-semibold text-emerald-800 animate-in fade-in duration-200 shadow-xs">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2. Organization Information Card */}
      <form onSubmit={generalFormik.handleSubmit} className="space-y-6">
        <div className="dashboard-card p-6 sm:p-7 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Organization Information
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your business contact details and organization identity.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Company Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="companyName"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                name="companyName"
                placeholder="e.g. AI Dialer Technologies Inc."
                value={generalFormik.values.companyName}
                onChange={generalFormik.handleChange}
                onBlur={generalFormik.handleBlur}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                  generalFormik.touched.companyName &&
                  generalFormik.errors.companyName
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              {generalFormik.touched.companyName &&
                generalFormik.errors.companyName && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">
                    {generalFormik.errors.companyName}
                  </p>
                )}
            </div>

            {/* Primary Contact Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                Primary Contact Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="admin@aidialer.com"
                value={generalFormik.values.email}
                onChange={generalFormik.handleChange}
                onBlur={generalFormik.handleBlur}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                  generalFormik.touched.email && generalFormik.errors.email
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              {generalFormik.touched.email && generalFormik.errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {generalFormik.errors.email}
                </p>
              )}
            </div>

            {/* Contact Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                Contact Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="+1 (555) 890-1234"
                value={generalFormik.values.phone}
                onChange={generalFormik.handleChange}
                onBlur={generalFormik.handleBlur}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                  generalFormik.touched.phone && generalFormik.errors.phone
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
              {generalFormik.touched.phone && generalFormik.errors.phone && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {generalFormik.errors.phone}
                </p>
              )}
            </div>

            {/* Website URL */}
            <div>
              <label
                htmlFor="website"
                className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                Company Website
              </label>
              <input
                id="website"
                type="text"
                name="website"
                placeholder="https://aidialer.com"
                value={generalFormik.values.website}
                onChange={generalFormik.handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            {/* Timezone */}
            <div>
              <label
                htmlFor="timezone"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Default System Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={generalFormik.values.timezone}
                onChange={generalFormik.handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="EST (Eastern Standard Time)">EST (Eastern Standard Time - US)</option>
                <option value="CST (Central Standard Time)">CST (Central Standard Time - US)</option>
                <option value="PST (Pacific Standard Time)">PST (Pacific Standard Time - US)</option>
                <option value="IST (India Standard Time)">IST (India Standard Time - UTC+5:30)</option>
                <option value="GMT (Greenwich Mean Time)">GMT (London / UK)</option>
              </select>
            </div>

            {/* Office Address */}
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Office Address (Optional)
              </label>
              <input
                id="address"
                type="text"
                name="address"
                placeholder="100 Innovation Way, Suite 400, San Francisco, CA"
                value={generalFormik.values.address}
                onChange={generalFormik.handleChange}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={generalFormik.isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
