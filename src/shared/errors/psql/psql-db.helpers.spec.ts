import { formatDuplicateMessage } from './psql-db.helpers';

describe('Errors: psql', () => {
  describe('formatDuplicateMessage', () => {
    it('should return proper message', () => {
      const expectedResult = 'Value test-value for test-key exists already';

      const result = formatDuplicateMessage(
        'Key (test-key)=(test-value) already exists.',
      );

      expect(result).toBe(expectedResult);
    });
  });
});
