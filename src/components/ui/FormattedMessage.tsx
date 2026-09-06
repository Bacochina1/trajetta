'use client';

import React from 'react';

interface FormattedMessageProps {
  content: string;
  className?: string;
}

export function FormattedMessage({ content, className = '' }: FormattedMessageProps) {
  if (!content) return null;

  // 1. Sanitize any duplicate asterisks (e.g. ****text**** -> **text**)
  const sanitized = content
    .replace(/\*{3,}/g, '**')
    .trim();

  // 2. Split by paragraphs
  const paragraphs = sanitized.split(/\n\s*\n/);

  return (
    <div className={`space-y-2 leading-relaxed text-inherit ${className}`}>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        return (
          <p key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => {
              // Parse **bold** elements inside the line
              const parts = line.split(/(\**.*?\**)/g);
              return (
                <React.Fragment key={lIdx}>
                  {lIdx > 0 && <br />}
                  {parts.map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                      const boldText = part.slice(2, -2);
                      return (
                        <strong key={partIdx} className="font-semibold text-white">
                          {boldText}
                        </strong>
                      );
                    }
                    return <span key={partIdx}>{part}</span>;
                  })}
                </React.Fragment>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
