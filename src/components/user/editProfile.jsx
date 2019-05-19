import React, { Component } from "react";
import Navbar from "../common/navbar";
import "../../css/editProfile.css";
import { Link } from "react-router-dom";
import axios from "axios";
import FormEventHandlers from "../common/formEventHandlers";
import { Redirect } from "react-router";
import {
  getToken,
  getJWTUsername,
  getJWTID,
  getJWTScreenName,
  getJWTAdminStatus,
  setHeader
} from "../common/auth";
import Joi from "joi-browser";
import { rootUrl } from "../common/constant";

class EditProfile extends FormEventHandlers {
  constructor() {
    super();
    this.state = {
      screenname: "",
      first: "",
      last: "",
      businessTitle: "",
      aboutMe: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      id: "",
      errors: {},
      dbErrors: ""
    };
  }

  componentDidMount() {
    const ID = getJWTID();
    setHeader();
    axios
      .get(rootUrl + "/users/" + ID)
      .then(response => {
        this.setState({
          screenname: response.data.screenName,
          first: response.data.name.first,
          last: response.data.name.last,
          businessTitle: response.data.businessTitle,
          aboutMe: response.data.aboutMe,
          street: response.data.address.street,
          city: response.data.address.city,
          state: response.data.address.state,
          zipcode: response.data.address.zip,
          id: response.data.id
        });
      })
      .catch(error => {
        this.setState({
          // dbErrors: error.response.data.code
          dbErrors: error
        });
      });
  }

  doSubmit = e => {
    var profile = {
      screenName: this.state.screenname,
      name: {
        first: this.state.first,
        last: this.state.last
      },
      businessTitle: this.state.businessTitle,
      aboutMe: this.state.aboutMe,
      address: {
        street: this.state.street,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zipcode
      }
    };

    console.log(profile);

    const ID = getJWTID();
    setHeader();
    axios.put(rootUrl + "/users/" + ID, profile).then(response => {
      window.alert("Profile updated successfully.");
    });
  };

  schema = {
    first: Joi.string()
      .required()
      .max(15)
      .regex(/^[a-zA-Z]*$/)
      .label("First Name"),
    last: Joi.string()
      .required()
      .max(15)
      .regex(/^[a-zA-Z]*$/)
      .label("Last Name"),
    businessTitle: Joi.string()
      .max(20)
      .min(0)
      .label("Business Title"),
    aboutMe: Joi.string()
      .label("About me")
      .max(200),
    street: Joi.string()
      .label("Street Address")
      .max(30),
    city: Joi.string()
      .label("City")
      .max(20),
    state: Joi.string()
      .label("state")
      .max(20),
    zipcode: Joi.string()
      .label("Zipcode")
      .max(6)
      .min(5)
  };

  render() {
    let redirectVar = null;
    var id = getJWTID();
    if (!id) {
      redirectVar = <Redirect to="/home" />;
    }

    return (
      <div className="profile-home">
        {redirectVar}
        <Navbar />
        <hr />
        <div className="profile">
          <div className="profile-photo">
            <input type="file" className="upload_profile_photo" name="files" />
            <img
              src={require("../../images/man.svg")}
              width="300"
              height="200"
              alt="User has not uploaded anything yet"
            />
          </div>
          <br />
          <h1 className="name">
            <span>{this.state.screenname}</span>
          </h1>
        </div>
        <div className="profile-body">
          <form>
            <div className="profile-information">
              <h3>Profile Information</h3>
              <br />
              <input
                type="text"
                name="screenname"
                className="form-control"
                autoFocus
                placeholder="Screen Name"
                disabled
                defaultValue={this.state.screenname}
              />
              <input
                type="text"
                name="first"
                className="form-control"
                placeholder="First Name"
                defaultValue={this.state.first}
                onChange={this.handleChangeFirstName}
                error={this.state.errors.first}
              />
              {this.state.errors.first && (
                <div className="red">{this.state.errors.first} </div>
              )}
              <input
                type="text"
                name="last"
                className="form-control"
                placeholder="Last Name"
                defaultValue={this.state.last}
                onChange={this.handleChangeLastName}
                error={this.state.errors.last}
              />
              {this.state.errors.last && (
                <div className="red">{this.state.errors.last} </div>
              )}
              <input
                type="text"
                name="businessTitle"
                className="form-control"
                placeholder="Business Title"
                defaultValue={this.state.businessTitle}
                onChange={this.handleChangeTitle}
                error={this.state.errors.businessTitle}
              />
              {this.state.errors.businessTitle && (
                <div className="red">{this.state.errors.businessTitle} </div>
              )}
              <input
                type="text"
                name="aboutMe"
                placeholder="About me"
                className="form-control"
                defaultValue={this.state.aboutMe}
                onChange={this.handleChangeAbout}
                error={this.state.errors.aboutMe}
              />
              {this.state.errors.aboutMe && (
                <div className="red">{this.state.errors.aboutMe} </div>
              )}
              <input
                type="text"
                name="street"
                className="form-control"
                placeholder="Street Address"
                defaultValue={this.state.street}
                onChange={this.handleChangeStreet}
                error={this.state.errors.street}
              />
              {this.state.errors.street && (
                <div className="red">{this.state.errors.street} </div>
              )}
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="City"
                defaultValue={this.state.city}
                onChange={this.handleChangeCity}
                error={this.state.errors.city}
              />
              {this.state.errors.city && (
                <div className="red">{this.state.errors.city} </div>
              )}
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="State"
                defaultValue={this.state.state}
                onChange={this.handleChangeState}
                error={this.state.errors.state}
              />
              {this.state.errors.state && (
                <div className="red">{this.state.errors.state} </div>
              )}
              <input
                type="text"
                name="zipcode"
                className="form-control"
                placeholder="Zipcode"
                defaultValue={this.state.zipcode}
                onChange={this.handleChangeZipcode}
                error={this.state.errors.zipcode}
              />
              {this.state.errors.zipcode && (
                <div className="red">{this.state.errors.zipcode} </div>
              )}
            </div>
            <div className="view_profile">
              <Link
                className="btn btn-primary"
                to={{
                  pathname: "/profile",
                  state: { id: this.state.id }
                }}
              >
                View Profile
              </Link>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.handleSubmit}
            >
              Save
            </button>{" "}
          </form>
        </div>
      </div>
    );
  }
}
export default EditProfile;
