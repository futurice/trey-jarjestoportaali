import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { BlobFile } from "../models/file.ts"
import { FileService } from "../services/fileService.ts"

export const useFileList = (fileService: FileService) => {
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<BlobFile[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const fileList = await fileService.getList()
        setFiles(fileList)
      } catch (err) {
        setError("Failed to fetch files. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiles()
  }, [fileService])

  return { files, isLoading, error }
}

export const useFilesForOrganization = (
  fileService: FileService,
  organizationId: string | null,
) => {
  return useQuery<BlobFile[], AxiosError>({
    queryKey: ["files", organizationId],
    queryFn: async () => {
      if (!organizationId) return []
      const fileList = await fileService.getByOrganization(organizationId)
      return fileList
    },
    enabled: !!organizationId,
    retry: false,
  })
}

export const getFileByName = async (
  fileService: FileService,
  fileName: string,
): Promise<Blob | null> => {
  try {
    const file = await fileService.getFileByName(fileName)
    return file
  } catch (error) {
    console.error("Error fetching file by name:", error)
    return null
  }
}

export const useGetBlobByName = (fileService: FileService, fileName: string) => {
  return useQuery<Blob | null, AxiosError>({
    queryKey: ["blobFile", fileName],
    queryFn: async () => {
      const file = await fileService.getFileByName(fileName)
      return file
    },
    enabled: !!fileName,
  })
}

export const useGetFileByName = (fileService: FileService, fileId: string) => {
  return useQuery<BlobFile | null, AxiosError>({
    queryKey: ["file", fileId],
    queryFn: async () => {
      const file = await fileService.getFileDetailsByName(fileId)
      return file
    },
  })
}
