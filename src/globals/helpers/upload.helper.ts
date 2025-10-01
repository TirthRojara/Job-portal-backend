import multer from 'multer';
import path from 'path';
import fs from 'fs/promises'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../uploads/company-images');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

export async function deleteImage(imageUrl: string) {
  const uploadDir = path.join(__dirname, '../../../uploads/company-images', imageUrl);

  try {
    await fs.unlink(uploadDir);
  } catch (error) {
    console.error(`Error deleting image: ${error}`);
  }
}

export const uploadCompanyImage = multer({ storage: storage });
