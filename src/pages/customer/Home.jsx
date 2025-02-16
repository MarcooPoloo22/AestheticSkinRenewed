import React from "react";
import { Link } from 'react-router-dom';
import banner from "../../assets/customer/spa_massage.jpg";

function Home() {
  return (
    <>
      {/* Banner Section */}
      <div
        className="position-relative overflow-hidden"
        style={{
          width: "100%",
          maxHeight: "70vh",
          aspectRatio: "16/9",
        }}
      >
        <img
          src={banner}
          alt="Banner"
          className="w-100 h-100"
          style={{
            objectFit: "cover",
          }}
        />
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <Link className="btn btn-success btn-lg" to ="/booking" role="button" >Book Now!</Link>
        </div>
      </div>

      {/* Promos Section */}
      <div className="container my-5">
        <h1>Promos/Packages</h1>
        <div className="row d-flex justify-content-center">
          {/* Card 1 */}
          <div className="card m-4" style={{ width: "18rem" }}>
            <img src={banner} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div>

          <div className="card m-4" style={{ width: "18rem" }}>
            <img src={banner} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card m-4" style={{ width: "18rem" }}>
            <img src={banner} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card m-4" style={{ width: "18rem" }}>
            <img src={banner} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
