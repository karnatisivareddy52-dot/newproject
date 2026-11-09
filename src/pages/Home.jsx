
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8080/api/employees";

function Home() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmployees() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not load employees.");
        }

        const data = await response.json();
        setEmployees(data);
      } catch {
        setError(
          "Cannot connect to the backend. Check that Spring Boot is running on port 8080."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEmployees();
  }, []);

  const totalSalary = employees.reduce(
    (total, employee) => total + Number(employee.salary || 0),
    0
  );

  return (
    <div>
      <section className="hero">
        <div>
          <p className="eyebrow">EMPLOYEE MANAGEMENT SYSTEM</p>
          <h1>Welcome to EmployeeHub</h1>
          <p className="hero-description">
            Manage employee information from one simple dashboard.
          </p>
          <Link to="/employees" className="button-link">
            Manage Employees →
          </Link>
        </div>
        <div className="hero-icon">👥</div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon purple">👤</div>
          <p>Total Employees</p>
          <h2>{loading ? "..." : employees.length}</h2>
        </article>

        <article className="stat-card">
          <div className="stat-icon green">₹</div>
          <p>Total Salary</p>
          <h2>
            {loading
              ? "..."
              : totalSalary.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
          </h2>
        </article>

        <article className="stat-card">
          <div className="stat-icon blue">✓</div>
          <p>Backend Status</p>
          <h2 className="status-text">
            {loading ? "Checking..." : error ? "Offline" : "Connected"}
          </h2>
        </article>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Recent Employees</h2>
            <p>Your employee records</p>
          </div>
          <Link to="/employees" className="secondary-link">
            View All →
          </Link>
        </div>

        {loading ? (
          <p className="empty-state">Loading employees...</p>
        ) : employees.length === 0 ? (
          <p className="empty-state">
            No employees found. Add your first employee.
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee Name</th>
                  <th>Salary</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 5).map((employee) => (
                  <tr key={employee.id}>
                    <td>#{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>
                      ₹{Number(employee.salary).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
