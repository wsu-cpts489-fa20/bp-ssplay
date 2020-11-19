import React from 'react';
import { Navbar, Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

class RatesModal extends React.Component {
    constructor(){
        super();

        this.state={
                      id: ""
                   };
        }

        // Get information of the course that was selected on render
        componentDidMount(){
            this.getSearchedCourse(this.props.course);
        }

        // Get information of the course that was selected to show rates information
        getSearchedCourse = async (id) => {
            const url = '/courses/'+id;
            fetch(url)
            .then((response) => {
                if (response.status == 200)
                    return response.json();
                else
                {
                    throw Error(response.statusText);
                }
            })
            .then((obj) => 
            {
                console.log("GET RATES SUCCESS!");
                let thisCourse = JSON.parse(obj);
                this.setState({
                    courseName: thisCourse.courseName,
                    id: thisCourse.id,
                    course: (
                        <Col  style={{marginTop: "20px", marginBottom: "50px"}}>
                            <Card key={thisCourse.id} style={{ width: "30rem", display: "flex" }}>
                            <Card.Img className="course-image" variant="top" src={thisCourse.picture}></Card.Img>
                            <Card.Body>
                                <Card.Title>Location: {thisCourse.location}</Card.Title>
                                <Card.Text>RATES: ALL WEEK</Card.Text>
                                <Card.Text>STANDARD: ${thisCourse.rateStandard}</Card.Text>
                                <Card.Text>SENIOR: ${thisCourse.rateSenior}</Card.Text>
                            </Card.Body>
                            <Card.Footer>Rates and policies are subject to change without notice.</Card.Footer>
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
        <div id="ratesModal" className="modal" role="dialog">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
            <h3>{this.state.courseName}</h3>
                <button className="modal-close" onClick={this.props.handleClose}>
                    &times;
                </button>
            </div>
            <center>
            <div className="modal-body">
                <Container fluid={true}>
                    <Row noGutters>
                        {this.state.course}
                    </Row>
                </Container>
            </div>
                </center>
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

export default RatesModal;