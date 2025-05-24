import { Component, OnInit } from '@angular/core';
import { Position } from '@capacitor/geolocation';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

@Component({
  selector: 'app-test-location',
  templateUrl: './test-location.page.html',
  styleUrls: ['./test-location.page.scss'],
  standalone: false
})
export class TestLocationPage {

  latitude: number | null = null;
  longitude: number | null = null;
  accuracy: number | null = null;
  position : Position | null = null;

  constructor(private geoService: GeolocationService) {}

  async getLocation() {
    try {
      this.position = await this.geoService.getCurrentLocation();
      this.latitude = this.position.coords.latitude;
      this.longitude = this.position.coords.longitude;
      this.accuracy = this.position.coords.accuracy || null;
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }

}
