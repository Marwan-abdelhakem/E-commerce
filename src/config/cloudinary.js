// src/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path"; // بنحتاجه عشان نحدد المسار صح

// هنا بنقول لـ dotenv: "روح للمسار ده واقرأ الملف ده بالاسم ده"
dotenv.config({ path: path.resolve('src/config/.env.development') });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// للتأكد إن البيانات اتقرت صح
console.log('Cloudinary Config Check:', {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY ? "Key Loaded ✅" : "Key Not Found ❌"
});

export default cloudinary;