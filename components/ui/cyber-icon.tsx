export function CyberIcon({ type, size = 20 }: { type: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    network: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="3" /><circle cx="19" cy="19" r="3" />
        <line x1="12" y1="8" x2="5" y2="16" /><line x1="12" y1="8" x2="19" y2="16" />
      </svg>
    ),
    web: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    endpoint: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    app: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    mssp: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    data: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    mobile: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    risk: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    secops: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    threat: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    identity: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    digitalrisk: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    blockchain: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="8" height="8" rx="1" /><rect x="15" y="4" width="8" height="8" rx="1" />
        <rect x="8" y="12" width="8" height="8" rx="1" /><line x1="9" y1="8" x2="15" y2="8" />
        <line x1="12" y1="12" x2="12" y2="8" />
      </svg>
    ),
    iot: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.12 19a7 7 0 0 1 0-14" /><path d="M18.88 5a7 7 0 0 1 0 14" />
        <circle cx="12" cy="12" r="3" /><path d="M2 12h3" /><path d="M19 12h3" />
      </svg>
    ),
    messaging: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    consulting: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="9" y1="10" x2="15" y2="10" />
      </svg>
    ),
    fraud: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    cloud: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <path d="M12 12v4" /><path d="M12 8v.01" />
      </svg>
    ),
    server: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
    database: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    firewall: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="9" y1="12" x2="15" y2="12" />
      </svg>
    ),
    vpn: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    encryption: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    malware: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    virus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" />
        <circle cx="6" cy="6" r="1" /><circle cx="18" cy="6" r="1" />
        <circle cx="6" cy="18" r="1" /><circle cx="18" cy="18" r="1" />
      </svg>
    ),
    monitoring: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 20 3 20 8 15 8" /><polyline points="1 18 4 21 4 16 9 16" />
        <path d="M22 4v5h-5" /><path d="M2 20v-5h5" />
      </svg>
    ),
    audit: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
      </svg>
    ),
    compliance: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="9" y1="12" x2="11" y2="14" /><line x1="15" y1="10" x2="11" y2="14" />
      </svg>
    ),
    // Digital Member Category Icons
    ecommerce: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    logistic: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    financial: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    edutech: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    telecom: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    media: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/>
        <line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/>
        <line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>
      </svg>
    ),
    healthcare: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    venture: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        <polyline points="7 4 7 1 17 1 17 4"/>
      </svg>
    ),
    consultant: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    university: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    bumn: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="3" height="9"/>
        <rect x="14" y="7" width="3" height="5"/>
      </svg>
    ),
    retail: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><circle cx="6" cy="7" r="1" fill="currentColor"/>
        <circle cx="18" cy="7" r="1" fill="currentColor"/>
      </svg>
    ),
    shopping: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    cart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    manufacturing: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9"/><line x1="4" y1="5" x2="20" y2="5"/><rect x="9" y="9" width="6" height="4"/>
      </svg>
    ),
    agriculture: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20"/><path d="M2 12h20"/><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>
      </svg>
    ),
    energy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    construction: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="5 5 12 2 19 5"/>
      </svg>
    ),
    'shield-check': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 3L6 7v8c0 5.5 4.3 10.6 10 12 5.7-1.4 10-6.5 10-12V7L16 3z" />
        <path d="M12 16l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 16h2M26 16h2M16 4v2M16 26v2" strokeOpacity="0.4" strokeLinecap="round" />
        <circle cx="4" cy="16" r="1" fill="currentColor" strokeWidth="0" />
        <circle cx="28" cy="16" r="1" fill="currentColor" strokeWidth="0" />
      </svg>
    ),
    'tri-network': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="16" r="3" />
        <circle cx="16" cy="5" r="2" />
        <circle cx="27" cy="22" r="2" />
        <circle cx="5" cy="22" r="2" />
        <line x1="16" y1="7" x2="16" y2="13" strokeLinecap="round" />
        <line x1="25.3" y1="21" x2="18.6" y2="17.8" strokeLinecap="round" />
        <line x1="6.7" y1="21" x2="13.4" y2="17.8" strokeLinecap="round" />
        <path d="M12 5.5 Q8 8 6.7 19" strokeOpacity="0.25" strokeDasharray="2 2" strokeLinecap="round" />
        <path d="M20 5.5 Q24 8 25.3 19" strokeOpacity="0.25" strokeDasharray="2 2" strokeLinecap="round" />
        <path d="M7 24 Q16 30 25 24" strokeOpacity="0.25" strokeDasharray="2 2" strokeLinecap="round" />
      </svg>
    ),
    'hex-core': (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="16,3 28,10 28,22 16,29 4,22 4,10" />
        <circle cx="16" cy="16" r="4" />
        <line x1="16" y1="12" x2="16" y2="3" strokeOpacity="0.4" />
        <line x1="16" y1="20" x2="16" y2="29" strokeOpacity="0.4" />
      </svg>
    ),
    'medal-bronze': (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
        <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
        <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />
        <circle cx="20" cy="24" r="12" />
        <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />
        <line x1="13" y1="24.5" x2="27" y2="24.5" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    'medal-silver': (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
        <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
        <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />
        <circle cx="20" cy="24" r="12" />
        <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />
        <line x1="13.5" y1="22.5" x2="26.5" y2="22.5" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13.5" y1="26.5" x2="26.5" y2="26.5" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    'medal-gold': (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
        <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
        <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />
        <circle cx="20" cy="24" r="12" />
        <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />
        <line x1="14" y1="21" x2="26" y2="21" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13" y1="24.5" x2="27" y2="24.5" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="14" y1="28" x2="26" y2="28" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    'medal-platinum': (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
        <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
        <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />
        <circle cx="20" cy="24" r="12" />
        <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />
        <line x1="14.5" y1="20" x2="25.5" y2="20" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13" y1="23" x2="27" y2="23" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13" y1="26" x2="27" y2="26" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="14.5" y1="29" x2="25.5" y2="29" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    'medal-5': (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
        <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
        <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />
        <circle cx="20" cy="24" r="12" />
        <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />
        <line x1="14.5" y1="19" x2="25.5" y2="19" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13" y1="21.75" x2="27" y2="21.75" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13" y1="24.5" x2="27" y2="24.5" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13" y1="27.25" x2="27" y2="27.25" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="14.5" y1="30" x2="25.5" y2="30" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    'medal-6': (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
        <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
        <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />
        <circle cx="20" cy="24" r="12" />
        <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />
        <line x1="15" y1="18.5" x2="25" y2="18.5" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13.5" y1="21" x2="26.5" y2="21" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13" y1="23.5" x2="27" y2="23.5" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13" y1="26" x2="27" y2="26" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="13.5" y1="28.5" x2="26.5" y2="28.5" strokeLinecap="round" strokeWidth="1.8" />
        <line x1="15" y1="31" x2="25" y2="31" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
    'medal-star': (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
        <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
        <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />
        <circle cx="20" cy="24" r="12" />
        <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />
        <polygon points="20,18 21.4,22.1 25.7,22.1 22.3,24.7 23.5,28.9 20,26.4 16.5,28.9 17.7,24.7 14.3,22.1 18.6,22.1" strokeLinejoin="round" strokeWidth="1.4" />
      </svg>
    ),
    'medal-crown': (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
        <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
        <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />
        <circle cx="20" cy="24" r="12" />
        <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />
        <polyline points="13,30 13,22 16.5,27 20,19 23.5,27 27,22 27,30" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.4" />
        <line x1="13" y1="30" x2="27" y2="30" strokeLinecap="round" strokeWidth="1.4" />
      </svg>
    ),
    'medal-shield': (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
        <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
        <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />
        <circle cx="20" cy="24" r="12" />
        <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />
        <path d="M20 17 L26 20 L26 25 C26 28.5 20 31.5 20 31.5 C20 31.5 14 28.5 14 25 L14 20 Z" strokeLinejoin="round" strokeWidth="1.4" />
      </svg>
    ),
    'medal-diamond': (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="15" y1="4" x2="25" y2="4" strokeLinecap="round" />
        <line x1="15" y1="4" x2="17" y2="12" strokeLinecap="round" />
        <line x1="25" y1="4" x2="23" y2="12" strokeLinecap="round" />
        <circle cx="20" cy="24" r="12" />
        <circle cx="20" cy="24" r="8" strokeOpacity="0.22" strokeDasharray="2.5 2" />
        <polygon points="20,18 26,24 20,31 14,24" strokeLinejoin="round" strokeWidth="1.4" />
        <line x1="14" y1="24" x2="26" y2="24" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="17" y1="20.5" x2="23" y2="20.5" strokeOpacity="0.4" strokeWidth="1" />
      </svg>
    ),
  }
  return <>{icons[type] || icons.mssp}</>
}
