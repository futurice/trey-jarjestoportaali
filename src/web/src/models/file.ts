export interface BlobFile {
  id?: string
  uri?: string
  content?: string
  fileName?: string
  contentType?: string
  createdDate?: Date
  updatedDate?: Date
  uploadedBy?: string
  uploadedByUsername?: string
  organizationId?: string
  organizationName?: string
  originalFileName?: string
  fileSize?: number
}
