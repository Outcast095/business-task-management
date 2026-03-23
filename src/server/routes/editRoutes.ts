// src/server/routes/editRoutes.ts
import { Router } from 'express';
import { updateProfile } from '../controllers/edit.controller.js';

const router = Router();

router.put('/:userId', updateProfile); 

export default router;