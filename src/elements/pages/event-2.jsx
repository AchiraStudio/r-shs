import { useEffect } from 'react';
import EventTemplate from './events/event-template';
import eventData from '../json/events.json';

function Charity() {
    useEffect(() => {
            const id = 'event-style';
            const existing = document.getElementById(id);
            if (existing) existing.remove(); // Ensure only one active style
    
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'events/event-2.css';
            link.id = id;
    
            document.head.appendChild(link);
    
            return () => {
                const toRemove = document.getElementById(id);
                if (toRemove) toRemove.remove();
            };
        }, []);

    const charity = eventData.events.easter;
    
    return (
        <EventTemplate
            eventType={charity.eventType}
            coverImage={charity.coverImage}
            title={charity.title}
            subtitle={charity.subtitle}
            description={charity.description}
            audioSrc={charity.audioSrc}
            galleryImages={charity.galleryImages}
        />
    );
}

export default Charity;