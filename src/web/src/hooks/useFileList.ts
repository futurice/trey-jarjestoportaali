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

export const getFileById = async (
  fileService: FileService,
  fileId: string,
): Promise<Blob | null> => {
  try {
    const file = await fileService.getFileById(fileId)
    return file
  } catch (error) {
    console.error("Error fetching file by ID:", error)
    return null
  }
}

export const useGetBlobById = (fileService: FileService, fileId: string) => {
  return useQuery<Blob | null, AxiosError>({
    queryKey: ["blobFile", fileId],
    queryFn: async () => {
      const file = await fileService.getFileById(fileId)
      return file
    },
    enabled: !!fileId,
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
