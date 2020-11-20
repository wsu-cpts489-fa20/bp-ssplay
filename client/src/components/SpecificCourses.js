import React from 'react';
import ReactTooltip from "react-tooltip";
import { Navbar, Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import FloatingButton from "./FloatingButton.js";
import RatesModal from "./RatesModal.js";
import MoreModal from "./MoreModal.js";
import BookingPage from "./BookingPage.js";
import AdvancedSearch from "./AdvancedSearch.js";

class SpecificCourses extends React.Component {

    constructor(){
        super();

        this.state={
            addCourseClicked: false,
            getCourseClicked: false,
            searchCourseClicked: false,
            searchStart: false,
            getRatesButtonClicked: false,
            bookTeeTimeClicked: false,
            advancedSearchClicked: false,
            more: false,
            selectButtonValue: "Select Course",
            courseAmount: 1,
            query: "",
            data: [],
            filteredData: [],
            item: "",
            
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

    componentWillMount() {
        this.getCourse();
    }

    toggleAddCourseClicked = () => {
        this.setState(state => ({addCourseClicked: !state.addCourseClicked}));
    }

    toggleAdvancedSearchClicked = () => {
        this.setState(state => ({advancedSearchClicked: !state.advancedSearchClicked}));
    }

    toggleMoreClicked = (key) => {
        this.setState({item: key});
        this.setState(state => ({more: !state.more}));
    }

    toggleGetCourseClicked = () => {
        this.setState(state => ({getCourseClicked: !state.getCourseClicked}));
    }

    toggleGetRatesClicked = (key) => {
        this.setState({item: key});
        this.setState(state => ({getRatesButtonClicked: !state.getRatesButtonClicked}));
    }

    toggleBookTeeTimeClicked = (key) => {
        this.setState({item: key});
        this.setState(state => ({bookTeeTimeClicked: !state.bookTeeTimeClicked}));
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

    setCourseAmount = (x) => {
        this.setState({courseAmount: x});
    }

    setSearchCourseClickedTrue = () => {
        this.setState({searchCourseClicked : true});
        this.setSelectButtonValue("Clear Selected");
    }

    setSearchCourseClickedFalse = () => {
        this.setState({searchCourseClicked : false});
        this.setSelectButtonValue("Select Course");
    }

    // Show courses that were selected when user searches
    setFilteredData = (newData) => {
        this.setState({
            course: newData.map((c) =>(
                <Col  style={{marginTop: "20px", marginBottom: "50px"}}>
                    <Card key={c.id} style={{ width: "30rem", display: "flex" }}>
                    <Card.Img className="course-image" variant="top" src={c.picture}></Card.Img>
                    <Card.Body>
                        <Card.Title>{c.courseName}</Card.Title>
                        <Card.Text>Record Holder: {c.recordHolder}</Card.Text>
                        <Button type="button" onClick={() => this.toggleMoreClicked(c.id)}>More</Button>&nbsp;
                        <Button onClick={() => this.toggleGetRatesClicked(c.id)}>Get Rates</Button>&nbsp;
                        <Button onClick={() => this.toggleBookTeeTimeClicked(c.id)}>Book Tee Time</Button>&nbsp;
                    </Card.Body>
                    <Card.Footer>Rating: {c.rating}</Card.Footer>
                    </Card>
                </Col>
            ))
        });
    }

    // Handles changing the name of the Select Button to the appropriate values
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
              this.setCourseAmount(filteredData.length);
          }

          return {
            query,
            filteredData
          };
        });

    };

    // Retrieve information for all courses for searching usage
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

    // Retrieve information of 1 course provided an id
    getSearchedCourse = async (id) => {
        this.setSearchCourseClickedTrue();
        this.setSearchFalse();
        this.setCourseAmount(1);
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
                            <Card.Title>{thisCourse.courseName}</Card.Title>
                            <Card.Text>Record Holder: {thisCourse.recordHolder}</Card.Text>
                            <Button type="button" onClick={() => this.toggleMoreClicked(thisCourse.id)}>More</Button>&nbsp;
                            <Button onClick={() => this.toggleGetRatesClicked(thisCourse.id)}>Get Rates</Button>&nbsp;
                            <Button onClick={() => this.toggleBookTeeTimeClicked(thisCourse.id)}>Book Tee Time</Button>&nbsp;
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

    // Handle event when user clicks into 1 of the choices provided when searching for a course
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
                            <Card.Title>{c.courseName}</Card.Title>
                            <Card.Text>Record Holder: {c.recordHolder}</Card.Text>
                            <Button type="button" onClick={() => this.toggleMoreClicked(c.id)}>More</Button>&nbsp;
                            <Button onClick={() => this.toggleGetRatesClicked(c.id)}>Get Rates</Button>&nbsp;
                            <Button onClick={() => this.toggleBookTeeTimeClicked(c.id)}>Book Tee Time</Button>&nbsp;
                        </Card.Body>
                        <Card.Footer>Rating: {c.rating}</Card.Footer>
                        </Card>
                    </Col>
                ))
            });
        }
    }

    render() {
        return (
            <div id="specificCoursePage">
                <div style={{display: 'flex'}}>
                    <h3>Find Speedgolf-Friendly Courses:&nbsp;</h3>
                    <h3>
                        <a data-tip="React-tooltip">&#9432;</a>
                        <ReactTooltip variant="bottom" effect="solid">
                            <span>
                                Enter search term or course name to see matching courses, or enter a space to see ALL courses in the database.
                                Click on course in the list to select it, or click on 'Select' button to select all matching courses.
                            </span>
                        </ReactTooltip>
                    </h3>
                </div>

                <input style={{width: '60%'}} placeholder="Enter course name or search term"
                 value={this.state.query} onChange={this.handleInputChange}
                 disabled={this.state.searchCourseClicked ? true:false}></input>&nbsp;
                <Button onClick={this.handleClick}>{this.state.selectButtonValue}</Button>&nbsp;
                <Button id="advancedSearchBtn" onClick={this.toggleAdvancedSearchClicked} disabled={this.state.searchCourseClicked ? true:false}>Advanced Search</Button>
                {this.state.searchStart ? <div>{this.state.filteredData.map(i => <a className="course-search-list" onClick={() => this.getSearchedCourse(i.id)}>{i.id}</a>)}</div> : null}
                
                {this.state.searchCourseClicked ? <div style={{marginTop: "50px"}}><h3>{this.state.courseAmount} Course Selected: </h3>
                <Container fluid={true}>
                    <Row noGutters>  
                        {this.state.course}
                    </Row>
                </Container>  </div>               
                 : null}


                {this.state.advancedSearchClicked ? 
                    <AdvancedSearch handleClose={this.toggleAdvancedSearchClicked}
                    searchStart={this.setSearchCourseClickedTrue}
                    toggleMoreClicked={this.toggleMoreClicked}
                    toggleGetRatesClicked={this.toggleGetRatesClicked}
                    toggleBookTeeTimeClicked={this.toggleBookTeeTimeClicked}
                    course={this.state.item}  changeMode={this.props.changeMode} 
                    refreshOnUpdate={this.props.refreshOnUpdate} mode={this.props.mode} 
                    setFilteredData={this.setFilteredData}
                    setCourseAmount={this.setCourseAmount}
                    />
                    : null}
                {this.state.getRatesButtonClicked ? 
                    <RatesModal handleClose={this.toggleGetRatesClicked}
                    course={this.state.item}  changeMode={this.props.changeMode} 
                    refreshOnUpdate={this.props.refreshOnUpdate} mode={this.props.mode} 
                    />
                    : null}
                {this.state.more ? 
                    <MoreModal handleClose={this.toggleMoreClicked} 
                        course={this.state.item}  changeMode={this.props.changeMode} 
                        refreshOnUpdate={this.props.refreshOnUpdate} mode={this.props.mode} 
                    />
                    : null}
                {this.state.bookTeeTimeClicked ? 
                    <BookingPage handleClose={this.toggleBookTeeTimeClicked} 
                        course={this.state.item} changeMode={this.props.changeMode} 
                        refreshOnUpdate={this.props.refreshOnUpdate} mode={this.props.mode} 
                    />
                    : null}
            </div>
        );
    }   
}

export default SpecificCourses;