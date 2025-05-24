import { Injectable } from '@angular/core';
import { VoiceRecorder } from 'capacitor-voice-recorder';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  constructor() {}

  async requestPermissions(): Promise<void> {
    const result = await VoiceRecorder.requestAudioRecordingPermission();
    if (!result.value) {
      throw new Error('Permiso de grabación no concedido');
    }
  }

  async startRecording(): Promise<void> {
    await VoiceRecorder.startRecording();
  }

  async stopRecording(): Promise<{ recordDataBase64: string; mimeType: string }> {
    const result = await VoiceRecorder.stopRecording();

    const base64 = result.value?.recordDataBase64;
    if (!base64) {
      throw new Error('La grabación no devolvió datos válidos');
    }

    return {
      recordDataBase64: base64,
      mimeType: 'audio/aac',
    };
  }
}
