import {  createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../AxiosClient";
const stateContext = createContext();

export const AppContext = ({ children }) => {
  const [tour, setTour] = useState([]);
  const [users, setUsers] = useState([]);
  const [contact, setContact] = useState([]);
  const [booking, setBooking] = useState([]);
  const [todoss, setTodoss] = useState([]);

  
// 'descrption=string' \
//   -F 'itemSerial=string' \
//   -F 'itemImage=' \
//   -F 'ownerEmail=user@example.com' \
//   -F 'date=2025-05-25T17:39:06.318Z' \
//   -F 'location=string' \
//   -F 'ownerPhone=string' \
//   -F 'itemName=string' \
//   -F 'ownerName=string'

  useEffect(() => {
    const fetchtours = async () => {
      try {
        const response = await axiosClient.get(
          "/api/lostItems"
        );
        console.log('Lost items founded',response.data);
        setTour(response.data);
      } catch (err) {
        if (err.response) {
          console.log;
          err.response.data;
          console.log;
          err.response.status;
          console.log;
          err.response.headers;
        } else {
          console.log("error: ${err.message}");
        }
      }
    };
    fetchtours();
  }, []);

  let tokenn = localStorage.getItem("token");
  console.log(tokenn);
  useEffect(() => {
    const fetchposts = async () => {
      try {
        const response = await axiosClient.get(
          "/api/users",
          {
            headers: {
              Authorization: "Bearer " + tokenn,
            },
          }
        );
        console.log(response.data);

        setUsers(response.data);
      } catch (err) {
        if (err.response) {
          console.log;
          err.response.data;
          console.log;
          err.response.status;
          console.log;
          err.response.headers;
        } else {
          console.log("error: ${err.message}");
        }
      }
    };
    fetchposts();
  }, []);

  useEffect(() => {
    const fetchcontact = async () => {
      try {
        const response = await axiosClient.get(
          "/api/contacts",
          {
            headers: {
              Authorization: "Bearer " + tokenn,
            },
          }
        );
        console.log(response.data);

        setContact(response.data);
      } catch (err) {
        if (err.response) {
          console.log;
          err.response.data;
          console.log;
          err.response.status;
          console.log;
          err.response.headers;
        } else {
          console.log("error: ${err.message}");
        }
      }
    };
    fetchcontact();
  }, []);

  useEffect(() => {
    const fetchbook = async () => {
      try {
        const response = await axiosClient.get(
          `/api/foundItems`,
          {
            headers: {
              Authorization: "Bearer " + tokenn,
            },
          }
        );
        console.log(response.data);
        console.log("hhhhhhhhhhhhh");

        setBooking(response.data);
      } catch (err) {
        if (err.response) {
          console.log;
          err.response.data;
          console.log;
          err.response.status;
          console.log;
          err.response.headers;
        } else {
          console.log("error: ${err.message}");
        }
        
      }
    };
    fetchbook();
  }, []);

  // useEffect(() => {
  //   fetchTodos();
  // }, []);

  // const fetchTodos = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://todo-app-api-fkhb.onrender.com/api/todos"
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch todos");
  //     }
  //     console.log(response);
  //     setTodoss(response.data);
  //   } catch (error) {
  //     alert(error);
  //     console.error("Error fetching todos:", error);
  //   }
  // };

  return (
    <stateContext.Provider
      value={{
        users,
        setUsers,
        tour,
        setTour,
        contact,
        setContact,
        booking,
        setBooking,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export const mycontext = () => useContext(stateContext);
