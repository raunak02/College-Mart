import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Collapse, Select } from "antd";
const { Option } = Select;
const { Panel } = Collapse;
const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Delivered",
    "Cancel",
  ]);
  const [changeStatus, setCHangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/all-orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,
        {
          status: value,
        }
      );
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"All Orders Data"}>
      <div className="container-fluid m-3 dashboard ">
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-7">
            <h1>All Orders</h1>
            {orders?.map((o, i) => {
              // Create a set to store unique product IDs
              const uniqueProductIds = new Set();
              const uniqueProducts = [];

              // Iterate through the products and filter out duplicate products
              o.products.forEach((p) => {
                if (!uniqueProductIds.has(p._id)) {
                  uniqueProductIds.add(p._id);
                  uniqueProducts.push(p);
                }
              });
              const orderNumber = orders.length - i;

              return (
                <Collapse key={o._id} className="shadow mb-2">
                  <Panel
                    header={`  #${orderNumber}  ${o?.buyer?.name} `}
                    key={o._id}
                  >
                    <div className=" p-3 mb-1 bg-white rounded">
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Status</th>
                            <th scope="col">Buyer</th>
                            <th scope="col">Date</th>
                            <th scope="col">Payment</th>
                            <th scope="col">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{orderNumber}</td>
                            <td>
                              <Select
                                bordered={false}
                                onChange={(value) => handleChange(o._id, value)}
                                defaultValue={o?.status}
                              >
                                {status.map((s, i) => (
                                  <Option key={i} value={s}>
                                    {s}
                                  </Option>
                                ))}
                              </Select>
                            </td>
                            <td>{o?.buyer?.name}</td>
                            <td>{moment(o?.createdAt).fromNow()}</td>
                            <td>{o?.payment.success ? "Success" : "Failed"}</td>
                            <td>{uniqueProducts.length}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="container">
                        {uniqueProducts.map((p, i) => (
                          <div
                            className="row mb-2 shadow p-3 card flex-row"
                            key={p._id}
                          >
                            <div className="col-md-2">
                              <a href={`/product/${p.slug}`}>
                                <img
                                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                  className="card-img shadow"
                                  alt={p.name}
                                  width={"100px"}
                                  height={"100px"}
                                />
                              </a>
                            </div>
                            <div className="col-md-8">
                              <h6>{p.name}</h6>
                              {/* <p>{p.description.substring(0, 30)}</p> */}
                              <p> ₹{p.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;
