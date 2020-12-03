import React from 'react';
import AppMode from '../AppMode';
import { Navbar, Container, Row, Col, Card, Button } from "react-bootstrap";
import { async } from 'regenerator-runtime';
import PaymentDialog from './PaymentDialog';

class MyAppointments extends React.Component {

    constructor(){
        super();
    
        this.state={
            matched: false,
            payClicked: false
        };
    }

    // Get information of all courses on render
    componentDidMount(){
        this.getMyAppointments();
    }

    toggleSetMatched = (s) => {
        this.setState(state => ({matched: !state.matched}));
    }

    togglePayClicked = () => {
        this.setState(state => ({payClicked: !state.payClicked}));
    }

    handleDeleteAll = (user, course, d, t, i) =>{
        this.handleDelete(user, course, d, t, i);
        this.handleDeleteFromDB(user, course, d, t);
    }

    handleAllPayment = (mid, aid, u, c, d, t, p) => {
        if (p === "true")
            alert("You've already paid!");
        else{
            this.setState({info: {
                mmId: mid,
                userId: aid,
                username: u,
                courseName: c,
                date: d,
                time: t,
                paid: p
            }});
            this.togglePayClicked();
            // this.handlePayment(aid, u, c, d, t, p);
            // this.handleUserPayment(mid, aid, u, c, d, t, p);
        }
    }   

    handleUserPayment = async (mid, aid, u, c, d, t, p) => {
        let newData = {
            userId: aid,
            username: u,
            courseName: c,
            date: d,
            time: t,
            paid: "true"
        }
        const url = '/appointments/'+this.props.userObj.id+'/'+mid;
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
            alert("Paid");
            this.getMyAppointments();
        } else {
            this.props.refreshOnUpdate(AppMode.COURSES_MYAPPT);
        }
    }

    handlePayment = async(aid, u, c, d, t, p) => {
        let newData = {
            userId: aid,
            username: u,
            courseName: c,
            date: d,
            time: t,
            paid: "true"
        }
        const url = '/appointments_op/'+u+'/'
                                        +c+'/'
                                        +d+'/'
                                        +t;
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
            alert("Paid");
            this.getMyAppointments();
        } else {
            this.props.refreshOnUpdate(AppMode.COURSES_MYAPPT);
        }
    }

    // Delete course with this id from database
    handleDelete = async (u, c, d, t, i) => {
        const url = '/appointments/'+u+'/'+c+'/'+d+'/'+t+'/'+i;
        const res = await fetch(url, {method: 'DELETE'}); 
        const msg = await res.text();
        console.log(msg);
        if (res.status == 200) {
            console.log("APPOINTMENT CANCELLED");
            this.getMyAppointments();
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
            this.getMyAppointments();
        } else {
            alert(msg);
        }  
    }

    // Get information of all courses to show on page
    getMyAppointments = async () => {
        const url = '/appointments/'+this.props.userObj.id;
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
                            <Button style={{float: 'right'}} onClick={() => this.handleAllPayment(c._id, c.userId, c.username, c.courseName, c.date, c.time, c.paid)}>{c.paid === "true" ? "Paid": "Pay"}</Button>
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
            <div id="myAppointmentsPage">
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
                {this.state.payClicked ? <PaymentDialog userObj={this.props.userObj} info={this.state.info}
                toggleSetMatched={this.toggleSetMatched} close={this.togglePayClicked}
                handleUserPayment={this.handleUserPayment} handlePayment={this.handlePayment}></PaymentDialog> :null}
        </div>
        );
    }
}

export default MyAppointments;