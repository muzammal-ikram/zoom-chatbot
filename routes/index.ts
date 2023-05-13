import { Router } from 'express';
import zoom from './zoom.routes';

const router = Router();

const routes = () => {
  router.get('/', (_req, res) => {
    res.json('Welcome to the Unsplash Chatbot for Zoom');
  });
  router.use('/zoom', zoom);
  return router;
};

export default routes;
