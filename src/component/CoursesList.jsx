import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  getFirestore,
  orderBy,
  addDoc,
  doc,
  deleteDoc,
  increment,
  updateDoc,
} from "firebase/firestore";

import { app } from "../component/firebase";
import { useAuth0 } from "@auth0/auth0-react";
import Heart from "react-heart";

export default function CoursesList() {
  const db = getFirestore(app);

  const [courses, setCourses] = useState([]);
  const [searchCourse, setSearchCourse] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [likes, setLikes] = useState([]);
  const [totalLikes, setTotalLikes] = useState([]);

  const getCourses = async () => {
    const colRef = query(collection(db, "courses"), orderBy("CourseName"));
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((doc) => {
      setCourses((courses) => [...courses, doc.data()]);
    });
  };
  const getTotalLikes = async () => {
    const colRef = query(collection(db, "courses"), orderBy("CourseName"));
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((doc) => {
      setTotalLikes(doc.data()["totalLikes"]);
    });
  };

  const handleSearch = (e) => {
    const search = courses.filter((d) => {
      return (
        d.CourseName.toLowerCase().includes(e.target.value.toLowerCase()) ||
        d.InstructorName.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    setSearchCourse(e.target.value.toLowerCase());
    setSearchData(search);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 700);
  });

  const { user, logout, isAuthenticated } = useAuth0();
  const getLikesData = async () => {
    const q2 = query(collection(db, "likes"));
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc2) => {
      if (doc2.data()["name"] === user.name) {
        setLikes((likes) => [...likes, doc2.data()]);
      }
    });
  };

  const addLike = async (courseName, name, id) => {
    addDoc(collection(db, "likes"), {
      CourseName: courseName,
      name: name,
      id: id,
    });

    const colRef = query(collection(db, "courses"));
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((dat) => {
      const scoreRef = doc(db, "courses", dat.id);
      if (courseName === dat.data()["CourseName"]) {
        updateDoc(scoreRef, {
          totalLikes: increment(1),
        });
      }
    });

    setLikes((likes) => [
      ...likes,
      {
        CourseName: courseName,
        name: name,
        id: id,
      },
    ]);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const deletelike = async (courseName, name) => {
    const querySnapshot = await getDocs(collection(db, "likes"));
    querySnapshot.forEach((dat) => {
      if (
        dat.data()["CourseName"] === courseName &&
        dat.data()["name"] === name
      ) {
        const scoreRef = doc(db, "likes", dat.id);
        deleteDoc(scoreRef);
      }
    });
    getLikesData();
  };

  useEffect(() => {
    getLikesData();
    getCourses();
    getTotalLikes();
  }, []);

  return (
    <>
      {loading && (
        <div className="w-[100%] h-[100vh] bg-[#f4f4f5] flex justify-center my-auto">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}

      {!loading && (
        <>
          {" "}
          <div className="navbar bg-base-100 md:px-36">
            <div className="flex-1 mt-4">
              <a
                href="/home"
                className="flex items-center mb-5 font-medium text-gray-900 lg:w-auto lg:items-center lg:justify-center md:mb-0"
              >
                <span className="mx-auto text-xl font-black leading-none text-gray-900 select-none">
                  Alemeno<span className="text-indigo-600">.</span>
                </span>
              </a>
            </div>
            <div className="flex-none gap-2">
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Search Course"
                  className="input input-bordered w-24 md:w-auto"
                  id="search-course"
                  value={searchCourse}
                  name="searchCourse"
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="md:w-[83%] hero bg-blue-100 md:rounded-xl mt-4">
              <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                  src="https://blogassets.leverageedu.com/blog/wp-content/uploads/2019/10/23170101/List-of-Professional-Courses-after-Graduation.gif"
                  className="md:max-w-sm rounded-lg shadow-2xl"
                />
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold">
                    Welcome Student!
                  </h1>
                  <p className="py-6">
                    Comprehensive online course covering the latest trends and
                    best practices. Unlock your potential and master courses
                    with our engaging and interactive learning platform.
                  </p>
                  <a href="/dashboard" className="btn btn-primary">
                    Goto Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="m-4 mt-14 md:m-8">
            <h1 className="text-3xl md:text-5xl font-semibold pl-0 md:pl-28">
              Courses
            </h1>

            <div className="flex flex-row flex-wrap justify-center gap-4 mt-8">
              {searchCourse === ""
                ? courses.map((e, idx) => {
                    return (
                      <div
                        key={idx}
                        className="card mx-2 w-72 md:w-68 h-[100%] bg-base-100 border-[#a3b18a] border-2 hover:bg-slate-200 hover:-translate-y-2 hover:duration-300"
                      >
                        <div className="p-2 md:p-4 flex flex-col h-[100%] justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-lg font-semibold">
                              {e.CourseName}
                            </p>
                            {/* <div style={{ width: "1.7rem" }}> */}
                            <Heart
                              // isActive={active}
                              onClick={() => {
                                if (
                                  likes.some(
                                    (item) => item.CourseName === e.CourseName
                                  )
                                ) {
                                  deletelike(e.CourseName, user.name);
                                } else {
                                  addLike(e.CourseName, user.name, user.sub);
                                }
                              }}
                              animationScale={1.25}
                              style={{
                                marginBottom: "1rem",
                                width: "1.7rem",
                                zIndex: "999",
                              }}
                              className={`browseHeart ${
                                likes.some(
                                  (item) => item.CourseName === e.CourseName
                                )
                                  ? "browseHeart-active"
                                  : ""
                              }`}
                            />
                            <p>{e.totalLikes}</p>
                            {/* </div> */}
                          </div>

                          <p className="flex justify-between items-center pr-2 md:pr-0">
                            {e.InstructorName}
                            <a
                              href={
                                "course?" +
                                e.CourseName.replace(/ /g, "-").replace(
                                  /'/g,
                                  ""
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                width={15}
                                height={15}
                              >
                                <path
                                  d="M438.6 278.6c12.5-12.5 12.5-32.8
                            0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5
                            32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32
                            32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5
                            32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                                />
                              </svg>
                            </a>
                          </p>
                        </div>
                      </div>
                    );
                  })
                : searchData.map((e, idx) => {
                    return (
                      <div
                        key={idx}
                        className="card mx-2 w-72 md:w-68 h-[100%] bg-base-100 border-[#a3b18a] border-2 hover:bg-slate-200 hover:-translate-y-2 hover:duration-300"
                      >
                        <div className="p-2 md:p-4 flex flex-col h-[100%] justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-lg font-semibold">
                              {e.CourseName}
                            </p>
                            {/* <div style={{ width: "1.7rem" }}> */}
                            <Heart
                              // isActive={active}
                              onClick={() => {
                                if (
                                  likes.some(
                                    (item) => item.CourseName === e.CourseName
                                  )
                                ) {
                                  deletelike(e.CourseName, user.name);
                                } else {
                                  addLike(e.CourseName, user.name, user.sub);
                                }
                              }}
                              animationScale={1.25}
                              style={{
                                marginBottom: "1rem",
                                width: "1.7rem",
                                zIndex: "999",
                              }}
                              className={`browseHeart ${
                                likes.some(
                                  (item) => item.CourseName === e.CourseName
                                )
                                  ? "browseHeart-active"
                                  : ""
                              }`}
                            />
                            <p>{e.totalLikes}</p>
                            {/* </div> */}
                          </div>

                          <p className="flex justify-between items-center pr-2 md:pr-0">
                            {e.InstructorName}
                            <a
                              href={
                                "course?" +
                                e.CourseName.replace(/ /g, "-").replace(
                                  /'/g,
                                  ""
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                width={15}
                                height={15}
                              >
                                <path
                                  d="M438.6 278.6c12.5-12.5 12.5-32.8
                          0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5
                          32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32
                          32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5
                          32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                                />
                              </svg>
                            </a>
                          </p>
                        </div>
                      </div>
                    );
                  })}
              {/* 
          {searchData !== "" && (
            <div className="text-3xl border-2 border-black rounded-xl text-center w-[85%] py-6">
              No Course Found!
            </div>
          )} */}
            </div>
          </div>
        </>
      )}
    </>
  );
}
