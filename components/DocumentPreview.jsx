import React, { useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Packer, Paragraph, TextRun, Document as DocxDocument } from 'docx';

export default function DocumentPreview({ content, variables }) {
  const previewRef = useRef();

  // Function to convert plain text into docx paragraphs
  const generateDocx = async () => {
    const doc = new DocxDocument({
      sections: [
        {
          properties: { page: { size: { orientation: 'portrait', width: 11906, height: 16838 } } }, //	A4 in twips
          children: [],
        },
      ],
    });
    // Simple splitting on newlines; for more complex formatting, parse headings, lists, etc.
    content.split('\n').forEach((line) => {
      doc.sections[0].children.push(
        new Paragraph({
          children: [new TextRun({ text: line })],
        })
      );
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'legal-draft.docx');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Draft Preview (A4)</h2>

      <div className="a4" ref={previewRef}>
        <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
          {content || 'Your generated draft will appear here...'}
        </pre>
      </div>

      {content && (
        <div className="mt-4 text-right">
          <button
            onClick={generateDocx}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Download as Word (.docx)
          </button>
        </div>
      )}
    </div>
  );
}
