"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Mail,
  Phone,
  User,
  Building2,
  Trash2,
  Eye,
  Search,
  Download,
  MessageCircle,
  X,
} from "lucide-react";
import { db } from "@/firebase/config"; // adjust this import to your firebase config file

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: "New" | "Contacted" | "Completed";
  createdAt?: any;
}

const PAGE_SIZE = 8;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Lead["status"]>(
    "All"
  );
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // 🔥 Live Firestore subscription
  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Lead[];
        setLeads(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load leads:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Delete lead
  async function deleteLead(id: string) {
    if (!confirm("Delete this lead? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "leads", id));
    } catch (error) {
      console.error("Failed to delete lead:", error);
      alert("Failed to delete lead. Please try again.");
    }
  }

  // Update status
  async function updateStatus(id: string, status: Lead["status"]) {
    try {
      await updateDoc(doc(db, "leads", id), { status });
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    }
  }

  // Search + filter
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / PAGE_SIZE));
  const paginatedLeads = filteredLeads.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter]);

  function createCSV(rows: Record<string, string | undefined>[]) {
    if (rows.length === 0) return "";

    const headers = Object.keys(rows[0]);
    const escapeValue = (value: string | undefined) => {
      const safeValue = value ?? "";
      return `"${safeValue.replace(/"/g, '""')}"`;
    };

    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => escapeValue(String(row[header] ?? "")))
          .join(",")
      ),
    ];

    return csvRows.join("\r\n");
  }

  function downloadCSV(filename: string, csvContent: string) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // CSV / Excel export
  function exportCSV() {
    const exportData = filteredLeads.map((lead) => ({
      Name: lead.name,
      Company: lead.company,
      Email: lead.email,
      Phone: lead.phone,
      Service: lead.service,
      Message: lead.message,
      Status: lead.status,
    }));

    const csvContent = createCSV(exportData);
    downloadCSV(
      `Leads_${new Date().toISOString().slice(0, 10)}.csv`,
      csvContent
    );
  }

  function statusBadgeClass(status: Lead["status"]) {
    if (status === "New") return "bg-green-500/20 text-green-400";
    if (status === "Contacted") return "bg-yellow-500/20 text-yellow-400";
    return "bg-blue-500/20 text-blue-400";
  }

  function whatsappLink(phone: string) {
    const digits = phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${digits}`;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white">Leads Management</h1>
          <p className="mt-2 text-slate-400">
            Customer enquiries received from your website.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white hover:bg-cyan-600"
        >
          <Download size={18} />
          Export Excel
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name, company, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-900 py-3 pl-12 pr-4 text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "All" | Lead["status"])
          }
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-500"
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-6 py-4 text-left text-white">Customer</th>
                <th className="px-6 py-4 text-left text-white">Contact</th>
                <th className="px-6 py-4 text-left text-white">Service</th>
                <th className="px-6 py-4 text-left text-white">Status</th>
                <th className="px-6 py-4 text-center text-white">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    Loading leads...
                  </td>
                </tr>
              )}

              {!loading && paginatedLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    No leads found.
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-t border-white/10 hover:bg-slate-800/50"
                  >
                    {/* Customer */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-cyan-500/20 p-3">
                          <User size={18} className="text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {lead.name}
                          </h3>
                          <p className="flex items-center gap-2 text-sm text-slate-400">
                            <Building2 size={14} />
                            {lead.company}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-5">
                      <p className="flex items-center gap-2 text-slate-300">
                        <Mail size={16} />
                        {lead.email}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-slate-400">
                        <Phone size={16} />
                        {lead.phone}
                      </p>
                    </td>

                    {/* Service */}
                    <td className="px-6 py-5 text-slate-300">
                      {lead.service}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateStatus(
                            lead.id,
                            e.target.value as Lead["status"]
                          )
                        }
                        className={`rounded-full border-none px-4 py-2 text-sm font-semibold outline-none ${statusBadgeClass(
                          lead.status
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          title="View Details"
                          className="rounded-xl bg-cyan-500 p-3 hover:bg-cyan-600"
                        >
                          <Eye size={18} />
                        </button>

                        <a
                          href={`mailto:${lead.email}`}
                          title="Email Customer"
                          className="rounded-xl bg-indigo-500 p-3 hover:bg-indigo-600"
                        >
                          <Mail size={18} />
                        </a>

                        <a
                          href={`tel:${lead.phone}`}
                          title="Call Customer"
                          className="rounded-xl bg-amber-500 p-3 hover:bg-amber-600"
                        >
                          <Phone size={18} />
                        </a>

                        <a
                          href={whatsappLink(lead.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          className="rounded-xl bg-green-500 p-3 hover:bg-green-600"
                        >
                          <MessageCircle size={18} />
                        </a>

                        <button
                          onClick={() => deleteLead(lead.id)}
                          title="Delete Lead"
                          className="rounded-xl bg-red-500 p-3 hover:bg-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredLeads.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
            <p className="text-sm text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filteredLeads.length)} of{" "}
              {filteredLeads.length} leads
            </p>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-3 py-2 text-sm text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {selectedLead.name}
              </h2>
              <button onClick={() => setSelectedLead(null)}>
                <X className="text-slate-400 hover:text-white" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-slate-300">
              <p className="flex items-center gap-2">
                <Building2 size={16} /> {selectedLead.company}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} /> {selectedLead.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} /> {selectedLead.phone}
              </p>
              <p>
                <span className="font-semibold text-white">Service: </span>
                {selectedLead.service}
              </p>
              <p>
                <span className="font-semibold text-white">Message:</span>
                <br />
                {selectedLead.message}
              </p>
              <p>
                <span className="font-semibold text-white">Status: </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${statusBadgeClass(
                    selectedLead.status
                  )}`}
                >
                  {selectedLead.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}