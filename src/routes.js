import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import CollectionController from './app/controllers/CollectionController';
import NoteController from './app/controllers/NoteController';
import ForgotPasswordController from './app/controllers/ForgotPasswordController';
import ResetPasswordController from './app/controllers/ResetPasswordController';

import validateUserStore from './app/validators/User/UserStore';
import validateSessionStore from './app/validators/Session/SessionStore';
import validateForgotPasswordStore from './app/validators/ForgotPassword/ForgotPasswordStore';
import validateResetPasswordStore from './app/validators/ResetPassword/ResetPasswordStore';
import validateCollectionStore from './app/validators/Collection/CollectionStore';
import validateCollectionUpdate from './app/validators/Collection/CollectionUpdate';
import validateNoteStore from './app/validators/Note/NoteStore';

import AuthMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/users', validateUserStore, UserController.store);
routes.post('/sessions', validateSessionStore, SessionController.store);

routes.post(
  '/forgot_password',
  validateForgotPasswordStore,
  ForgotPasswordController.store
);
routes.post(
  '/reset_password',
  validateResetPasswordStore,
  ResetPasswordController.store
);

routes.use(AuthMiddleware);

routes.get('/collections', CollectionController.index);
routes.get('/collections/:id', CollectionController.show);
routes.post(
  '/collections',
  validateCollectionStore,
  CollectionController.store
);
routes.put(
  '/collections/:id',
  validateCollectionUpdate,
  CollectionController.update
);
routes.delete('/collections/:id', CollectionController.delete);

routes.get('/collections/:id/notes', NoteController.index);
routes.post('/collections/:id/notes', validateNoteStore, NoteController.store);

export default routes;
