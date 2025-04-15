import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import './PopupContainer.css';

type Section = 'home' | 'credentials' | 'settings';

interface Credential {
  id: string;
  name: string;
  type: string;
  service: string;
  status: string;
  [key: string]: any;
}

interface ApiResponse {
  data: {
    credentials: Credential[];
  };
  error?: string;
}

const API_BASE = '/api/v1/credentials';

const PopupContainer: React.FC = () => {
  const [section, setSection] = useState<Section>('home');
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch credentials when section is 'credentials'
  useEffect(() => {
    if (section !== 'credentials') return;
    setLoading(true);
    setError(null);
    fetch(API_BASE)
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to load credentials');
        }
        return res.json() as Promise<ApiResponse>;
      })
      .then(data => {
        setCredentials(data.data.credentials || []);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [section]);

  return (
    <div>
      <Navigation currentSection={section} onSectionChange={setSection} />
      {section === 'home' && <div>Home Content</div>}
      {section === 'credentials' && (
        <div>
          {loading && <p>Loading credentials...</p>}
          {error && <p>Error: {error}</p>}
          <ul>
            {credentials.map(credential => (
              <li key={credential.id}>
                {credential.name} - {credential.service}
              </li>
            ))}
          </ul>
        </div>
      )}
      {section === 'settings' && <div>Settings Content</div>}
    </div>
  );
};

export default PopupContainer;
