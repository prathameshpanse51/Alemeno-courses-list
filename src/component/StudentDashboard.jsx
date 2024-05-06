import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  collection,
  getDocs,
  query,
  getFirestore,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { app } from "../component/firebase";

export default function StudentDashboard() {
  const { user, logout, isAuthenticated } = useAuth0();
  const db = getFirestore(app);

  const [enrolledList, setEnrolledList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCompletedList = async () => {
    const colRef = query(collection(db, "students"));
    const querySnapshot = await getDocs(colRef);
    const colRef1 = query(collection(db, "courses"));
    const querySnapshot1 = await getDocs(colRef1);
    querySnapshot.forEach((doc) => {
      querySnapshot1.forEach((doc1) => {
        if (doc.data()["id"] === user.sub) {
          for (let i = 0; i < doc.data()["completedCourses"].length; i++) {
            if (
              doc.data()["completedCourses"][i] === doc1.data()["CourseName"]
            ) {
              setCompletedList((completedList) => [
                ...completedList,
                doc1.data(),
              ]);
            }
          }
        }
      });
    });
  };

  const getEnrolledList = async () => {
    const colRef = query(collection(db, "students"));
    const querySnapshot = await getDocs(colRef);
    const colRef1 = query(collection(db, "courses"));
    const querySnapshot1 = await getDocs(colRef1);
    querySnapshot.forEach((doc) => {
      querySnapshot1.forEach((doc1) => {
        if (doc.data()["id"] === user.sub) {
          for (let i = 0; i < doc.data()["enrolledCourses"].length; i++) {
            if (
              doc.data()["enrolledCourses"][i] === doc1.data()["CourseName"]
            ) {
              setEnrolledList((enrolledList) => [...enrolledList, doc1.data()]);
            }
          }
        }
      });
    });

    setLoading(false);
  };

  const handleCompletedCourse = async (val, e, name) => {
    window.document.getElementById("completedCourse").style.transform =
      "scale(1)";
    const colRef = query(collection(db, "courses"));
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((dat) => {
      for (let i = 0; i < dat.data()["students"].length; i++) {
        if (dat.data()["CourseName"] === e) {
          if (dat.data()["students"][i]["name"] === name) {
            const scoreRef = doc(db, "courses", dat.id);
            updateDoc(scoreRef, {
              students: arrayRemove({
                id: user.sub,
                name: user.name,
                email: user.email,
                completed: !val,
              }),
            });
            updateDoc(scoreRef, {
              students: arrayUnion({
                id: user.sub,
                name: user.name,
                email: user.email,
                completed: val,
              }),
            });
          }
        }
      }
    });
    const colRef1 = query(collection(db, "students"));
    const querySnapshot1 = await getDocs(colRef1);
    querySnapshot1.forEach((dat) => {
      if (dat.data()["id"] === user.sub) {
        const scoreRef = doc(db, "students", dat.id);
        updateDoc(scoreRef, {
          completedCourses: arrayUnion(e),
        });
      }
    });
    setTimeout(() => {
      window.document.getElementById("completedCourse").style.transform =
        "scale(0)";
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    if (isAuthenticated) {
      getEnrolledList();
      getCompletedList();
    }
  }, [isAuthenticated]);

  return (
    <>
      {loading && (
        <div className="w-[100%] h-[100vh] bg-[#f4f4f5] flex justify-center my-auto">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}

      {!loading && (
        <>
          <div className="navbar bg-base-100 md:px-36">
            <div className="flex-1 mt-4 md:mt-0">
              <a
                href="/home"
                className="flex items-center mb-5 font-medium text-gray-900 lg:w-auto lg:items-center lg:justify-center md:mb-0"
              >
                <span className="mx-auto text-xl font-black leading-none text-gray-900 select-none">
                  Alemeno<span className="text-indigo-600">.</span>
                </span>
              </a>
            </div>
            <div className="flex-none gap-2 mt-2">
              <div className="form-control">
                <button
                  className="btn btn-error px-10"
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 my-4 md:mx-28 md:my-12">
            <h1 className="text-xl md:text-4xl font-bold bg-blue-200 px-6 py-6 rounded-xl">
              Enrolled Courses
            </h1>
            {enrolledList.length > 0 ? (
              <div className="mt-6 px-2 flex flex-wrap gap-8 md:justify-start">
                {enrolledList.map((e, idx) => {
                  return (
                    <a
                      key={idx}
                      href={
                        "course?" +
                        e.CourseName.replace(/ /g, "-").replace(/'/g, "")
                      }
                    >
                      <div className="card md:w-96 bg-base-100 shadow-xl h-full">
                        <figure>
                          <img src={e.thumbnail} />
                        </figure>
                        <div className="card-body p-6 ">
                          <h2 className="card-title">
                            {e.CourseName}

                            <input
                              onClick={(val) =>
                                handleCompletedCourse(
                                  val.target.checked,
                                  e.CourseName,
                                  user.name
                                )
                              }
                              disabled={false}
                              type="checkbox"
                              className="checkbox border-4"
                            />
                          </h2>
                          <p>{e.InstructorName}</p>
                          <div className="card-actions justify-between items-end">
                            <div>
                              <p>Due date:</p>
                              <div className="badge badge-secondary">
                                {e.dueDate}
                              </div>
                            </div>
                            <div
                              className="radial-progress"
                              style={{ "--value": 70 }}
                              role="progressbar"
                            >
                              70%
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className=" mt-4 text-lg md:text-3xl font-bold text-center py-4">
                No Courses Enrolled!{" "}
                <a
                  href="/home"
                  className="btn btn-outline btn-primary border-2 px-2 md:px-4 md:ml-4 md:text-lg"
                >
                  Explore Courses
                </a>
              </p>
            )}
          </div>

          <div className="px-4 my-4 md:mx-28 md:my-12">
            <h1 className="text-xl md:text-4xl font-bold bg-blue-200 px-6 py-6 rounded-xl">
              Completed Courses
            </h1>
            {completedList.length > 0 ? (
              <div className="mt-6 px-2 flex flex-wrap gap-8 md:justify-start">
                {completedList.map((e, idx) => {
                  return (
                    <a
                      key={idx}
                      href={
                        "course?" +
                        e.CourseName.replace(/ /g, "-").replace(/'/g, "")
                      }
                    >
                      <div className="card md:w-96 bg-base-100 shadow-xl h-full">
                        <figure>
                          <img src={e.thumbnail} />
                        </figure>
                        <div className="card-body p-6 ">
                          <h2 className="card-title">{e.CourseName}</h2>
                          <p>{e.InstructorName}</p>
                          <div className="card-actions justify-between items-end">
                            <div>
                              <p>Due date:</p>
                              <div className="badge badge-secondary">
                                {e.dueDate}
                              </div>
                            </div>
                            <div
                              className="radial-progress"
                              style={{ "--value": 70 }}
                              role="progressbar"
                            >
                              70%
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <>
                <h6 className=" mt-4 text-lg md:text-3xl font-bold text-center py-4">
                  No Courses Completed!{" "}
                  <p className="text-center text-lg font-normal">
                    Complete the above Courses
                  </p>
                </h6>
              </>
            )}
          </div>
          <div className="toast" id="completedCourse">
            <div className="alert alert-warning">
              <span>Course Completed!</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
