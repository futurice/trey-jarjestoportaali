import { useEffect, useState } from 'react';
import type { BlobFile } from '../models/file.ts';
import type { FileService } from '../services/fileService.ts';

export const useFileList = (fileService: FileService) => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fileList = await fileService.getList();
        setFiles(fileList);
      } catch (_err) {
        setError('Failed to fetch files. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [fileService]);

  return { files, isLoading, error };
};
