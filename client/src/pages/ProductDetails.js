import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import Modal from "react-modal";

const ProductDetails = () => {
  const [cart, setCart] = useCart();
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const handleImageClick = () => {
    setShowModal(true);
  };
  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-4">
          <img
            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
            className="card-img-top rounded shadow"
            alt={product.name}
            height="500px"
            width="350px"
            onClick={handleImageClick}
          />
        </div>
        <div className="col-md-5 product-details-info">
          <h1 className="text-center">{product.name}</h1>
          <hr />
          {/* <h4>PRODUCT DETAILS</h4> */}
          <h3>
            {product?.price?.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </h3>
          <h6>{product?.category?.name}</h6>
          <h5>{product.description}</h5>

          <button
            className="btn btn-dark ms-1"
            onClick={() => {
              setCart([...cart, product]);
              localStorage.setItem("cart", JSON.stringify([...cart, product]));
              toast.success("Item Added to cart");
            }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap ">
          {relatedProducts?.map((p) => (
            <div className="card m-3 shadow  card-zoom" key={p._id}>
              <a href={`/product/${p.slug}`}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  width={"100px"}
                  height={"100px"}
                />
              </a>
              <div className="card-body ">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </h5>
                </div>
                {/* <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p> */}
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1 rounded"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    DETAILS
                  </button>
                  {/* <button
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
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            maxWidth: "700px",
            margin: "auto",
            padding: "20px",
            marginTop: "50px",
          },
        }}
      >
        <img
          src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
          alt={product.name}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
          className="rounded shadow"
        />
      </Modal>
    </Layout>
  );
};

export default ProductDetails;
