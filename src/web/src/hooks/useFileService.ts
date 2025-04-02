import { FileService } from "../services/fileService.ts";
import config from "../config";

export const useFileService = (sessionJwt: string | undefined) => {
  return new FileService(config.api.baseUrl, 'files', sessionJwt!);
}; 