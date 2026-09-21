import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

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
    } catch (err) {
      setError("Google sign-in failed. Try again.");
    }
  };
  const handleLogin = (e) => {
    e.preventDefault();

    // Demo login — no real authentication yet
    navigate("/upload");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">

      {/* Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">
            SAFE<span className="text-[#2563EB]">INFRA</span>
          </h1>

          <p className="text-xs text-[#6B7280]">
            Infrastructure Safety Intelligence
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-sm text-[#6B7280]">
          <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
          AI Safety System
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-md">

          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">

            {/* Icon */}
            <div className="mx-auto mb-5 w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>

            {/* Heading */}
            <div className="text-center mb-7">
              <h2 className="text-2xl font-bold text-[#111827]">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-[#6B7280]">
                Sign in to access your SafeInfra dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none text-sm text-[#111827] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#111827]">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-[#2563EB] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg outline-none text-sm text-[#111827] placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-sm"
              >
                Login
              </button>

            </form>
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-[#6B7280]">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-[#111827] font-semibold py-3 rounded-lg transition duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/>
                <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1 16.4 0 20.100 0 24s1 7.600 2.600 10.800l7.900-6.100z"/>
                <path fill="#34A853" d="M24 48c6.500 0 11.900-2.100 15.900-5.800l-7.600-5.900c-2.100 1.400-4.900 2.300-8.300 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            {error && <p className="text-center text-xs text-red-600 mt-3">{error}</p>}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-[#6B7280] mt-6">
            Safe infrastructure. Smarter decisions.
          </p>

        </div>
      </main>

    </div>
  );
}

export default Login;