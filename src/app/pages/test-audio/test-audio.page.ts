import { Component, OnInit } from '@angular/core';
import { VoiceService } from 'src/app/shared/services/voice.service';

@Component({
  selector: 'app-test-audio',
  templateUrl: './test-audio.page.html',
  styleUrls: ['./test-audio.page.scss'],
  standalone: false,
})
export class TestAudioPage {

  isRecording = false;
  audioBlobUrl: string | null = null;

  constructor(private vr: VoiceService) {}

  async toggleRecording() {
    try {
      if (!this.isRecording) {
        await this.vr.requestPermissions();
        await this.vr.startRecording();
        this.isRecording = true;
        this.audioBlobUrl = null;
      } else {
        const { recordDataBase64, mimeType } = await this.vr.stopRecording();
        this.isRecording = false;

        const blob = this.base64ToBlob(recordDataBase64, mimeType);
        this.audioBlobUrl = URL.createObjectURL(blob);
      }
    } catch (error) {
      console.error('Error de grabación:', error);
      this.isRecording = false;
    }
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.from(slice, c => c.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mimeType });
  }

}
