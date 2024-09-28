/*
* Developers: Aditya Rajpurohit
*/
const request = require('supertest');
const nock = require('nock');
const app = require('./server.js');
describe('Mastodon API Routes', () => {
  const apiURL = process.env.API_URL;
  const accessToken = process.env.ACCESS_TOKEN;

  afterEach(() => {
    nock.cleanAll(); 
  });
  describe('POST /create', () => {
    it('should create a post successfully', async () => {
      const postData = { status: 'Hello, Mastodon!' };

      nock(apiURL, {
        reqheaders: {
          authorization: `Bearer ${accessToken}`, 
        },
      })
      .post('/statuses') 
      .query({ status: postData.status }) 
      .reply(200, { id: 'mockPostId', content: postData.status });

      const response = await request(app)
        .post('/create')
        .send(postData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 'mockPostId');
      expect(response.body).toHaveProperty('content', postData.status);
    });
  });

  describe('GET /retrieve/:id', () => {
    it('should retrieve a post by ID successfully', async () => {
      const postId = 'mockPostId';

      nock(apiURL, {
        reqheaders: {
          authorization: `Bearer ${accessToken}`,
        },
      })
        .get(`/statuses/${postId}`)
        .reply(200, { id: postId, content: 'Post content' });

      const response = await request(app)
        .get(`/retrieve/${postId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', postId);
      expect(response.body).toHaveProperty('content', 'Post content');
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a post successfully', async () => {
      const postId = 'mockPostId';

      nock(apiURL, {
        reqheaders: {
          authorization: `Bearer ${accessToken}`, 
        },
      })
        .delete(`/statuses/${postId}`)
        .reply(200, { message: 'Post deleted' });

      const response = await request(app)
        .delete(`/delete/${postId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Post deleted');
    });
  });
});
