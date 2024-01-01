import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <div className=" frame-5">
          <img
            className="group"
            alt="Group"
            src="https://c.animaapp.com/WxRKDcF6/img/group.png"
          />
          <div className="text-wrapper-3">Welcome to</div>
          <div className="text-wrapper-3">Goodspace Communications</div>
        </div>
        <div>
          <form action="" onSubmit={(event) => handleSubmit(event)}>
            <div className="brand">
              <img
                src="https://c.animaapp.com/WxRKDcF6/img/group.png"
                alt="logo"
              />
              <h1>GoodSpace</h1>
            </div>

            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={(e) => handleChange(e)}
              min="3"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <button type="submit">Lets Go ! !</button>
            <span>
              Don't have an account ? <Link to="/register">Create One.</Link>
            </span>
          </form>
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 1rem;
  padding:150px;
  align-items: center;
  background-color: #541554;
  background-image: url(https://c.animaapp.com/WxRKDcF6/img/background.png);
  background-size: 1600px 750px;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: #fff;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    
    gap: 2rem;
    background-color: white;
    border-radius: 2rem;
    padding: 5rem;
    -webkit-backdrop-filter: blur(149.14px) brightness(100%);
    backdrop-filter: blur(149.14px) brightness(100%);
    background-color: #ffffff1a;
  }
  input {
    background-color: white;
    padding: 1rem;
    border: 0.1rem solid white;
    border-radius: 0.4rem;
    color: black;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid white;
      outline: none;
    }
  }
  button {
    background-color: blue;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #3254a8;
    }
  }
  span {
    color: #fff;
    text-transform: uppercase;
    a {
      color: #3405f0;
      text-decoration: none;
      font-weight: bold;
    }
  }
  .frame-5 {
    align-items: flex-start;
    display: inline-flex;
    flex-direction: column;
    left: 92px;
    position: absolute;
    top: 321px;
  }
  .group {
    height: 173.71px;
    position: relative;
    width: 113px;
  }
  .text-wrapper-3 {
  color: #ffffff;
  font-family: "Poppins", Helvetica;
  font-size: 48px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: normal;
  position: relative;
  text-align: center;
  width: fit-content;
  .apple-vision-pro-ui {
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}
`;
