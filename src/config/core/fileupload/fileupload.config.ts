import { diskStorage } from 'multer';
import { DefaultConfig } from 'src/config/default.config';
import { v4 as uuid } from 'uuid';

/**
 * 이미지 업로드 처리
 */
export const uploadImage = {
  storage: diskStorage({
    destination: DefaultConfig.files.upload.image.getUploadFilePath(), // 파일 업로드 경로
    filename: (req, file, cb) => {
      const fileName: string = uuid();
      cb(null, fileName);
    },
  }),
};
