import React from 'react';
import './ProfileSidebar.css';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = ({ activeSection, onSectionClick }) => {
    const navigate = useNavigate();

    const sections = [
        'Personal Details',
        'Contact Details',
        'Next of kin Details',
        'Education Qualifications',
        'Guarantor Details',
        'Family Details',
        'Job Details',
        'Financial Details',
    ];

    const handleSectionClick = (section) => {
        onSectionClick(section); // Update the active section
        switch (section) {
            case 'Contact Details':
                navigate('/contact-details');
                break;
            case 'Personal Details':
                navigate('/profile-details');
                break;
            case 'Next of kin Details':
                navigate('/next-of-kin-details');
                break;
            case 'Education Qualifications':    
                navigate('/education-qualifications');
                break;
            case 'Guarantor Details':
                navigate('/guarantor-details');
                break;
            case 'Family Details':
                navigate('/family-details');
                break;
            case 'Job Details':
                navigate('/job-details');
                break;
            case 'Financial Details':
                navigate('/financial-details');
                break;
                
            // Add other cases as needed
            default:
                break;
        }
    };

    return (
        <div className="profile-sidebar">
            <ul>
                {sections.map((section, index) => (
                    <li
                        key={index}
                        className={`sidebar-item ${activeSection === section ? 'active' : ''}`} // Highlight active section
                        onClick={() => handleSectionClick(section)}
                    >
                        {section}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileSidebar;
