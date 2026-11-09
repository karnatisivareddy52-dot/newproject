
import { NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Employees from "./pages/Employees.jsx";
import About from "./pages/About.jsx";

function App() {
  return (
    <>
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-icon">E</span>
          <span>Employee<span className="brand-light">Hub</span></span>
        </NavLink>

        <nav className="navbar">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/employees">Employees</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/about" element={<About />} />
          <Route
            path="*"
            element={
              <section className="panel">
                <h1>404 - Page Not Found</h1>
                <p>The page you requested does not exist.</p>
                <NavLink className="button-link" to="/">
                  Go to Home
                </NavLink>
              </section>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
