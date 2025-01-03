import { BlobFile } from "../../models/file.ts";
import styles from './ListFiles.module.css';

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