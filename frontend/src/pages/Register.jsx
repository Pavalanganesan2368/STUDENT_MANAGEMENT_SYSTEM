import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "var(--background-color)",
        padding: "1rem",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            color: "var(--primary-color)",
          }}
        >
          Student Registration
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              padding: "0.75rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1rem",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
            className="grid-responsive"
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                className="input"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                }}
              >
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                className="input"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              Email Address
            </label>
            <input
              name="email"
              type="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
              }}
            >
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              className="input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register as Student"}
          </button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
          }}
        >
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "var(--primary-color)", fontWeight: "600" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
