import config from '../config';
import { FileService } from '../services/fileService.ts';

export const useFileService = (sessionJwt: string | undefined) => {
  return new FileService(config.api.baseUrl, 'files', sessionJwt || '');
};
