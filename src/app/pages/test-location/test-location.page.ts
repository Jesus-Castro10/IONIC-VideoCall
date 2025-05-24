import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { Map, Marker } from 'mapbox-gl';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

@Component({
  selector: 'app-test-location',
  templateUrl: './test-location.page.html',
  styleUrls: ['./test-location.page.scss'],
  standalone: false
})
export class TestLocationPage {

  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  showMap = false;

  constructor(private geoService: GeolocationService) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamVzdXNkY3IiLCJhIjoiY21iMm5oeG9oMG0wZTJpcGx3M3Z5ams5YyJ9.5LevSLU58Mvq2ADH4LyXEg';
  }

  async getLocation() {
    try {
      const position = await this.geoService.getCurrentLocation();
      this.showMap = true;

      setTimeout(() => {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 14,
        });

        this.marker = new mapboxgl.Marker()
          .setLngLat([position.coords.longitude, position.coords.latitude])
          .addTo(this.map);
      }, 100);
    } catch (err) {
      console.error('Error al obtener ubicación:', err);
    }
  }

}
