import React, { useRef } from 'react';
import './JobDetails.css';

const JobDetails = () => {
    const employeeId = localStorage.getItem('employeeId');

    // Refs for file inputs
    const offerLetterRef = useRef(null);
    const birthCertificateRef = useRef(null);
    const guarantorFormRef = useRef(null);
    const degreeCertificateRef = useRef(null);

    const handleUpload = async (file, documentType) => {
        if (!file) {
            alert(`Please select a file for ${documentType}`);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('document', file); // Ensure 'document' matches the field name in Multer
            formData.append('documentType', documentType);

            const response = await fetch(`/api/employees/${employeeId}/upload-document`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorDetails = await response.text(); // Log server response for debugging
                console.error(`Server response: ${errorDetails}`);
                throw new Error(`Failed to upload ${documentType}`);
            }

            alert(`${documentType} uploaded successfully and saved in the database!`);
        } catch (error) {
            console.error(`Error uploading ${documentType}:`, error);
            alert(`Error uploading ${documentType}: ${error.message}`);
        }
    };

    return (
        <div className="job-details-container">
            <h2>Job Details / Upload Documents</h2>
            <div className="upload-section">
                <div className="upload-row">
                    <label>Upload Offer Letter</label>
                    <input type="file" ref={offerLetterRef} />
                    <button onClick={() => handleUpload(offerLetterRef.current.files[0], 'offerLetter')}>
                        Upload
                    </button>
                </div>

                <div className="upload-row">
                    <label>Upload Birth Certificate</label>
                    <input type="file" ref={birthCertificateRef} />
                    <button onClick={() => handleUpload(birthCertificateRef.current.files[0], 'birthCertificate')}>
                        Upload
                    </button>
                </div>

                <div className="upload-row">
                    <label>Upload Guarantor's Form</label>
                    <input type="file" ref={guarantorFormRef} />
                    <button onClick={() => handleUpload(guarantorFormRef.current.files[0], 'guarantorForm')}>
                        Upload
                    </button>
                </div>

                <div className="upload-row">
                    <label>Upload Degree Certificate</label>
                    <input type="file" ref={degreeCertificateRef} />
                    <button onClick={() => handleUpload(degreeCertificateRef.current.files[0], 'degreeCertificate')}>
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
