/** source/routes/events.ts */
import express from 'express';
import controller from '../controllers/events';
const router = express.Router();

router.get('/events', controller.getEvents);
router.get('/events/:id', controller.getEvent);
router.put('/events/:id', controller.updateEvent);
router.delete('/events/:id', controller.deleteEvent);
router.post('/events', controller.addEvent);

export = router;