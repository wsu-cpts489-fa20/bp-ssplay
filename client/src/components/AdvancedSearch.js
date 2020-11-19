import React from 'react';
import { Navbar, Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

class AdvancedSearch extends React.Component {
    constructor(){
        super();

        this.state={
            rating: "",
            yardage: "",
            runningDistance: "",
            timePar: "",
            rateStandard: "",
            rateSenior: "",
            searchType: "",
            allCourses: [],
            filteredCourses: []
        };
    }

    // Get information on all courses at render
    componentDidMount(){
        this.getCourse();
    }

    // Get information on all courses for searching purposes
    getCourse = async () => {
        const url = '/allcourses/';
        fetch(url)
        .then((response) => {
            if (response.status == 200)
                return response.json();
            else
            {
                this.setErrorMsg("ERROR: " + response.statusText);
                throw Error(response.statusText);
            }
        })
        .then((obj) => 
        {
            console.log("GET SUCCESS!");
            let thisCourse = JSON.parse(obj);
            let table = [];
            for (var i = 0; i < thisCourse.length; i++)
            {
                table.push(thisCourse[i]);
            }
            
            this.setState({allCourses: table});
            // console.log(this.state.allCourses);
        }).catch((error) =>{
            console.log("GET ERROR!");
        });
    }

    handleChange = (event) =>{
        this.setState({[event.target.name]: event.target.value});
    }

    // Query what to show depending on form that was submitted
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.searchStart();
        let type = this.state.searchType;
        let len = this.state.allCourses.length;
        let c = this.state.allCourses;
        let table = [];
        switch (type){
            case "rates":
                for (var i = 0; i < len; i++)
                {
                    if (c[i].rateSenior === this.state.rateSenior || c[i].rateStandard === this.state.rateStandard)
                    {
                        table.push(c[i]);
                    }
                }
                break;
            case "rating":
                for (var i = 0; i < len; i++)
                {
                    if (c[i].rating === this.state.rating)
                    {
                        table.push(c[i]);
                    }
                }
                break;
            case "yardage":
                for (var i = 0; i < len; i++)
                {
                    if (c[i].yardage === this.state.yardage)
                    {
                        table.push(c[i]);
                    }
                }
                break;
            case "runningDistance":
                for (var i = 0; i < len; i++)
                {
                    if (c[i].runningDistance === this.state.runningDistance)
                    {
                        table.push(c[i]);
                    }
                }
                break;
            case "timePar":
                for (var i = 0; i < len; i++)
                {
                    if (c[i].timePar === this.state.timePar)
                    {
                        table.push(c[i]);
                    }
                }
                break;
        }
        console.log(table.length);
        this.props.setCourseAmount(table.length);
        this.props.setFilteredData(table);
        this.props.handleClose();
    }

    // toggling between different forms of advanced search
    handleSwitch = (type) => {
        if (type === "rates")
        {
            return (
                <form onSubmit={this.handleSubmit}>
                    <center>
                    <label>
                        Standard Rate: $<br></br>
                        <input id="rateStandard" name="rateStandard" placeholder="rateStandard" value={this.state.rateStandard} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <label>
                        Senior Rate: $<br></br>
                        <input id="rateSenior" name="rateSenior" placeholder="rateSenior" value={this.state.rateSenior} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    </center>
                </form>
            );
        }
        else if (type === "rating"){
            return (
                <form onSubmit={this.handleSubmit}>
                    <center>
                    <label>
                        Rating:<br></br>
                        <input id="rating" name="rating" placeholder="rating" value={this.state.rating} onChange={this.handleChange}></input>
                    </label>
                    <p></p> 
                    </center>
                </form>
            );
        }
        else if (type === "yardage"){
            return (
                <form onSubmit={this.handleSubmit}>
                    <center>
                    <label>
                        Yardage:<br></br>
                        <input id="yardage" name="yardage"  placeholder="yardage" value={this.state.yardage} onChange={this.handleChange}></input>
                    </label>
                    <p></p>  
                    </center>
                </form>
            );
        }
        else if (type === "runningDistance"){
            return (
                <form onSubmit={this.handleSubmit}>
                    <center>
                    <label>
                        Running Distance:<br></br>
                        <input id="runningDistance" name="runningDistance"  placeholder="runningDistance" value={this.state.runningDistance} onChange={this.handleChange}></input>
                    </label>
                    <p></p> 
                    </center>
                </form>
            );
        }
        else if (type === "timePar"){
            return (
                <form onSubmit={this.handleSubmit}>
                    <center>
                    <label>
                        Time Par:<br></br>
                        <input id="timePar" name="timePar"  placeholder="timePar" value={this.state.timePar} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    </center>
                </form>
            );
        }
    }

    render (){
        return(
        <div id="advancedSearchPage" className="modal" role="dialog">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Advanced Search</h3>
                        <button className="modal-close" onClick={this.props.handleClose}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <label>Search By:&nbsp;
                            <select id="searchOptions" name="searchType" value={this.state.searchType} 
                                className="form-control form-center" onChange={this.handleChange}>
                                <option></option>
                                <option value="rates">Rates</option>
                                <option id="RATING" value="rating">Ratings</option>
                                <option value="yardage">Holes Yardage</option>
                                <option value="runningDistance">Running Distance</option>
                                <option value="timePar">Time Pars</option>
                            </select> 
                            </label>
                            <p></p>
                        </form>
                        {this.handleSwitch(this.state.searchType)}
                    </div>
                    <div className="modal-footer">
                        {this.state.searchType !== "" ? 
                        <button onClick={this.handleSubmit} id="submitBtn" type="submit" style={{width: "70%",fontSize: "36px"}} 
                            className="btn btn-primary btn-color-theme">
                            &nbsp;Submit
                        </button> : null}
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default AdvancedSearch;