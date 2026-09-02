import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            // =================================================
            // LOGIN API
            // =================================================

            const response = await api.post("/auth/login", {
                email: email.trim(),
                password,
            });

            const result = response.data;

            console.log("Login response:", result);

            // =================================================
            // CHECK RESPONSE
            // =================================================

            if (!result?.success) {
                setError(
                    result?.message || "Invalid email or password"
                );
                return;
            }

            // =================================================
            // GET TOKEN + USER
            // =================================================

            const token = result?.data?.token;
            const user = result?.data?.user;

            if (!token) {
                setError("Login successful but token was not received.");
                return;
            }

            // =================================================
            // SAVE TOKEN
            // =================================================

            localStorage.setItem("token", token);

            // =================================================
            // SAVE USER
            // =================================================

            if (user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }

            // =================================================
            // REDIRECT
            // =================================================

            navigate("/dashboard", {
                replace: true,
            });

        } catch (err) {
            console.error("Login error:", err);

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Unable to login. Please try again.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">

            <div className="w-full max-w-md">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

                    {/* HEADER */}

                    <div className="mb-6">

                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                            ROUTEX
                        </p>

                        <h1 className="mt-2 text-2xl font-semibold text-white">
                            Fleet Operations
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Sign in to continue
                        </p>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-3">

                            <p className="text-sm text-red-400">
                                {error}
                            </p>

                        </div>
                    )}

                    {/* FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* EMAIL */}

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-xs font-medium text-slate-400"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="admin@routex.com"
                                autoComplete="email"
                                required
                                disabled={loading}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>

                        {/* PASSWORD */}

                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-xs font-medium text-slate-400"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                disabled={loading}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Login;