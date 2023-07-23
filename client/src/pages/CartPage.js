import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [uniqueCartItems, setUniqueCartItems] = useState([]);

// Get total price and unique cart items on cart update
  useEffect(() => {
    const uniqueItems = new Map();

    cart?.forEach((item) => {
      if (!uniqueItems.has(item._id)) {
        uniqueItems.set(item._id, item);
      }
    });

    setUniqueCartItems(Array.from(uniqueItems.values()));
  }, [cart]);
    // Get total price and unique cart items on cart update
    useEffect(() => {
      let totalPrice = 0;
      const uniqueItems = new Set();

      cart?.forEach((item) => {
        totalPrice += item.price;
        uniqueItems.add(JSON.stringify(item)); // Use JSON.stringify to compare item objects
      });

      setUniqueCartItems(uniqueItems);
    }, [cart]);

    // Convert Set of cart items to an array for rendering
    const uniqueCartItemsArray = Array.from(uniqueCartItems).map((item) =>
      JSON.parse(item)
    );
  // Total price calculation for unique products
  const totalPriceForUniqueProducts = () => {
    try {
      let total = 0;
      uniqueCartItemsArray.forEach((item) => {
        total += item.price;
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
      return "0.00";
    }
  };
  const uni = Array.from(new Set(cart?.map((item) => item._id)));
  //total price
  // const totalPrice = () => {
  //   try {
  //     let total = 0;
  //     cart?.map((item) => {
  //       total = total + item.price;
  //     });
  //     return total.toLocaleString("en-IN", {
  //       style: "currency",
  //       currency: "INR",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  //detele item
  const removeCartItem = (pid) => {
    try {
      const updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.log(error);
    }
  };
  // Get total price and unique product IDs on cart update
  
  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    
  };
  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {uni.length
                  ? `You Have ${uni.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Nothing to see here"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {uniqueCartItemsArray.map((p) => (
                <div className="row card flex-row " key={p._id}>
                  <div className="col-md-3">
                    <a href={`/product/${p.slug}`}>
                      <img
                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                        width={"100px"}
                        height={"100px"}
                      />
                    </a>
                  </div>
                  <div className="col-md-4">
                    <h4>{p.name}</h4>
                    <h6>
                      <div style={{ color: "green" }}>₹{p.price}</div>
                    </h6>
                  </div>
                  <div className="col-md-3 cart-remove-btn d-flex justify-content-between my-2">
                    <a href={`/product/${p.slug}`}>
                      <button className="btn btn-success">Details</button>
                    </a>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h2>
                <div style={{ color: "green" }}>
                  Total : {totalPriceForUniqueProducts()}{" "}
                </div>
              </h2>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3" style={{ color: "black" }}>
                    {/* <h5>Current Address:</h5> */}
                    <h5
                      style={{
                        color: "black",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      Address: {auth?.user?.address}
                    </h5>

                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
