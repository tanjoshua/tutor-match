import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // I have no idea why ts is raising an error
    // @ts-ignore
    folder: "listing-images",
  },
});

export default multer({ storage });
