import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let gfs: GridFSBucket;

export const initGridFS = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Keine Datenbankverbindung gefunden. Bitte stellen Sie sicher, dass Mongoose verbunden ist.');
  }
  gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: 'profileImages' });
};

export const getGFS = () => gfs;