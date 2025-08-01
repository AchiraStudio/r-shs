import EventTemplate from './events/event-template';
import eventData from '../json/events.json';

function Christmas() {
    // Get the Christmas event data from the JSON
    const christmasEvent = eventData.events.christmas;
    
    return (
        <EventTemplate
            eventType={christmasEvent.eventType}
            coverImage={christmasEvent.coverImage}
            title={christmasEvent.title}
            subtitle={christmasEvent.subtitle}
            description={christmasEvent.description}
            audioSrc={christmasEvent.audioSrc}
            galleryImages={christmasEvent.galleryImages}
        />
    );
}

export default Christmas;