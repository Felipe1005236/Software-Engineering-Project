import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { useNavigate } from 'react-router-dom';
import { fetchWrapper } from '../utils/fetchWrapper';

const BASE_URL = 'http://localhost:3000/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await fetchWrapper('/projects');
      const sanitized = data.map((p) => ({
        id: p.projectID,
        name: p.title,
        priority: 'Medium',
        members: [], 
        status: p.status || 'Unknown',
        tasks: [], 
      }));
  
      setProjects(sanitized);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setProjects([]);
    }
  };

  const handleAdd = () => {
    setEditProject(null);
    setIsModalOpen(true);
  };

  const handleSave = async (project) => {
    try {
      if (editProject) {
        const data = await fetchWrapper(`/projects/${project.id}`, {
          method: 'PUT',
          body: JSON.stringify(project),
        });
        setProjects(prev => prev.map(p => p.id === project.id ? data : p));
      } else {
        const data = await fetchWrapper('/projects', {
          method: 'POST',
          body: JSON.stringify(project),
        });
        setProjects(prev => [...prev, data]);
      }
      setIsModalOpen(false);
      setEditProject(null);
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetchWrapper(`/projects/${id}`, {
        method: 'DELETE',
      });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-8 text-white">
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">📁 Projects</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-sm rounded shadow-md"
        >
          + New Project
        </button>
      </motion.div>

      {projects.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-zinc-400 italic"
        >
          No projects found. Start by creating a new one! 🚀
        </motion.p>
      ) : (
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id || i}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewTasks={() => navigate(`/projects/${project.id}/tasks`)}
            />
          ))}
        </motion.div>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editProject}
      />
    </div>
  );
};

export default Projects;
