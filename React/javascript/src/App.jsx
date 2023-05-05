import React, { useCallback, useEffect, useState } from "react";
import RowComponent from "./RowComponent";

import "./App.css";

function App() {
  const [loadedData, setLoadedData] = useState();
  const [countUsers, setCountUsers] = useState(5);
  const [activeFilterByAge, setActiveFilterByAge] = useState(false);
  const [activeFilterByGender, setActiveFilterByGender] = useState(false);
  const [selectValue, setSelectValue] = useState("gender");
  const [filteredByAge, setFilteredByAge] = useState();
  const [filteredByGender, setFilteredByGender] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users`
        );
        const data = await responseData.json();
        setLoadedData(data.users.slice(0, 5));
      } catch (error) {
        console.error(error);
        alert(error);
        // display error message to user using toast message or alert box
      }
    };

    fetchData();
  }, []);

  const handleReset = async () => {
    setActiveFilterByAge(false);
    try {
      const responseData = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users`
      );
      const data = await responseData.json();

      setLoadedData(data.users.slice(0, 5));
      setCountUsers(countUsers + 5);
    } catch (error) {
      console.error(error);
      alert(error);
      // display error message to user using toast message or alert box
    }
  };

  const handleFilterByAge = () => {
    setActiveFilterByAge(true);
    if (countUsers > 5) {
      setFilteredByAge(
        filteredByAge && filteredByAge.sort((a, b) => a.age - b.age)
      );
    } else {
      setFilteredByAge(loadedData && loadedData.sort((a, b) => a.age - b.age));
    }

    console.log("2" + filteredByAge);
  };

  const handleFilterByGender = useCallback(async () => {
    console.log("aqui" + countUsers);

    try {
      const responseData = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/users`
      );
      const data = await responseData.json();
      // setLoadedData(data.users.slice(0, countUsers + 5))

      let i = 0;
      setFilteredByGender(
        data.users.filter((item) => {
          if (item.gender === selectValue && i < countUsers) {
            i++; // increment the counter if the gender matches and count is less than maxValue
            return true; // include the item in the filtered array
          }
          return false; // exclude the item from the filtered array
        })
      );
      // setCountUsers(countUsers - i);
      console.log("other" + i);
      console.log("aqui" + countUsers);
    } catch (error) {
      console.error(error);
      alert(error);
      // display error message to user using toast message or alert box
    }
    setActiveFilterByGender(true);

    console.log("3" + filteredByGender);
  }, [countUsers, filteredByGender, selectValue]);

  const handleMoreData = useCallback(async () => {
    if (activeFilterByGender && !activeFilterByAge) {
      try {
        const responseData = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users`
        );
        const data = await responseData.json();
        // setLoadedData(data.users.slice(0, countUsers + 5))

        let i = 0;
        setFilteredByGender(
          data.users.filter((item) => {
            if (item.gender === selectValue && i < countUsers + 5) {
              i++; // increment the counter if the gender matches and count is less than maxValue
              return true; // include the item in the filtered array
            }
            return false; // exclude the item from the filtered array
          })
        );
        // setCountUsers(countUsers - i);
        console.log("other" + i);
        console.log("aqui" + countUsers);
      } catch (error) {
        console.error(error);
        alert(error);
        // display error message to user using toast message or alert box
      }
    } else {
      try {
        const responseData = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/users`
        );
        const data = await responseData.json();

        if (activeFilterByAge && !activeFilterByGender) {
          setFilteredByAge(
            data.users.slice(0, countUsers + 5).sort((a, b) => a.age - b.age)
          );
        } else {
          setLoadedData(data.users.slice(0, countUsers + 5));
        }
      } catch (error) {
        console.error(error);
        alert(error);
        // display error message to user using toast message or alert box
      }
    }
    setCountUsers(countUsers + 5);
  }, [
    countUsers,
    activeFilterByAge,
    activeFilterByGender,
    handleFilterByGender,
  ]);

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
              onClick={selectValue !== "gender" ? handleFilterByGender : null}
            >
              <select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
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
          {activeFilterByAge && !activeFilterByGender ? (
            <React.Fragment>
              {activeFilterByAge
                ? filteredByAge.map((item, index) => (
                    <RowComponent
                      key={item.id}
                      id={index + 1}
                      name={item.firstName}
                      email={item.email}
                      university={item.university}
                      gender={item.gender}
                      age={item.age}
                    />
                  ))
                : ""}
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

          // disabled={countUsers + 5 === 35 ? true : false}
        >
          {countUsers + 5 === 35 ? "No more data" : "Load more"}
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
