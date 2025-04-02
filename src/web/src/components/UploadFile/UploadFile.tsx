import { useStytch } from '@stytch/react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useFileService } from '../../hooks/useFileService';
import { useFileUpload } from '../../hooks/useFileUpload';
import styles from './UploadFile.module.css';

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null);

  const { session } = useStytch();
  const sessionJwt = useMemo(() => session?.getTokens()?.session_jwt, [session]);

  const fileService = useFileService(sessionJwt);
  const { isUploading, uploadError, uploadFile } = useFileUpload(fileService);

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
        type="button"
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
