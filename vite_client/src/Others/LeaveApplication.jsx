import React, { useState } from 'react';

const LeaveApplication= () => {
  const [leaveForm, setLeaveForm] = useState({
    name: '',
    email: '',
    startDate: '',
    endDate: '',
    reason: '',
    document: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLeaveForm({
      ...leaveForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLeaveForm({
      ...leaveForm,
      document: file,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!leaveForm.name) formErrors.name = 'Name is required';
    if (!leaveForm.email) formErrors.email = 'Email is required';
    if (!leaveForm.startDate) formErrors.startDate = 'Start date is required';
    if (!leaveForm.endDate) formErrors.endDate = 'End date is required';
    if (!leaveForm.reason) formErrors.reason = 'Reason is required';
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', leaveForm.name);
    formData.append('email', leaveForm.email);
    formData.append('startDate', leaveForm.startDate);
    formData.append('endDate', leaveForm.endDate);
    formData.append('reason', leaveForm.reason);
    if (leaveForm.document) {
      formData.append('document', leaveForm.document);
    }

    try {
      const response = await fetch('/api/leave-application', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      alert('Leave application submitted successfully!');
      setLeaveForm({
        name: '',
        email: '',
        startDate: '',
        endDate: '',
        reason: '',
        document: null,
      });
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Leave Application Form</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={leaveForm.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={leaveForm.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={leaveForm.startDate}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={leaveForm.endDate}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Reason</label>
          <textarea
            name="reason"
            value={leaveForm.reason}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Supporting Document (Optional)
          </label>
          <div className="flex items-center space-x-4 mt-2">
            <label
              htmlFor="document"
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
            >
              Upload File
            </label>
            <span className="text-sm text-gray-600 truncate max-w-xs">
              {leaveForm.document ? leaveForm.document.name : 'No file chosen'}
            </span>
          </div>
          <input
            type="file"
            id="document"
            name="document"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Formats: PDF, DOC, DOCX</p>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveApplication;
