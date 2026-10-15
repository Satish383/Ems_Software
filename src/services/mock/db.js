// ============================================================================
// EmployeeHub — Centralized Mock Data
// This file simulates a backend database. Replace with real API calls later.
// All names/emails/salaries are FICTIONAL demo data.
// ============================================================================

const firstNames = ['Aarav', 'Priya', 'Marcus', 'Elena', 'Kwame', 'Sofia', 'Liam', 'Yuki', 'Noah', 'Amara', 'Diego', 'Imani', 'Lucas', 'Nadia', 'Omar', 'Freya', 'Kenji', 'Isabel', 'Ethan', 'Zara', 'Ravi', 'Mia', 'Jonas', 'Hana', 'Caleb'];
const lastNames = ['Sharma', 'Patel', 'Chen', 'Novak', 'Okafor', 'Rossi', 'Andersen', 'Tanaka', 'Williams', 'Mensah', 'Alvarez', 'Brooks', 'Silva', 'Haddad', 'Rahman', 'Larsen', 'Watanabe', 'Costa', 'Fischer', 'Khan', 'Iyer', 'Novak', 'Weber', 'Park', 'Bennett'];

const departments = [
    { id: 'DEP-001', name: 'Engineering', head: 'Aarav Sharma', description: 'Product development, platform, and infrastructure.', status: 'Active', code: 'ENG' },
    { id: 'DEP-002', name: 'Human Resources', head: 'Priya Patel', description: 'People operations, talent, and culture.', status: 'Active', code: 'HR' },
    { id: 'DEP-003', name: 'Finance', head: 'Marcus Chen', description: 'Accounting, payroll, and financial planning.', status: 'Active', code: 'FIN' },
    { id: 'DEP-004', name: 'Marketing', head: 'Elena Novak', description: 'Brand, growth, and demand generation.', status: 'Active', code: 'MKT' },
    { id: 'DEP-005', name: 'Sales', head: 'Kwame Okafor', description: 'Revenue, partnerships, and customer success.', status: 'Active', code: 'SLS' },
    { id: 'DEP-006', name: 'Operations', head: 'Sofia Rossi', description: 'Facilities, logistics, and internal operations.', status: 'Active', code: 'OPS' },
];

const designations = [
    { id: 'DSG-001', title: 'Frontend Developer', department: 'Engineering', level: 'Mid', employees: 5, description: 'Builds modern web interfaces with React.' },
    { id: 'DSG-002', title: 'Backend Developer', department: 'Engineering', level: 'Mid', employees: 4, description: 'Designs APIs and server-side systems.' },
    { id: 'DSG-003', title: 'UI/UX Designer', department: 'Engineering', level: 'Mid', employees: 2, description: 'Designs product experiences and interfaces.' },
    { id: 'DSG-004', title: 'Engineering Manager', department: 'Engineering', level: 'Lead', employees: 1, description: 'Leads engineering teams and delivery.' },
    { id: 'DSG-005', title: 'HR Executive', department: 'Human Resources', level: 'Junior', employees: 2, description: 'Supports hiring and employee relations.' },
    { id: 'DSG-006', title: 'HR Manager', department: 'Human Resources', level: 'Senior', employees: 1, description: 'Owns people strategy and operations.' },
    { id: 'DSG-007', title: 'Finance Manager', department: 'Finance', level: 'Senior', employees: 1, description: 'Oversees finance and reporting.' },
    { id: 'DSG-008', title: 'Accountant', department: 'Finance', level: 'Mid', employees: 2, description: 'Handles day-to-day accounting.' },
    { id: 'DSG-009', title: 'Marketing Specialist', department: 'Marketing', level: 'Mid', employees: 3, description: 'Executes campaigns and content.' },
    { id: 'DSG-010', title: 'Sales Executive', department: 'Sales', level: 'Mid', employees: 4, description: 'Drives revenue and client relationships.' },
    { id: 'DSG-011', title: 'Operations Coordinator', department: 'Operations', level: 'Junior', employees: 2, description: 'Coordinates internal operations.' },
    { id: 'DSG-012', title: 'Product Manager', department: 'Engineering', level: 'Senior', employees: 1, description: 'Owns product roadmap and delivery.' },
];

const empType = ['Full-time', 'Full-time', 'Full-time', 'Contract', 'Intern'];
const statuses = ['Active', 'Active', 'Active', 'Active', 'On Leave', 'Probation', 'Inactive'];
const cities = [
    { city: 'San Francisco', state: 'CA', zip: '94107' },
    { city: 'Austin', state: 'TX', zip: '73301' },
    { city: 'New York', state: 'NY', zip: '10001' },
    { city: 'Seattle', state: 'WA', zip: '98101' },
    { city: 'Chicago', state: 'IL', zip: '60601' },
    { city: 'Boston', state: 'MA', zip: '02108' },
];

const seed = (n) => {
    let x = Math.sin(n) * 10000;
    return x - Math.floor(x);
};

