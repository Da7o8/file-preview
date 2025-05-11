export const detectFileType = (filename: string): string | null => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return null;

  switch (ext) {
    case 'xlsx':
      return 'excel';
    case 'docx':
      return 'docx';
    case 'pdf':
      return 'pdf';
    case 'jpeg':
    case 'jpg':
    case 'png':
      return 'image';
    default:
      return null;
  }
};
