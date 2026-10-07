import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user); // displayName, email, photoURL
      navigate("/upload");
    } catch {
      setError("Google sign-in failed. Try again.");
    }
  };
  const handleLogin = (e) => {
    e.preventDefault();

    // Demo login — no real authentication yet
    navigate("/upload");
  };

  return (
    <div className="login-screen">
      <main className="login-main">
        <div className="login-content">
          <section className="login-card" aria-label="Sign in to SafeInfra">
            <div className="login-brand-panel">
              <div className="login-brand-content">
                <div className="login-brand-lockup">
                  <span className="login-brandmark" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3Z" />
                      <path d="m8.5 12 2.2 2.2 4.8-5" />
                    </svg>
                  </span>
                  <div>
                    <h1 className="login-wordmark">Safe<span>Infra</span></h1>
                    <p className="login-tagline">Infrastructure Safety Intelligence</p>
                  </div>
                </div>

                <div className="login-brand-copy">
                  <h2>Smarter infrastructure.<br />Safer tomorrow.</h2>
                  <p>AI-powered inspections for safer, more resilient infrastructure.</p>
                </div>

                <div className="login-system-status">
                  <span aria-hidden="true" />
                  AI safety system
                </div>
              </div>
              <p className="login-photo-credit">Sea Cliff Bridge · Photo by Silas Baisch / Unsplash</p>
            </div>

            <div className="login-form-panel">
              <div className="login-heading">
                <h2>Welcome back</h2>
                <p>Sign in to your account</p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                <div>
                  <label htmlFor="login-email">Email address</label>
                  <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="login-field"
                  />
                </div>

                <div>
                  <div className="login-password-heading">
                    <label htmlFor="login-password">Password</label>
                    <button type="button" className="login-link">Forgot password?</button>
                  </div>
                  <div className="login-password-field">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="login-field"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="login-password-toggle"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button type="submit" className="login-primary-action">Sign in</button>
              </form>

              <div className="login-divider">
                <div />
                <span>or</span>
                <div />
              </div>

              <button type="button" onClick={handleGoogleLogin} className="login-google-action">
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
                  <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1 16.4 0 20.1 0 24s1 7.6 2.6 10.8l7.9-6.1z" />
                  <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
                </svg>
                Continue with Google
              </button>

              {error && <p className="login-error" role="alert" aria-live="polite">{error}</p>}
              <p className="login-footer">Safe infrastructure. Smarter decisions.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;