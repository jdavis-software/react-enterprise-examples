import { describe, it, expect } from 'vitest';
import { compareByKey } from './sort';

describe('compareByKey', () => {
  it('sorts numbers, strings and dates', () => {
    const items = [
      { v: 2, s: 'b', d: new Date('2020-01-02') },
      { v: 1, s: 'a', d: new Date('2020-01-01') }
    ];
    const nums = items.slice().sort((a, b) => compareByKey(a, b, 'v', 'asc'));
    expect(nums[0].v).toBe(1);
    const strings = items.slice().sort((a, b) => compareByKey(a, b, 's', 'desc'));
    expect(strings[0].s).toBe('b');
    const dates = items.slice().sort((a, b) => compareByKey(a, b, 'd', 'asc'));
    expect(dates[0].d.getTime()).toBeLessThan(dates[1].d.getTime());
  });
});
