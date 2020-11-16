import React from 'react';
import AppMode from "./../AppMode.js";
import { Navbar, Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { async } from 'regenerator-runtime';

class MoreModal extends React.Component {

constructor(){
    super();
    this.state={
        id: "",
        reviewClicked: false,
        review: "",
        rating: ""
    };
}

componentDidMount(){
    this.getSearchedCourse(this.props.course);
}

toggleReviewClicked = () =>{
    this.setState(state =>({reviewClicked: !state.reviewClicked}));
}

getSearchedCourse = async (id) => {
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
            id: thisCourse.id,
            rating: thisCourse.rating,
            review: thisCourse.review,
            picture: thisCourse.picture,
            location: thisCourse.location,
            yardage: thisCourse.yardage,
            runningDistance: thisCourse.runningDistance,
            timePar: thisCourse.timePar,
            bestScore: thisCourse.bestScore,
            recordHolder: thisCourse.recordHolder,
            course: (
                <Col  style={{marginTop: "20px", marginBottom: "50px"}}>
                    <Card key={thisCourse.id} style={{ width: "30rem", display: "flex" }}>
                    <Card.Img className="course-image" variant="top" src={thisCourse.picture}></Card.Img>
                    <Card.Body>
                        <Card.Title>Location: {thisCourse.location}</Card.Title>
                        <Card.Text>Review: {thisCourse.review}</Card.Text>
                        <Card.Text>Yardage: {thisCourse.yardage}</Card.Text>
                        <Card.Text>Running Distance: {thisCourse.runningDistance}</Card.Text>
                        <Card.Text>Time Par: {thisCourse.timePar}</Card.Text>
                        <Card.Text>Best Score: {thisCourse.bestScore}</Card.Text>
                        <Card.Text>Record Holder: {thisCourse.recordHolder}</Card.Text>
                    </Card.Body>
                    <Card.Footer>Rating: {thisCourse.rating}</Card.Footer>
                    <Button onClick={this.toggleReviewClicked}>Leave A Review:</Button>
                    </Card>
                </Col>
            )
        });
    }).catch((error) =>{
        console.log(error);
    });
}

editCourse = async (newData) =>{
    const url = '/courses/' + this.state.id;
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
        method: 'PUT',
        body: JSON.stringify(newData)}); 
    const msg = await res.text();
    console.log(msg);
    if (res.status === 200) {
        this.toggleReviewClicked();
        this.props.handleClose();
        if (this.props.mode === AppMode.COURSES)
            this.props.refreshOnUpdate(AppMode.COURSES);
        else 
            this.props.refreshOnUpdate(AppMode.COURSES_ALL);
        // this.props.changeMode(AppMode.COURSES_ALL);
    } else {
        this.props.refreshOnUpdate(AppMode.COURSES_ALL);
    }
}

handleSubmit = (event) =>{
    event.preventDefault();
    let newData = {
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
    }

    this.editCourse(newData);

}

handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
}

render() {
    return (
        <div className="modal" role="dialog">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h3>{this.state.id}</h3>
                <button className="modal-close" onClick={this.props.handleClose}>
                    &times;
                </button>
            </div>
            {this.state.reviewClicked ? 
                <div className="modal" role="dialog">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h3>Leaving A Review</h3>
                        <button className="modal-close" onClick={this.toggleReviewClicked}>
                            &times;
                        </button>
                    </div>
                <div className="modal-body">
                    <form onSubmit={this.handleSubmit}>
                    <Container fluid={true}>
                        <Row noGutters>
                        <label>Rating:
                        <select name="rating" value={this.state.rating} 
                        className="form-control form-center" onChange={this.handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        </select> 
                        </label>
                        <p></p>
                        <label>Review:
                        <textarea name="review" className="form-control" rows="6" cols="75" 
                            placeholder="Enter round notes" value={this.state.review} 
                            onChange={this.handleChange} />
                        </label>
                        <p></p>
                        <Button type="submit">Submit Review</Button>
                        </Row>
                    </Container>
                    </form>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary btn-color-theme"
                    onClick={this.toggleReviewClicked}>OK</button>
                    </div>
                </div>
                </div>
                </div>
            :null}
            <div className="modal-body">
                <Container fluid={true}>
                    <Row noGutters>
                        {this.state.course}
                    </Row>
                </Container>
            </div>
            {/* <div className="modal-footer">
                <button className="btn btn-primary btn-color-theme"
                onClick={this.props.handleClose}>OK</button>
            </div> */}
            </div>
        </div>
        </div>
    );
    }
}

export default MoreModal;