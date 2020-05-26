import { Router } from 'express';

const routes = Router();

routes.post('/users', (request, response) => response.json());

export default routes;
