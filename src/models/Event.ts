import EventLocation from "./EventLocation";
import Performer from "./Performer";

export default interface Event {
    Id?: Number;
    Performer: Performer;
    Location: EventLocation;
    Date: string;
    Genre: string;
}