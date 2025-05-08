import React, { useState, useEffect } from 'react';

function ProfileDetails() {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        if (!token || !email) {
          setError('User not authenticated.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/employees?email=${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch employee profile');
        }

        setEmployee(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, []);

  if (loading) return <p className="text-center p-8 text-lg">Loading dashboard...</p>;
  if (error) return <p className="text-center p-8 text-lg text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="w-36 h-36 mx-auto mb-6 rounded-full bg-yellow-300 overflow-hidden flex items-center justify-center">
            <img
              src={
                employee?.profilePicture ||
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80'
              }
              alt={`${employee?.name || 'Employee'}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="max-w-xl mx-auto">
            <p className="text-gray-600 text-sm">Employee Name</p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-1 mb-6">{employee?.name || 'Xyz Siz'}</h2>

            <div className="grid grid-cols-2 gap-6 mb-4 text-center">
              <div>
                <p className="text-gray-500 text-sm">Department</p>
                <p className="text-lg font-semibold text-gray-700">{employee?.department || 'Development'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Manager</p>
                <p className="text-lg font-semibold text-gray-700">{employee?.manager || 'Name of manager'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-gray-500 text-sm">Job Title</p>
                <p className="text-lg font-semibold text-gray-700">{employee?.position || 'Salesforce Developer'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Job Category</p>
                <p className="text-lg font-semibold text-gray-700">{employee?.jobCategory || 'Full time'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
