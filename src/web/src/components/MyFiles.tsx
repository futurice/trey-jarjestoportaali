import { useMemo } from "react"
import { useAuth } from "../authentication/AuthContext"
import { useFileList } from "../hooks/useFileList"
import { useFileService } from "../hooks/useFileService"
import ListFiles from "./ListFiles/ListFiles"
import UploadFile from "./UploadFile/UploadFile"

const MyFiles = () => {
  const { session } = useAuth()
  const sessionJwt = useMemo(() => session?.access_token, [session])

  const fileService = useFileService(sessionJwt)
  const { files, isLoading, error } = useFileList(fileService)

  return (
    <>
      <h1>MyFiles</h1>
      <ListFiles files={files} isLoading={isLoading} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <UploadFile />
    </>
  )
}

export default MyFiles
