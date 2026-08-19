import { useEffect, useState } from "react";
import { ShieldCheck, UserCheck, Users } from "lucide-react";
import { getAdminUsers } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import Card, { CardHeader } from "../../components/ui/Card";
import StatCard from "../../components/dashboard/StatCard";

export default function UserManagement() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers(token)
      .then(setUsers)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [token]);

  const activeUsers = users.filter((user) => user.is_active).length;
  const admins = users.filter((user) => user.is_admin).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={loading ? "—" : users.length} icon={Users} trend="All registered accounts" />
        <StatCard label="Active users" value={loading ? "—" : activeUsers} icon={UserCheck} accent="resolved" trend="Accounts with system access" />
        <StatCard label="Administrators" value={loading ? "—" : admins} icon={ShieldCheck} accent="teal" trend="Users with admin privileges" />
      </div>

      <Card padded={false}>
        <div className="p-5">
          <CardHeader title="System users" subtitle="Roles and department assignments from the backend" />
        </div>

        {error ? (
          <div className="border-t border-border px-5 py-12 text-center">
            <p className="text-sm font-medium text-status-escalated">Could not load users</p>
            <p className="mt-1 text-xs text-ink-faint">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-surface-sunken/60 text-[11px] uppercase tracking-wide text-ink-faint">
                <tr>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Department</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-sunken/40">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{user.full_name || "Unnamed user"}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">{user.email}</p>
                    </td>
                    <td className="px-5 py-4 text-ink-muted">{user.is_admin ? "ADMIN" : user.role}</td>
                    <td className="px-5 py-4 text-ink-muted">{user.department_name || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.is_active
                          ? "bg-status-resolved-soft text-status-resolved"
                          : "bg-status-open-soft text-status-open"
                      }`}>
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!loading && users.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-ink-faint">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
