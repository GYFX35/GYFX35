import React from 'react';
import {
  Home,
  Target,
  Users,
  Shield,
  Cpu,
  DollarSign,
  Globe,
  Heart,
  BookOpen,
  Briefcase
} from 'lucide-react';
import './App.css';

const navItems = [
  { name: 'Home', icon: Home, path: '../index.html', category: 'Core' },
  { name: 'Projects', icon: Target, path: '../projects.html', category: 'Core' },
  { name: 'Governments', icon: Globe, path: '../global-governments.html', category: 'Partners' },
  { name: 'NGOs', icon: Users, path: '../global-ngos.html', category: 'Partners' },
  { name: 'Security', icon: Shield, path: '../global-security.html', category: 'Safety' },
  { name: 'AI Assistant', icon: Briefcase, path: '../ai-assistant.html', category: 'Tools' },
  { name: 'GenAI Role', icon: Cpu, path: '../genai-role.html', category: 'Tools' },
  { name: 'Funding', icon: DollarSign, path: '../funding.html', category: 'Tools' },
  { name: 'WHO Data', icon: Heart, path: '../who.html', category: 'Data' },
  { name: 'World Bank', icon: Briefcase, path: '../world-bank.html', category: 'Data' },
  { name: 'Education', icon: BookOpen, path: '../global_education.html', category: 'Themes' },
];

function App() {
  const openLink = (path) => {
    // If in Chrome extension, path needs to be handled differently or use absolute URL for the production site
    // But for the website-integrated Codex, relative paths are better.
    // Let's check if we are in an extension context.
    const isExtension = typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime && chrome.runtime.id;

    if (isExtension) {
      const baseUrl = 'https://prompt-engineering.github.io/Global-Peace-Youth-Entrepreneurship-and-Wellbeing-Platform/';
      const targetPath = path.replace('../', '');
      chrome.tabs.create({ url: baseUrl + targetPath });
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="codex-container">
      <header className="codex-header">
        <h1>GPW Codex</h1>
        <p>Global Navigation Hub</p>
      </header>

      <div className="codex-grid">
        {navItems.map((item) => (
          <button
            key={item.name}
            className="codex-card"
            onClick={() => openLink(item.path)}
          >
            <item.icon className="codex-icon" size={24} />
            <span className="codex-name">{item.name}</span>
            <span className="codex-category">{item.category}</span>
          </button>
        ))}
      </div>

      <footer className="codex-footer">
        <p>&copy; 2024 GPW Platform</p>
      </footer>
    </div>
  );
}

export default App;
