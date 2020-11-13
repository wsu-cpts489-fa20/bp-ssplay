import React from 'react';
import ReactTooltip from "react-tooltip";
import { Navbar, Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import FloatingButton from "./FloatingButton.js";
import RatesModal from "./RatesModal.js";

class SpecificCourses extends React.Component {

    constructor(){
        super();

        this.state={
            addCourseClicked: false,
            getCourseClicked: false,
            searchCourseClicked: false,
            searchStart: false,
            getRatesButtonClicked: false,
            selectButtonValue: "Select Course",
            query: "",
            data: [],
            filteredData: [],
            id: "",
            rating: "",
            review: "",
            picture: "",
            location: "",
            yardage: "",
            runningDistance: "",
            timePar: "",
            bestScore: "",
            recordHolder: ""
        };
    }

    setGetRatesTrue = () => {
        this.setState({getRatesButtonClicked : true});
    }

    setSelectButtonValue = (newVal) => {
        this.setState({selectButtonValue : newVal});
    }

    setSearchTrue = () => {
        this.setState({searchStart : true});
    }

    setSearchFalse = () => {
        this.setState({searchStart : false});
    }

    setSearchCourseClickedTrue = () => {
        this.setState({searchCourseClicked : true});
        this.setSelectButtonValue("Clear Selected");
    }

    setSearchCourseClickedFalse = () => {
        this.setState({searchCourseClicked : false});
        this.setSelectButtonValue("Select Course");
    }

    componentWillMount() {
        this.getCourse();
    }

    handleInputChange = event => {
        const query = event.target.value;
        this.setState(prevState => {
          const filteredData = prevState.data.filter(element => {
            return element.id.toLowerCase().includes(query.toLowerCase());
          });

          if (query == "")
          {
              this.setSearchFalse();
              this.setSelectButtonValue("Select Course");
          }
          else
          {
              this.setSearchTrue();
              this.setSelectButtonValue("Select All "+ filteredData.length +" Matching Courses");
          }

          return {
            query,
            filteredData
          };
        });

    };

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
            console.log("GET ALL COURSES SUCCESS!");
            let data = JSON.parse(obj);
            const { query } = this.state;
            const filteredData = data.filter(element => {
              return element.id.toLowerCase().includes(query.toLowerCase());
            });
    
            this.setState({
              data,
              filteredData
            });
        }).catch((error) =>{
            console.log("GET ERROR!");
        });
    }

    getSearchedCourse = async (id) => {
        this.setSearchCourseClickedTrue();
        this.setSearchFalse();
        const url = '/courses/'+id;
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
            console.log("GET SEARCH COURSES SUCCESS!");
            let thisCourse = JSON.parse(obj);
            this.setState({
                course: (
                    <Col  style={{marginTop: "20px", marginBottom: "50px"}}>
                        <Card key={thisCourse.id} style={{ width: "30rem", display: "flex" }}>
                        <Card.Img className="course-image" variant="top" src={thisCourse.picture}></Card.Img>
                        <Card.Body>
                            <Card.Title>Location: {thisCourse.location}</Card.Title>
                            <Card.Text>Review: {thisCourse.review}</Card.Text>
                            <Button onClick={this.toggleGetRatesClicked}>Get Rates</Button>
                        </Card.Body>
                        <Card.Footer>Rating: {thisCourse.rating}</Card.Footer>
                        </Card>
                    </Col>
                )
            });
        }).catch((error) =>{
            console.log(error);
        });
    }

    toggleAddCourseClicked = () => {
        this.setState(state => ({addCourseClicked: !state.addCourseClicked}));
    }

    toggleGetCourseClicked = () => {
        this.setState(state => ({getCourseClicked: !state.getCourseClicked}));
    }

    toggleGetRatesClicked = () => {
        this.setState(state => ({getRatesButtonClicked: !state.getRatesButtonClicked}));
    }
