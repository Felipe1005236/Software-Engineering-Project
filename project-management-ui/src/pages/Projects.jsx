import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch(`${BASE_URL}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
  
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
      console.error('Failed to fetch projects. Using fallback data.');
      setProjects([
        {
          id: '1',
          name: 'Apollo Redesign',
          priority: 'High',
          members: ['Alice', 'Javier'],
          status: 'In Progress',
          tasks: [
            {
              id: 'task-1',
              title: 'Fix Login Bug',
              assignee: 'Kavya Shah',
              due: '2025-04-05',
              status: 'In Progress',
              description: 'Handle expired sessions gracefully.',
            },
          ],
        },
        {
          id: '2',
          name: 'Marketing Revamp',
          priority: 'Medium',
          members: ['Kavya'],
          status: 'Planning',
        },
        {
          id: '3',
          name: 'Bug Fix Sprint',
          priority: 'Low',
          members: ['Saim', 'Dev Bot'],
          status: 'Completed',
        },
      ]);
    }
  };

  const handleAdd = () => {
    setEditProject(null);
    setIsModalOpen(true);
  };

  const handleSave = async (newProject) => {
    try {
      const url = editProject
        ? `${BASE_URL}/projects/${editProject.id}`
        : `${BASE_URL}/projects`;
  
      const method = editProject ? 'PUT' : 'POST';
  
      const payload = editProject
        ? {
            title: newProject.name,
            status: newProject.status || 'Planning',
          }
        : {
            title: newProject.name,
            status: newProject.status || 'Planning',
          };
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error('Failed to save project');
  
      const saved = await response.json();
  
      setProjects((prev) =>
        editProject
          ? prev.map((p) => (p.id === editProject.id ? { ...saved } : p))
          : [...prev, saved]
      );
    } catch (err) {
      console.error('Save failed:', err);
    }
    setIsModalOpen(false);
  };



  const handleDelete = async (target) => {
    try {
      const response = await fetch(`${BASE_URL}/projects/${target.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      setProjects((prev) => prev.filter((p) => p.id !== target.id));
    } catch (err) {
      console.error('Delete failed:', err);
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
