const express = require('express');
const request = require('supertest');
const router = require('../../src/routes/healthRouter.js');

const app = express();
app.use('/', router);

describe('Test Suite: Healthz Integration Test Cases', () => {
    it('Test Case 1: Invalid URL Case', async () => {
        const response = await request(app).get('/xyz');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });
    
    it('Test Case 2: GET API Case, when DB is connected', async () => {
        const response = await request(app).get('/healthz');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
    });

    it('Test Case 3: GET API Case, when DB is not connected', async () => {
        const response = await request(app).get('/healthz');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({});
    });

    it('Test Case 4: POST API Case', async () => {
        const response = await request(app).post('/healthz');
        expect(response.status).toBe(405);
        expect(response.body).toEqual({});
    });

    it('Test Case 5: PUT API Case', async () => {
        const response = await request(app).put('/healthz');
        expect(response.status).toBe(405);
        expect(response.body).toEqual({});
    });

    it('Test Case 6: PATCH API Case', async () => {
        const response = await request(app).patch('/healthz');
        expect(response.status).toBe(405);
        expect(response.body).toEqual({});
    });

    it('Test Case 7: DELETE API Case', async () => {
        const response = await request(app).delete('/healthz');
        expect(response.status).toBe(405);
        expect(response.body).toEqual({});
    });

    it('Test Case 8: API request with body Case', async () => {
        const response = await request(app).get('/healthz?param=HITMAN');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });

});