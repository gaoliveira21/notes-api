import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CollectionController from './app/controllers/CollectionController';
import NoteController from './app/controllers/NoteController';
import ResetPasswordController from './app/controllers/ResetPasswordController';

import AuthMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.post('/reset-password', ResetPasswordController.store);

routes.use(AuthMiddleware);

routes.get('/collections', CollectionController.index);
routes.get('/collections/:id', CollectionController.show);
routes.post('/collections', CollectionController.store);
routes.put('/collections/:id', CollectionController.update);
routes.delete('/collections/:id', CollectionController.delete);

routes.get('/collections/:id/notes', NoteController.index);
routes.post('/collections/:id/notes', NoteController.store);

export default routes;
