import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor() {}

  async getCurrentLocation(): Promise<Position>{
    if(Capacitor.getPlatform() !== 'android'){
      throw new Error('Este servicio solo está disponible en dispositivos móviles');
    }

    const permission = await Geolocation.checkPermissions();
    if (permission.location !== 'granted') {
      const request = await Geolocation.requestPermissions();
      if (request.location !== 'granted') {
        throw new Error('Permiso de ubicación no concedido');
      }
    }

    const position = await Geolocation.getCurrentPosition();
    return position;
  }
}
