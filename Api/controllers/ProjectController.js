const Project = require('../models/Project');

// Get all projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { name, status } = req.body;
        const newProject = new Project({ name, status });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { name, status, updatedAt: Date.now() },
            { new: true }
        );
        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
