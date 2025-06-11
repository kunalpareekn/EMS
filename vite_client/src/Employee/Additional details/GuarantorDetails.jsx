import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addGuarantor } from '../../context/employeeDetailsSlice'; // Adjust path as needed

const GuarantorDetails = () => {
  const dispatch = useDispatch();
  const { employee, updatingGuarantor } = useSelector((state) => state.employeeDetails);

  const guarantorDetails = employee?.guarantors?.[0] || {}; // Assuming single guarantor

  const [guarantor, setGuarantor] = useState({
    name: guarantorDetails?.name || '',
    occupation: guarantorDetails?.occupation || '',
    phone: guarantorDetails?.phone || '',
    relationship: guarantorDetails?.relationship || '',
    address: guarantorDetails?.address || ''
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuarantor({ ...guarantor, [name]: value });
  };

  const handleUpdate = () => {
    dispatch(addGuarantor(guarantor));
    setEditMode(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Guarantor Details</h2>

      {!editMode ? (
        <div className="space-y-3">
          <p><strong>Name:</strong> {guarantorDetails?.name || '-'}</p>
          <p><strong>Occupation:</strong> {guarantorDetails?.occupation || '-'}</p>
          <p><strong>Phone:</strong> {guarantorDetails?.phone || '-'}</p>
          <p><strong>Relationship:</strong> {guarantorDetails?.relationship || '-'}</p>
          <p><strong>Address:</strong> {guarantorDetails?.address || '-'}</p>
          <button
            className="bg-blue-600 text-white px-5 py-2 mt-4 rounded hover:bg-blue-700 transition"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        </div>
      ) : (
        <>
          {[ 'name', 'occupation', 'phone', 'relationship', 'address' ].map((field) => (
            <div key={field} className="mb-4">
              <label className="block font-medium text-gray-700 mb-1 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={guarantor[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={field}
              />
            </div>
          ))}

          <div className="flex gap-4 mt-4">
            <button
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
              onClick={handleUpdate}
              disabled={updatingGuarantor}
            >
              {updatingGuarantor ? 'Saving...' : 'Save'}
            </button>
            <button
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GuarantorDetails;
