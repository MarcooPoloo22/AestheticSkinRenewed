import react from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customer/CreateAccount.css";
import { Link } from "react-router-dom";

const CreateAccount = () => {
  return (
    <>
      <div className="create-account-container d-flex justify-content-center align-items-center">
        <div className="form-box p-4">
          <h2 className="text-center mb-4">Create your account</h2>
          <br />
          <form>
            <div className="row mb-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Middle Initial"
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email Address"
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
              />
            </div>

            <div className="mb-3">
              <input
                type="tel"
                className="form-control"
                placeholder="Contact No."
              />
            </div>

            <div className="mb-4 d-flex justify-content-center">
              <button className="regsubmit" type="submit">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;
