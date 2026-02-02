// Utility functions for text processing

export interface CharInfo {
    char: string;
    code: number;
    name: string;
    isInvisible: boolean;
}

/**
 * Detects special/invisible characters and returns detailed information.
 */
export function analyzeString(text: string): CharInfo[] {
    const chars: CharInfo[] = [];
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const code = char.charCodeAt(0);
        let name = char;
        let isInvisible = false;

        if (code <= 32 || (code >= 127 && code <= 160) || code === 8203) {
            isInvisible = true;
            switch (code) {
                case 0: name = 'NULL'; break;
                case 9: name = 'TAB'; break;
                case 10: name = 'LF'; break;
                case 13: name = 'CR'; break;
                case 29: name = 'GS'; break;
                case 30: name = 'RS'; break;
                case 31: name = 'US'; break;
                case 32: name = 'SPACE'; break;
                case 160: name = 'NBSP'; break;
                case 8203: name = 'ZWSP'; break;
                default: name = `CHAR(${code})`;
            }
        }
        chars.push({ char, code, name, isInvisible });
    }
    return chars;
}

export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

// LocalStorage helpers for scan history
export interface ScanHistoryItem {
    id: string;
    value: string;
    type: string;
    timestamp: number;
}

const HISTORY_KEY = 'barcode_scan_history';
const MAX_HISTORY_ITEMS = 30;

export function getScanHistory(): ScanHistoryItem[] {
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function addScanToHistory(value: string, type: string): void {
    const history = getScanHistory();
    const newItem: ScanHistoryItem = {
        id: Date.now().toString(),
        value,
        type,
        timestamp: Date.now()
    };

    // Remove duplicate if exists
    const filtered = history.filter(item => item.value !== value);

    // Add new item at the beginning
    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearScanHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
}
