import { useEffect, useMemo, useState } from "react";
import { getAllTickets } from "../api";
import { useAuth } from "../hooks/useAuth";
import TicketFilters from "../components/tickets/TicketFilters";
import TicketsTable from "../components/tickets/TicketsTable";

export default function Tickets() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    let active = true;
    getAllTickets(token).then((res) => {
      if (!active) return;
      setTickets(res);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [token]);

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = tickets.filter((t) => {
      const matchesSearch =
        !q || t.sender.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
      const matchesDept = department === "All" || t.department === department;
      const matchesStatus = status === "All" || t.status === status;
      return matchesSearch && matchesDept && matchesStatus;
    });

    rows = [...rows].sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (sortKey === "createdAt" || sortKey === "updatedAt") {
        va = new Date(va).getTime();
        vb = new Date(vb).getTime();
      } else {
        va = String(va).toLowerCase();
        vb = String(vb).toLowerCase();
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [tickets, search, department, status, sortKey, sortDir]);

  return (
    <div className="space-y-4">
      <TicketFilters
        search={search}
        onSearch={setSearch}
        department={department}
        onDepartment={setDepartment}
        status={status}
        onStatus={setStatus}
        count={filtered.length}
        total={tickets.length}
      />
      <TicketsTable
        tickets={filtered}
        loading={loading}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
      />
    </div>
  );
}
