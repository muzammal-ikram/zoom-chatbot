import { Router } from 'express';
import { Authorize, DeAuthorize, UnSplash } from '../controllers/zoom.controller';

const router = Router();

router.get('/authorize', Authorize);
router.get('/deauthorize', DeAuthorize);
router.post('/unsplash', UnSplash);

export default router;
