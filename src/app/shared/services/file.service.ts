import { Injectable } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import type { PickFilesResult } from '@capawesome/capacitor-file-picker';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor() {}

  async pickFile(): Promise<PickFilesResult['files'][0] | null> {
    try {
      const result = await FilePicker.pickFiles({
        types: ['*/*'],
      });
      return result.files.length > 0 ? result.files[0] : null;
    } catch (error: any) {
      if (error?.message?.includes('User cancelled')) {
        console.warn('El usuario canceló la selección de archivo.');
      } else {
        console.error('Error al seleccionar archivo:', error);
      }
      return null;
    }
  }
}
