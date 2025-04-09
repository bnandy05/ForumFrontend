import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'shortenNumber'
})
export class ShortenNumberPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '';

    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (abs < 1000) return `${value}`;
    if (abs < 1_000_000) return `${sign}${(abs / 1000).toFixed(1).replace(/\.0$/, '')}E`;
    if (abs < 1_000_000_000) return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (abs < 1_000_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}Md`;
    
    return `${sign}${(abs / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  }
}
