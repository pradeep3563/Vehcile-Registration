import express from 'express';
import {
  registerVehicle,
  getVehicles,
  updateVehicleStatus,
  searchVehicles,
  renewRegistration,
  getVehicleStats,
  deleteVehicle,
  updateVehicle,
  getVehicleById,
} from '../controllers/vehicleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, upload.array('documents'), registerVehicle)
  .get(protect, getVehicles);

router.get('/search', protect, searchVehicles);
router.get('/stats', protect, admin, getVehicleStats);

router.route('/:id')
  .get(protect, getVehicleById)
  .delete(protect, deleteVehicle)
  .put(protect, updateVehicle);

router.route('/:id/status')
  .put(protect, admin, updateVehicleStatus);

router.route('/:id/renew')
  .put(protect, renewRegistration);

export default router;
