import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here..."
        value={props.value}
        type={props.type}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Register = () => {
  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
  const [retype, setRetype] = useState(null);

  const doSubmit = async (e) => {
    e.preventDefault();
    if (password === retype) {
      try {
        const requestBody = JSON.stringify({ username, password });
        const response = await api.post("/users", requestBody);

        // Get the returned user and update a new object.
        const user = new User(response.data);

        // Store the token into the local storage.
        localStorage.setItem("token", user.token);
        localStorage.setItem("userId", user.id);

        // Login successfully worked --> navigate to the route /game in the GameRouter
        history.push(`/game`);
      } catch (error) {
        alert(`Username or name already exist: \n${handleError(error)}`);
      }
    } else {
      alert("please retype the correct password");
    }
  };

  const routeChange = () => {
    history.push(`/login`);
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="choose a unique username"
            value={username}
            onChange={(e) => setUsername(e)}
          />
          <FormField
            label="choose your password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e)}
          />
          <FormField
            label="please retype your password"
            value={retype}
            type="password"
            onChange={(e) => setRetype(e)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password || !retype}
              width="100%"
              onClick={(e) => doSubmit(e)}
            >
              submit
            </Button>
            <Button width="100%" onClick={() => routeChange()}>
              back to main page
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Register;
