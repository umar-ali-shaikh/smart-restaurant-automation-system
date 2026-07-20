import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const [role, setRole] = useState("admin");

  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ======================================
      LOGIN
  ====================================== */

  const login = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        password,
        role,
      };

      if (role === "admin") {
        payload.email = email;
      } else {
        payload.employeeId = employeeId;
      }

      const response = await loginUser(payload);

      const userData = {
        id: response.user?._id || response.user?.id,
        name: response.user?.name || response.user?.employeeId || employeeId,
        email: response.user?.email || email,
        employeeId: response.user?.employeeId || employeeId,
        username:
          response.user?.username || response.user?.employeeId || employeeId,
        role: response.user?.role || role,
      };

      setAuthUser(userData, response.token);

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/kitchen");
      }
    } catch (error) {
      console.log(error);
      setError(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  /* ======================================
      ENTER SUBMIT
  ====================================== */

  // const onKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     login();
  //   }
  // };

  /* ======================================
      UI
  ====================================== */

  return (
    <div
      className="
        fixed
        inset-0
        flex
        items-center
        justify-center
        overflow-hidden
        bg-gradient-to-br
        from-[#1a1308]
        via-[#0f0d09]
        to-[#050403]
        px-4
      "
    >
      {/* GLOW */}

      <div
        className="
          absolute
          left-1/2
          top-0
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-yellow-500/10
          blur-[120px]
        "
      />

      {/* CARD */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          overflow-hidden
          rounded-[32px]
          border
          border-yellow-700/20
          bg-[#111]
          p-10
          shadow-[0_20px_80px_rgba(0,0,0,0.7)]
        "
      >
        {/* TOP */}
        <div className="text-center">
          <div className="mb-4 text-5xl">🍽️</div>

          <h1
            className="
              text-3xl
              font-light
              tracking-wide
              text-yellow-300
            "
          >
            Grand Mesa Admin
          </h1>

          <p
            className="
              mt-2
              text-[11px]
              uppercase
              tracking-[0.35em]
              text-zinc-500
            "
          >
            Management Portal
          </p>
        </div>
        {/* ROLE */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={() => setRole("admin")}
            className={`
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              transition-all
              duration-300

              ${
                role === "admin"
                  ? `
                    border-yellow-500
                    bg-yellow-500/10
                    text-yellow-400
                  `
                  : `
                    border-yellow-700/20
                    bg-[#1c1814]
                    text-zinc-400
                  `
              }
            `}
          >
            👑 Admin
          </button>

          <button
            onClick={() => setRole("kitchen")}
            className={`
              rounded-2xl
              border
              px-4
              py-3
              text-sm
              transition-all
              duration-300

              ${
                role === "kitchen"
                  ? `
                    border-yellow-500
                    bg-yellow-500/10
                    text-yellow-400
                  `
                  : `
                    border-yellow-700/20
                    bg-[#1c1814]
                    text-zinc-400
                  `
              }
            `}
          >
            👨‍🍳 Kitchen
          </button>
        </div>

        {/* FORM */}
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          {/* EMAIL OR EMPLOYEE ID */}

          <div>
            <label
              className="
        mb-2
        block
        text-xs
        uppercase
        tracking-wider
        text-zinc-500
      "
            >
              {role === "admin" ? "Email Address" : "Employee ID"}
            </label>

            <input
              type={role === "admin" ? "email" : "text"}
              value={role === "admin" ? email : employeeId}
              onChange={(event) =>
                role === "admin"
                  ? setEmail(event.target.value)
                  : setEmployeeId(event.target.value)
              }
              placeholder={
                role === "admin" ? "Enter admin email" : "Enter employee ID"
              }
              autoComplete={role === "admin" ? "email" : "username"}
              className="
        w-full
        rounded-2xl
        border
        border-yellow-700/20
        bg-[#1c1814]
        px-4
        py-3
        text-white
        outline-none
        transition-all
        duration-300
        focus:border-yellow-500/50
      "
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label
              className="
        mb-2
        block
        text-xs
        uppercase
        tracking-wider
        text-zinc-500
      "
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              className="
        w-full
        rounded-2xl
        border
        border-yellow-700/20
        bg-[#1c1814]
        px-4
        py-3
        text-white
        outline-none
        transition-all
        duration-300
        focus:border-yellow-500/50
      "
            />
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
        rounded-2xl
        border
        border-red-500/20
        bg-red-500/10
        px-4
        py-3
        text-sm
        text-red-300
      "
            >
              {error}
            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
      mt-2
      w-full
      rounded-2xl
      bg-gradient-to-r
      from-yellow-500
      to-orange-500
      py-3
      font-semibold
      text-black
      transition-all
      duration-300
      hover:scale-[1.02]
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}
