import React, { useState } from 'react';
import DocumentForm from '../components/DocumentForm';
import DocumentPreview from '../components/DocumentPreview';
import { generateDraft } from '../lib/openai';

export default function Home() {
  const [draftContent, setDraftContent] = useState('');

  async function handleGenerate(variables) {
    try {
      const generated = await generateDraft(variables);
      setDraftContent(generated);
    } catch (error) {
      console.error(error);
      alert('Error generating draft. Please check console for details.');
    }
  }

  return (
    <div>
      <DocumentForm onGenerate={handleGenerate} />
      <DocumentPreview content={draftContent} />
    </div>
  );
}
