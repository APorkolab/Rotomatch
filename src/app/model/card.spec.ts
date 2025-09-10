import { Card } from './card';

describe('Card', () => {
  it('should create an instance', () => {
    void expect(new Card({} as any)).toBeTruthy();
  });
});
