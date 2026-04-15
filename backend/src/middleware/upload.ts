import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Pastikan folder uploads ada
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req: Request, file, cb) => {
        // Format readable: booking-{booking_id}-{timestamp}.ext
        const bookingId = req.body?.booking_id ?? 'unknown';
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = `booking-${bookingId}-${Date.now()}${ext}`;
        cb(null, filename);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar (JPG/PNG/WEBP) yang diperbolehkan'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // maks 5MB
    },
});