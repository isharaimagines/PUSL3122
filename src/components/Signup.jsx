import React from "react";
import logo from "../assets/img/icons8-furniture-100.png";
import banner from "../assets/img/Bedroom-furniture-wallpaper-coll.jpg";
import { NavLink } from "react-router-dom";

const Signup = () => {
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
                Start your website in seconds. Don’t have an account?{" "}
                <NavLink className="text-blue-500 hover:underline">
                  Sign up.
                </NavLink>
              </p>
              <div className="">
                <form action="#">
                  <div className="mb-4">
                    <input
                      className="block w-full rounded py-1.5 px-3 bg-white/20 border-[1px] focus:border-blue-400 focus:outline-0 focus:ring-0"
                      type="email"
                      id="emailaddress"
                      required=""
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      className="block w-full rounded py-1.5 px-3 bg-white/20 border-[1px] focus:border-blue-400 focus:outline-0 focus:ring-0"
                      type="password"
                      required=""
                      id="password"
                      placeholder="Enter your password"
                    />
                  </div>
                  <div className="mb-4">
                    <select
                      id="countries"
                      className="bg-gray-50 border-gray-300 text-gray-900 text-sm focus:ring-blue-500  block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-full rounded py-1.5 px-3 bg-white/20 border-[1px] focus:border-blue-400 focus:outline-0 focus:ring-0"
                    >
                      <option selected>Choose a Role</option>
                      <option value="US">Admin</option>
                      <option value="CA">Desinger</option>
                    </select>
                  </div>

                  <div className="relative w-full h-4 flex items-center justify-center mt-8 bg-transparent">
                    <div className="text-lg mb-6 bg-blue-50 dark:bg-[#1f2937] dark:text-white text-black px-2 z-10">
                      or
                    </div>

                    <span className="absolute top-0 left-0 w-full h-[1px] bg-slate-700"></span>
                  </div>

                  <div className="text-center mt-4">
                    <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2 mt-1">
                      <a
                        href="#"
                        className="w-full inline-flex items-center justify-center px-6 py-2 backdrop-blur-2xl dark:bg-white/20 bg-slate-300 dark:text-white text-black rounded-lg transition-all duration-500 group hover:bg-blue-600 hover:text-white"
                      >
                        <svg
                          className="me-3 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                          ></path>
                          <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                          ></path>
                          <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                          ></path>
                          <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                          ></path>
                        </svg>
                        Login with Google
                      </a>
                    </div>
                  </div>

                  <div className="mb-6 text-center">
                    <a
                      href="#"
                      className="w-full inline-flex items-center justify-center px-6 py-2 backdrop-blur-2xl dark:bg-white/20 bg-slate-300 dark:text-white text-black rounded-lg transition-all duration-500 group hover:bg-blue-600 hover:text-white mt-5"
                      type="submit"
                    >
                      Sign in to your account
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
