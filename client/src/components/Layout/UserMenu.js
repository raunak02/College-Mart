import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
const UserMenu = () => {
  const [auth, setAuth] = useAuth();
  return (
    <div>
      <div
        className="text-center dashboard-menu"
        style={{ borderRadius: "10px" }}
      >
        <div className="list-group">
          <div
            style={{
              backgroundColor: "#505050",
              color: "white",
              borderRadius: "10px 10px 0 0",
              padding: "15px",
              fontSize: "1.2rem",
            }}
          >
            <NavLink
              to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
              style={{ color: "white", textDecoration:"none" }}
            >
              <h3 style={{ margin: 0 }}>Dashboard</h3>
            </NavLink>
          </div>
          <NavLink
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action"
          >
            Profile
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className="list-group-item list-group-item-action"
          >
            Orders
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
