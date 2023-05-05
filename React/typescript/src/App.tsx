import React, { useCallback, useEffect, useState } from "react";
import RowComponent from "./RowComponent";

import "./App.css";

interface User {
  id: number;
  firstName: string;
  email: string;
  university: string;
  gender: string;
  age: number;
}

interface Response {
  users: User[];
}

function App() {
  const [loadedData, setLoadedData] = useState<User[]>([]);
  const [countUsers, setCountUsers] = useState<number>(5);
  const [activeFilterByAge, setActiveFilterByAge] = useState<boolean>(false);
  const [activeFilterByGender, setActiveFilterByGender] =
    useState<boolean>(false);
  const [selectValue, setSelectValue] = useState<string>("gender");
  const [filteredByAge, setFilteredByAge] = useState<User[]>([]);
  const [filteredByGender, setFilteredByGender] = useState<User[]>([]);

  // This block uses the useEffect hook to fetch data from a server using an async function.
  // The server URL is obtained from the environment variables using import.meta.env.
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users`
        );
        if (response.ok) {
          const data: Response = await response.json();
          setLoadedData(data.users.slice(0, 5));
        } else {
          throw new Error("Network response was not ok.");
        }
      } catch (error: unknown) {
        console.error(error); // Any errors encountered during the fetch are logged to the console
        alert(error);
      }
    }

    fetchUsers();
  }, []);

  // This function handles resetting all filters and states to their initial values
  const handleReset = useCallback(async () => {
    setActiveFilterByAge(false); // deactivate age filter
    setActiveFilterByGender(false); // deactivate gender filter
    setSelectValue("gender"); // reset dropdown value to default
    setFilteredByGender([]); // clear gender filter results
    setCountUsers(5); // reset number of displayed users

    // Fetch all users from the backend
    try {
      const responseData = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users`
      );
      const data: Response = await responseData.json();
      // Display only the first 5 users
      setLoadedData(data.users.slice(0, 5));
    } catch (error) {
      console.error(error); // Any errors encountered during the fetch are logged to the console
      alert(error);
      // display error message to user using a message or alert box
    }
  }, []);

  // A function to handle filter by age button click event
  const handleFilterByAge = () => {
    // Set active filter by age flag to true and reset other flags
    setActiveFilterByAge(true);
    setSelectValue("gender");
    setActiveFilterByGender(false);
    setFilteredByGender([]);
    setCountUsers(5);

    if (loadedData) {
      //Sort the loaded data by age in ascending order
      const sortedData = [...loadedData].sort((a, b) => a.age - b.age);
      setFilteredByAge(sortedData);
    }
  };

  // A function to handle filtering users by gender
  const handleFilterByGender = async () => {
    if (activeFilterByAge) {
      setActiveFilterByAge(false); // deactivate age filter
      setActiveFilterByGender(false); // deactivate gender filter
      // setSelectValue("gender"); // reset dropdown value to default
      setFilteredByGender([]); // clear gender filter results
      // reset number of displayed users
    }

    try {
      const responseData = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users`
      );
      const data = await responseData.json();

      let filteredData = data.users.filter(
        (item: { gender: string }) => item.gender === selectValue
      );

      if (activeFilterByAge) {
        filteredData = filteredData.sort((a: User, b: User) => a.age - b.age);
        setFilteredByAge(filteredData.slice(0, countUsers));
        setLoadedData(filteredData.slice(0, countUsers));
      }

      setFilteredByGender(filteredData.slice(0, countUsers));
    } catch (error: unknown) {
      console.error(error);
      alert(error);
      // display error message to user using a message or alert box
    }

    setActiveFilterByGender(true);
  };

  // A function to load more data based on active filters and user count
  const handleMoreData = async (): Promise<void> => {
    // check if gender filter is active and age filter is not active
    if (activeFilterByGender && !activeFilterByAge) {
      // Fetch all users from the backend
      try {
        const responseData = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users`
        );
        const data = await responseData.json();
        let i = 0;
        // filter the data by gender and update the filteredByGender state with additional 5 records
        setFilteredByGender(
          data.users.filter((item: User) => {
            if (item.gender === selectValue && i < countUsers + 5) {
              i++; // increment the counter if the gender matches and count is less than maxValue
              return true; // include the item in the filtered array
            }
            return false; // exclude the item from the filtered array
          })
        );
      } catch (error: unknown) {
        console.error(error);
        alert(String(error));
        // display error message to user using toast message or alert box
      }
    } else {
      // Fetch all users from the backend
      try {
        const responseData = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users`
        );
        const data = await responseData.json();
        // if age filter is active and gender filter is not active
        if (activeFilterByAge && !activeFilterByGender) {
          // update the filteredByAge state with additional 5 records sorted by age
          setFilteredByAge(
            data.users
              .slice(0, countUsers + 5)
              .sort((a: User, b: User) => a.age - b.age)
          );
        } else {
          // if no filter is active then update the loadedData state with additional 5 records
          setLoadedData(data.users.slice(0, countUsers + 5));
        }
      } catch (error: unknown) {
        console.error(error);
        alert(String(error));
        // display error message to user using toast message or alert box
      }
    }
    setCountUsers(countUsers + 5);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
    if (e.target.value === "gender") {
      handleReset();
    }
  };

  return (
    <div className="container-general">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>University</th>
            <th
              className="gender"
              onClick={
                selectValue !== "gender" ? handleFilterByGender : undefined
              }
            >
              <select
                value={selectValue}
                onChange={(e) => handleSelectChange(e)}
              >
                <option value="gender">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </th>

            <th className="age" onClick={handleFilterByAge}>
              Age
            </th>
          </tr>
        </thead>
        <tbody>
          {!activeFilterByGender && activeFilterByAge ? (
            <React.Fragment>
              {filteredByAge.map((item, index) => (
                <RowComponent
                  key={item.id}
                  id={index + 1}
                  name={item.firstName}
                  email={item.email}
                  university={item.university}
                  gender={item.gender}
                  age={item.age}
                />
              ))}
            </React.Fragment>
          ) : !activeFilterByAge && activeFilterByGender ? (
            <React.Fragment>
              {filteredByGender.map((item, index) => (
                <RowComponent
                  key={item.id}
                  id={index + 1}
                  name={item.firstName}
                  email={item.email}
                  university={item.university}
                  gender={item.gender}
                  age={item.age}
                />
              ))}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {loadedData &&
                loadedData.map((item, index) => (
                  <RowComponent
                    key={item.id}
                    id={index + 1}
                    name={item.firstName}
                    email={item.email}
                    university={item.university}
                    gender={item.gender}
                    age={item.age}
                  />
                ))}
            </React.Fragment>
          )}
        </tbody>
      </table>
      <div className="container-buttons">
        <button
          className="button-loadmore"
          onClick={() => handleMoreData()}
          disabled={
            countUsers > loadedData.length &&
            countUsers > filteredByAge.length &&
            countUsers > filteredByGender.length
              ? true
              : false
          }
        >
          {countUsers > loadedData.length &&
          countUsers > filteredByAge.length &&
          countUsers > filteredByGender.length
            ? "No more data"
            : "Load more"}
        </button>
        <button
          className="button-reset"
          onClick={handleReset}
          disabled={countUsers >= 5 ? false : true}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
