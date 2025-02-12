import {useEffect, useState} from "react";
import {FileService} from "../services/fileService.ts";
import config from "../config";
import {BlobFile} from "../models/file.ts";
import UploadFile from "./UploadFile/UploadFile.tsx";
import ListFiles from "./ListFiles/ListFiles.tsx";

const MyFiles = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<BlobFile[]>([]);

  useEffect(() => {
    const fileService = new FileService(config.api.baseUrl, '/files');
    setIsLoading(true);
    fileService.getList() // Todo: add user id
        .then(files => setFiles(files))
        .finally(() => setIsLoading(false));
  }, []);

  return <>
    <h1>MyFiles</h1>
    <ListFiles files={files} isLoading={isLoading} />

    <UploadFile />
  </>;
}

export default MyFiles