const buildEmployees = () => {
    const list = [];
    for (let i = 0; i < 24; i++) {
        const first = firstNames[i % firstNames.length];
        const last = lastNames[(i * 3 + 1) % lastNames.length];
        const name = `${first} ${last}`;
        const dept = departments[i % departments.length];
        const desig = designations.filter((d) => d.department === dept.name)[i % 2] || designations[i % designations.length];
        const loc = cities[i % cities.length];
        const joinYear = 2018 + Math.floor(seed(i) * 6);
        const joinMonth = 1 + Math.floor(seed(i + 1) * 12);
        const joinDay = 1 + Math.floor(seed(i + 2) * 27);
        const joinDate = `${joinYear}-${String(joinMonth).padStart(2, '0')}-${String(joinDay).padStart(2, '0')}`;
        const status = statuses[i % statuses.length];
        const type = empType[i % empType.length];
        const base = 55000 + Math.floor(seed(i + 3) * 90000);
        const allowances = Math.floor(base * 0.12);
        const deductions = Math.floor(base * 0.08);
        const gross = base + allowances;
        const net = gross - deductions;

        list.push({
            id: `EMP-${String(1001 + i).padStart(4, '0')}`,
            firstName: first,
            lastName: last,
            name,
            email: `${first.toLowerCase()}.${last.toLowerCase()}@employeehub.demo`,
            phone: `+1 (415) 555-${String(1000 + i).slice(-4)}`,
            dob: `${1985 + (i % 15)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 27)).padStart(2, '0')}`,
            gender: i % 3 === 0 ? 'Female' : i % 3 === 1 ? 'Male' : 'Other',
            department: dept.name,
            departmentId: dept.id,
            designation: desig?.title || 'Associate',
            designationId: desig?.id || 'DSG-000',
            employmentType: type,
            status,
            joiningDate: joinDate,
            reportingManager: i % 4 === 0 ? '—' : list[i - 1]?.name || 'Aarav Sharma',
            address: `${100 + i} Market Street`,
            city: loc.city,
            state: loc.state,
            postalCode: loc.zip,
            emergencyContact: `+1 (415) 555-${String(2000 + i).slice(-4)}`,
            baseSalary: base,
            allowances,
            deductions,
            gross,
            net,
            performanceRating: Number((3.2 + seed(i + 5) * 1.7).toFixed(1)),
            avatarColorSeed: name,
        });
    }
    return list;
};

const employees = buildEmployees();

const today = new Date();
const isoDay = (offset = 0) => {
    const d = new Date(today);
    d.setDate(d.getDate() - offset);
    return d.toISOString().slice(0, 10);
};

const buildAttendance = () => {
    const records = [];
    const attendanceStatus = ['Present', 'Present', 'Present', 'Present', 'Late', 'Half Day', 'Absent', 'On Leave'];
    for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
        const date = isoDay(dayOffset);
        employees.forEach((emp, idx) => {
            const s = attendanceStatus[(idx + dayOffset) % attendanceStatus.length];
            const checkIn = s === 'Absent' || s === 'On Leave' ? '—' : s === 'Late' ? '10:15' : s === 'Half Day' ? '09:30' : '08:55';
            const checkOut = s === 'Absent' || s === 'On Leave' ? '—' : s === 'Half Day' ? '13:00' : '17:30';
            const hours = s === 'Absent' || s === 'On Leave' ? 0 : s === 'Half Day' ? 3.5 : s === 'Late' ? 7.25 : 8.6;
            records.push({
                id: `ATT-${date}-${emp.id}`,
                employeeId: emp.id,
                employeeName: emp.name,
                department: emp.department,
                date,
                status: s,
                checkIn,
                checkOut,
                hours,
            });
        });
    }
    return records;
};

const attendance = buildAttendance();

const leaveTypes = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity Leave', 'Unpaid Leave'];
const leaveStatuses = ['Pending', 'Approved', 'Rejected'];

const buildLeaves = () => {
    const requests = [];
    const reasons = [
        'Family vacation',
        'Medical appointment',
        'Personal errand',
        'Recovering from fever',
        'Attending a wedding',
        'Childcare responsibilities',
        'Travel abroad',
        'Bereavement',
        'Study leave',
        'Moving apartments',
        'Dental surgery',
        'Extended weekend',
    ];
    for (let i = 0; i < 14; i++) {
        const emp = employees[i % employees.length];
        const start = new Date(today);
        start.setDate(start.getDate() + (i - 4) * 2);
        const end = new Date(start);
        end.setDate(end.getDate() + 1 + (i % 4));
        const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
        requests.push({
            id: `LV-${String(2001 + i).padStart(4, '0')}`,
            employeeId: emp.id,
            employeeName: emp.name,
            department: emp.department,
            avatarColorSeed: emp.name,
            leaveType: leaveTypes[i % leaveTypes.length],
            startDate: start.toISOString().slice(0, 10),
            endDate: end.toISOString().slice(0, 10),
            days,
            appliedOn: isoDay(2 + i),
            reason: reasons[i % reasons.length],
            status: leaveStatuses[i % 3],
        });
    }
    return requests;
};

