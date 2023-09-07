import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - College Mart"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
            College Mart is a prototype of our college's second-hand product e-commerce website. Users can sell their products via admin, and College Mart will handle all the unnecessary stress of selling on their behalf.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
