import express from 'express';
import isAuthenticated from '../../middlewares/isAuthenticated.js';
import { createNotification, getNotifications } from '../../controllers/admin/notificationController.js';
import isAdminAuthenticated from './../../middlewares/isAdminAuthenticated.js';
 


const router = express.Router();

// Get all notifications for user
router.route("/get-all-notification").get(isAuthenticated,getNotifications);


// Create notification (admin only)
router.route("/create-notification").post(isAdminAuthenticated ,createNotification);


// incomplete --------> Mark notification as read
// router.route("/:id/read").patch(isAuthenticated,markAsRead);

export default router;