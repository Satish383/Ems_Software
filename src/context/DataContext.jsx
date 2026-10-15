import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mockDB } from "@/services/mock/db";

const DataContext = createContext(null);
const KEY = "employeehub.data.v1";

const loadState = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export function DataProvider({ children }) {
  const persisted = loadState();
  const [employees, setEmployees] = useState(
    persisted?.employees || mockDB.employees,
  );
  const [departments, setDepartments] = useState(
    persisted?.departments || mockDB.departments,
  );
  const [designations, setDesignations] = useState(
    persisted?.designations || mockDB.designations,
  );
  const [attendance, setAttendance] = useState(
    persisted?.attendance || mockDB.attendance,
  );
  const [leaves, setLeaves] = useState(persisted?.leaves || mockDB.leaves);
  const [notifications, setNotifications] = useState(
    persisted?.notifications || mockDB.notifications,
  );

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          KEY,
          JSON.stringify({
            employees,
            departments,
            designations,
            attendance,
            leaves,
            notifications,
          }),
        );
      } catch {
        /* storage full — ignore */
      }
    }, 200);
    return () => clearTimeout(t);
  }, [employees, departments, designations, attendance, leaves, notifications]);

  const addEmployee = useCallback(
    (emp) => setEmployees((list) => [emp, ...list]),
    [],
  );
  const updateEmployee = useCallback(
    (id, patch) =>
      setEmployees((list) =>
        list.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      ),
    [],
  );
  const archiveEmployee = useCallback(
    (id) =>
      setEmployees((list) =>
        list.map((e) => (e.id === id ? { ...e, status: "Inactive" } : e)),
      ),
    [],
  );
  const deleteEmployee = useCallback(
    (id) => setEmployees((list) => list.filter((e) => e.id !== id)),
    [],
  );

  const addDepartment = useCallback(
    (d) =>
      setDepartments((list) => [
        { ...d, id: `DEP-${String(list.length + 1).padStart(3, "0")}` },
        ...list,
      ]),
    [],
  );
  const updateDepartment = useCallback(
    (id, patch) =>
      setDepartments((list) =>
        list.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      ),
    [],
  );

  const addDesignation = useCallback(
    (d) =>
      setDesignations((list) => [
        { ...d, id: `DSG-${String(list.length + 1).padStart(3, "0")}` },
        ...list,
      ]),
    [],
  );
  const updateDesignation = useCallback(
    (id, patch) =>
      setDesignations((list) =>
        list.map((d) => (d.id === id ? { ...d, ...patch } : d)),
      ),
    [],
  );

  const updateLeaveStatus = useCallback(
    (id, status, rejectionReason) =>
      setLeaves((list) =>
        list.map((l) => (l.id === id ? { ...l, status, rejectionReason } : l)),
      ),
    [],
  );
  const addLeave = useCallback(
    (leave) => setLeaves((list) => [leave, ...list]),
    [],
  );

  const updateAttendance = useCallback(
    (id, patch) =>
      setAttendance((list) =>
        list.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      ),
    [],
  );
  const addAttendance = useCallback(
    (rec) => setAttendance((list) => [rec, ...list]),
    [],
  );

  const markNotificationRead = useCallback(
    (id) =>
      setNotifications((list) =>
        list.map((n) => (n.id === id ? { ...n, read: true } : n)),
      ),
    [],
  );
  const markAllNotificationsRead = useCallback(
    () => setNotifications((list) => list.map((n) => ({ ...n, read: true }))),
    [],
  );

  const resetDemoData = useCallback(() => {
    setEmployees(mockDB.employees);
    setDepartments(mockDB.departments);
    setDesignations(mockDB.designations);
    setAttendance(mockDB.attendance);
    setLeaves(mockDB.leaves);
    setNotifications(mockDB.notifications);
    localStorage.removeItem(KEY);
  }, []);

  const value = useMemo(
    () => ({
      employees,
      departments,
      designations,
      attendance,
      leaves,
      notifications,
      addEmployee,
      updateEmployee,
      archiveEmployee,
      deleteEmployee,
      addDepartment,
      updateDepartment,
      addDesignation,
      updateDesignation,
      updateLeaveStatus,
      addLeave,
      updateAttendance,
      addAttendance,
      markNotificationRead,
      markAllNotificationsRead,
      resetDemoData,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),
    [
      employees,
      departments,
      designations,
      attendance,
      leaves,
      notifications,
      addEmployee,
      updateEmployee,
      archiveEmployee,
      deleteEmployee,
      addDepartment,
      updateDepartment,
      addDesignation,
      updateDesignation,
      updateLeaveStatus,
      addLeave,
      updateAttendance,
      addAttendance,
      markNotificationRead,
      markAllNotificationsRead,
      resetDemoData,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
};
