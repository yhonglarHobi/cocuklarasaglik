
import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface SafeHTMLProps {
    html: string;
    className?: string;
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className }) => {
    const sanitizedHTML = DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe'], // If you need to allow iframes (e.g. youtube), add here. Be careful.
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
    });

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
    );
};
