"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useAuth } from "@/contexts/auth-context";
import { getVendorDashboard, uploadKycDocumentFileApi } from "@/lib/api";
import { useEffect, useState, useRef } from "react";

interface KycDoc {
  id: number;
  document_type: string;
  document_url: string;
  status: "submitted" | "verified" | "rejected";
  created_at: string;
}

const DOC_TYPES: Record<string, string> = {
  gst_certificate: "GST Certificate",
  trade_license: "Trade License",
  pan_card: "PAN Card",
  aadhar: "Aadhar Card",
  bank_statement: "Bank Statement",
};

export default function VendorKycPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("gst_certificate");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStatus = () => {
    if (!user) return;
    setLoading(true);
    getVendorDashboard(user.vendor_id ?? 0)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, [user]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.vendor_id || !selectedFile) {
      setError("Please select a document type and file to upload.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await uploadKycDocumentFileApi(user.vendor_id, docType, selectedFile);
      setSuccess("Document submitted successfully. Our team will review it shortly.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchStatus();
    } catch (err: any) {
      setError(err?.message ?? "Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const vendor = (data?.vendor ?? {}) as Record<string, any>;
  const docs = (vendor.kyc_documents ?? []) as KycDoc[];
  const kycStatus = String(vendor.kyc_status ?? "pending").toLowerCase();

  return (
    <DashboardGuard requiredRole="vendor">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-dark dark:text-white bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              🛡️ Business KYC Verification
            </h1>
            <p className="text-sm text-dark-4 dark:text-dark-6 mt-1">
              Verify your business details to unlock wholesale catalog privileges and full trade tools.
            </p>
          </div>
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                kycStatus === "verified" || kycStatus === "approved"
                  ? "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200/50"
                  : kycStatus === "rejected"
                  ? "bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200/50"
                  : "bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200/50"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${
                kycStatus === "verified" || kycStatus === "approved" ? "bg-green-500" : kycStatus === "rejected" ? "bg-red-500" : "bg-yellow-500"
              }`} />
              KYC Status: {kycStatus}
            </span>
          </div>
        </div>

        {kycStatus === "rejected" && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50 p-4 text-sm text-red-800 dark:text-red-300">
            <h3 className="font-bold text-red-900 dark:text-red-400 mb-1">⚠️ KYC Verification Rejected</h3>
            <p>Please review the uploaded documents and re-upload the correct details. Reason: {data?.approval?.rejection_reason ?? "Invalid document format or details."}</p>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-stroke dark:border-dark-3 bg-white p-6 shadow-sm dark:bg-gray-dark">
                <h2 className="text-xl font-bold text-dark dark:text-white mb-4">Upload Document</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark-3 dark:text-dark-5 mb-2">
                      Document Type
                    </label>
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full rounded-lg border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 px-4 py-2.5 text-sm font-medium text-dark dark:text-white outline-none transition focus:border-primary"
                    >
                      {Object.entries(DOC_TYPES).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-stroke dark:border-dark-3 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-dark-3"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl mb-3">
                      📂
                    </div>

                    {selectedFile ? (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-dark dark:text-white">
                          Selected: {selectedFile.name}
                        </p>
                        <p className="text-xs text-dark-4">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-dark dark:text-white">
                          Drag & drop file here, or <span className="text-primary font-bold">browse</span>
                        </p>
                        <p className="text-xs text-dark-4">
                          Supports JPEG, PNG, or PDF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200/50 p-3 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200/50 p-3 text-sm text-green-600 dark:text-green-400">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="w-full inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/95 text-white font-semibold py-2.5 px-4 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading document...
                      </>
                    ) : (
                      "Submit Document"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Checklist / Status Section */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-stroke dark:border-dark-3 bg-white p-6 shadow-sm dark:bg-gray-dark">
                <h2 className="text-lg font-bold text-dark dark:text-white mb-3">Verification Info</h2>
                <div className="space-y-3 text-xs text-dark-4 dark:text-dark-6">
                  <p>
                    Please upload one or more business documents. A <strong>GST Certificate</strong> or <strong>Trade License</strong> is highly recommended for immediate vendor approval.
                  </p>
                  <p>
                    Verification is typically completed within 24 to 48 hours. Once verified, your status will change to "verified" and you will receive an email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Documents List */}
        {!loading && docs.length > 0 && (
          <div className="rounded-2xl border border-stroke dark:border-dark-3 bg-white p-6 shadow-sm dark:bg-gray-dark">
            <h2 className="text-xl font-bold text-dark dark:text-white mb-4">Submitted Documents</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stroke dark:border-dark-3 text-left">
                    <th className="pb-3 font-semibold text-dark-4">Document Type</th>
                    <th className="pb-3 font-semibold text-dark-4">Submitted Date</th>
                    <th className="pb-3 font-semibold text-dark-4">Status</th>
                    <th className="pb-3 font-semibold text-dark-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc) => (
                    <tr key={doc.id} className="border-b border-stroke/50 dark:border-dark-3/50">
                      <td className="py-3 font-medium text-dark dark:text-white">
                        {DOC_TYPES[doc.document_type] ?? doc.document_type}
                      </td>
                      <td className="py-3 text-dark-4">
                        {new Date(doc.created_at).toLocaleDateString("en-IN", {
                          dateStyle: "medium",
                        })}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block rounded px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                            doc.status === "verified"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : doc.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <a
                          href={doc.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-bold text-xs"
                        >
                          View Document ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardGuard>
  );
}
