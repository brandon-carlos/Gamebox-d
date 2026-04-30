import { employeeProfiles } from '../data/siteData';

export default function About() {
  return (
    <div className="page-stack">
      <section className="simple-title-wrap">
        <h1 className="pixel-title giant-title">ABOUT US</h1>
      </section>
      <section className="about-list">
        {employeeProfiles.map((employee) => (
          <article key={employee.id} className="employee-card">
            <div className="employee-side">
              <p className="employee-name">{employee.name}</p>
              <img loading="lazy" decoding="async" className="employee-portrait" src={employee.image} alt={employee.name} />
              <div className="employee-mini-stats">
                <span>{employee.stats.gamesPlayed} games played</span>
                <span>{employee.stats.reviews} games reviewed</span>
                <span>{employee.stats.followers} followers</span>
              </div>
            </div>
            <div className="employee-main-copy">
              <h2>{employee.role}</h2>
              <p>{employee.description}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
