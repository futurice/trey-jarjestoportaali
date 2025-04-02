import { useState } from 'react';
import { FileService } from "../services/fileService.ts";

/**
 * Custom hook to handle file upload logic.
 *
 * @returns {Object} The upload state and the upload function.
 * @returns {boolean} isUploading - Indicates if a file is currently being uploaded.
 * @returns {string|null} uploadError - Error message if the upload fails.
 * @param fileService
 */
export const useFileUpload = (fileService: FileService) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadError(null);

    try {
      await fileService.upload(formData);
    } catch (error) {
      setUploadError('Failed to upload file. Please try again');
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadError, uploadFile };
}; 