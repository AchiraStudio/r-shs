import { useEffect } from 'react';
import EventTemplate from './events/event-template';
import eventData from '../json/events.json';

function Valentine() {
    useEffect(() => {
            const id = 'event-style';
            const existing = document.getElementById(id);
            if (existing) existing.remove(); // Ensure only one active style
    
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'events/event-4.css'; // now from public/
            link.id = id;
    
            document.head.appendChild(link);
    
            return () => {
                const toRemove = document.getElementById(id);
                if (toRemove) toRemove.remove();
            };
        }, []);

    const slither = eventData.events.valentine;
    
    return (
        <EventTemplate
            eventType={slither.eventType}
            coverImage={slither.coverImage}
            title={slither.title}
            subtitle={slither.subtitle}
            description={slither.description}
            audioSrc={slither.audioSrc}
            galleryImages={slither.galleryImages}
        />
    );
}

export default Valentine;