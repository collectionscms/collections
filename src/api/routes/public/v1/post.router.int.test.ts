import express from 'express';
import request from 'supertest';
import { apiKey, project } from '../../../../../test/common/variables.js';
import { extractToken } from '../../../middlewares/auth.js';
import { post } from './post.router.js';

const app = express();
app.use(extractToken);
app.use('/', post);

describe('Post Router', () => {
  describe('GET /posts', () => {
    it('should return 401 Unauthorized if there is no token', async () => {
      const response = await request(app).get('/posts');
      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        status: 401,
        code: 'unauthorized',
      });
    });

    it('should return a list of posts', async () => {
      const response = await request(app)
        .get('/posts')
        .set('Host', project.host)
        .set('Authorization', `Bearer ${apiKey.fullAccess.key}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        posts: [],
      });
    });
  });
});
