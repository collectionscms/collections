import { ContentStatus } from '../content/content.entity.js';
import { buildContentRevisionEntity } from './contentRevision.entity.fixture.js';

describe('ContentRevisionEntity', () => {
  describe('getDraftKey', () => {
    it('should return draft key if status is draft', () => {
      const entity = buildContentRevisionEntity({
        status: ContentStatus.draft,
        draftKey: 'draftKey',
      });

      expect(entity.getDraftKey()).toEqual('draftKey');
    });

    it('should return draft key if status is review', () => {
      const entity = buildContentRevisionEntity({
        status: ContentStatus.review,
        draftKey: 'draftKey',
      });

      expect(entity.getDraftKey()).toEqual('draftKey');
    });

    it('should return null if status is not draft or review', () => {
      const entity = buildContentRevisionEntity({
        status: ContentStatus.published,
        draftKey: 'draftKey',
      });

      expect(entity.getDraftKey()).toBeNull();
    });
  });
});
