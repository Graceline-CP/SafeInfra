import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export function useReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "reports"), where("uid", "==", user.uid));
    return onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ ...d.data(), id: d.id }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setReports(data);
      setLoading(false);
    });
  }, [user]);

  const count = (s) => reports.filter((r) => r.severity === s).length;
  const stats = {
    critical: count("Critical"),
    high: count("High"),
    medium: count("Medium"),
    low: count("Low"),
  };

  return { reports, stats, loading };
}