import type { BlobFile } from '../models/file.ts';
import { RestService } from './restService.ts';

export class FileService extends RestService<BlobFile> {
  upload = async (formData: FormData) => {
    return await this.client.request<BlobFile>({
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
}
