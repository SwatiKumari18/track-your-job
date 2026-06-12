"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase-client";
import { useRouter } from "next/navigation";

export default function ApplicationsPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("thisYear");

  useEffect(() => {
    getUser();
  }, []);

  //Route Protection - if user is not logged in, redirect to login page
  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("User:", user);

     if (!user) {
      router.push("/login");
      return;
    }

    setEmail(user.email || "");
    setLoading(false);
  }


  //Showing Applications
  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    setApplications(data || []);
    setLoading(false);

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }
  }

  //Saving new applications
  async function saveApplication() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in.");
      return;
    }

    const { error } = await supabase
      .from("applications")
      .insert([
        {
          user_id: user.id, //making sure jobs are linked to the authenticated user
          company,
          position,
          status,
          applied_date: new Date()
            .toISOString()
            .split("T")[0],
          notes,
        },
      ]);

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    await fetchApplications();

    setCompany("");
    setPosition("");
    setStatus("Applied");
    setNotes("");

    alert("Application added!");

  }

  //Deleting an application
  async function deleteApplication(id: string) 
  {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete)
    {
      return;
    } 
  
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    fetchApplications(); // refresh list
  }

  //Editing an application
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");

  async function updateApplication(id: string) 
  {
    const { error } = await supabase
      .from("applications")
      .update({
        status: editStatus,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    setEditingId(null);
    fetchApplications();
  }


  //Change colour based on status
  function getStatusStyle(status: string) 
  {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";
      case "Interview":
        return "bg-yellow-100 text-yellow-700";
      case "Offer":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }


  //To export to csv file
  function exportToCSV() {
    const headers = [
      "Company",
      "Position",
      "Status",
      "Applied Date",
      "Notes",
    ];

    const rows = filteredApplications.map((app) => [
      app.company,
      app.position,
      app.status,
      app.applied_date,
      app.notes,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "applications.csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }


  if (loading) {
    return (
      <main className="p-10">
        <p className="text-gray-500">
          Loading applications...
        </p>
      </main>
    );
  }

  //To filter the jobs based on search, status and date filter. 
  // Search checks if company or position includes the search term. 
  // Status filter checks if status matches or if "All" is selected.
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesDate = isWithinDateFilter(app.applied_date);

    return matchesSearch && matchesStatus && matchesDate;

  });

  //To filter jobs based on date applied/date-range
  function isWithinDateFilter(date: string) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const appDateStr = date?.slice(0, 10);

    const appDate = new Date(appDateStr);
    const today = new Date(todayStr);

    const diffTime = today.getTime() - appDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    switch (dateFilter) {
      case "today":
        return appDateStr === todayStr;

      case "7":
        return diffDays <= 7;

      case "30":
        return diffDays <= 30;

      case "90":
        return diffDays <= 90;

      case "thisYear":
        return appDate.getFullYear() === today.getFullYear();

      default:
        return true;
    }
  }
  

  return (
    <main className="p-4 md:p-10">
      <div className="space-y-3 max-w-md">
        <input
            className="border p-2 w-full"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
        />

        <input
            className="border p-2 w-full"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
        />

       <select
          className="border p-2 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <textarea
            className="border p-2 w-full"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
        />

        <button
            onClick={saveApplication}
            className="border px-4 py-2"
            >
            Add Application
        </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            My Applications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="border p-2 w-full mb-4"
              placeholder="Search by company or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border p-2 w-full mb-4"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              className="border p-2 w-full mb-4"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>

          <button
            onClick={exportToCSV}
            className="border px-4 py-2 rounded mb-4 bg-pink-200 w-full md:w-auto"
          >
            Export CSV
          </button>

          {filteredApplications
          .map((app) => (
            <div 
              key={app.id} 
              className="bg-white border rounded-lg p-5 mb-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {app.company}
                  </h3>

                  <p className="text-gray-600">
                    {app.position}
                  </p>
                  <p className="text-gray-600">
                    Application Date: {app.applied_date?.slice(0, 10)}
                  </p>
                </div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>
              {editingId === app.id ? (
                <div className="mt-3 flex items-center gap-2">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>

                  <button
                    onClick={() => updateApplication(app.id)}
                    className="border px-3 py-2 rounded bg-green-100"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="border px-3 py-2 rounded bg-red-100"
                  >
                    Cancel
                  </button>
                </div>
              ) : null}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => deleteApplication(app.id)}
                  className="border px-3 py-1 text-red-600 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() => {
                    setEditingId(app.id);
                    setEditStatus(app.status);
                  }}
                  className="border px-3 py-1 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

    </main>
  );
}