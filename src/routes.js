import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CollectionController from './app/controllers/CollectionController';

import AuthMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);

routes.get('/collections', CollectionController.index);
routes.post('/collections', CollectionController.store);

export default routes;
