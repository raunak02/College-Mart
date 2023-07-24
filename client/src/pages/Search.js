import React, { useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import toast from "react-hot-toast";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";
import "../styles/Search.css";
const Search = () => {
  const [values, setValues] = useSearch();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h5>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h5>
          <div className="d-flex flex-wrap">
            {values?.results.map((p) => (
              <div className="card m-3" style={{ width: "18rem" }}>
                <a href={`/product/${p.slug}`}>
                  <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  style={{ width: "18rem", height: "20rem" }}
                  alt={p.name}
                />
                </a>
                
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  {/* <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p> */}
                  {/* <p className="card-text fw-bold " style={{ color: "green" }}> */}
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </h5>
                  {/* </p> */}
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    DETAILS
                  </button>
                  <button
                    className="btn btn-dark ms-1"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Item Added to cart");
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
