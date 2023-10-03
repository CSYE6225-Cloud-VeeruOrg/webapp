const request = require('supertest');
const express = require('express');
const router = require('../../src/routes/healthRouter');
const healthService = require('../../src/service/healthService');

const app = express();
app.use('/', router);

jest.mock('../../src/service/healthService');

describe('Test Suite: Healthz Unit Test Cases', () => {
    it('Test Case 1: GET API Case with invalid URL', async () => {
        const response = await request(app).get('/xyz');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });

    it('Test Case 2: GET API Case with successful DB connection', async () => {
        healthService.healthCheck.mockResolvedValue(true);
        const response = await request(app).get('/healthz');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
    });

    it('Test Case 3: GET API Case with Failed DB connection', async () => {
        healthService.healthCheck.mockRejectedValue(new Error('Service not available'));
        const response = await request(app).get('/healthz');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({});
    });

    it('Test Case 4: PUT API Case', async () => {
        const response = await request(app).put('/healthz');
        expect(response.status).toBe(405);
        expect(response.body).toEqual({});
    });

    it('Test Case 5: PATCH API Case', async () => {
        const response = await request(app).patch('/healthz');
        expect(response.status).toBe(405);
    });

    it('Test Case 6: POST API Case', async () => {
        const response = await request(app).post('/healthz');
        expect(response.status).toBe(405);
        expect(response.body).toEqual({});
    });

    it('Test Case 7: DELETE API Case', async () => {
        const response = await request(app).delete('/healthz');
        expect(response.status).toBe(405);
        expect(response.body).toEqual({});
    });

    it('Test Case 8: API call with Params', async () => {
        const response = await request(app).get('/healthz?param=hitman45');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({});
    });
})