import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./images/public/auth.css"; // CSS inside images/public
import logo from "./images/public/real_logo.jpg";

function Signup() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }
    alert("Sign up submitted (replace with real logic)");
  };

  return (
    <div className="auth-container">
      {/* Left Side */}
      <div className="auth-side auth-branding">
        <div className="brand-content">
          <h1>
            <img src={logo} alt="Innopharma Logo" className="brand-logo" />
          </h1>
          <p>Easy access to medicine in Cameroon</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="auth-side auth-form">
        <div className="form-wrapper">
          <h2>Create an account</h2>
          <p className="form-subtitle">Sign up for an Innopharma account</p>

          <form className="auth-form-group" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                aria-label="Full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                aria-label="Email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePassword}
                  aria-label="Toggle password visibility"
                >
                  {passwordVisible ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="confirm"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  aria-label="Confirm password"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary btn-large">
              Create Account
            </button>
          </form>

          <div className="social-divider">
            <span>Or continue with</span>
          </div>

          <div className="social-buttons">
            <button className="btn-social">Continue with Google</button>
            <button className="btn-social">Continue with Facebook</button>
          </div>

          <p className="form-footer">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;