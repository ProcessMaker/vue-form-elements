import {
  isValidDate
} from '../../src/dateUtils';

describe('dateUtils', () => {
  const validDates = [
    ['12/24/2019', 'MM/DD/YYYY', true],
    ['24/12/2019', 'MM/DD/YYYY', false],
    ['2019/12/24', 'MM/DD/YYYY', false],
    ['12/24/2019', 'DD/MM/YYYY', false],
    ['24/12/2019', 'DD/MM/YYYY', true],
    ['12/24/2019', 'YYYY/MM/DD', false],
    ['2019/12/24', 'YYYY/MM/DD', true]
  ];

  it.each(validDates)('isValidDate(%s, %s)', (date, format, expectedIsValid) => {
    expect(isValidDate(date, format)).toBe(expectedIsValid);
  });
});
