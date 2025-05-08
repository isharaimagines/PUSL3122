import React, { useState } from "react";
import logo from "../assets/img/icons8-furniture-100.png";
import banner from "../assets/img/Bedroom-furniture-wallpaper-coll.jpg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const designerEmail = import.meta.env.VITE_DESIGNER_EMAIL;
  const designerPassword = import.meta.env.VITE_DESIGNER_PASSWORD;

  const generateToken = (length = 54) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    return [...Array(length)]
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    console.log("Form submitted", email, password);
    if (role === "admin") {
      if (email === adminEmail) {
        if (password === adminPassword) {
          toast.success("Admin Login!");
          localStorage.setItem("token", generateToken());
          localStorage.setItem("role", role);
          localStorage.setItem("current_user", email);
          const log_time = new Date().toISOString();
          localStorage.setItem("logTime", log_time);
          navigate("/dashboard");
          window.location.reload();
        } else {
          toast.error("Invalid Password");
        }
      } else {
        toast.error("Invalid Email");
      }
    } else if (role === "designer") {
      if (email === designerEmail) {
        if (password === designerPassword) {
          toast.success("Designer login!");
          localStorage.setItem("token", generateToken());
          localStorage.setItem("role", role);
          localStorage.setItem("current_user", email);
          navigate("/");
          window.location.reload();
        } else {
          toast.error("Invalid password!");
        }
      } else {
        toast.error("Invalid email!");
      }
    } else {
      toast.error("Please select account role");
    }
  };
  return (
    <div
      className="h-screen bg-cover bg-center relative bg-no-repeat"
      style={{
        backgroundImage: `url(${banner})`,
      }}
    >
      <div className="inline-flex items-center justify-center p-4 bg-transparent h-full w-full sm:w-auto">
        <div className="h-full w-full sm:min-w-[460px]">
          <div className="bg-blue-50 dark:bg-[#1f2937] lg:max-w-[480px] z-10 p-6 relative w-full h-full border-t-4 border-blue-600 rounded-lg">
            <div className="flex flex-col h-full gap-4">
              <div className="mb-2 text-center lg:text-start">
                <a href="" className="flex ms-2 md:me-24">
                  <img src={logo} className="h-8 me-3" alt="FlowBite Logo" />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                    Furniture Planner
                  </span>
                </a>
              </div>
              <h1 className="text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Welcome back
              </h1>
              <p className="dark:text-white">
                <h1 className="text-transparent">login</h1>
                Start your Furniture Planner in seconds.{" "}
                <Link className="text-blue-500 hover:underline">
                  All in one stage
                </Link>
              </p>
              <div className="">
                <form action="#" onSubmit={onSubmitHandler}>
                  <div className="mb-4">
                    <input
                      className="block w-full rounded py-1.5 px-3 bg-white/20 border-[1px] focus:border-blue-400 focus:outline-0 focus:ring-0"
                      type="email"
                      id="emailaddress"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      className="block w-full rounded py-1.5 px-3 bg-white/20 border-[1px] focus:border-blue-400 focus:outline-0 focus:ring-0"
                      type="password"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                      required
                      id="password"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="mb-4">
                    <select
                      id="roles"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="bg-gray-50 border-gray-300 text-gray-900 text-sm focus:ring-blue-500  block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full rounded py-1.5 px-3 bg-white/20 border-[1px] focus:border-blue-400 focus:outline-0 focus:ring-0"
                    >
                      <option value="">Choose a Role</option>
                      <option value="admin">Admin</option>
                      <option value="designer">Designer</option>
                    </select>
                  </div>

                  <div className="mb-6 text-center">
                    <button
                      className="w-full inline-flex items-center justify-center px-6 py-2 backdrop-blur-2xl dark:bg-white/20 bg-slate-300 dark:text-white text-black rounded-lg transition-all duration-500 group hover:bg-blue-600 hover:text-white mt-5"
                      type="submit"
                    >
                      Sign in to your account
                    </button>
                  </div>
                </form>

                <div className="max-w-xl mx-auto mt-2 p-6 bg-slate-400 shadow-lg rounded-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    🔐 Default Credentials
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-700 ">
                      Admin
                      <code className="bg-gray-100 text-blue-700 px-1 py-0.5 rounded mx-1">
                        admin
                      </code>
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1 pl-4 list-disc">
                      <li>
                        <strong>Email:</strong>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded">
                          admin@gmail.com
                        </code>
                      </li>
                      <li>
                        <strong>Password:</strong>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded">
                          123@qwe
                        </code>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-green-700">
                      Designer
                      <code className="bg-gray-100 text-green-700 px-1 py-0.5 rounded mx-1">
                        designer
                      </code>
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1 pl-4 list-disc">
                      <li>
                        <strong>Email:</strong>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded">
                          designer@gmail.com
                        </code>
                      </li>
                      <li>
                        <strong>Password:</strong>{" "}
                        <code className="bg-gray-100 px-1 py-0.5 rounded">
                          123123@qwe
                        </code>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
