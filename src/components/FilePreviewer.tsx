import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { getDocument } from 'pdfjs-dist';

interface Props {
  file: File;
  fileType: string;
}

const FilePreviewer: React.FC<Props> = ({ file, fileType }) => {
  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const reader = new FileReader();

    if (fileType === 'excel') {
      reader.onload = (e) => {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const html = XLSX.utils.sheet_to_html(sheet);
        setContent(<div dangerouslySetInnerHTML={{ __html: html }} />);
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === 'docx') {
      reader.onload = async (e) => {
        const result = await mammoth.convertToHtml({ arrayBuffer: e.target!.result as ArrayBuffer });
        setContent(<div dangerouslySetInnerHTML={{ __html: result.value }} />);
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === 'pdf') {
      reader.onload = async (e) => {
        const pdf = await getDocument({ data: e.target!.result as ArrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context!, viewport }).promise;
        setContent(<div><canvas ref={(el) => el?.replaceWith(canvas)} /></div>);
      };
      reader.readAsArrayBuffer(file);
    } else if (fileType === 'image') {
      const imageUrl = URL.createObjectURL(file);
      setContent(<img src={imageUrl} alt="Preview" style={{ maxWidth: '100%' }} />);
    }
  }, [file, fileType]);

  return <div className="preview">{content}</div>;
};

export default FilePreviewer;
