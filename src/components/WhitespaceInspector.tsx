import React from 'react';
import { analyzeString } from '../utils/helpers';
import './WhitespaceInspector.css';

interface Props {
    text: string;
}

export const WhitespaceInspector: React.FC<Props> = ({ text }) => {
    const analysis = analyzeString(text);
    const hasInvisible = analysis.some(c => c.isInvisible);

    if (!text) return null;

    return (
        <div className="whitespace-inspector">
            <div className="inspector-display-text">
                {analysis.map((item, idx) => (
                    item.isInvisible ? (
                        <span
                            key={idx}
                            className="invisible-char-highlight"
                            title={`CHAR(${item.code}): ${item.name}`}
                        >
                            {item.char === '\n' ? '↵' : (item.char === '\t' ? '→' : ' ')}
                            <span className="char-label">{item.name}</span>
                        </span>
                    ) : (
                        <span key={idx} className="normal-char">{item.char}</span>
                    )
                ))}
            </div>

            {hasInvisible && (
                <div className="inspector-legend mt-2">
                    <div className="char-codes-list">
                        {Array.from(new Set(analysis.filter(c => c.isInvisible).map(c => `${c.name}: CHAR(${c.code})`))).map((label, idx) => (
                            <span key={idx} className="char-badge">
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
