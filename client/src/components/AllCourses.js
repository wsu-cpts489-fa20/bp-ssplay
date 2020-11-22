import React from 'react';
import AppMode from "./../AppMode.js";
import { Navbar, Container, Row, Col, Card, Button } from "react-bootstrap";
import RatesModal from "./RatesModal.js";
import MoreModal from "./MoreModal.js";
import BookingPage from "./BookingPage.js";

class AllCourses extends React.Component {

    constructor(){
        super();
    
        this.state={
            item: "",
            getCourseClicked: false,
            getRatesButtonClicked: false,
            bookTeeTimeClicked: false,
            more: false,
            index: 0,
            cname: ''
        };
    }

    // Get information of all courses on render
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

    toggleGetRatesClicked = (key) => {
        this.setState({item: key});
        this.setState(state => ({getRatesButtonClicked: !state.getRatesButtonClicked}));
    }

    toggleBookTeeTimeClicked = (key, i, cn) => {
        this.setState({item: key});
        this.setState({index: i});
        this.setState({cname: cn});
        this.setState(state => ({bookTeeTimeClicked: !state.bookTeeTimeClicked}));
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
        const url = '/allcourses/';
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
                filteredData: thisCourse,
                course: thisCourse.map((c, index) =>(
                    <Col  style={{marginTop: "20px", marginBottom: "50px"}}>
                        <Card key={c.id} style={{ width: "30rem", display: "flex" }}>                      
                        <Card.Img className="course-image" variant="top" src={c.picture}></Card.Img>
                        <Card.Body>
                            <Card.Title>{c.courseName}</Card.Title>
                            <Card.Text>Record Holder: {c.recordHolder}</Card.Text>
                            {this.setState({item: c.id})}
                            <Button id="moreBtn" type="button" onClick={() => this.toggleMoreClicked(c.id)}>More</Button>&nbsp;
                            <Button id="ratesBtn" type="button" onClick={() => this.toggleGetRatesClicked(c.id)}>Get Rates</Button>&nbsp;
                            <Button id="bookingBtn" type="button" onClick={() => this.toggleBookTeeTimeClicked(c.id, index, c.courseName)}>Book Tee Time</Button>&nbsp;
                            {this.props.userObj.type === "operator" ? 
                            <Button style={{display: 'flex', float: 'right'}} onClick={() => this.handleDelete(c.id)}>&times;</Button>
                            : null}
                        </Card.Body>
                        <Card.Footer>Rating: {c.rating}</Card.Footer>
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
            <div id="allCoursesPage">
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
                    <RatesModal handleClose={this.toggleGetRatesClicked} 
                    course={this.state.item} changeMode={this.props.changeMode} 
                    refreshOnUpdate={this.props.refreshOnUpdate} mode={this.props.mode} 
                    />
                    : null}
                {this.state.more ? 
                    <MoreModal handleClose={this.toggleMoreClicked}
                        course={this.state.item} changeMode={this.props.changeMode} 
                        refreshOnUpdate={this.props.refreshOnUpdate} mode={this.props.mode} 
                    />
                    : null}
                {this.state.bookTeeTimeClicked ? 
                    <BookingPage handleClose={this.toggleBookTeeTimeClicked} userObj={this.props.userObj} courseName={this.state.cname}
                        course={this.state.item} changeMode={this.props.changeMode} editId={this.state.index}
                        refreshOnUpdate={this.props.refreshOnUpdate} mode={this.props.mode} info={this.props.info}
                    />
                    : null}
            </div>
            );
    }   
}

export default AllCourses;