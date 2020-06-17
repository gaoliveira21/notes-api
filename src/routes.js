import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get('/users', UserController.index);

export default routes;
