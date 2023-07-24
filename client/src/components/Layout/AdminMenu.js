import React from "react";
import { NavLink } from "react-router-dom";
import "./adminmenu.css";
import { FaArrowRight } from "react-icons/fa";
const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="text-center list-group dashboard-menu admin-menu">
          <div
            className="text-center"
            style={{
              backgroundColor: "#505050",
              color: "white",
              borderRadius: "10px 10px 0 0",
              padding: "0px",
              fontSize: "1.2rem",
              paddingTop: "10px",
            }}
          >
            <NavLink
              className="text-center"
              to="/dashboard/admin"
              style={{
                color: "white",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              <div>
                <h3 className="text-center">
                  Admin Panel
                </h3>
                  {/* <FaArrowRight /> */}
              </div>
            </NavLink>
          </div>

          <NavLink
            to="/dashboard/admin/create-category"
            className="list-group-item list-group-item-action"
          >
            Create Category
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className="list-group-item list-group-item-action"
          >
            Create Product
          </NavLink>
          <NavLink
            to="/dashboard/admin/products"
            className="list-group-item list-group-item-action"
          >
            Products
          </NavLink>
          <NavLink
            to="/dashboard/admin/orders"
            className="list-group-item list-group-item-action"
          >
            Orders
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
