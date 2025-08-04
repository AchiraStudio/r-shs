import { useEffect } from 'react';
import EventTemplate from './events/event-template';
import eventData from '../json/events.json';

function Mpls() {
    useEffect(() => {
                const id = 'event-style';
                const existing = document.getElementById(id);
                if (existing) existing.remove(); // Ensure only one active style
        
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'events/event-3.css';
                link.id = id;
        
                document.head.appendChild(link);
        
                return () => {
                    const toRemove = document.getElementById(id);
                    if (toRemove) toRemove.remove();
                };
            }, []);
            
    const mpls = eventData.events.mpls;
    
    return (
        <EventTemplate
            eventType={mpls.eventType}
            coverImage={mpls.coverImage}
            title={mpls.title}
            subtitle={mpls.subtitle}
            description={mpls.description}
            audioSrc={mpls.audioSrc}
            galleryImages={mpls.galleryImages}
        />
    );
}

export default Mpls;