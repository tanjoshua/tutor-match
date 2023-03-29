import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../services/s3.service";
import { S3_PP_BUCKET_NAME } from "../utils/config";

const profilePicUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: S3_PP_BUCKET_NAME,
    metadata: function (_req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (_req, file, cb) {
      cb(null, `profile-pic-${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

export default profilePicUpload;
