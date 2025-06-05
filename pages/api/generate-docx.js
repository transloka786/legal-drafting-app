import { generateDraft } from '../../lib/openai';
import { Packer, Paragraph, TextRun, Document as DocxDocument } from 'docx';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const variables = req.body;
  try {
    const draftText = await generateDraft(variables);
    // Build DOCX
    const doc = new DocxDocument({
      sections: [
        {
          properties: { page: { size: { orientation: 'portrait', width: 11906, height: 16838 } } },
          children: [],
        },
      ],
    });
    draftText.split('\n').forEach((line) => {
      doc.sections[0].children.push(
        new Paragraph({ children: [new TextRun({ text: line })] })
      );
    });
    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Disposition', 'attachment; filename=legal-draft.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
