import React, { Component } from "react";
import "../../css/navbar.css";
import { Redirect } from "react-router";
import { If } from "react-if";

class Navbar extends Component {
  handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    console.log("Logged out successfully.");
    return <Redirect to="/home" />;
  };
  render() {
    var id = localStorage.getItem("id");

    return (
      <div>
        <If condition={!id}>
          <nav className="navbar navbar-expand-lg navbar-light ">
            <a className="navbar-home" href="/home">
              OpenHack
            </a>

            <a href="/login" className="login">
              Login
            </a>
          </nav>
        </If>
        <If condition={id}>
          <nav className="navbar navbar-expand-lg navbar-light ">
            <a className="navbar-home" href="/home">
              OpenHack
            </a>

            <div
              className="dropdown-menu dropdown-content"
              aria-labelledby="navbarDropdown"
            >
              <a className="dropdown-item" href="/profile">
                Profile
              </a>
              <a className="dropdown-item" href="/organizations">
                My Organizations
              </a>
              <a className="dropdown-item" onClick={this.handleLogout}>
                Logout
              </a>
            </div>
          </nav>
        </If>
      </div>
    );
  }
}

export default Navbar;