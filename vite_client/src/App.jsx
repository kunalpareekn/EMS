import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './Auth/Register';
import Login from './Auth/Login';
import DashboardAdmin from './Admin/DashboardAdmin';
import DashboardEmployee from './Employee/DashboardEmployee';
import Header from './Shared/Header'; // Import Header component
import AddEmployee from './Admin/AddEmployee'; // Import AddEmployee component
import EmployeeList from './Admin/EmployeeList'; // Import EmployeeList component
import AddProject from './Admin/AddProject'; // Import AddProject component
import EmployeeDetails from './Admin/EmployeeDetail'; // Import EmployeeDetails component
import ProfileDetails from './Employee/ProfileDetails'; // Import ProfileDetails component
import ContactDetails from './Employee/ContactDetails';
import ProfileSidebar from './Shared/ProfileSidebar'; // Import ProfileSidebar component
import NextOfKinDetails from './Employee/NextOfKinDetails';
import EducationQualifications from './Admin/EducationQualifications';
import GuarantorDetails from './Employee/GuarantorDetails';
import FamilyDetails from './Employee/FamilyDetails';
import JobDetails from "./Employee/JobDetails"
import FinancialDetails from './Employee/FinancialDetails';
import DailyReport from './Others/DailyReport'; // Import DailyReport component
import AttendanceDashboard from './Both/AttendanceDashboard';
import EmployeePayroll from './Employee/EmployeePayroll';
import Leave from './Others/LeaveApplication';
import LeaveManagement from './Admin/LeaveManagement';
import AdminPayroll from './Admin/AdminPayroll';

function App() {
    const location = useLocation();
    const hideHeaderRoutes = ['/', '/login', '/register']; // Routes where Header and Sidebar should not be shown
    const showSidebarRoutes = [
        '/profile-details',
        '/contact-details',
        '/next-of-kin-details',
        '/education-qualifications',
        '/guarantor-details',
        '/family-details',
        '/job-details',
        '/financial-details',
    ]; // Routes where ProfileSidebar should be shown

    const [activeSection, setActiveSection] = useState('Personal Details'); // Track active section

    return (
        <>
            {!hideHeaderRoutes.includes(location.pathname) && <Header />} {/* Conditionally render Header */}
            <div style={{ display: 'flex' }}>
                {showSidebarRoutes.includes(location.pathname) && (
                    <div style={{ width: '250px' }}>
                        <ProfileSidebar
                            activeSection={activeSection} // Pass active section
                            onSectionClick={setActiveSection} // Update active section
                        />
                    </div>
                )}
                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Login />} /> {/* Set Login as the default route */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
                        <Route path="/dashboard-employee" element={<DashboardEmployee />} />
                        <Route path="/add" element={<AddEmployee />} /> {/* Add route for AddEmployee */}
                        <Route path="/employee-list" element={<EmployeeList />} /> {/* Add route for EmployeeList */}
                        <Route path="/add-employee" element={<AddEmployee />} /> {/* Add route for AddEmployee */}
                        <Route path="/add-project" element={<AddProject />} /> {/* Add route for AddProject */}
                        <Route path="/employee/:id" element={<EmployeeDetails />} /> {/* Add route for EmployeeDetails */}
                        <Route path="/contact-details" element={<ContactDetails />} /> {/* Add route for ContactDetails */}
                        <Route path="/profile-details" element={<ProfileDetails />} /> {/* Add route for ProfileDetails */}
                        <Route path="/next-of-kin-details" element={<NextOfKinDetails />} />
                        <Route path="/education-qualifications" element={<EducationQualifications />} />
                        <Route path="/guarantor-details" element={<GuarantorDetails />} />
                        <Route path="/family-details" element={<FamilyDetails />} />
                        <Route path="/job-details" element={<JobDetails />} />
                        <Route path="/financial-details" element={<FinancialDetails />} />
                        <Route path="/leave" element={<Leave />} />
                        <Route path="/leave-management" element={<LeaveManagement />} />
                        <Route path="/daily-report" element={<DailyReport />} /> {/* Add route for DailyReport */}
                        <Route path="/attendance" element={<AttendanceDashboard />} />
                        <Route path="/employee-payroll" element={<EmployeePayroll />} />
                        <Route path="/admin-payroll" element={<AdminPayroll />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
