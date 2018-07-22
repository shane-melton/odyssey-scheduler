import { TruthyPipe } from './truthy.pipe';

describe('TruthyPipe', () => {
  it('create an instance', () => {
    const pipe = new TruthyPipe();
    expect(pipe).toBeTruthy();
  });
});
