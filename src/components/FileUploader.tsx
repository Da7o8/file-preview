import React, { useState } from 'react';
import { detectFileType } from '../utils/detectFileType';
import FilePreviewer from './FilePreviewer';

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [error, setError] = useState('');
  const [fileType, setFileType] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const type = detectFileType(selected.name);
    if (type) {
      setFile(selected);
      setFileType(type);
      setError('');
    } else {
      setError('Không hỗ trợ loại file này.');
    }
  };

  const handleUrlSubmit = async () => {
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const name = fileUrl.split('/').pop() || 'file';
      const file = new File([blob], name, { type: blob.type });

      const type = detectFileType(name);
      if (type) {
        setFile(file);
        setFileType(type);
        setError('');
      } else {
        setError('Không hỗ trợ loại file từ URL này.');
      }
    } catch {
      setError('Không thể tải file từ URL.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <input type="text" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="Nhập URL file" />
      <button onClick={handleUrlSubmit}>Tải từ URL</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {file && <FilePreviewer file={file} fileType={fileType} />}
    </div>
  );
};

export default FileUploader;
