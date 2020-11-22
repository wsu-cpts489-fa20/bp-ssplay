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
        this.getAllAppointments();
    }

    toggleDeleteClicked = () => {
        this.setState(state => ({deleteClicked: !state.deleteClicked}));
    }

    handleDeleteAll = (user, course, d, t, i) =>{
        this.handleDelete(user, course, d, t, i);
        this.handleDeleteFromDB(user, course, d, t);
    }

    // Delete course with this id from database
    handleDelete = async (u, c, d, t, i) => {
        const url = '/appointments/'+u+'/'+c+'/'+d+'/'+t+'/'+i;
        const res = await fetch(url, {method: 'DELETE'}); 
        const msg = await res.text();
        console.log(msg);
        if (res.status == 200) {
            console.log("APPOINTMENT CANCELLED");
            this.getAllAppointments();
        } else {
            alert(msg);
        }  
    }

    handleDeleteFromDB = async(u, c, d, t) => {
        const url = '/appointments_op/'+u+'/'+c+'/'+d+'/'+t;
        const res = await fetch(url, {method: 'DELETE'}); 
        const msg = await res.text();
        console.log(msg);
        if (res.status == 200) {
            console.log("APPOINTMENT CANCELLED");
            this.getAllAppointments();
        } else {
            alert(msg);
        }  
    }

    // Get information of all courses to show on page
    getAllAppointments = async () => {
        const url = '/allappointments_op/';
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
            console.log("GET SUCCESS!");
            let thisCourse = JSON.parse(obj);
            this.setState({
                course: thisCourse.map((c) =>(
                    <Col  style={{marginTop: "20px", marginBottom: "50px"}}>
                        <Card key={c.userId} style={{ width: "30rem", display: "flex" }}>                      
                        <Card.Body>
                            <Button style={{float: 'right'}} onClick={() => this.handleDeleteAll(c.username, c.courseName, c.date, c.time, c.userId)}>&times;</Button>
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