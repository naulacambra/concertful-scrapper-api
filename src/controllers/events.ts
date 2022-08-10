/** source/controllers/events.ts */
import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';
import ConcertfulService from '../services/concertful';

// This types could be exported from other file. Then you should import them
type ReqDictionary = {}
type ReqBody = {}
type ResBody = {}

type GetEventsReqQuery = { 
    location ?: string,
    date ?: string,
    genre ?: string,
    order ?: string,
}

type GetEventsReq = Request<ReqDictionary, ResBody, ReqBody, GetEventsReqQuery>

// getting all events
const getEvents = async (req: GetEventsReq, res: Response, next: NextFunction) => {
    const { location, date, genre, order } = req.query;
    // get some events
    let events: Event[] = await ConcertfulService.search(location, date, genre, order);
    
    return res.status(200).json(events);
};

// getting a single event
const getEvent = async (req: Request, res: Response, next: NextFunction) => {
    // get the event id from the req
    let id: string = req.params.id;
    // get the event
    let event: Event = await ConcertfulService.get(id);
    return res.status(200).json(event);
};

export default { getEvents, getEvent };