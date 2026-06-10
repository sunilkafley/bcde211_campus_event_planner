interface PageHeaderProps {
  title: string
  subtitle: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="page-header">
      <img src="\icon_campus_event_planner.png"></img>
      <p className="eyebrow">Developed by Sunil Kafley</p>

      <h1>{title}</h1>

      <p className="subtitle">{subtitle}</p>
    </header>
  )
}
