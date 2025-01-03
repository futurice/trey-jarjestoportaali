import {RestService} from "./restService.ts";
import {BlobFile} from "../models/file.ts";

export class FileService extends RestService<BlobFile> {
    public constructor(baseUrl: string, baseRoute: string) {
        super(baseUrl, baseRoute);
    }

    upload = async (formData: FormData) => {
        return await this.client.request<BlobFile>({
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }
}