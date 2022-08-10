/** source/controllers/events.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
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

// updating a event
const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    // get the event id from the req.params
    let id: string = req.params.id;
    // get the data from req.body
    let title: string = req.body.title ?? null;
    let body: string = req.body.body ?? null;
    // update the event
    let response: AxiosResponse = await axios.put(`https://jsonplaceholder.typicode.com/events/${id}`, {
        ...(title && { title }),
        ...(body && { body })
    });
    // return response
    return res.status(200).json({
        message: response.data
    });
};

// deleting a event
const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    // get the event id from req.params
    let id: string = req.params.id;
    // delete the event
    let response: AxiosResponse = await axios.delete(`https://jsonplaceholder.typicode.com/events/${id}`);
    // return response
    return res.status(200).json({
        message: 'event deleted successfully'
    });
};

// adding a event
const addEvent = async (req: Request, res: Response, next: NextFunction) => {
    // get the data from req.body
    let title: string = req.body.title;
    let body: string = req.body.body;
    // add the event
    let response: AxiosResponse = await axios.post(`https://jsonplaceholder.typicode.com/events`, {
        title,
        body
    });
    // return response
    return res.status(200).json({
        message: response.data
    });
};

export default { getEvents, getEvent, updateEvent, deleteEvent, addEvent };