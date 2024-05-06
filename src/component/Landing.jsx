import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { collection, addDoc, getFirestore } from "firebase/firestore";

import { app } from "./firebase";

export default function Landing() {
  const { user, loginWithRedirect, isAuthenticated } = useAuth0();
  const db = getFirestore(app);

  if (isAuthenticated) {
    addDoc(collection(db, "students"), {
      id: user.sub,
      name: user.name,
      email: user.email,
      enrolledCourses: [],
      completedCourses: [],
    });
    setTimeout(() => {
      window.location.href = "/home";
    }, 1000);
  }

  return (
    <>
      <section className="w-full px-8 text-gray-700 bg-white">
        <div className="container flex flex-wrap items-center justify-between py-5 mx-auto flex-row max-w-7xl">
          <div className="relative flex flex-col md:flex-row mt-4">
            <a
              href="/"
              className="flex items-center mb-5 font-medium text-gray-900 lg:w-auto lg:items-center lg:justify-center md:mb-0"
            >
              <span className="mx-auto text-xl font-black leading-none text-gray-900 select-none">
                Alemeno<span className="text-indigo-600">.</span>
              </span>
            </a>
          </div>

          <div className="inline-flex items-center ml-5 space-x-6 lg:justify-end">
            <button
              //   href="#"
              onClick={() => loginWithRedirect()}
              className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap btn btn-primary border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              Sign up
            </button>
          </div>
        </div>
      </section>

      <section className="px-2 py-2 md:py-32 bg-white md:px-0">
        <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
          <div className="flex flex-wrap items-center sm:-mx-3">
            <div className="w-full md:w-1/2 md:px-3">
              <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                  <span className="block xl:inline">
                    Embark on a transformative learning{" "}
                  </span>
                  <span className="block text-primary xl:inline">
                    journey with our course!
                  </span>
                </h1>
                <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">
                  Welcome to our comprehensive course, where you'll embark on a
                  transformative learning journey.
                </p>
                <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                  <button
                    // href="#_"
                    onClick={() => loginWithRedirect()}
                    className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-primary rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
                  >
                    Try It Free
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 ml-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                  {/* <a
                    href="#_"
                    className="flex items-center px-6 py-3 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600"
                  >
                    Learn More
                  </a> */}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl">
                <img src="https://images.unsplash.com/photo-1498049860654-af1a5c566876?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
