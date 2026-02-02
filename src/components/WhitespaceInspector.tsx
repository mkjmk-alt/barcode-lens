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
            <div className="inspector-display">
                {analysis.map((item, idx) => (
                    <span
                        key={idx}
                        className={`char-box ${item.isInvisible ? 'invisible-char' : ''}`}
                        title={`CHAR(${item.code}): ${item.name}`}
                    >
                        {item.isInvisible ? ' ' : item.char}
                        {item.isInvisible && <span className="char-indicator">{item.name}</span>}
                    </span>
                ))}
            </div>

            {hasInvisible && (
                <div className="inspector-legend mt-2">
                    <p className="text-muted">
                        <span className="dot help"></span>
                        빨간색 표시는 보이지 않는 특수 문자(공백 등)를 의미합니다.
                    </p>
                    <div className="char-codes-list">
                        {analysis.filter(c => c.isInvisible).map((c, idx) => (
                            <span key={idx} className="char-badge">
                                {c.name}: CHAR({c.code})
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
