import React from 'react';
import { Navbar, Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

class MoreModal extends React.Component {

constructor(){
    super();
    this.state={
        id: ""
    };
}

componentDidMount(){
    this.getSearchedCourse(this.props.course);
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
                    </Card>
                </Col>
            )
        });
    }).catch((error) =>{
        console.log(error);
    });
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
            <div className="modal-body">
                <Container fluid={true}>
                    <Row noGutters>
                        {this.state.course}
                    </Row>
                </Container>
            </div>
            <div className="modal-footer">
                <button className="btn btn-primary btn-color-theme"
                onClick={this.props.handleClose}>OK</button>
                </div>
            </div>
        </div>
        </div>
    );
    }
}

export default MoreModal;