import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useParams, useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        disabled={props.disabled}
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

const Profile = () => {
  const { id } = useParams();
  const history = useHistory();

  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState(null);
  const [birthday, setBirthday] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get(`/users/${id}`);

        setUser(response.data);
      } catch (error) {
        alert(`Something went wrong during the login: \n${handleError(error)}`);
      }
    };
    getUser();
  }, [id]);

  let content = <div>{console.log(user)}</div>;

  if (user) {
    const checkEditable = () => {
      return localStorage.token === user.token;
    };

    const toggleEvent = () => {
      setEdit((prevState) => !prevState);
    };

    const submitEdit = async () => {
      try {
        user.username = username != null ? username : user.username;
        user.birthday = birthday != null ? birthday : user.birthday;

        const requestBody = JSON.stringify(user);

        await api.put(`/users/${user.id}`, requestBody);

        history.push(`/game`);
      } catch (error) {
        alert(
          `Something went wrong during the submission: \n${handleError(error)}`
        );
      }
    };

    const routeChange = () => {
      history.push("/game");
    };

    content = (
      <div className="login container">
        <div className="login form">
          <FormField
            label="username"
            value={username}
            placeholder={user.username}
            disabled={!edit}
            onChange={(e) => setUsername(e)}
          />
          <FormField
            label="online status"
            placeholder={user.status}
            disabled={true}
          />
          <FormField
            label="creation date"
            placeholder={user.creation_date}
            disabled={true}
          />
          <FormField
            label="birth date"
            type={edit ? "date" : "text"}
            value={birthday}
            placeholder={
              !user.birthday ? "birthday to be edited" : user.birthday
            }
            disabled={!edit}
            onChange={(e) => setBirthday(e)}
          />
          <div className="login button-container">
            <Button
              width="100%"
              onClick={toggleEvent}
              disabled={!checkEditable() || edit}
            >
              edit
            </Button>
          </div>
          <div className="login button-container">
            <Button width="100%" onClick={!edit ? routeChange : submitEdit}>
              {!edit ? "back" : "save"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <BaseContainer>{content}</BaseContainer>;
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Profile;
