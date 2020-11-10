import React from 'react';
import { Navbar, Container, Row, Col, Card, Button } from "react-bootstrap";

class AllCourses extends React.Component {

    constructor(){
        super();
    
        this.state={
            getCourseClicked: false
        };
    }

    componentDidMount(){
        this.getCourse();
    }
    
    toggleGetCourseClicked = () => {
        this.setState(state => ({getCourseClicked: !state.getCourseClicked}));
    }
    getCourse = async () => {
        let course = "a";
        const url = '/courses/' + course;
        fetch(url)
        .then((response) => {
            if (response.status == 200)
                return response.json();
            else
            {
                this.setErrorMsg("ERROR: " + course + " " + response.statusText);
                throw Error(response.statusText);
            }
        })
        .then((obj) => 
        {
            console.log("GET SUCCESS!");
            let thisCourse = JSON.parse(obj);

            this.setState({
                course: thisCourse.map((c) =>(
                // <tr key={c.id}>
                //     <td>{c.location}</td>
                //     <td>{c.picture}</td>
                //     <td>{c.review}</td>
                //     <td>{c.rating}</td>
                // </tr> 
                <Container fluid={true}>
                <Row noGutters>
                    <Col>
                    <Card key={c.id} style={{ width: "30rem", display: "flex" }}>
                    <Card.Img className="apartment-image" variant="top" src={c.picture}></Card.Img>
                    <Card.Body>
                        <Card.Title>{c.location}</Card.Title>
                        <Card.Text>{c.review}</Card.Text>
                    </Card.Body>
                    <Card.Footer>{c.rating}</Card.Footer>
                    </Card>
                    </Col>
                </Row>
            </Container> 
                ))
            });

            // this.renderCourses(thisCourse);
            console.log(thisCourse);
        }).catch((error) =>{
            console.log("GET ERROR!");
        });
    }
    
    renderCourses = (courses) =>{
        console.log("Course length = ", courses.length);
        let table = [];
        for (let r = 0; r < courses.length; ++r) {
            table.push(
            <tr key={courses[r].id}>
                <td>{courses[r].location}</td>
                <td>{courses[r].picture}</td>
                <td>{courses[r].review}</td>
                <td>{courses[r].rating}</td>
            </tr> 
            // <Container fluid={true}>
            //     <Row noGutters>
            //         <Col>
            //         <Card key={courses[r].id} style={{ width: "30rem", display: "flex" }}>
            //         <Card.Img className="apartment-image" variant="top" src={courses[r].picture}></Card.Img>
            //         <Card.Body>
            //             <Card.Title>{courses[r].location}</Card.Title>
            //             <Card.Text>{courses[r].review}</Card.Text>
            //         </Card.Body>
            //         <Card.Footer>{courses[r].rating}</Card.Footer>
            //         </Card>
            //         </Col>
            //     </Row>
            // </Container> 
            );
        }
        return table;
    }

    render() {
        return(
            <div className="padded-page">
            {/* <Button onClick={this.toggleGetCourseClicked}>GET</Button> */}

              <h1></h1>
              <table className="table table-hover">
                <tbody>
                    {this.state.course}
                {/* {this.state.getCourseClicked ? this.getCourse() : null} */}
                </tbody>
              </table>
            </div>
            );
    }   
}

export default AllCourses;