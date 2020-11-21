import React from 'react';
import { Navbar, Container, Row, Col, Card, Button } from "react-bootstrap";

class AllAppointments extends React.Component {

    constructor(){
        super();
    
        this.state={
            deleteClicked: false
        };
    }

    // Get information of all courses on render
    componentDidMount(){
        this.getCourse();
    }

    toggleDeleteClicked = () => {
        this.setState(state => ({deleteClicked: !state.deleteClicked}));
    }

    // Delete course with this id from database
    handleDelete = async (key) => {
        const url = '/courses/' + key;
        const res = await fetch(url, {method: 'DELETE'}); 
        const msg = await res.text();
        console.log(msg);
        if (res.status == 200) {
            for (var i = 0; i < this.state.filteredData.length; i++)
            {
                if (this.state.filteredData[i].id === key)
                {
                    this.state.course.splice(i, 1);
                    this.setState({
                        course: this.state.course
                    });
                }
            }
        } else {
            alert(msg);
        }  
    }

    // Get information of all courses to show on page
    getCourse = async () => {
        const url = '/allappointments_op/';
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
                filteredData: thisCourse,
                course: thisCourse.map((c) =>(
                    <Col  style={{marginTop: "20px", marginBottom: "50px"}}>
                        <Card key={c.userId} style={{ width: "30rem", display: "flex" }}>                      
                        <Card.Body>
                            <Card.Title>Appointment for {c.username}</Card.Title>
                            <Card.Text>Location: {c.courseName}</Card.Text>
                            <Card.Text>On: {c.date}</Card.Text>
                            <Card.Text>At: {c.time}</Card.Text>
                        </Card.Body>
                        </Card>
                    </Col>
                ))
            });
        }).catch((error) =>{
            console.log("GET ERROR!");
        });
    }

    render() {
        return(
            <div id="allAppointmentsPage">
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
        </div>
        );
    }
}

export default AllAppointments;