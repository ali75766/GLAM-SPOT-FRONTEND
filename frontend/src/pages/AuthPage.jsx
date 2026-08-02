import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormError from "../components/forms/FormError";
import PageIntro from "../components/PageIntro";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../lib/api";

function AuthPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/";
  const [mode, setMode] = useState(location.pathname === "/signup" ? "signup" : "login");
  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const signupForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    setMode(location.pathname === "/signup" ? "signup" : "login");
  }, [location.pathname]);

  const submitLogin = loginForm.handleSubmit(async (values) => {
    try {
      const data = await loginUser(values);
      login(data);
      toast.success("Login successful.");
      navigate(data.user.role === "admin" ? "/admin/products" : redirectTo);
    } catch (apiError) {
      toast.error(apiError.response?.data?.message || "Wrong credentials.");
    }
  });

  const submitSignup = signupForm.handleSubmit(async (values) => {
    try {
      const data = await registerUser(values);
      login(data);
      toast.success("Account created successfully.");
      navigate(data.user.role === "admin" ? "/admin/products" : redirectTo);
    } catch (apiError) {
      toast.error(apiError.response?.data?.message || "Unable to create account.");
    }
  });

  return (
    <>
      <PageIntro
        eyebrow="Account"
        title="Sign in or create your customer account before checkout"
        copy="Orders are protected, so a customer session is required before placing one. Admin accounts can still use the separate admin panel."
      />

      <section className="section-shell py-16">
        {isAuthenticated ? (
          <div className="mx-auto max-w-2xl glass-card rounded-[2rem] p-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Already signed in</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">{user?.name}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Your account is ready. Continue to the next step.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to={user?.role === "admin" ? "/admin/products" : redirectTo}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
              >
                Continue
              </Link>
              <Link
                to="/products"
                className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-foreground"
              >
                Browse products
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-card rounded-[2rem] p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Why sign in</p>
              <h2 className="mt-3 font-display text-5xl text-foreground">Checkout with confidence</h2>
              <div className="mt-6 space-y-4 text-sm leading-8 text-muted">
                <p>Your order is linked to your account and email automatically.</p>
                <p>Checkout stays protected, so guests cannot place incomplete or anonymous orders.</p>
                <p>The same login works for customers, while admin users can still access `/admin`.</p>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-8">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-full px-5 py-3 text-sm font-semibold ${
                    mode === "login" ? "bg-primary text-white" : "border border-line text-foreground"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-full px-5 py-3 text-sm font-semibold ${
                    mode === "signup" ? "bg-primary text-white" : "border border-line text-foreground"
                  }`}
                >
                  Create account
                </button>
              </div>

              {mode === "login" ? (
                <form onSubmit={submitLogin} className="mt-6 space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Email address"
                      {...loginForm.register("email", { required: "Email is required" })}
                      className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                    />
                    <FormError message={loginForm.formState.errors.email?.message} />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      {...loginForm.register("password", { required: "Password is required" })}
                      className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                    />
                    <FormError message={loginForm.formState.errors.password?.message} />
                  </div>
                  <button
                    type="submit"
                    disabled={loginForm.formState.isSubmitting}
                    className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {loginForm.formState.isSubmitting ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              ) : (
                <form onSubmit={submitSignup} className="mt-6 space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Full name"
                      {...signupForm.register("name", { required: "Name is required" })}
                      className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                    />
                    <FormError message={signupForm.formState.errors.name?.message} />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email address"
                      {...signupForm.register("email", { required: "Email is required" })}
                      className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                    />
                    <FormError message={signupForm.formState.errors.email?.message} />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      {...signupForm.register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })}
                      className="w-full rounded-2xl border border-line bg-background px-5 py-4 outline-none transition focus:border-primary"
                    />
                    <FormError message={signupForm.formState.errors.password?.message} />
                  </div>
                  <button
                    type="submit"
                    disabled={signupForm.formState.isSubmitting}
                    className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {signupForm.formState.isSubmitting ? "Creating account..." : "Create account"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default AuthPage;
