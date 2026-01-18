import { useState } from "react";
import { Link } from "react-router-dom";
import "./images/public/auth.css";
import logo from "./images/public/real_logo.jpg";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-container">
      {/* Left Side - Branding */}
      <div className="auth-side auth-branding">
        <div className="brand-content">
          <h1>
            <img src={logo} alt="Innopharma Logo" className="brand-logo" />
          </h1>
          <p>Easy access to medicine in Cameroon</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-side auth-form">
        <div className="form-wrapper">
          <h2>Welcome Back</h2>
          <p className="form-subtitle">
            Sign in to your Innopharma account
          </p>

          <form className="auth-form-group">
            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" required />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁️
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="form-options">
              <div className="checkbox">
                <input type="checkbox" />
                <label>Remember me</label>
              </div>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary btn-large">
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;

