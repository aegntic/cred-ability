import React from 'react';

type Section = 'home' | 'credentials' | 'settings';

interface NavigationProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, onSectionChange }) => {
  return (
    <nav style={{ display: 'flex', borderBottom: '1px solid #ccc' }} aria-label="Main navigation">
      <button
        style={{
          flex: 1,
          padding: '8px',
          background: currentSection === 'home' ? '#e0e0e0' : undefined,
          fontWeight: currentSection === 'home' ? 'bold' : undefined,
        }}
        aria-current={currentSection === 'home' ? 'page' : undefined}
        onClick={() => onSectionChange('home')}
      >
        Home
      </button>
      <button
        style={{
          flex: 1,
          padding: '8px',
          background: currentSection === 'credentials' ? '#e0e0e0' : undefined,
          fontWeight: currentSection === 'credentials' ? 'bold' : undefined,
        }}
        aria-current={currentSection === 'credentials' ? 'page' : undefined}
        onClick={() => onSectionChange('credentials')}
      >
        Credentials
      </button>
      <button
        style={{
          flex: 1,
          padding: '8px',
          background: currentSection === 'settings' ? '#e0e0e0' : undefined,
          fontWeight: currentSection === 'settings' ? 'bold' : undefined,
        }}
        aria-current={currentSection === 'settings' ? 'page' : undefined}
        onClick={() => onSectionChange('settings')}
      >
        Settings
      </button>
    </nav>
  );
};

export default Navigation;
