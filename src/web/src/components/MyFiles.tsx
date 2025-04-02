import { useMemo } from "react";
import { useStytch } from "@stytch/react";
import UploadFile from "./UploadFile/UploadFile";
import ListFiles from "./ListFiles/ListFiles";
import { useFileService } from "../hooks/useFileService";
import { useFileList } from "../hooks/useFileList";

const MyFiles = () => {
  const { session } = useStytch();
  const sessionJwt = useMemo(() => session?.getTokens()?.session_jwt, [session]);

  const fileService = useFileService(sessionJwt);
  const { files, isLoading, error } = useFileList(fileService);

  return <>
    <h1>MyFiles</h1>
    <ListFiles files={files} isLoading={isLoading} />
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <UploadFile />
  </>;
}

export default MyFiles;
