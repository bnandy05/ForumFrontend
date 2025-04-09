import { ShortenNumberPipe } from './shorten-number.pipe';

describe('ShortenNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
