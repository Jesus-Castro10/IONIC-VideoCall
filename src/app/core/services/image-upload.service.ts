import {Injectable} from '@angular/core';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {Storage} from '@angular/fire/storage';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private storage: Storage) {}

  async uploadImage(file: File, path: string): Promise<string> {
    const filePath = `${path}/${uuidv4()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
}
