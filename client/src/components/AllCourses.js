import React from 'react';
import { Navbar, Container, Row, Col, Card, Button } from "react-bootstrap";
import RatesModal from "./RatesModal.js";
import MoreModal from "./MoreModal.js";

class AllCourses extends React.Component {

    constructor(){
        super();
    
        this.state={
            item: "",
            getCourseClicked: false,
            getRatesButtonClicked: false,
            more: false
        };
    }

    componentDidMount(){
        this.getCourse();
    }
    
    toggleGetCourseClicked = () => {
        this.setState(state => ({getCourseClicked: !state.getCourseClicked}));
    }

    toggleMoreClicked = (key) => {
        this.setState({item: key});
        this.setState(state => ({more: !state.more}));
    }

    toggleGetRatesClicked = () => {
        this.setState(state => ({getRatesButtonClicked: !state.getRatesButtonClicked}));
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

            this.setState({
                course: thisCourse.map((c) =>(
                    <Col  style={{marginTop: "20px", marginBottom: "50px"}}>
                        <Card key={c.id} style={{ width: "30rem", display: "flex" }}>
                        <Card.Img className="course-image" variant="top" src={c.picture}></Card.Img>
                        <Card.Body>
                            <Card.Title>Location: {c.location}</Card.Title>
                            <Card.Text>Review: {c.review}</Card.Text>
                            <Button type="button" onClick={() => this.toggleMoreClicked(c.id)}>More</Button>
                            <Button onClick={this.toggleGetRatesClicked}>Get Rates</Button>
                        </Card.Body>
                        <Card.Footer>Rating: {c.rating}</Card.Footer>
                        </Card>
                    </Col>
                ))
            });

            // this.renderCourses(thisCourse);
            console.log(thisCourse);
        }).catch((error) =>{
            console.log("GET ERROR!");
        });
    }

    render() {
        return(
            <div>
              <h1></h1>
              <table >
                <tbody>
                <Container fluid={true}>
                    <Row noGutters>                    
                        {this.state.course}
                    </Row>
                </Container> 
                </tbody>
              </table>
              {this.state.getRatesButtonClicked ? 
                <RatesModal handleClose={this.toggleGetRatesClicked} />
                : null}
                {this.state.more ? 
                <MoreModal handleClose={this.toggleMoreClicked} 
                    course={this.state.item}
                />
                : null}
            </div>
            );
    }   
}

export default AllCourses;