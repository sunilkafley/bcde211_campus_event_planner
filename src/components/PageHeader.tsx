interface PageHeaderProps {
  title: string
  subtitle: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="header-brand">
        <img
          src="/icons/pwa-192x192.png"
          alt="Campus Event Planner Logo"
          className="header-logo"
        />

        <div>
          <h1>{title}</h1>
          <p className="eyebrow">Christchurch, New Zealand</p>

          <p className="subtitle">{subtitle}</p>
        </div>
      </div>
    </header>
  )
}
