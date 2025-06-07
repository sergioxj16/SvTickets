import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
  standalone: true
})
export class DistancePipe implements PipeTransform {

  transform(value: number): string {
    if (value < 1) {
      const metros = Math.round(value * 1000);
      return `${metros} m`;
    }
    return `${value.toFixed(1)} km`;
  }

}
