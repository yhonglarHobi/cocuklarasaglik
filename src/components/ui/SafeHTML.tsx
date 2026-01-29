
import React from 'react';
import sanitizeHtml from 'sanitize-html';

interface SafeHTMLProps {
    html: string;
    className?: string;
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className }) => {
    const sanitizedHTML = sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['iframe', 'img']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            iframe: ['src', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'width', 'height'],
            img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
            a: ['href', 'name', 'target', 'rel'],
            '*': ['class'] // Allow class attribute on all elements
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    });

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
    );
};
