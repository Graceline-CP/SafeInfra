import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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