import { useState, useMemo } from 'react';
import { useTranslation } from '../utils/LanguageContext';
import './ExpirationPage.css';

export function ExpirationPage() {
    const { t } = useTranslation();

    // Mfg Validator State
    const [mfgPhysicalDate, setMfgPhysicalDate] = useState('');
    const [mfgSystemDate, setMfgSystemDate] = useState('');
    const [mfgCategory, setMfgCategory] = useState('diaper_dom');

    // Expiry Validator State
    const [physicalDate, setPhysicalDate] = useState('');
    const [systemDate, setSystemDate] = useState('');
    const [isStickerCovered, setIsStickerCovered] = useState(false);

    const mfgValidationResult = useMemo(() => {
        if (!mfgPhysicalDate || !mfgSystemDate) return null;

        const pDate = new Date(mfgPhysicalDate);
        const sDate = new Date(mfgSystemDate);
        const today = new Date();

        pDate.setHours(0, 0, 0, 0);
        sDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        // 1. Mismatch check
        if (pDate.getTime() !== sDate.getTime()) {
            return { status: 'fail', reason: t.expiration.mfgReasonMismatch };
        }

        // 2. Range check
        const diffMs = today.getTime() - pDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let limitDays = 365; // Default for diaper_dom
        if (mfgCategory === 'diaper_imp') limitDays = 450; // 15 months
        else if (mfgCategory === 'pet_wipes') limitDays = 240; // 8 months
        else if (mfgCategory === 'grains') limitDays = 14;
        else if (mfgCategory === 'rice') limitDays = 7;

        if (diffDays > limitDays) {
            return { status: 'fail', reason: `${t.expiration.mfgReasonExpired} (${limitDays}일 초과)` };
        }

        return { status: 'pass', reason: t.expiration.resultPass };
    }, [mfgPhysicalDate, mfgSystemDate, mfgCategory, t.expiration]);

    const validationResult = useMemo(() => {
        if (!physicalDate || !systemDate) return null;

        const pDate = new Date(physicalDate);
        const sDate = new Date(systemDate);

        pDate.setHours(0, 0, 0, 0);
        sDate.setHours(0, 0, 0, 0);

        const isShorter = pDate < sDate;

        if (isShorter && isStickerCovered) return { status: 'fail', reason: t.expiration.reasonBoth };
        if (isShorter) return { status: 'fail', reason: t.expiration.reasonShort };
        if (isStickerCovered) return { status: 'fail', reason: t.expiration.reasonSticker };

        return { status: 'pass', reason: t.expiration.resultPass };
    }, [physicalDate, systemDate, isStickerCovered, t.expiration]);

    return (
        <div className="expiration-page container animate-fade">
            <section className="hero-section">
                <h2>{t.expiration.title}</h2>
                <p className="text-muted">{t.expiration.sub}</p>
            </section>

            <div className="validators-stack">
                {/* NEW: Manufacturing Date Validator */}
                <section className="validator-section mt-4 glass-card">
                    <div className="section-header">
                        <span className="material-symbols-outlined emoji">precision_manufacturing</span>
                        <h3>{t.expiration.mfgValidatorTitle}</h3>
                    </div>
                    <div className="validator-grid mt-3">
                        <div className="input-group">
                            <label className="info-label">{t.expiration.mfgCategoryLabel}</label>
                            <select
                                className="input-field"
                                value={mfgCategory}
                                onChange={(e) => setMfgCategory(e.target.value)}
                            >
                                <option value="diaper_dom">기저귀/물티슈 (국내 - 12개월)</option>
                                <option value="diaper_imp">기저귀/물티슈 (수입 - 15개월)</option>
                                <option value="pet_wipes">Pet 물티슈 (240일)</option>
                                <option value="grains">잡곡 (14일)</option>
                                <option value="rice">쌀 (7일)</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label className="info-label">{t.expiration.mfgPhysicalLabel}</label>
                            <input
                                type="date"
                                className="input-field"
                                value={mfgPhysicalDate}
                                onChange={(e) => setMfgPhysicalDate(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label className="info-label">{t.expiration.mfgSystemLabel}</label>
                            <input
                                type="date"
                                className="input-field"
                                value={mfgSystemDate}
                                onChange={(e) => setMfgSystemDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {mfgValidationResult && (
                        <div className={`result-box mt-3 ${mfgValidationResult.status}`}>
                            <div className="result-header">
                                {mfgValidationResult.status === 'pass' ? t.expiration.resultPass : t.expiration.resultFail}
                            </div>
                            <p className="result-reason">{mfgValidationResult.reason}</p>
                        </div>
                    )}
                </section>

                {/* Expiration Validator Section */}
                <section className="validator-section mt-4 glass-card">
                    <div className="section-header">
                        <span className="material-symbols-outlined emoji">verified_user</span>
                        <h3>{t.expiration.validatorTitle}</h3>
                    </div>
                    <div className="validator-grid mt-3">
                        <div className="input-group">
                            <label className="info-label">{t.expiration.physicalLabel}</label>
                            <input
                                type="date"
                                className="input-field"
                                value={physicalDate}
                                onChange={(e) => setPhysicalDate(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label className="info-label">{t.expiration.systemLabel}</label>
                            <input
                                type="date"
                                className="input-field"
                                value={systemDate}
                                onChange={(e) => setSystemDate(e.target.value)}
                            />
                        </div>
                        <div className="input-group checkbox-group">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={isStickerCovered}
                                    onChange={(e) => setIsStickerCovered(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                {t.expiration.stickerCovered}
                            </label>
                        </div>
                    </div>

                    {validationResult && (
                        <div className={`result-box mt-3 ${validationResult.status}`}>
                            <div className="result-header">
                                {validationResult.status === 'pass' ? t.expiration.resultPass : t.expiration.resultFail}
                            </div>
                            <p className="result-reason">{validationResult.reason}</p>
                            {validationResult.status === 'fail' && (
                                <p className="strict-notice mt-1">⚠️ {t.expiration.strictNotice}</p>
                            )}
                        </div>
                    )}
                </section>
            </div>

            <div className="expiration-grid mt-4">
                {/* Domestic & Imported Card */}
                <div className="info-card highlight-card">
                    <div className="card-header">
                        <span className="material-symbols-outlined">inventory_2</span>
                        <h3>{t.expiration.remaining}</h3>
                    </div>
                    <div className="criteria-list">
                        <div className="criteria-item">
                            <span className="label">{t.expiration.domestic}</span>
                            <span className="value primary">{t.expiration.criteria50}</span>
                        </div>
                        <div className="criteria-item">
                            <span className="label">{t.expiration.imported}</span>
                            <span className="value secondary">{t.expiration.criteria40}</span>
                        </div>
                    </div>
                </div>

                {/* Manufacturing Date Card */}
                <div className="info-card">
                    <div className="card-header">
                        <span className="material-symbols-outlined">factory</span>
                        <h3>{t.expiration.mfgDate}</h3>
                    </div>
                    <div className="mfg-list">
                        <div className="mfg-item">
                            <div className="mfg-main">
                                <span>{t.expiration.diaper} / {t.expiration.wetWipes}</span>
                                <span className="mfg-val">12~15개월</span>
                            </div>
                            <p className="mfg-sub">국내 12개월 / 수입 15개월 이내</p>
                        </div>
                        <div className="mfg-item">
                            <div className="mfg-main">
                                <span>{t.expiration.petWipes}</span>
                                <span className="mfg-val">8개월</span>
                            </div>
                            <p className="mfg-sub">국내/수입 공통 240일 이내</p>
                        </div>
                        <div className="mfg-item">
                            <div className="mfg-main">
                                <span>{t.expiration.grains}</span>
                                <span className="mfg-val">7~14일</span>
                            </div>
                            <p className="mfg-sub">{t.expiration.grainsTip}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pro Tips Section */}
            <section className="tips-section mt-4">
                <div className="section-header">
                    <span className="material-symbols-outlined emoji">lightbulb</span>
                    <h3>{t.expiration.tipTitle}</h3>
                </div>
                <div className="tips-grid mt-2">
                    <div className="tip-card">
                        <div className="tip-number">01</div>
                        <p>{t.expiration.tip1}</p>
                    </div>
                    <div className="tip-card">
                        <div className="tip-number">02</div>
                        <p>{t.expiration.tip2}</p>
                    </div>
                    <div className="tip-card">
                        <div className="tip-number">03</div>
                        <p>{t.expiration.tip3}</p>
                    </div>
                </div>
            </section>

            <section className="footer-notice mt-4">
                <p className="text-muted small">
                    * 위 기준은 쿠팡의 공식 공급자 입고 매뉴얼(v3.06) 및 로켓그로스 가이드를 바탕으로 작성되었습니다.
                    정확한 최신 기준은 윙(WING) 시스템의 공지사항을 반드시 확인하시기 바랍니다.
                </p>
            </section>
        </div>
    );
}
