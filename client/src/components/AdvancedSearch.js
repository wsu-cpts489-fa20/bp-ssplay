import React from 'react';

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
            searchType: ""
        };
    }

    componentDidMount(){
        this.getCourse();
    }

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
            // for (var i = 0; i < thisCourse.length; i++)
            //     console.log(thisCourse[i].courseName);
            // this.setState({
            //     course: thisCourse.map((c) =>(
            //         <Col  style={{marginTop: "20px", marginBottom: "50px"}}>
            //             <Card key={c.id} style={{ width: "30rem", display: "flex" }}>
            //             <Card.Img className="course-image" variant="top" src={c.picture}></Card.Img>
            //             <Card.Body>
            //                 <Card.Title>{c.courseName}</Card.Title>
            //                 <Card.Text>Record Holder: {c.recordHolder}</Card.Text>
            //                 {this.setState({item: c.id})}
            //                 <Button type="button" onClick={() => this.toggleMoreClicked(c.id)}>More</Button>&nbsp;
            //                 <Button type="button" onClick={() => this.toggleGetRatesClicked(c.id)}>Get Rates</Button>&nbsp;
            //                 <Button type="button" onClick={() => this.toggleBookTeeTimeClicked(c.id)}>Book Tee Time</Button>&nbsp;
            //             </Card.Body>
            //             <Card.Footer>Rating: {c.rating}</Card.Footer>
            //             </Card>
            //         </Col>
            //     ))
            // });
        }).catch((error) =>{
            console.log("GET ERROR!");
        });
    }

    handleChange = (event) =>{
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log("SUBMIT ADVANCED SEARCH!");
    }

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
                    <button id="submitBtn" type="submit" style={{width: "70%",fontSize: "36px"}} 
                        className="btn btn-primary btn-color-theme">
                        &nbsp;Submit
                    </button>
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
                    <button id="submitBtn" type="submit" style={{width: "70%",fontSize: "36px"}} 
                        className="btn btn-primary btn-color-theme">
                        &nbsp;Submit
                    </button>
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
                    <button id="submitBtn" type="submit" style={{width: "70%",fontSize: "36px"}} 
                        className="btn btn-primary btn-color-theme">
                        &nbsp;Submit
                    </button>
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
                    <button id="submitBtn" type="submit" style={{width: "70%",fontSize: "36px"}} 
                        className="btn btn-primary btn-color-theme">
                        &nbsp;Submit
                    </button>
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
                    <button id="submitBtn" type="submit" style={{width: "70%",fontSize: "36px"}} 
                        className="btn btn-primary btn-color-theme">
                        &nbsp;Submit
                    </button>
                    </center>
                </form>
            );
        }
    }

    render (){
        return(
        <div className="modal" role="dialog">
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
                            <select name="searchType" value={this.state.searchType} 
                                className="form-control form-center" onChange={this.handleChange}>
                                <option></option>
                                <option value="rates">Rates</option>
                                <option value="rating">Ratings</option>
                                <option value="yardage">Holes Yardage</option>
                                <option value="runningDistance">Running Distance</option>
                                <option value="timePar">Time Pars</option>
                            </select> 
                            </label>
                            <p></p>
                        </form>
                        {this.handleSwitch(this.state.searchType)}
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default AdvancedSearch;