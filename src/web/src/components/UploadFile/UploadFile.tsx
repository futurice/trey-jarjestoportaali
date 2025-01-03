import React, { useState } from 'react';
import config from "../../config";
import { FileService } from "../../services/fileService.ts";
import styles from './UploadFile.module.css';

/**
 * Custom hook to handle file upload logic.
 *
 * @param {string} baseUrl - The base URL for the API.
 * @param {string} baseRoute - The base route for the file upload endpoint.
 * @returns {Object} The upload state and the upload function.
 * @returns {boolean} isUploading - Indicates if a file is currently being uploaded.
 * @returns {string|null} uploadError - Error message if the upload fails.
 */
const useFileUpload = (baseUrl: string, baseRoute: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileService = new FileService(baseUrl, baseRoute);
      const response = await fileService.upload(formData);
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadError, uploadFile };
};

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const { isUploading, uploadError, uploadFile } = useFileUpload(config.api.baseUrl, '/files');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div className={styles.uploadFileContainer}>
      <h2>Upload File</h2>
      <label htmlFor="file-upload" className={styles.fileUploadLabel}>
        Choose a file to upload
      </label>
      <input
        type="file"
        id="file-upload"
        onChange={handleFileChange}
        className={styles.fileUploadInput}
        aria-describedby="file-upload-description"
      />
      <button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className={styles.uploadButton}
        aria-busy={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadError && (
        <p id="file-upload-error" className={styles.uploadError} role="alert">
          {uploadError}
        </p>
      )}
      <p id="file-upload-description" style={{ display: 'none' }}>
        Please select a file to upload and then click the upload button.
      </p>
    </div>
  );
};

export default UploadFile;