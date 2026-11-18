/** Identidade visual: logotipo vetorial da Minha Oficina */

interface BrandMarkProps {
  tamanho?: number;
  className?: string;
}

export function BrandMark({ tamanho = 44, className = '' }: BrandMarkProps) {
  return (
    <svg
      className={`brand-mark ${className}`}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Minha Oficina"
    >
      <rect x="0" y="0" width="48" height="48" rx="14" fill="var(--brand)" />
      <path
        d="M24 10.5v3.6M24 33.9v3.6M10.5 24h3.6M33.9 24h3.6M14.5 14.5l2.6 2.6M30.9 30.9l2.6 2.6M33.5 14.5l-2.6 2.6M17.1 30.9l-2.6 2.6"
        stroke="var(--brand-mark)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="7.2" fill="none" stroke="var(--brand-mark)" strokeWidth="2.8" />
      <path
        d="M18.5 34.5 31 22M28.5 18.5a4.6 4.6 0 1 1 5.6 5.6"
        fill="none"
        stroke="var(--brand-on)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="38" cy="10" r="3.2" fill="var(--brand-spark)" />
    </svg>
  );
}

interface BrandLogoProps {
  tamanho?: number;
  compacto?: boolean;
}

export function BrandLogo({ tamanho = 46, compacto = false }: BrandLogoProps) {
  return (
    <div className={`brand-lockup ${compacto ? 'compact' : ''}`}>
      <BrandMark tamanho={tamanho} />
      <div className="brand-texto">
        <strong>Minha Oficina</strong>
        {!compacto && <span>GESTÃO DE OFICINA</span>}
      </div>
    </div>
  );
}
