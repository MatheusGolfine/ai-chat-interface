import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const EditableContentPage: React.FC = () => {
  const location = useLocation();
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const encodedContent = searchParams.get('content');

    if (encodedContent) {
      try {
        const decodedContent = decodeURIComponent(encodedContent);
        setHtmlContent(decodedContent);
      } catch (error) {
        console.error('Error decoding URL parameter:', error);
        setHtmlContent('Error loading content.');
      }
    } else {
      setHtmlContent('No content provided.');
    }
  }, [location.search]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Generated Content</h1>
      <textarea
        style={{
          width: '100%',
          minHeight: '400px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          resize: 'vertical', // Allow vertical resizing
          fontFamily: 'monospace',
        }}
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
      />
    </div>
  );
};

export default EditableContentPage;