import { NavLink } from "react-router-dom";

export default function AdminSectionNav() {
  const getClassName = ({ isActive }: { isActive: boolean }) =>
    `admin-section-nav-link${isActive ? " active" : ""}`;

  return (
    <nav
      className="admin-section-nav"
      aria-label="Navegación de administración"
    >
      <NavLink to="/dashboard" className={getClassName}>
        Principal
      </NavLink>
      <NavLink to="/admin/dashboard" end className={getClassName}>
        Admin
      </NavLink>
      <NavLink to="/admin/users" className={getClassName}>
        Usuarios
      </NavLink>
      <NavLink to="/admin/challenges" className={getClassName}>
        Disputa de carreras
      </NavLink>
    </nav>
  );
}
