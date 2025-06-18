import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProjectCard from './ProjectCard';
import useGetAllProjects from '../../Hooks/useGetAllProjects';
import { TextField, InputAdornment, IconButton, Container, Typography, Grid, Box, CircularProgress, Alert } from '@mui/material';
import { FiSearch, FiX } from 'react-icons/fi';

const ProjectsPage = () => {
  useGetAllProjects();
  const { allProjects, loading, error } = useSelector(store => store.project);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const filteredProjects = allProjects?.filter(project => {
    if (!debouncedSearchTerm) return true;
    return (
      project.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" mb={4} gap={2}>
        <Typography variant="h4" fontWeight="bold">Projects</Typography>

        <TextField
          label="Search projects"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')}>
                  <FiX />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {loading && (
        <Box textAlign="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Grid container spacing={3}>
          {filteredProjects?.length > 0 ? (
            filteredProjects.map(project => (
              <Grid item xs={12} md={6} lg={4} key={project._id}>
                <ProjectCard project={project} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity="info">
                {debouncedSearchTerm ? 'No projects match your search.' : 'No projects found.'}
              </Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default ProjectsPage;