f
    addCourse = async (newData) => {
        console.log(newData);
        const url = '/courses/' + this.state.id;
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(newData)}); 
        const msg = await res.text();
        if (res.status == 200) {
            console.log("SUCCESS");
            console.log(msg);
            // this.setState({errorMsg: msg});
            // this.props.changeMode(AppMode.COURSE);
        } else {
            console.log("FAILURE");
            console.log(msg);
            // this.setState({errorMsg: ""});
            // this.props.refreshOnUpdate(AppMode.COURSE);
        }
    }


    handleSubmit = (event) => {
        event.preventDefault();
        let courseData = {
            id: this.state.id,
            rating: this.state.rating,
            review: this.state.review,
            picture: this.state.picture,
            location: this.state.location,
            yardage: this.state.yardage,
            runningDistance: this.state.runningDistance,
            timePar: this.state.timePar,
            bestScore: this.state.bestScore,
            recordHolder: this.state.recordHolder
        };
        this.addCourse(courseData);

    }

    handleClick = (event) =>{
        event.preventDefault();

        if (this.state.selectButtonValue == "Select Course")
        {

        }
        else if (this.state.selectButtonValue == "Clear Selected")
        {
            this.setSearchCourseClickedFalse();
            this.setSearchFalse();
            this.setState({query: ""});
        }
        else{
            this.setSearchCourseClickedTrue();
            this.setSearchFalse();
            this.setState({
                course: this.state.filteredData.map((c) =>(
                    <Col  style={{marginTop: "20px", marginBottom: "50px"}}>
                        <Card key={c.id} style={{ width: "30rem", display: "flex" }}>
                        <Card.Img className="course-image" variant="top" src={c.picture}></Card.Img>
                        <Card.Body>
                            <Card.Title>Location: {c.location}</Card.Title>
                            <Card.Text>Review: {c.review}</Card.Text>
                            <Button onClick={this.toggleGetRatesClicked}>Get Rates</Button>
                        </Card.Body>
                        <Card.Footer>Rating: {c.rating}</Card.Footer>
                        </Card>
                    </Col>
                ))
            });
        }
    }

    handleChange = (event) =>{
        this.setState({[event.target.name]: event.target.value});
    }

    getRates = () => {

    }

    render() {
        return (
            <div>
                <div style={{display: 'flex'}}>
                    <h3>Find Speedgolf-Friendly Courses:&nbsp;</h3>
                    <h3>
                        <a data-tip="React-tooltip">&#9432;</a>
                        <ReactTooltip effect="solid">
                            <span>
                                Enter search term or course name to see matching courses, or enter a space to see ALL courses in the database.
                                Click on course in the list to select it, or click on 'Select' button to select all matching courses.
                            </span>
                        </ReactTooltip>
                    </h3>
                </div>

                <input style={{width: '60%'}} placeholder="Enter course name or search term"
                 value={this.state.query} onChange={this.handleInputChange}
                 disabled={this.state.searchCourseClicked ? true:false}></input>
                <button onClick={this.handleClick}>{this.state.selectButtonValue}</button>
                {/* <button onClick={this.toggleAddCourseClicked}>Add Course</button> */}
                {this.state.searchStart ? <div>{this.state.filteredData.map(i => <a className="course-search-list" onClick={() => this.getSearchedCourse(i.id)}>{i.id}</a>)}</div> : null}
                {this.state.searchCourseClicked ? <div style={{marginTop: "50px"}}><h3>1 Course Selected: </h3>
                <Container fluid={true}>
                    <Row noGutters>  
                        {this.state.course}
                    </Row>
                </Container>  </div>               
                 : null}

                {/* {this.state.addCourseClicked ? 
                <form onSubmit={this.handleSubmit}>
                    <h3>Add Course</h3>
                    <input name="id" placeholder="id" value={this.state.id} onChange={this.handleChange}></input>
                    <input name="rating" placeholder="rating" value={this.state.rating} onChange={this.handleChange}></input>
                    <input name="review"  placeholder="review" value={this.state.review} onChange={this.handleChange}></input>
                    <input name="picture"  placeholder="picture" value={this.state.picture} onChange={this.handleChange}></input>
                    <input name="location"  placeholder="location" value={this.state.location} onChange={this.handleChange}></input>
                    <input name="yardage"  placeholder="yardage" value={this.state.yardage} onChange={this.handleChange}></input>
                    <input name="runningDistance"  placeholder="runningDistance" value={this.state.runningDistance} onChange={this.handleChange}></input>
                    <input name="timePar"  placeholder="timePar" value={this.state.timePar} onChange={this.handleChange}></input>
                    <input name="bestScore"  placeholder="bestScore" value={this.state.bestScore} onChange={this.handleChange}></input>
                    <input name="recordHolder"  placeholder="recordHolder" value={this.state.recordHolder} onChange={this.handleChange}></input>
                    <button>Submit</button>
                </form>
                : null} */}

                {/* <FloatingButton handleClick={this.toggleGetRatesClicked}/> */}
                {this.state.getRatesButtonClicked ? 
                <RatesModal handleClose={this.toggleGetRatesClicked} />
                : null}
            </div>
        );
    }   
}

export default SpecificCourses;