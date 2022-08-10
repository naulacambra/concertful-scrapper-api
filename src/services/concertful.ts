import axios, { AxiosResponse } from "axios";
import * as cheerio from 'cheerio';
import Event from '../models/Event';

class ConcertfulService {
    _baseUrl : string = "https://concertful.com";

    async search(location ?: string, from ?: string, category ?: string, order ?: string) : Promise<Event[]> {
        const base_url = `${this._baseUrl}/area/${location}`;
        var result = await axios.get(base_url, { params: { category, order, from } });
        return this.parseList(result);
    }

    async get(id ?: string) : Promise<Event> {
        const base_url = `${this._baseUrl}/event/${id}`
        var result = await axios.get(base_url);
        return this.parseDetail(result);
    }

    private parseList(response : AxiosResponse) : Event[] {
        const $ = cheerio.load(response.data);
        const eventsList = $('.eventList tr.eventRow');
        const list: Event[] = new Array<Event>();
        eventsList.each(function () {
            const eventLocation = $(this).find('.eventLocation');
            list.push({
                Id: parseInt($(this).find('.eventInfo > .eventInfoSpan > .eventName > a').attr('href')?.split('/')[2] || "0"),
                Performer: {
                    Name: $(this).find('.eventInfo > .eventInfoSpan > .eventName > a').text(),
                },
                Location: {
                    City: $(eventLocation).find('span.eventCity').text().split(',')[0].trim(),
                    Country: $(eventLocation).find('span.eventCity').text().split(',')[1].trim(),
                    Venue: $(eventLocation).find('span.eventVenue').text(),
                },
                Date: "",
                Genre: $(this).find('.eventInfo > .eventInfoSpan > .eventCategory').text(),
            })
        })
        return list;
    }

    private parseDetail(response : AxiosResponse) : Event {
        const $ = cheerio.load(response.data);
        const event = $('#left');
        return {
            Id: parseInt($(event).find('#id_event').attr('title') || "0"),
            Performer: {
                Name: $(event).find('.event_info .performers abbr').text(),
                Id: $(event).find('.event_info .performers a').attr('href')?.split('/')[2]
            },
            Location: {
                City: $(event).find('.event_info .address abbr:first-of-type').text(),
                Country: $(event).find('.event_info .address abbr:last-of-type').text(),
                Venue: $(event).find('.event_info .venue_name').text(),
            },
            Date: $(event).find('#event tr:nth-child(3) .event_info').text().trim(),
            Genre: $(event).find('#event tr:nth-child(4) td:nth-child(2)').text(),
        }
    }
}

export default new ConcertfulService();