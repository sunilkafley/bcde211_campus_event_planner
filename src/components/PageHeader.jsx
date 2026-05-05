export default function PageHeader({ title, subtitle }) {
  return (
    <header className="page-header">
      <p className="eyebrow">BCDE211</p>
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
    </header>
  );
}