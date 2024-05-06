import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  getFirestore,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import { app } from "../component/firebase";
import { useAuth0 } from "@auth0/auth0-react";

export default function CourseHome() {
  var courseUrl = "/course" + window.location.search;

  let [courseInfo, setCourseInfo] = useState([]);
  const db = getFirestore(app);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 700);
  });

  const getCourse = async () => {
    const colRef = query(collection(db, "courses"), orderBy("CourseName"));
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((data) => {
      try {
        if (
          ("/course?" +
            data.data()["CourseName"].replace(/ /g, "-").replace(/'/g, "") ===
            courseUrl) ===
          true
        ) {
          setCourseInfo(data.data());
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  const { user } = useAuth0();

  const applyCourse = async (e) => {
    window.document.getElementById("enrolledCourse").style.transform =
      "scale(1)";
    const colRef = query(collection(db, "courses"));
    const querySnapshot = await getDocs(colRef);
    querySnapshot.forEach((dat) => {
      if (dat.data()["CourseName"] === e.CourseName) {
        const scoreRef = doc(db, "courses", dat.id);
        updateDoc(scoreRef, {
          students: arrayUnion({
            id: user.sub,
            name: user.name,
            email: user.email,
            completed: false,
          }),
        });
      }
    });

    const colRef1 = query(collection(db, "students"));
    const querySnapshot1 = await getDocs(colRef1);
    querySnapshot1.forEach((dat) => {
      if (dat.data()["id"] === user.sub) {
        const scoreRef = doc(db, "students", dat.id);
        updateDoc(scoreRef, {
          enrolledCourses: arrayUnion(e.CourseName),
        });
      }
    });
    setTimeout(() => {
      window.document.getElementById("enrolledCourse").style.transform =
        "scale(0)";
    }, 2000);
  };

  useEffect(() => {
    getCourse();
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
          <div className="md:my-6 md:px-64 py-6 bg-[#2d2f31] text-white flex flex-col-reverse md:flex-row">
            <div className="mx-4 md:mx-0 mt-2 md:mt-0">
              <h1 className="text-3xl md:text-4xl font-bold">
                {courseInfo.CourseName}
              </h1>
              <p className="text-sm md:text-xl mt-6">
                {courseInfo.Description}
              </p>
              <h3 className="text-sm mt-4">
                Created by {courseInfo.InstructorName}
              </h3>
              {courseInfo.enrollmentStatus === "Open" && (
                <div className="badge badge-success gap-2 px-4 py-[12px] mt-6">
                  {courseInfo.enrollmentStatus}
                </div>
              )}
              {courseInfo.enrollmentStatus === "Closed" && (
                <div className="badge badge-error gap-2 px-4 py-[12px] mt-6">
                  {courseInfo.enrollmentStatus}
                </div>
              )}
              {courseInfo.enrollmentStatus === "In Progress" && (
                <div className="badge badge-warning gap-2 px-4 py-[12px] mt-6">
                  {courseInfo.enrollmentStatus}
                </div>
              )}
            </div>
            <img src={courseInfo.thumbnail} width={450} />
          </div>

          <div className="mt-4 mx-2 md:mx-64">
            <div className="p-4 px-4 md:px-10 border-[#a3b18a] border-2 rounded">
              <div className="flex flex-col md:flex-row gap-4 md:gap-20 text-sm md:text-lg">
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-4 h-4"
                      fill="grey"
                    >
                      <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9V168c0-8.7 4.7-16.7 12.3-20.9z" />
                    </svg>
                    DURATION
                  </p>
                  <p>{courseInfo.duration}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-4 h-4"
                      fill="grey"
                    >
                      <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                    </svg>
                    SCHEDULE
                  </p>
                  <p>{courseInfo.schedule}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                      className="w-4 h-4"
                      fill="grey"
                    >
                      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                    </svg>
                    LOCATION
                  </p>
                  <p>{courseInfo.location}</p>
                </div>
              </div>

              <div className="mt-10">
                <h4 className="text-2xl md:text-3xl font-bold">
                  Prerequisites:{" "}
                </h4>
                <ul className="mt-2" style={{ columns: 2 }}>
                  {courseInfo.length !== 0 &&
                    courseInfo.prerequisites.map((e, idx) => {
                      return <li key={idx}>{e}</li>;
                    })}
                </ul>
              </div>
            </div>
          </div>

          <div className="mx-2 md:mx-64 my-4 md:my-12 py-4">
            <h4 className="text-2xl md:text-3xl font-bold mb-4">Syllabus</h4>

            {courseInfo.length !== 0 &&
              courseInfo.syllabus.map((e, idx) => {
                return (
                  <ul className="menu menu-horizontal flex flex-col">
                    <li style={{ marginLeft: 0 }}>
                      <details
                        key={idx}
                        className="border-[1px] border-[#a3b18a] py-2 px-2 rounded hover:bg-slate-200"
                      >
                        <summary className="font-bold md:text-xl">
                          Week {e.week}
                        </summary>
                        <div className="mt-2 border-t-2 border-[#ced4da]">
                          <h3 className="md:text-lg font-semibold">
                            {e.topic}
                          </h3>
                          <p className="text-sm md:text-sm">{e.content}</p>
                        </div>
                      </details>
                    </li>
                  </ul>
                );
              })}

            <button
              className="btn btn-accent w-full mt-10 text-xl mb-20"
              onClick={() => applyCourse(courseInfo)}
            >
              Apply to Course
            </button>
          </div>

          <div className="toast" id="enrolledCourse">
            <div className="alert alert-success">
              <span>Course Enrolled!</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
