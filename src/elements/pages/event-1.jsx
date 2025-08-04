import { useEffect } from 'react';
import EventTemplate from './events/event-template';
import eventData from '../json/events.json';

function Christmas() {
    useEffect(() => {
        const id = 'event-style';
        const existing = document.getElementById(id);
        if (existing) existing.remove(); // Ensure only one active style

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'events/event-1.css';
        link.id = id;

        document.head.appendChild(link);

        return () => {
            const toRemove = document.getElementById(id);
            if (toRemove) toRemove.remove();
        };
    }, []);

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
