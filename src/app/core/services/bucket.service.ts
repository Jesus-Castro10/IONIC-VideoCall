import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BucketService {

  private supabase = createClient(environment.supabaseConfig.url, environment.supabaseConfig.key);

  async uploadImage(blob: Blob, path: string): Promise<string> {
    const { data, error } = await this.supabase.storage.from('jitcall/images').upload(path, blob);
    if (error) throw error;

    const { publicUrl } = this.supabase.storage.from('jitcall/images').getPublicUrl(path).data;
    return publicUrl;
  }

  async uploadFile(blob: Blob, path: string): Promise<string> {
    const { data, error } = await this.supabase.storage.from('jitcall/files').upload(path, blob);
    if (error) throw error;

    const { publicUrl } = this.supabase.storage.from('jitcall/files').getPublicUrl(path).data;
    return publicUrl;
  }

  // async uploadAudio(blob: Blob, path: string): Promise<string> {

  //   const { data, error } = await this.supabase.storage.from('jitcall/audio').upload(path, blob,{mimeType: 'audio/aac'});
  //   if (error) throw error;

  //   const { publicUrl } = this.supabase.storage.from('jitcall/audio').getPublicUrl(path).data;
  //   return publicUrl;
  // }

  async uploadAudio(blob: Blob, path: string): Promise<string> {
  const { error } = await this.supabase.storage
    .from('jitcall/audio')
    .upload(path, blob, {
      contentType: blob.type || 'audio/aac',
      upsert: true,
    });

  if (error) {
    console.error('Error al subir el audio:', error);
    throw error;
  }

  const { data } = this.supabase.storage
    .from('jitcall/audio')
    .getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error('No se pudo obtener la URL pública del audio');
  }

  return data.publicUrl;
}

  
  async uploadVideo(blob: Blob, path: string): Promise<string> {
    const { data, error } = await this.supabase.storage.from('jitcall/video').upload(path, blob);
    if (error) throw error;

    const { publicUrl } = this.supabase.storage.from('jitcall/video').getPublicUrl(path).data;
    return publicUrl;
  }
}