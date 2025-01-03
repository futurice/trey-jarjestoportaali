import { BlobFile } from "../../models/file.ts";
import styles from './ListFiles.module.css';

/**
 * ListFiles component displays a list of files with their creation and last modified dates.
 *
 * @component
 * @example
 * const files = [
 *   { id: '1', uri: '/path/to/file1', createdOn: new Date(), lastModified: new Date() },
 *   { id: '2', uri: '/path/to/file2', createdOn: new Date(), lastModified: new Date() }
 * ];
 * const isLoading = false;
 * return <ListFiles files={files} isLoading={isLoading} />;
 *
 * @param {Object} props - Component props
 * @param {BlobFile[]} props.files - Array of file objects to display
 * @param {boolean} props.isLoading - Flag indicating if the files are being loaded
 */
function ListFiles(props: { files: BlobFile[], isLoading: boolean }) {
  return (
    <div className={styles.listFilesContainer}>
      {props.isLoading ? (
        <p className={styles.loadingMessage}>Loading...</p>
      ) : (
        <ul>
          {props.files.map(file => (
            <li key={file.id}>
              <a href={file.uri} aria-label={`Download file ${file.id}`}>
                {file.id}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListFiles;