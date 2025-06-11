import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNextOfKin } from '../../context/employeeDetailsSlice';

function NextOfKinDetails() {
    const dispatch = useDispatch();
    const { employee, loading, error: reduxError } = useSelector(state => state.employeeDetails);
    
    const [formData, setFormData] = useState({
        name: '',
        occupation: '',
        phone: '',
        relationship: 'Relative',
        address: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (employee?.nextOfKin) {
            setFormData(employee.nextOfKin);
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

   const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setLocalError(null);
  
  try {
    const result = await dispatch(addNextOfKin(formData));
    
    if (addNextOfKin.fulfilled.match(result)) {
      setIsEditing(false);
      // Optional: show success message
    } else {
      throw new Error(result.payload || 'Failed to save details');
    }
  } catch (error) {
    setLocalError(error.message);
    console.error('Submission error:', {
      error: error.toString(),
      stack: error.stack
    });
  } finally {
    setIsSubmitting(false);
  }
};

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Next of Kin Details</h2>

                {(reduxError || localError) && (
                    <div className="mb-4 p-2 text-red-600 bg-red-100 rounded">
                        {reduxError || localError}
                    </div>
                )}

                {!isEditing ? (
                    <div className="space-y-3">
                        <p><strong>Name:</strong> {formData.name || 'N/A'}</p>
                        <p><strong>Occupation:</strong> {formData.occupation || 'N/A'}</p>
                        <p><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
                        <p><strong>Relationship:</strong> {formData.relationship || 'N/A'}</p>
                        <p><strong>Address:</strong> {formData.address || 'N/A'}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Edit
                        </button>
                    </div>
                ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Occupation</label>
                            <input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Relationship</label>
                            <select
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            >
                                <option value="Relative">Relative</option>
                                <option value="Friend">Friend</option>
                                <option value="Colleague">Colleague</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none"
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:bg-green-400"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default NextOfKinDetails;