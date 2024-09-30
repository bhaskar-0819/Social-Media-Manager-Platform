import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header id="header">
      <Link to="/" className="logo" id="logo">MyBlog</Link>
      <nav id="nav">
        {username ? (
          <>
            <Link to="/create" id="create-post-buttonn">Create new post</Link>
            <a id="logout-button" onClick={logout}>Logout ({username})</a>
          </>
        ) : (
          <>
            <Link to="/login" id="login-buttonn">Login</Link>
            <Link to="/register" id="register-button">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
