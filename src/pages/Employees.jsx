
import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/employees";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const getEmployees = useCallback(async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch employees.");
      }

      const data = await response.json();
      setEmployees(data);
      setError("");
    } catch {
      setError(
        "Cannot connect to Spring Boot. Make sure the backend is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  function resetForm() {
    setName("");
    setSalary("");
    setEditId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const numericSalary = Number(salary);

    if (!trimmedName || salary.trim() === "" ||
        !Number.isFinite(numericSalary) || numericSalary < 0) {
      setError("Enter a valid employee name and non-negative salary.");
      return;
    }

    setSaving(true);

    try {
      const isEditing = editId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trimmedName,
            salary: numericSalary,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to save employee.");
      }

      resetForm();
      await getEmployees();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(employee) {
    setEditId(employee.id);
    setName(employee.name);
    setSalary(String(employee.salary));
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete employee.");
      }

      if (editId === id) {
        resetForm();
      }

      await getEmployees();
    } catch (err) {
      setError(err.message || "Unable to delete employee.");
    }
  }

  const filteredEmployees = employees.filter((employee) =>
    String(employee.name || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <section className="page-heading">
        <div>
          <p className="eyebrow">MANAGEMENT</p>
          <h1>Employees</h1>
          <p>Manage your employee records.</p>
        </div>
        <div className="count-badge">
          {employees.length} employees
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>{editId !== null ? "Update Employee" : "Add Employee"}</h2>
            <p>Enter the employee details below.</p>
          </div>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="employee-name">Employee Name</label>
            <input
              id="employee-name"
              type="text"
              placeholder="Enter employee name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="employee-salary">Salary (₹)</label>
            <input
              id="employee-salary"
              type="number"
              placeholder="Enter salary"
              value={salary}
              onChange={(event) => setSalary(event.target.value)}
              min="0"
              step="any"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editId !== null
                  ? "Update Employee"
                  : "Add Employee"}
            </button>

            {editId !== null && (
              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      <section className="panel employee-list-panel">
        <div className="section-heading list-heading">
          <div>
            <h2>Employee List</h2>
            <p>Search, edit, or delete employee records.</p>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="Search by name..."
            aria-label="Search employees by name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p className="empty-state">Loading employees...</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee Name</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No matching employees found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>#{employee.id}</td>
                      <td>
                        <div className="employee-name">
                          <span className="avatar">
                            {employee.name?.charAt(0).toUpperCase() || "E"}
                          </span>
                          {employee.name}
                        </div>
                      </td>
                      <td>
                        ₹{Number(employee.salary).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="edit-button"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Employees;
