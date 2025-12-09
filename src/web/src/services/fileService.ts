import { BlobFile } from "../models/file.ts"
import { RestService } from "./restService.ts"

export class FileService extends RestService<BlobFile> {
  public constructor(baseUrl: string, baseRoute: string, authToken: string) {
    super(baseUrl, baseRoute, authToken)
  }

  upload = async (formData: FormData) => {
    return await this.client.request<BlobFile>({
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }

  uploadMany = async (formData: FormData) => {
    return await this.client.request<BlobFile[]>({
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  }

  getByOrganization = async (organizationId: string): Promise<BlobFile[]> => {
    const response = await this.client.request<BlobFile[]>({
      method: "GET",
      url: `organization?organizationId=${organizationId}`,
    })

    return response.data
  }

  getFileByName = async (fileName: string): Promise<Blob> => {
    const response = await this.client.request<Blob>({
      method: "GET",
      url: `file/${fileName}`,
    })

    return response.data
  }
}
