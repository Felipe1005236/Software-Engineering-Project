import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProfilePage = () => {
    // Sample data - replace with actual API call
    const profileData = {
        id: '123',
        name: 'John Doe',
        role: 'Senior Developer',
        team: 'Frontend Team',
        department: 'Engineering',
        bio: 'Passionate about creating intuitive user experiences with React',
        skills: ['React', 'TypeScript', 'Node.js', 'CSS'],
        achievements: [
            'Employee of the Month (June 2023)',
            'Best UI Design Award 2022'
        ],
        contact: {
            email: 'john.doe@example.com',
            location: 'Office C2'
        }
    };

    return (
        <div className="container profile-page">
            <div className="profile-header">
                <div className="profile-avatar">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="profile-info">
                    <h1>{profileData.name}</h1>
                    <p className="role">{profileData.role}</p>
                    <p className="team">{profileData.team} • {profileData.department}</p>
                </div>
            </div>

            <div className="profile-section">
                <h2>About</h2>
                <p>{profileData.bio}</p>
            </div>

            <div className="profile-section">
                <h2>Skills</h2>
                <div className="skills-list">
                    {profileData.skills.map(skill => (
                        <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                </div>
            </div>

            <div className="profile-section">
                <h2>Achievements</h2>
                <ul className="achievements-list">
                    {profileData.achievements.map((item, index) => (
                        <li key={index}>🏆 {item}</li>
                    ))}
                </ul>
            </div>

            <div className="profile-actions">
                <Link to="/account" className="btn">My Account</Link>
                <button className="btn btn-secondary">Contact</button>
            </div>
        </div>
    );
};

export default ProfilePage;