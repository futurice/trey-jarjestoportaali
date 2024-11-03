import {useEffect, useState} from "react";
import {FileService} from "../services/fileService.ts";
import config from "../config";
import {BlobFile} from "../models/file.ts";

const MyFiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<BlobFile[]>([]);

  const fileService = new FileService(config.api.baseUrl, '/lists');

  useEffect(() => {
    setIsLoading(true);
    fileService.getList() // Todo: add user id
        .then(files => setFiles(files))
        .finally(() => setIsLoading(false));
  }, []);

  return <>
    <h1>MyFiles</h1>
    <div>
      {isLoading
          ? <p>Loading...</p>
          : files.map(file => (
          <div key={file.name}>Filename: {file.name}</div>
      ))}
    </div>
  </>;
}

export default MyFiles
