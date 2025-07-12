import { Router } from 'express';
import multer from 'multer';
import { Types } from 'mongoose';
import { getGFS } from '../gridFs';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/upload
 * erwartet Feld "file"; liefert { fileId }
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Keine Datei hochgeladen' });
      return;
    }

    const gfs = getGFS();
    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer); // Buffer in GridFS schreiben

    uploadStream.on('finish', () => {
      res.json({ fileId: uploadStream.id }); // ⬅️ diese ID kannst du im Frontend speichern
    });

    uploadStream.on('error', (err) => {
      console.error('Upload-Fehler:', err);
      res.status(500).json({ message: 'Upload fehlgeschlagen' });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serverfehler beim Upload' });
  }
});

/**
 * GET /api/upload/:fileId  –  Datei abrufen
 */
router.get('/:fileId', async (req, res) => {
  try {
    const fileId = new Types.ObjectId(req.params.fileId);
    const gfs = getGFS();

    const dl = gfs.openDownloadStream(fileId);
    dl.on('file', (f) => res.set('Content-Type', f.contentType || 'application/octet-stream'));
    dl.on('error', () => res.status(404).json({ message: 'Datei nicht gefunden' }));
    dl.pipe(res);
  } catch {
    res.status(400).json({ message: 'Ungültige Datei-ID' });
  }
});

export default router;
