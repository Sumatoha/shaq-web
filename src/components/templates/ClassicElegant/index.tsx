'use client';

import { useState, useEffect, useRef } from 'react';
import { EventData, ThemeConfig } from '@/types';
import { formatDate, getTimeUntil, TimeUntilResult } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface ClassicElegantProps {
  data: EventData;
  theme: ThemeConfig;
  guestName?: string;
  onRSVP?: (status: string, guestCount: number, wishes: string) => void;
}

export function ClassicElegant({ data, theme, guestName, onRSVP }: ClassicElegantProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [countdown, setCountdown] = useState<TimeUntilResult>(getTimeUntil(data.date, data.time));

  // RSVP state
  const [rsvpStatus, setRsvpStatus] = useState<'form' | 'success' | 'declined'>('form');
  const [rsvpName, setRsvpName] = useState(guestName || '');
  const [rsvpCount, setRsvpCount] = useState(2);
  const [rsvpWishes, setRsvpWishes] = useState('');

  // Countdown timer
  useEffect(() => {
    if (countdown.isPlaceholder) return;
    const timer = setInterval(() => {
      setCountdown(getTimeUntil(data.date, data.time));
    }, 1000);
    return () => clearInterval(timer);
  }, [data.date, data.time, countdown.isPlaceholder]);

  // Generate CSS variables from theme
  const cssVars = {
    '--gold': theme.colors.accent,
    '--gold-light': theme.colors.accentLight,
    '--gold-dark': theme.colors.accent,
    '--cream': theme.colors.primary,
    '--cream-dark': theme.colors.secondary,
    '--dark': theme.colors.text,
    '--dark-soft': theme.colors.text,
    '--text': theme.colors.text,
    '--text-light': theme.colors.textMuted,
    '--white': '#FFFFFF',
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
  } as React.CSSProperties;

  const names = data.names.person2
    ? `${data.names.person1} & ${data.names.person2}`
    : data.names.person1;

  const handleRSVP = async (status: 'confirmed' | 'declined') => {
    if (onRSVP) {
      await onRSVP(status, rsvpCount, rsvpWishes);
    }
    setRsvpStatus(status === 'confirmed' ? 'success' : 'declined');
  };

  // Envelope intro
  if (showIntro) {
    return (
      <div
        className="envelope-intro"
        style={cssVars}
        onClick={() => setShowIntro(false)}
      >
        <style>{getStyles(theme)}</style>
        <div className="envelope-container">
          <svg className="envelope-icon" viewBox="0 0 120 120" fill="none">
            <rect x="10" y="30" width="100" height="70" rx="4" stroke={theme.colors.accent} strokeWidth="1.5" fill="none"/>
            <path d={`M10 30 L60 72 L110 30`} stroke={theme.colors.accent} strokeWidth="1.5" fill="none"/>
            <path d="M10 100 L45 65" stroke={theme.colors.accent} strokeWidth="1" opacity="0.4"/>
            <path d="M110 100 L75 65" stroke={theme.colors.accent} strokeWidth="1" opacity="0.4"/>
            <path d="M60 45 L67 55 L60 65 L53 55Z" stroke={theme.colors.accent} strokeWidth="1" fill="none" opacity="0.6"/>
            <circle cx="60" cy="55" r="3" fill={theme.colors.accent} opacity="0.4"/>
          </svg>
          <div className="envelope-text">Откройте приглашение</div>
        </div>
      </div>
    );
  }

  return (
    <div className="invitation" style={cssVars}>
      <style>{getStyles(theme)}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-border">
          <CornerOrnament position="top-left" color={theme.colors.accent} />
          <CornerOrnament position="top-right" color={theme.colors.accent} />
          <CornerOrnament position="bottom-left" color={theme.colors.accent} />
          <CornerOrnament position="bottom-right" color={theme.colors.accent} />
        </div>

        <div className="section-inner">
          <div className="hero-overline">Приглашение на торжество</div>
          <h1 className="hero-names">
            {data.names.person1}
            {data.names.person2 && (
              <>
                <span className="amp">и</span>
                {data.names.person2}
              </>
            )}
          </h1>
          <div className="hero-date-line">
            <span className="line"></span>
            <span className="hero-date">{formatDate(data.date)}</span>
            <span className="line"></span>
          </div>
        </div>

        <div className="scroll-hint">
          <span>листайте</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* GREETING */}
      <section className="greeting">
        <div className="section-inner">
          <OrnamentDivider color={theme.colors.accent} />
          {guestName && (
            <div className="guest-name-slot">Құрметті {guestName}</div>
          )}
          <p className="greeting-text">
            {data.greetingKz || 'Біздің өмірімізде ұмытылмас сәт орын алғалы отыр. Бақытымызды бөлісуге сізді шақырамыз!'}
            <br /><br />
            {data.greetingRu || 'В нашей жизни наступает незабываемый момент. Мы будем рады разделить наше счастье вместе с вами!'}
          </p>
        </div>
      </section>

      {/* DETAILS */}
      <section className="details">
        <div className="section-inner">
          <div className="section-label">Детали торжества</div>
          <OrnamentDivider color={theme.colors.accent} light />

          <div className="details-grid">
            <RevealCard>
              <div className="detail-card">
                <CalendarIcon />
                <div className="detail-title">Дата</div>
                <div className="detail-info">
                  <strong>{formatDate(data.date)}</strong>
                  {data.gatheringTime && `Сбор гостей в ${data.gatheringTime}`}
                </div>
              </div>
            </RevealCard>

            <RevealCard delay={100}>
              <div className="detail-card">
                <ClockIcon />
                <div className="detail-title">Время</div>
                <div className="detail-info">
                  <strong>Начало в {data.time || '18:00'}</strong>
                </div>
              </div>
            </RevealCard>

            <RevealCard delay={200}>
              <div className="detail-card">
                <LocationIcon />
                <div className="detail-title">Место</div>
                <div className="detail-info">
                  <strong>{data.venue?.name || 'Ресторан'}</strong>
                  {data.venue?.address || 'Адрес уточняется'}
                </div>
              </div>
            </RevealCard>

            {data.dressCode && (
              <RevealCard delay={300}>
                <div className="detail-card">
                  <DressCodeIcon />
                  <div className="detail-title">Дресс-код</div>
                  <div className="detail-info">
                    <strong>{data.dressCode}</strong>
                  </div>
                </div>
              </RevealCard>
            )}
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="countdown-section">
        <div className="section-inner">
          <div className="section-label" style={{ color: theme.colors.accent }}>
            До торжества осталось
          </div>
          <div className="countdown-grid">
            <div className="countdown-item">
              <div className="countdown-number">{countdown.days}</div>
              <div className="countdown-label">дней</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{String(countdown.hours).padStart(2, '0')}</div>
              <div className="countdown-label">часов</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{String(countdown.minutes).padStart(2, '0')}</div>
              <div className="countdown-label">минут</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{String(countdown.seconds).padStart(2, '0')}</div>
              <div className="countdown-label">секунд</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      {data.program && data.program.length > 0 && (
        <section className="program">
          <div className="section-inner">
            <div className="section-label" style={{ color: theme.colors.accent }}>
              Программа вечера
            </div>
            <OrnamentDivider color={theme.colors.accent} />

            <div className="timeline">
              {data.program.map((item, i) => (
                <RevealCard key={i} delay={i * 100}>
                  <div className="timeline-item">
                    <div className="timeline-time">{item.time}</div>
                    <div className="timeline-title">{item.title}</div>
                    {item.desc && <div className="timeline-desc">{item.desc}</div>}
                  </div>
                </RevealCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCATION */}
      {data.venue && (
        <section className="location">
          <div className="section-inner">
            <div className="section-label" style={{ color: theme.colors.accent }}>
              Место проведения
            </div>
            <div className="detail-title" style={{ color: theme.colors.text, marginBottom: '8px' }}>
              {data.venue.name}
            </div>
            <p style={{ color: theme.colors.textMuted, fontSize: '0.9rem' }}>
              {data.venue.address}
            </p>

            {data.venue.mapUrl && (
              <div className="map-wrapper">
                <iframe
                  src={data.venue.mapUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="map-overlay" />
              </div>
            )}

            <a
              href={data.venue.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(data.venue.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="location-btn"
            >
              <LocationIcon small />
              Построить маршрут
            </a>
          </div>
        </section>
      )}

      {/* RSVP */}
      <section className="rsvp">
        <div className="section-inner">
          <div className="section-label">Подтверждение</div>
          <h2 className="rsvp-title">Ждём вашего ответа</h2>
          {data.rsvpDeadline && (
            <p className="rsvp-subtitle">
              Пожалуйста, подтвердите ваше присутствие до {formatDate(data.rsvpDeadline)}
            </p>
          )}

          {rsvpStatus === 'form' ? (
            <div className="rsvp-form">
              <div className="form-group">
                <label className="form-label">Ваше имя</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Введите ваше полное имя"
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Количество гостей</label>
                <select
                  className="form-select"
                  value={rsvpCount}
                  onChange={(e) => setRsvpCount(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Пожелания</label>
                <textarea
                  className="form-textarea"
                  placeholder="Особые пожелания, аллергии, предпочтения..."
                  value={rsvpWishes}
                  onChange={(e) => setRsvpWishes(e.target.value)}
                />
              </div>
              <div className="rsvp-buttons">
                <button className="rsvp-btn accept" onClick={() => handleRSVP('confirmed')}>
                  Приду
                </button>
                <button className="rsvp-btn decline" onClick={() => handleRSVP('declined')}>
                  Не смогу
                </button>
              </div>
            </div>
          ) : (
            <div className="rsvp-success show">
              <svg className="checkmark" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 32 L28 40 L44 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>{rsvpStatus === 'success' ? 'Рахмет! Спасибо!' : 'Жаль, что не сможете'}</h3>
              <p>
                {rsvpStatus === 'success'
                  ? 'Мы с нетерпением ждём встречи с вами!'
                  : 'Мы будем скучать! Надеемся увидеться в другой раз.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <OrnamentDivider color={theme.colors.accent} light />
        <div className="footer-names">{names}</div>
        <div className="footer-date">{formatDate(data.date)}</div>
        {data.hashtag && <span className="footer-hashtag">{data.hashtag}</span>}
      </footer>
    </div>
  );
}

// Helper components
function RevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isInView } = useScrollAnimation({ delay });
  return (
    <div
      ref={ref}
      className={`reveal ${isInView ? 'visible' : ''}`}
    >
      {children}
    </div>
  );
}

function CornerOrnament({ position, color }: { position: string; color: string }) {
  return (
    <svg className={`ornament-corner ${position}`} viewBox="0 0 120 120" fill="none">
      <path d="M0 60 Q30 60 30 30 Q30 0 60 0" stroke={color} strokeWidth="1.5" fill="none"/>
      <path d="M0 40 Q20 40 20 20 Q20 0 40 0" stroke={color} strokeWidth="1" fill="none"/>
      <circle cx="30" cy="30" r="3" fill={color}/>
      <path d="M15 15 L22 22 M38 0 L38 12 M0 38 L12 38" stroke={color} strokeWidth="0.8"/>
    </svg>
  );
}

function OrnamentDivider({ color, light = false }: { color: string; light?: boolean }) {
  const opacity = light ? '0.5' : '1';
  return (
    <svg width="200" height="30" viewBox="0 0 200 30" fill="none" className="ornament-divider" style={{ opacity }}>
      <line x1="0" y1="15" x2="70" y2="15" stroke={color} strokeWidth="0.5"/>
      <path d="M80 15 L90 5 L100 15 L90 25Z" stroke={color} strokeWidth="1" fill="none"/>
      <circle cx="90" cy="15" r="3" fill={color} opacity="0.6"/>
      <path d="M100 15 L110 5 L120 15 L110 25Z" stroke={color} strokeWidth="1" fill="none"/>
      <circle cx="110" cy="15" r="3" fill={color} opacity="0.6"/>
      <line x1="130" y1="15" x2="200" y2="15" stroke={color} strokeWidth="0.5"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="detail-icon" viewBox="0 0 36 36" fill="none">
      <rect x="4" y="8" width="28" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="4" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="24" y1="4" x2="24" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="18" cy="24" r="2" fill="currentColor"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="detail-icon" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="18" y1="10" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="18" x2="24" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="18" cy="18" r="2" fill="currentColor"/>
    </svg>
  );
}

function LocationIcon({ small = false }: { small?: boolean }) {
  const size = small ? 16 : 36;
  return (
    <svg className="detail-icon" viewBox="0 0 36 36" fill="none" width={size} height={size}>
      <path d="M18 3C12 3 6 8 6 15C6 24 18 33 18 33C18 33 30 24 30 15C30 8 24 3 18 3Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="15" r="5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function DressCodeIcon() {
  return (
    <svg className="detail-icon" viewBox="0 0 36 36" fill="none">
      <path d="M6 28 L18 6 L30 28Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <line x1="12" y1="28" x2="24" y2="28" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1"/>
    </svg>
  );
}

// Styles function - generates CSS based on theme
function getStyles(theme: ThemeConfig): string {
  return `
    .envelope-intro {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${theme.colors.text};
      cursor: pointer;
    }

    .envelope-container {
      text-align: center;
      animation: float 3s ease-in-out infinite;
    }

    .envelope-icon {
      width: 120px;
      height: 120px;
      margin-bottom: 32px;
      filter: drop-shadow(0 0 40px ${theme.colors.accent}40);
    }

    .envelope-text {
      font-family: '${theme.fonts.heading}', serif;
      font-size: 1.3rem;
      font-weight: 300;
      color: ${theme.colors.accentLight};
      letter-spacing: 4px;
      text-transform: uppercase;
      animation: pulse-text 2s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }

    @keyframes pulse-text {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    .invitation {
      max-width: 100%;
      overflow-x: hidden;
      font-family: '${theme.fonts.body}', sans-serif;
      background: ${theme.colors.primary};
      color: ${theme.colors.text};
      line-height: 1.6;
    }

    section {
      position: relative;
      padding: 100px 24px;
      overflow: hidden;
    }

    .section-inner {
      max-width: 680px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    /* HERO */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: ${theme.colors.text};
      color: ${theme.colors.primary};
      position: relative;
    }

    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 30% 20%, ${theme.colors.accent}14 0%, transparent 50%),
        radial-gradient(ellipse at 70% 80%, ${theme.colors.accent}10 0%, transparent 50%);
      pointer-events: none;
    }

    .hero-border {
      position: absolute;
      inset: 16px;
      border: 1px solid ${theme.colors.accent}26;
      pointer-events: none;
    }

    .hero-border::before {
      content: '';
      position: absolute;
      inset: 8px;
      border: 1px solid ${theme.colors.accent}14;
    }

    .ornament-corner {
      position: absolute;
      width: 120px;
      height: 120px;
      opacity: 0.12;
      pointer-events: none;
    }

    .ornament-corner.top-left { top: 20px; left: 20px; }
    .ornament-corner.top-right { top: 20px; right: 20px; transform: scaleX(-1); }
    .ornament-corner.bottom-left { bottom: 20px; left: 20px; transform: scaleY(-1); }
    .ornament-corner.bottom-right { bottom: 20px; right: 20px; transform: scale(-1, -1); }

    .hero-overline {
      font-family: '${theme.fonts.body}', sans-serif;
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 8px;
      text-transform: uppercase;
      color: ${theme.colors.accent};
      margin-bottom: 40px;
      opacity: 0;
      animation: fadeSlideUp 1s ease 0.3s forwards;
    }

    .hero-names {
      font-family: '${theme.fonts.heading}', serif;
      font-weight: 300;
      font-size: clamp(2.8rem, 8vw, 5.5rem);
      line-height: 1.15;
      margin-bottom: 16px;
      opacity: 0;
      animation: fadeSlideUp 1.2s ease 0.6s forwards;
    }

    .hero-names .amp {
      display: block;
      font-style: italic;
      font-size: 0.45em;
      color: ${theme.colors.accent};
      margin: 8px 0;
      letter-spacing: 2px;
    }

    .hero-date-line {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-top: 40px;
      opacity: 0;
      animation: fadeSlideUp 1s ease 0.9s forwards;
    }

    .hero-date-line .line {
      width: 60px;
      height: 1px;
      background: ${theme.colors.accent};
      opacity: 0.4;
    }

    .hero-date {
      font-family: '${theme.fonts.body}', sans-serif;
      font-size: 0.8rem;
      font-weight: 400;
      letter-spacing: 6px;
      color: ${theme.colors.accentLight};
    }

    .scroll-hint {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      opacity: 0;
      animation: fadeIn 1s ease 1.5s forwards;
    }

    .scroll-hint span {
      font-size: 0.6rem;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: ${theme.colors.accent};
      opacity: 0.5;
    }

    .scroll-line {
      width: 1px;
      height: 40px;
      background: linear-gradient(to bottom, ${theme.colors.accent}, transparent);
      animation: scroll-pulse 2s ease-in-out infinite;
    }

    @keyframes scroll-pulse {
      0%, 100% { opacity: 0.3; transform: scaleY(1); }
      50% { opacity: 0.8; transform: scaleY(1.3); }
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* GREETING */
    .greeting {
      background: ${theme.colors.primary};
      text-align: center;
      padding: 120px 24px;
    }

    .ornament-divider {
      width: 200px;
      height: 30px;
      margin: 0 auto 48px;
    }

    .guest-name-slot {
      display: block;
      font-family: '${theme.fonts.heading}', serif;
      font-size: clamp(1.6rem, 4vw, 2.2rem);
      font-weight: 600;
      font-style: italic;
      color: ${theme.colors.accent};
      margin: 32px 0;
      padding: 16px 0;
      border-top: 1px solid ${theme.colors.accentLight};
      border-bottom: 1px solid ${theme.colors.accentLight};
    }

    .greeting-text {
      font-family: '${theme.fonts.heading}', serif;
      font-size: clamp(1.15rem, 3vw, 1.4rem);
      font-weight: 400;
      line-height: 2;
      color: ${theme.colors.text};
      max-width: 560px;
      margin: 0 auto;
    }

    /* DETAILS */
    .details {
      background: ${theme.colors.text};
      color: ${theme.colors.primary};
      text-align: center;
      position: relative;
    }

    .section-label {
      font-family: '${theme.fonts.body}', sans-serif;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 6px;
      text-transform: uppercase;
      color: ${theme.colors.accent};
      margin-bottom: 48px;
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 56px;
      margin-top: 48px;
    }

    @media (min-width: 600px) {
      .details-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .detail-card {
      padding: 40px 24px;
      border: 1px solid ${theme.colors.accent}1f;
      position: relative;
      transition: border-color 0.4s ease;
    }

    .detail-card:hover {
      border-color: ${theme.colors.accent}4d;
    }

    .detail-card::before {
      content: '';
      position: absolute;
      top: -1px; left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 2px;
      background: ${theme.colors.accent};
    }

    .detail-icon {
      width: 36px;
      height: 36px;
      margin: 0 auto 20px;
      color: ${theme.colors.accent};
    }

    .detail-title {
      font-family: '${theme.fonts.heading}', serif;
      font-size: 1.6rem;
      font-weight: 500;
      margin-bottom: 12px;
      color: ${theme.colors.primary};
    }

    .detail-info {
      font-size: 0.85rem;
      line-height: 1.8;
      color: ${theme.colors.primary}99;
      font-weight: 300;
    }

    .detail-info strong {
      display: block;
      color: ${theme.colors.accentLight};
      font-weight: 500;
      font-size: 1rem;
      margin-bottom: 4px;
    }

    /* COUNTDOWN */
    .countdown-section {
      background: ${theme.colors.primary};
      text-align: center;
      padding: 100px 24px;
    }

    .countdown-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      max-width: 480px;
      margin: 48px auto 0;
    }

    .countdown-item {
      padding: 24px 8px;
      background: #fff;
      border: 1px solid ${theme.colors.accent}26;
      position: relative;
    }

    .countdown-item::after {
      content: '';
      position: absolute;
      bottom: 0; left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 1px;
      background: ${theme.colors.accent};
    }

    .countdown-number {
      font-family: '${theme.fonts.heading}', serif;
      font-size: clamp(2.2rem, 6vw, 3rem);
      font-weight: 300;
      color: ${theme.colors.text};
      line-height: 1;
      margin-bottom: 8px;
    }

    .countdown-label {
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: ${theme.colors.textMuted};
    }

    /* PROGRAM */
    .program {
      background: #fff;
      text-align: center;
    }

    .timeline {
      margin-top: 56px;
      position: relative;
      text-align: left;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: linear-gradient(to bottom, transparent, ${theme.colors.accentLight}, ${theme.colors.accentLight}, transparent);
    }

    .timeline-item {
      padding: 0 0 48px 40px;
      position: relative;
    }

    .timeline-item:last-child { padding-bottom: 0; }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -4px;
      top: 6px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: ${theme.colors.accent};
      box-shadow: 0 0 0 4px #fff, 0 0 0 5px ${theme.colors.accentLight};
    }

    .timeline-time {
      font-family: '${theme.fonts.body}', sans-serif;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: ${theme.colors.accent};
      margin-bottom: 6px;
    }

    .timeline-title {
      font-family: '${theme.fonts.heading}', serif;
      font-size: 1.3rem;
      font-weight: 500;
      color: ${theme.colors.text};
      margin-bottom: 4px;
    }

    .timeline-desc {
      font-size: 0.82rem;
      color: ${theme.colors.textMuted};
      font-weight: 300;
    }

    /* LOCATION */
    .location {
      background: ${theme.colors.secondary};
      text-align: center;
    }

    .map-wrapper {
      margin-top: 48px;
      border: 1px solid ${theme.colors.accent}33;
      overflow: hidden;
      aspect-ratio: 16/9;
      max-height: 400px;
      background: ${theme.colors.text};
      position: relative;
    }

    .map-wrapper iframe {
      width: 100%;
      height: 100%;
      border: none;
      filter: grayscale(0.3) contrast(1.1);
    }

    .map-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, ${theme.colors.text}1a, ${theme.colors.text}66);
      pointer-events: none;
    }

    .location-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-top: 32px;
      padding: 16px 40px;
      background: ${theme.colors.text};
      color: ${theme.colors.accentLight};
      border: none;
      font-family: '${theme.fonts.body}', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.4s ease;
    }

    .location-btn:hover {
      background: ${theme.colors.accent};
      color: #fff;
    }

    .location-btn svg {
      width: 16px;
      height: 16px;
    }

    /* RSVP */
    .rsvp {
      background: ${theme.colors.text};
      color: ${theme.colors.primary};
      text-align: center;
    }

    .rsvp-title {
      font-family: '${theme.fonts.heading}', serif;
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 300;
      margin-bottom: 16px;
    }

    .rsvp-subtitle {
      font-size: 0.85rem;
      color: ${theme.colors.primary}80;
      font-weight: 300;
      margin-bottom: 56px;
    }

    .rsvp-form {
      max-width: 420px;
      margin: 0 auto;
      text-align: left;
    }

    .form-group {
      margin-bottom: 28px;
    }

    .form-label {
      display: block;
      font-size: 0.62rem;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: ${theme.colors.accent};
      margin-bottom: 10px;
    }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: 14px 0;
      background: transparent;
      border: none;
      border-bottom: 1px solid ${theme.colors.accent}33;
      color: ${theme.colors.primary};
      font-family: '${theme.fonts.heading}', serif;
      font-size: 1.15rem;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      border-color: ${theme.colors.accent};
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
      color: ${theme.colors.primary}40;
    }

    .form-select {
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
    }

    .form-select option {
      background: ${theme.colors.text};
      color: ${theme.colors.primary};
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
      border: 1px solid ${theme.colors.accent}26;
      padding: 14px 16px;
      margin-top: 4px;
    }

    .rsvp-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 40px;
    }

    .rsvp-btn {
      padding: 18px 24px;
      font-family: '${theme.fonts.body}', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 4px;
      text-transform: uppercase;
      border: 1px solid ${theme.colors.accent};
      cursor: pointer;
      transition: all 0.4s ease;
    }

    .rsvp-btn.accept {
      background: ${theme.colors.accent};
      color: ${theme.colors.text};
    }

    .rsvp-btn.accept:hover {
      background: ${theme.colors.accentLight};
      border-color: ${theme.colors.accentLight};
    }

    .rsvp-btn.decline {
      background: transparent;
      color: ${theme.colors.accent};
    }

    .rsvp-btn.decline:hover {
      background: ${theme.colors.accent}1a;
    }

    .rsvp-success {
      text-align: center;
      padding: 40px 0;
      animation: fadeSlideUp 0.6s ease forwards;
    }

    .rsvp-success .checkmark {
      width: 64px;
      height: 64px;
      margin: 0 auto 24px;
      color: ${theme.colors.accent};
    }

    .rsvp-success h3 {
      font-family: '${theme.fonts.heading}', serif;
      font-size: 1.8rem;
      font-weight: 400;
      margin-bottom: 8px;
    }

    .rsvp-success p {
      color: ${theme.colors.primary}80;
      font-size: 0.9rem;
    }

    /* FOOTER */
    .footer {
      background: ${theme.colors.text};
      border-top: 1px solid ${theme.colors.accent}1a;
      text-align: center;
      padding: 60px 24px;
    }

    .footer-names {
      font-family: '${theme.fonts.heading}', serif;
      font-size: 1.6rem;
      font-weight: 300;
      color: ${theme.colors.accent};
      letter-spacing: 2px;
    }

    .footer-date {
      font-size: 0.7rem;
      letter-spacing: 4px;
      color: ${theme.colors.primary}4d;
      margin-top: 12px;
      text-transform: uppercase;
    }

    .footer-hashtag {
      display: inline-block;
      margin-top: 24px;
      font-family: '${theme.fonts.heading}', serif;
      font-size: 1rem;
      font-style: italic;
      color: ${theme.colors.accentLight};
      opacity: 0.5;
    }

    /* REVEAL ANIMATIONS */
    .reveal {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }

    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* RESPONSIVE */
    @media (max-width: 480px) {
      section { padding: 80px 20px; }
      .countdown-grid { gap: 8px; }
      .countdown-item { padding: 16px 4px; }
      .rsvp-buttons { grid-template-columns: 1fr; }
      .hero-border { inset: 10px; }
      .ornament-corner { width: 80px; height: 80px; }
    }
  `;
}