const leaves = buildLeaves();

const buildPayroll = () => {
    const month = today.toLocaleString('en-US', { month: 'long' });
    const year = today.getFullYear();
    return employees.map((emp, i) => ({
        id: `PAY-${year}${String(today.getMonth() + 1).padStart(2, '0')}-${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        month,
        year,
        baseSalary: emp.baseSalary,
        allowances: emp.allowances,
        deductions: emp.deductions,
        gross: emp.gross,
        net: emp.net,
        status: ['Paid', 'Paid', 'Pending', 'Paid'][i % 4],
    }));
};

const payroll = buildPayroll();

const performanceReviews = employees.slice(0, 12).map((emp, i) => ({
    id: `PR-${String(3001 + i)}`,
    employeeId: emp.id,
    employeeName: emp.name,
    department: emp.department,
    reviewPeriod: 'Q3 2024',
    goalCompletion: 60 + Math.floor(seed(i + 7) * 40),
    rating: emp.performanceRating,
    reviewer: employees[(i + 3) % employees.length].name,
    status: ['Completed', 'In Progress', 'Completed', 'Pending'][i % 4],
    goals: [
        { id: 'g1', title: 'Ship Q3 feature set', progress: 80 },
        { id: 'g2', title: 'Mentor 2 junior engineers', progress: 55 },
        { id: 'g3', title: 'Reduce page load by 30%', progress: 100 },
    ],
}));

const notifications = [
    { id: 'NT-001', title: 'Leave request pending', message: 'Priya Patel requested Annual Leave for 3 days.', type: 'leave', read: false, time: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    { id: 'NT-002', title: 'New employee added', message: 'Marcus Chen was added to Finance.', type: 'employee', read: false, time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: 'NT-003', title: 'Payroll processed', message: 'Payroll for the current month has been processed.', type: 'payroll', read: false, time: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
    { id: 'NT-004', title: 'Performance review due', message: '2 reviews are due this week.', type: 'performance', read: true, time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
    { id: 'NT-005', title: 'Attendance anomaly', message: '3 employees were late today.', type: 'attendance', read: true, time: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString() },
];

const activities = [
    { id: 'AC-001', actor: 'Aarav Sharma', action: 'approved leave for', target: 'Priya Patel', time: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: 'leave' },
    { id: 'AC-002', actor: 'HR Team', action: 'added new employee', target: 'Elena Novak', time: new Date(Date.now() - 1000 * 60 * 45).toISOString(), type: 'employee' },
    { id: 'AC-003', actor: 'Payroll', action: 'processed payroll for', target: 'October 2024', time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), type: 'payroll' },
    { id: 'AC-004', actor: 'Kwame Okafor', action: 'completed performance review for', target: 'Sofia Rossi', time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), type: 'performance' },
    { id: 'AC-005', actor: 'System', action: 'flagged late arrivals for', target: '3 employees', time: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), type: 'attendance' },
];

const users = [
    {
        id: 'U-001',
        name: 'Alex Morgan',
        email: 'admin@employeehub.demo',
        password: 'demo1234',
        role: 'HR Administrator',
        avatarColorSeed: 'Alex Morgan',
    },
    {
        id: 'U-002',
        name: 'Priya Patel',
        email: 'manager@employeehub.demo',
        password: 'demo1234',
        role: 'Department Manager',
        avatarColorSeed: 'Priya Patel',
    },
    {
        id: 'U-003',
        name: 'Marcus Chen',
        email: 'employee@employeehub.demo',
        password: 'demo1234',
        role: 'Employee',
        avatarColorSeed: 'Marcus Chen',
    },
];

const company = {
    name: 'EmployeeHub Inc.',
    legalName: 'EmployeeHub Technologies, Inc.',
    email: 'hello@employeehub.demo',
    phone: '+1 (415) 555-0100',
    website: 'https://employeehub.demo',
    address: '500 Market Street, San Francisco, CA 94105',
    taxId: 'DEMO-00-1234567',
};

export const mockDB = {
    employees,
    departments,
    designations,
    attendance,
    leaves,
    payroll,
    performanceReviews,
    notifications,
    activities,
    users,
    company,
    leaveTypes,
};

// Simulated API layer — swap these with real fetch() calls later.
export const api = {
    async getEmployees() {
        await delay(300);
        return [...mockDB.employees];
    },
    async getDepartments() {
        await delay(200);
        return [...mockDB.departments];
    },
    async getDesignations() {
        await delay(200);
        return [...mockDB.designations];
    },
    async getAttendance() {
        await delay(250);
        return [...mockDB.attendance];
    },
    async getLeaves() {
        await delay(250);
        return [...mockDB.leaves];
    },
    async getPayroll() {
        await delay(300);
        return [...mockDB.payroll];
    },
    async getPerformance() {
        await delay(250);
        return [...mockDB.performanceReviews];
    },
    async getNotifications() {
        await delay(150);
        return [...mockDB.notifications];
    },
};

export const delay = (ms) => new Promise((r) => setTimeout(r, ms));