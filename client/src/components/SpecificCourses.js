import React from 'react';
import ReactTooltip from "react-tooltip";
import { Navbar, Container, Row, Col, Card, Button } from "react-bootstrap";

class SpecificCourses extends React.Component {

    constructor(){
        super();

        this.state={
            addCourseClicked: false,
            getCourseClicked: false,
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

    toggleAddCourseClicked = () => {
        this.setState(state => ({addCourseClicked: !state.addCourseClicked}));
    }

    toggleGetCourseClicked = () => {
        this.setState(state => ({getCourseClicked: !state.getCourseClicked}));
    }

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

    handleChange = (event) =>{
        this.setState({[event.target.name]: event.target.value});
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
                <input style={{width: '60%'}} placeholder="Enter course name or search term"></input>
                <button>Select Course</button>


                <button onClick={this.toggleAddCourseClicked}>Add Course</button>
                {this.state.addCourseClicked ? 
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
                : null}

                {/* <Button onClick={this.toggleGetCourseClicked}>GET</Button> */}
                {/* <table>
                    <tbody>
                    {this.state.getCourseClicked ? this.getCourse() : null}
                    </tbody>
                </table> */}
                {/* <Container fluid={true}>
                    <Row noGutters>
                        <Col>
                            <tbody>
                            {this.state.getCourseClicked ? this.getCourse() : null}
                            </tbody>
                        </Col>
                    </Row>
                </Container> */}
                {/* <Container fluid={true}>
                    <Row noGutters>
                        <Col>
                            <Card style={{ width: "30rem", display: "flex" }}>
                                <Card.Img className="apartment-image" variant="top" src="http://brydencanyongolf.com/wp-content/uploads/2017/03/9th-Hole.jpg"></Card.Img>
                                <Card.Body>
                                    <Card.Title>Title</Card.Title>
                                    <Card.Text>Text</Card.Text>
                                </Card.Body>
                                <Card.Footer>Footer</Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </Container> */}
                
            </div>
        );
    }   
}

export default SpecificCourses;