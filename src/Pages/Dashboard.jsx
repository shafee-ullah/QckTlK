import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";

const Dashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get(
          `/api/users/profile?email=${user.email}`
        );
        setProfile(res.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get(
          `/api/payments/history?email=${user.email}`
        );
        setPayments(res.data);
      } catch (err) {
        /* ignore for now */
      }
    };
    if (user?.email) {
      fetchProfile();
      fetchPayments();
    }
  }, [user, axiosSecure]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!profile) return <div className="p-8">No profile found.</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        My Dashboard
      </h2>
      <div className="mb-4">
        <span className="font-semibold">Name:</span>{" "}
        {profile.displayName || profile.name || "-"}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Email:</span> {profile.email}
      </div>
      <div className="mb-4 flex items-center gap-2">
        <span className="font-semibold">Badge:</span>
        {profile.badge === "Gold" ? (
          <span className="inline-flex items-center px-3 py-1 bg-yellow-400 text-white rounded-full font-bold">
            Gold
          </span>
        ) : (
          <span className="text-gray-500">None</span>
        )}
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Payment History</h3>
        {payments.length === 0 ? (
          <div className="text-gray-500">No payments found.</div>
        ) : (
          <table className="w-full text-left border mt-2">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.paymentIntentId} className="border-t">
                  <td className="py-2 px-3">
                    {new Date(p.date).toLocaleString()}
                  </td>
                  <td className="py-2 px-3">${(p.amount / 100).toFixed(2)}</td>
                  <td className="py-2 px-3">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
