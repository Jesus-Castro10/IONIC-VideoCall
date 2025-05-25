import { Position } from '@capacitor/geolocation';
import { Component, Input, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { GeolocationService } from '../../services/geolocation.service';
import { LoaderService } from '../../services/loader.service';


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  standalone: false
})
export class LocationComponent  implements OnInit {

  map!: mapboxgl.Map;
  marker!: mapboxgl.Marker;
  @Input()position!: Position;

  constructor(private geoService: GeolocationService, private loaderSrv: LoaderService) {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamVzdXNkY3IiLCJhIjoiY21iMm5oeG9oMG0wZTJpcGx3M3Z5ams5YyJ9.5LevSLU58Mvq2ADH4LyXEg';
  }

  ngOnInit(): void {
    this.getLocation();
  }

  async getLocation() {
    try {
      // const position = await this.geoService.getCurrentLocation();
      setTimeout(() => {
        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [this.position.coords.longitude, this.position.coords.latitude],
          zoom: 14,
        });

        this.marker = new mapboxgl.Marker()
          .setLngLat([this.position.coords.longitude, this.position.coords.latitude])
          .addTo(this.map);
      }, 100);
    } catch (err) {
      console.error('Error al obtener ubicación:', err);
    }
  }

}
