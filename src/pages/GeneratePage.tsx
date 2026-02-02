import { useState, useEffect } from 'react';
import {
    generateBarcode,
    generateQRCode,
    downloadImage,
} from '../utils/barcodeGenerator';
import type { BarcodeType } from '../utils/barcodeGenerator';
import {
    getScanHistory,
    addScanToHistory,
    clearScanHistory,
} from '../utils/helpers';
import type { ScanHistoryItem } from '../utils/helpers';
import './GeneratePage.css';

const BARCODE_TYPES: { value: BarcodeType; label: string }[] = [
    { value: 'CODE128', label: 'CODE-128' },
    { value: 'QR', label: 'QR CODE' },
    { value: 'EAN13', label: 'EAN-13' },
    { value: 'EAN8', label: 'EAN-8' },
];

export function GeneratePage() {
    const [inputText, setInputText] = useState('');
    const [barcodeType, setBarcodeType] = useState<BarcodeType>('CODE128');
    const [barcodeImage, setBarcodeImage] = useState<string | null>(null);
    const [history, setHistory] = useState<ScanHistoryItem[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        setHistory(getScanHistory());
    }, []);

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            setError('ENTER VALUE...');
            return;
        }

        setError('');
        let img: string | null = null;

        try {
            if (barcodeType === 'QR') {
                img = await generateQRCode(inputText, { width: 250, margin: 2 });
            } else {
                img = await generateBarcode(inputText, barcodeType, { fontSize: 20 });
            }

            if (img) {
                setBarcodeImage(img);
                addScanToHistory(inputText, barcodeType);
                setHistory(getScanHistory());
                // Scroll to result
                setTimeout(() => {
                    document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                setError('GENERATION FAILED');
            }
        } catch (e) {
            setError('INVALID INPUT');
        }
    };

    const handleCopy = async () => {
        if (inputText) {
            await navigator.clipboard.writeText(inputText);
            alert('COPIED TO CLIPBOARD');
        }
    };

    const handleShare = async () => {
        if (barcodeImage) {
            try {
                const response = await fetch(barcodeImage);
                const blob = await response.blob();
                const file = new File([blob], 'barcode.png', { type: 'image/png' });
                if (navigator.share) {
                    await navigator.share({
                        files: [file],
                        title: 'Barcode',
                        text: inputText
                    });
                } else {
                    alert('SHARING NOT SUPPORTED ON THIS BROWSER');
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleDownload = () => {
        if (barcodeImage) {
            downloadImage(barcodeImage, `barcode_${inputText}.png`);
        }
    };

    const handleClearHistory = () => {
        if (window.confirm('CLEAR ALL HISTORY?')) {
            clearScanHistory();
            setHistory([]);
        }
    };

    const getTimeLabel = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 1) return 'YESTERDAY';
        if (diffDays < 7) return `${diffDays} DAYS AGO`;
        return date.toLocaleDateString();
    };

    return (
        <div className="generate-page container">
            {/* Generate Input Section */}
            <section className="generate-section animate-fade-in">
                <h2 className="section-title">GENERATE NEW</h2>

                <div className="input-group">
                    <div className="input-container">
                        <input
                            type="text"
                            className="input-main"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="ENTER VALUE..."
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <span className="material-symbols-outlined input-icon">qr_code_scanner</span>
                    </div>
                </div>

                <div className="type-selector">
                    {BARCODE_TYPES.map(type => (
                        <button
                            key={type.value}
                            className={`type-chip ${barcodeType === type.value ? 'active' : ''}`}
                            onClick={() => setBarcodeType(type.value)}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                <button className="btn btn-black create-btn" onClick={handleGenerate}>
                    CREATE BARCODE <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                {error && <p className="error-text">{error}</p>}
            </section>

            {/* Result Section */}
            {barcodeImage && (
                <section id="result-card" className="result-section animate-fade-in">
                    <div className="result-card">
                        <div className="barcode-display">
                            <img src={barcodeImage} alt="Generated" />
                        </div>
                        <div className="result-info">
                            <div className="result-value">{inputText}</div>
                            <div className="result-type">{barcodeType}</div>
                        </div>
                        <div className="result-actions">
                            <button className="btn btn-white action-btn" onClick={handleCopy}>
                                <span className="material-symbols-outlined">content_copy</span> COPY
                            </button>
                            <button className="btn btn-white action-btn" onClick={handleShare}>
                                <span className="material-symbols-outlined">share</span> SHARE
                            </button>
                            <button className="btn btn-black action-btn" onClick={handleDownload}>
                                <span className="material-symbols-outlined">download</span> SAVE
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* History Section */}
            <section className="history-section">
                <div className="history-header">
                    <h2 className="section-title">RECENT HISTORY</h2>
                    {history.length > 0 && (
                        <button className="clear-btn" onClick={handleClearHistory}>CLEAR ALL</button>
                    )}
                </div>

                <div className="history-list">
                    {history.length === 0 ? (
                        <div className="empty-history">
                            <span className="material-symbols-outlined">history</span>
                            <p>NO RECENT SCANS</p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="list-item"
                                onClick={() => {
                                    setInputText(item.value);
                                    setBarcodeType(item.type as BarcodeType);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                <div className="list-item-icon">
                                    <span className="material-symbols-outlined">
                                        {item.type === 'QR' ? 'qr_code_2' : 'barcode'}
                                    </span>
                                </div>
                                <div className="list-item-content">
                                    <div className="list-item-title">{item.value}</div>
                                    <div className="list-item-subtitle">{item.type} • {getTimeLabel(item.timestamp)}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* FAB Scan Button */}
            <div className="fab" onClick={() => (window.location.href = '/scan')}>
                <span className="material-symbols-outlined">qr_code_scanner</span>
            </div>
        </div>
    );
}
