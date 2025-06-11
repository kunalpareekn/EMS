import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiSave, FiX, FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUpdateProject from '../../Hooks/useUpdateProject';
import useDeleteProject from '../../Hooks/useDeleteProject';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const project = useSelector(store => 
    store.project?.allProjects?.find(p => p._id === id)
  );
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({
    name: project?.name || '',
    status: project?.status || '',
    description: project?.description || '',
    deadline: project?.deadline || '',
    budget: project?.budget || ''
  });

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  if (!project) {
    return <div className="p-8 text-center">Project not found</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const result = await updateProject(project._id, editedProject);
      if (result.success) {
        toast.success('Project updated successfully!');
        setIsEditing(false);
        // Force a refresh of the project data by navigating away and back
        navigate('/projects', { state: { shouldRefresh: true } });
      } else {
        toast.error(result.message || 'Failed to update project');
      }
    } catch (error) {
      toast.error('An error occurred while updating the project');
      console.error('Update error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const result = await deleteProject(project._id);
        if (result.success) {
          toast.success('Project deleted successfully!');
          navigate('/projects', { replace: true });
        } else {
          toast.error(result.message || 'Failed to delete project');
        }
      } catch (error) {
        toast.error('An error occurred while deleting the project');
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiChevronLeft className="mr-1" /> Back to Projects
        </button>
        
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <FiEdit2 className="mr-2" /> Edit
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <FiTrash2 className="mr-2" /> Delete
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleUpdate}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <FiSave className="mr-2" /> Save
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditedProject({
                    name: project.name,
                    status: project.status,
                    description: project.description,
                    deadline: project.deadline,
                    budget: project.budget
                  });
                }}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                <FiX className="mr-2" /> Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              name="name"
              value={editedProject.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={editedProject.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={editedProject.deadline ? editedProject.deadline.split('T')[0] : ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
              <input
                type="number"
                name="budget"
                value={editedProject.budget}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={editedProject.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">{project.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>
              <div className="space-y-3">
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </p>
                <p><span className="font-medium">Manager:</span> {project.projectLeader?.name || 'Not assigned'}</p>
                <p><span className="font-medium">Start Date:</span> {new Date(project.createdAt).toLocaleDateString()}</p>
                {project.deadline && (
                  <p><span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}</p>
                )}
                {project.budget && (
                  <p><span className="font-medium">Budget:</span> ${project.budget.toLocaleString()}</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Team Members</h2>
              {project.projectMembers?.length > 0 ? (
                <ul className="space-y-2">
                  {project.projectMembers.map((member, index) => (
                    <li key={index} className="border-b pb-2 last:border-0">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-gray-600">{member.role}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No team members assigned</p>
              )}
            </div>
          </div>

          {project.description && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetailPage;