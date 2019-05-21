import React, { Component } from "react";
import "../../css/createHackathon.css";
import Navbar from "../common/navbar";
import Form from "../common/form";
import { Redirect } from "react-router";
import axios from "axios";
import Joi from "joi-browser";
import {
  getToken,
  getJWTUsername,
  getJWTID,
  getJWTScreenName,
  getJWTAdminStatus,
  setHeader
} from "../common/auth";
import {rootUrl} from "../common/constant";
import Select from 'react-select';
var moment = require("moment");

class CreateHackathon extends Form {
  constructor() {
    super();
    this.state = {
      data: {},
      currentDate: "",
      localStartDate: "",
      localEndDate: "",
      judges : [],
      sponsors : [],
      discounts: [],
      selectedOption : null,
      errors: {},
      dbErrors: "",
      allJudges : [],
      allSponsors :[],
      x : []
       };
  }

  addSponsor(e){
    e.preventDefault();
    this.setState({
      sponsors : [...this.state.sponsors, ""]
    })
  }

  removeSponsor(e,i){
    e.preventDefault();
    this.state.sponsors.splice(i,1);
    this.setState({sponsors: this.state.sponsors})

    this.state.discounts.splice(i,1);
    this.setState({discounts: this.state.discounts})

    this.state.x.splice(i,1);
    this.setState({x: this.state.x})
  }

  handleDiscountChange(e,i){
    console.log("In discount change", e.target.value, i)
    e.preventDefault();
    this.state.discounts[i]=e.target.value;
    this.setState({discounts: this.state.discounts})
  }

  handleSelectionChange = (selectedOption) => {
    var judgeById = [];
    selectedOption.map(e=>{
      judgeById.push(e.id);
    })
    this.setState({ selectedOption });
    this.setState({ judges : judgeById });
  }

  handleSponsorSelection = (selectedOption,i) => {
    var sponsorById=this.state.x;
    
    if(sponsorById && !sponsorById.includes(selectedOption.id)){
      sponsorById[i]=selectedOption.id;
    }
    this.setState({ selectedOption });
    this.setState({ x : sponsorById });
  }
  
  componentDidMount(){
    setHeader();
    axios.get(rootUrl + "/users")
    .then(users=>{
      // remove isadmin true users.
      users.data.map(e=>{
        e["label"] = e.name.first+ " "+e.name.last;
        e["value"] = e.id
      })
      this.setState({
        allJudges : users.data
      })
    }).catch(err=>{

    })

    axios.get(rootUrl + "/organizations").then(org=>{
      org.data.map(e=>{
        e["label"] = e.name;
        e["value"] = e.id
      })
      this.setState({
        allSponsors : org.data
      })
    })
  }

  schema = {
    name: Joi.string()
      .required()
      .max(50)
      .label("Name"),
    description: Joi.string()
      .max(300)
      .required()
      .min(10)
      .label("Description"),
    start_date: Joi.string()
      .required()
      .label("Start Date"),
    end_date: Joi.string()
      .label("End Date")
      .required(),
    fee: Joi.string()
      .label("Fee")
      .regex(/^[0-9.]*$/)
      .required(),
    min_size: Joi.string()
      .label("Minimum Team Size")
      .required()
      .regex(/^[0-9]*$/),
    max_size: Joi.string()
      .label("Maximum Team Size")
      .required()
      .regex(/^[0-9]*$/),
    judges: Joi.string()
      .label("Judges")
      .required(),
    sponsors: Joi.string().label("Sponsors"),
    discount: Joi.string()
      .label("Discount")
      .regex(/^[0-9]*$/)
  };

  doSubmit = e => {
    console.log("dfjdsfskdhf")
    console.log(this.state);

    var startDateLocale = this.state.data.start_date;
    var startDate = moment(startDateLocale, "YYYY-MM-DD").toDate();

    var endDateLocale = this.state.data.end_date;
    var endDate = moment(endDateLocale, "YYYY-MM-DD").toDate();

    var data = {
      name: this.state.data.name,
      description: this.state.data.description,
      startDate: startDate,
      endDate: endDate,
      fee: this.state.data.fee,
      minSize: this.state.data.min_size,
      maxSize: this.state.data.max_size,
      judges: this.state.judges,
      sponsors:this.state.x,
      discount: this.state.discounts
    };

    console.log("data to send",data);
    var id = getJWTID();
    setHeader();
    axios
      .post(rootUrl + "/hackathons", data)
      .then(response => {
        window.alert("Hackathon created successfully.");
        this.props.history.push("/hackathons");
      });
  };

  render() {
    let redirectVar = null;
    var id = getJWTID();
    if (!id) {
      redirectVar = <Redirect to="/home" />;
    }
    return (
      <div className="create-hack-container">
        {redirectVar}
        <Navbar />
        <hr />

        <div className="org-body">
          <form>
            <div className="org-information">
              <h3>Hackathon Information</h3>
              <br />
              <label>Name </label>
              <input
                type="text"
                name="name"
                required
                className="form-control"
                autoFocus
                placeholder="Name"
                onChange={this.handleChange}
                error={this.state.errors.name}
              />
              {this.state.errors.name && (
                <div className="red">{this.state.errors.name} </div>
              )}
              <label>Description</label>
              <textarea
                required
                name="description"
                placeholder="Description"
                className="form-control"
                onChange={this.handleChange}
                error={this.state.errors.description}
              />
              {this.state.errors.description && (
                <div className="red">{this.state.errors.description} </div>
              )}
              <label>Start Date</label>
              <input
                type="date"
                required
                name="start_date"
                className="form-control"
                onChange={this.handleChange}
                error={this.state.errors.start_date}
              />
              {this.state.errors.start_date && (
                <div className="red">{this.state.errors.start_date} </div>
              )}
              <label>End Date</label>
              <input
                required
                type="date"
                name="end_date"
                className="form-control"
                onChange={this.handleChange}
                error={this.state.errors.end_date}
              />
              {this.state.errors.end_date && (
                <div className="red">{this.state.errors.end_date} </div>
              )}
              <label>Entry Fee</label>
              <input
                type="number"
                name="fee"
                required
                className="form-control"
                placeholder="Fee in USD"
                onChange={this.handleChange}
                error={this.state.errors.fee}
              />
              {this.state.errors.fee && (
                <div className="red">{this.state.errors.fee} </div>
              )}
              <label>Minimum coders</label>
              <input
                type="text"
                name="min_size"
                required
                className="form-control"
                placeholder="Minimum Team Size (inclusive)"
                onChange={this.handleChange}
                error={this.state.errors.min_size}
              />
              {this.state.errors.min_size && (
                <div className="red">{this.state.errors.min_size} </div>
              )}
              <label>Maximum coders</label>
              <input
                type="text"
                name="max_size"
                required
                className="form-control"
                placeholder="Maximum Team Size (inclusive)"
                onChange={this.handleChange}
                error={this.state.errors.max_size}
              />
              {this.state.errors.max_size && (
                <div className="red">{this.state.errors.max_size} </div>
              )}
              <label>Judges</label>
              <Select isMulti options={this.state.allJudges} onChange={this.handleSelectionChange} />
                <br/>

              {/* {this.state.errors.judges && (
                <div className="red">{this.state.errors.judges} </div>
              )} */}
              <label>Sponsors (Optional)</label>

              {
                this.state.sponsors.map((sponsor,i)=>{
                  return(
                    <div class="input-group mb-3" key={i}>
                      <Select className="css-1pcexqc-container-spon"  options={this.state.allSponsors} onChange={(e)=>{this.handleSponsorSelection(e,i)}} /> 
                       <input 
                        required
                        className="form-control"
                        placeholder="discount"
                        style={{marginLeft: "12px", borderRadius: "4px", height: "59px",  marginTop: "0px"}}
                      onChange={(e)=>this.handleDiscountChange(e,i)}
                      value ={this.state.discounts[i]}
                      />
                    <div class="input-group-append" style={{    marginTop: "-11px"}}>  
                      <button class="btn btn-primary btn-remove" onClick={(e)=>this.removeSponsor(e,i)}>Remove</button>
                    </div>
                    </div>
                  )
                })
              }
              <br/>
              <button className="btn-add" onClick={(e)=>this.addSponsor(e)}>Add Sponsor </button>
           
            </div>
            <div>
              <button
                type="submit"
                style={{ marginLeft: "41%", width: "fit-content" }}
                className="btn btn-primary"
                onClick={this.handleSubmit}
              >
                Post Hackathon
              </button>{" "}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CreateHackathon;
