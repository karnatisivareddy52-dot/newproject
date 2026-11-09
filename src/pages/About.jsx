
function About() {
  return (
    <div>
      <section className="page-heading">
        <div>
          <p className="eyebrow">ABOUT THE PROJECT</p>
          <h1>About EmployeeHub</h1>
          <p>A simple application for managing employee information.</p>
        </div>
      </section>

      <section className="panel about-panel">
        <div className="about-logo">E</div>
        <h2>Employee Management System</h2>
        <p>
          EmployeeHub helps users create, view, update, and delete
          employee records through an easy-to-use interface.
        </p>

        <h3>Technologies Used</h3>
        <div className="tech-list">
          <span>React JS</span>
          <span>React Router</span>
          <span>Spring Boot</span>
          <span>Java</span>
          <span>Oracle Database</span>
          <span>REST API</span>
        </div>
      </section>
    </div>
  );
}

export default About;
