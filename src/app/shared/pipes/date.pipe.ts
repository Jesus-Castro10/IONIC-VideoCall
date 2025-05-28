import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore/lite';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(timestamp: any, format: string = 'shortTime'): string {
    let date: Date;
    
    // Timestamp de Firestore (v9 modular)
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    }
    // Timestamp de Firestore (v8 compat)
    else if (timestamp?.seconds) {
      date = new Date(timestamp.seconds * 1000);
    }
    // Si ya es Date
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Si no se puede convertir
    else {
      console.error('Formato de fecha no soportado:', timestamp);
      return '';
    }

    return date.toLocaleTimeString(); // O usa DatePipe aquí si lo prefieres
  }

}
