import React from 'react';
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

    toggleGetRatesClicked = (key) => {
        this.setState({item: key});
        this.setState(state => ({getRatesButtonClicked: !state.getRatesButtonClicked}));
    }

    toggleBookTeeTimeClicked = (key) => {
        this.setState({item: key});
        this.setState(state => ({bookTeeTimeClicked: !state.bookTeeTimeClicked}));
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
                            <Card.Title>{c.courseName}</Card.Title>
                            <Card.Text>Record Holder: {c.recordHolder}</Card.Text>
                            {this.setState({item: c.id})}
                            <Button type="button" onClick={() => this.toggleMoreClicked(c.id)}>More</Button>&nbsp;
                            <Button type="button" onClick={() => this.toggleGetRatesClicked(c.id)}>Get Rates</Button>&nbsp;
                            <Button type="button" onClick={() => this.toggleBookTeeTimeClicked(c.id)}>Book Tee Time</Button>&nbsp;
                        </Card.Body>
                        <Card.Footer>Rating: {c.rating}</Card.Footer>
                        </Card>
                    </Col>
                ))
            });

            // this.renderCourses(thisCourse);
            // console.log(thisCourse);
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
                    <BookingPage handleClose={this.toggleBookTeeTimeClicked} 
                        course={this.state.item} changeMode={this.props.changeMode} 
                        refreshOnUpdate={this.props.refreshOnUpdate} mode={this.props.mode} 
                    />
                    : null}
            </div>
            );
    }   
}

export default AllCourses;