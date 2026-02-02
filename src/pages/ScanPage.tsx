import { useState, useRef, useEffect } from 'react';
import { createScanner, scanImageFile } from '../utils/barcodeScanner';
import { addScanToHistory } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import './ScanPage.css';

export function ScanPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState('');
    const scannerRef = useRef<any>(null); // Use any to bypass complex scanner type mismatch
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const startScanner = async () => {
        setIsScanning(true);
        setError('');

        setTimeout(async () => {
            try {
                scannerRef.current = createScanner('scanner-container');
                if (scannerRef.current) {
                    await scannerRef.current.start(
                        (result: any) => {
                            addScanToHistory(result.text, result.format);
                            navigate('/');
                        },
                        (err: string) => {
                            setError(err);
                            setIsScanning(false);
                        }
                    );
                }
            } catch (e) {
                setError('PERMISSION DENIED');
                setIsScanning(false);
            }
        }, 100);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const response = await scanImageFile(file);
        if (response.success && response.result) {
            addScanToHistory(response.result.text, response.result.format);
            navigate('/');
        } else {
            setError('COULD NOT RECOGNIZE BARCODE');
        }
    };

    useEffect(() => {
        startScanner();
        return () => {
            if (scannerRef.current) scannerRef.current.stop();
        };
    }, []);

    return (
        <div className="scan-page container">
            <header className="scan-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="section-title">SCAN BARCODE</h2>
                <div style={{ width: 40 }}></div>
            </header>

            <div id="scanner-container" className="scanner-view">
                {!isScanning && !error && <div className="scanner-placeholder">INITIALIZING...</div>}
                {error && <div className="scanner-error">{error}</div>}
            </div>

            <div className="scan-actions">
                <button className="btn btn-white" onClick={() => fileInputRef.current?.click()}>
                    <span className="material-symbols-outlined">image</span> UPLOAD FROM GALLERY
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </div>
        </div>
    );
}
