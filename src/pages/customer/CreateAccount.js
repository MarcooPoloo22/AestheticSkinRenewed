import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from 'sweetalert2';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customer/CreateAccount.css";

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        middle_initial: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        contact_no: ''
    });

    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirm_password) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match!',
            });
            return;
        }

        try {
            const response = await fetch('http://localhost/createAccount.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseText = await response.text();
            console.log("Raw Response:", responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('JSON Parsing Error:', jsonError);
                throw new Error('Invalid JSON response from server.');
            }

            if (result.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: result.message,
                }).then(() => {
                    // Redirect to the Login page after the user clicks "OK" on the success alert
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while creating the account.',
            });
        }
    };

    return (
        <div className="create-account-container d-flex justify-content-center align-items-center">
                 <div className="form-box p-4">
                 <h2 className="text-center mb-4">Create your account</h2>
                 <form onSubmit={handleSubmit}>
                 <div className="row mb-3">
                 <div className="col-12 col-md-4 mb-3 mb-md-0">
           <input
                 type="text"
                 className="form-control"
                 placeholder="First Name"
                 name="first_name"
                 value={formData.first_name}
                 onChange={handleChange}
                 required
           />
        </div>
          <div className="col-12 col-md-4 mb-3 mb-md-0">
            <input
               type="text"
               className="form-control"
               placeholder="Middle Initial"
               name="middle_initial"
               value={formData.middle_initial}
               onChange={handleChange}
          />
        </div>
           <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
          />
        </div>
      </div>

      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Confirm Password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <input
          type="tel"
          className="form-control"
          placeholder="Contact No."
          name="contact_no"
          value={formData.contact_no}
          onChange={handleChange}
          required
        />
      </div>
        <br />
      <div className="mb-4 d-flex justify-content-center">
        <button className="regsubmit" type="submit">Register</button>
      </div>
    </form>
  </div>
</div>
    );
};

export default CreateAccount;