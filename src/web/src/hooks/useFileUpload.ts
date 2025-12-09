import { useState } from "react"
import { FileService } from "../services/fileService.ts"

/**
 * Custom hook to handle file upload logic.
 *
 * @returns {Object} The upload state and the upload function.
 * @returns {boolean} isUploading - Indicates if a file is currently being uploaded.
 * @returns {string|null} uploadError - Error message if the upload fails.
 * @param fileService
 */
export const useFileUpload = (fileService: FileService) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const uploadFile = async (file: File, fileName?: string) => {
    const formData = new FormData()
    formData.append(fileName ?? file.name, file)

    setIsUploading(true)
    setUploadError(null)

    try {
      const response = await fileService.upload(formData)
      return response
    } catch (error) {
      setUploadError("Failed to upload file. Please try again")
    } finally {
      setIsUploading(false)
    }
  }

  const uploadFiles = async (files: File[]) => {
    const formData = new FormData()
    for (const file of files) {
      formData.append(file.name, file)
    }
    setIsUploading(true)
    setUploadError(null)

    try {
      return await fileService.uploadMany(formData)
    } catch (error) {
      setUploadError("Failed to upload file. Please try again")
    } finally {
      setIsUploading(false)
    }
  }

  return { isUploading, uploadError, uploadFile, uploadFiles }
}
