import { useNavigate } from 'react-router-dom';
import './Header.css';

export function Header() {
    const navigate = useNavigate();

    return (
        <header className="main-header">
            <button className="header-btn" onClick={() => { }}>
                <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="header-title" onClick={() => navigate('/')}>BARCODE GEN</h1>
            <button className="header-btn" onClick={() => navigate('/compare')}>
                <span className="material-symbols-outlined">settings</span>
            </button>
        </header>
    );
}

export function BottomNav() {
    // We might not need a bottom nav if we follow the screenshot's single-page or FAB approach.
    // However, I'll keep it as a placeholder or remove it if requested.
    // For now, let's keep it but style it minimally or just remove it to match the screenshot.
    return null;
}
