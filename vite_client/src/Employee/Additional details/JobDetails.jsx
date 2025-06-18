import React, { useRef, useState } from 'react';
import { BOTH_DOCUMENT_ENDPOINT } from '../../utils/constant';
const JobDetails = () => {
    const employeeId = localStorage.getItem('employeeId');
    const [additionalInfo, setAdditionalInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const offerLetterRef = useRef(null);
    const birthCertificateRef = useRef(null);
    const guarantorFormRef = useRef(null);
    const degreeCertificateRef = useRef(null);

    const handleAdditionalInfoChange = (type, field, value) => {
        setAdditionalInfo(prev => ({
            ...prev,
            [type]: {
                ...(prev[type] || {}),
                [field]: value
            }
        }));
    };

    const handleUpload = async (file, documentType) => {
        if (!file) {
            alert(`Please select a file for ${documentType}`);
            return;
        }

        setIsLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('documentType', documentType);
            
            // Add additional info if available
            if (additionalInfo[documentType]) {
                formData.append('additionalInfo', JSON.stringify(additionalInfo[documentType]));
            }

            const response = await fetch(`${BOTH_DOCUMENT_ENDPOINT}/document-upload`, {
                method: 'POST',
                body: formData,
                 credentials: 'include',
                // Don't set Content-Type header - the browser will set it with the correct boundary
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Failed to upload ${documentType}`);
            }

            alert(`${documentType} uploaded successfully!`);
            // Clear the file input after successful upload
            switch(documentType) {
                case 'OFFER_LETTER':
                    offerLetterRef.current.value = '';
                    break;
                case 'BIRTH_CERTIFICATE':
                    birthCertificateRef.current.value = '';
                    break;
                case 'GUARANTOR_FORM':
                    guarantorFormRef.current.value = '';
                    break;
                case 'DEGREE_CERTIFICATE':
                    degreeCertificateRef.current.value = '';
                    break;
            }
        } catch (error) {
            console.error(`Error uploading ${documentType}:`, error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Details / Upload Documents</h2>
            <div className="space-y-6">

                {/* Offer Letter */}
                <div className="border p-4 rounded-lg bg-white">
                    <h3 className="font-semibold text-lg mb-3">Offer Letter</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-full sm:w-1/3 font-medium text-gray-700">Upload File</label>
                            <input 
                                type="file" 
                                ref={offerLetterRef} 
                                className="flex-grow border p-2 rounded w-full"
                                accept=".pdf,.doc,.docx"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="font-medium text-gray-700">Effective Date</label>
                            <input
                                type="date"
                                onChange={(e) => handleAdditionalInfoChange('OFFER_LETTER', 'effectiveDate', e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>
                        <button
                            onClick={() => handleUpload(offerLetterRef.current.files[0], 'OFFER_LETTER')}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 self-end"
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>

                {/* Birth Certificate */}
                <div className="border p-4 rounded-lg bg-white">
                    <h3 className="font-semibold text-lg mb-3">Birth Certificate</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-full sm:w-1/3 font-medium text-gray-700">Upload File</label>
                            <input 
                                type="file" 
                                ref={birthCertificateRef} 
                                className="flex-grow border p-2 rounded w-full"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </div>
                        <button
                            onClick={() => handleUpload(birthCertificateRef.current.files[0], 'BIRTH_CERTIFICATE')}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 self-end"
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>

                {/* Guarantor Form */}
                <div className="border p-4 rounded-lg bg-white">
                    <h3 className="font-semibold text-lg mb-3">Guarantor's Form</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-full sm:w-1/3 font-medium text-gray-700">Upload File</label>
                            <input 
                                type="file" 
                                ref={guarantorFormRef} 
                                className="flex-grow border p-2 rounded w-full"
                                accept=".pdf,.doc,.docx"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-700">Guarantor Name</label>
                                <input
                                    type="text"
                                    onChange={(e) => handleAdditionalInfoChange('GUARANTOR_FORM', 'guarantorName', e.target.value)}
                                    className="border p-2 rounded"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-700">Guarantor Contact</label>
                                <input
                                    type="text"
                                    onChange={(e) => handleAdditionalInfoChange('GUARANTOR_FORM', 'guarantorContact', e.target.value)}
                                    className="border p-2 rounded"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => handleUpload(guarantorFormRef.current.files[0], 'GUARANTOR_FORM')}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 self-end"
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>

                {/* Degree Certificate */}
                <div className="border p-4 rounded-lg bg-white">
                    <h3 className="font-semibold text-lg mb-3">Degree Certificate</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <label className="w-full sm:w-1/3 font-medium text-gray-700">Upload File</label>
                            <input 
                                type="file" 
                                ref={degreeCertificateRef} 
                                className="flex-grow border p-2 rounded w-full"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-700">Institution</label>
                                <input
                                    type="text"
                                    onChange={(e) => handleAdditionalInfoChange('DEGREE_CERTIFICATE', 'institution', e.target.value)}
                                    className="border p-2 rounded"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-gray-700">Year Obtained</label>
                                <input
                                    type="text"
                                    onChange={(e) => handleAdditionalInfoChange('DEGREE_CERTIFICATE', 'yearObtained', e.target.value)}
                                    className="border p-2 rounded"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => handleUpload(degreeCertificateRef.current.files[0], 'DEGREE_CERTIFICATE')}
                            disabled={isLoading}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 self-end"
                        >
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default JobDetails;