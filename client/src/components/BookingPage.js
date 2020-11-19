import React from 'react';
import AppMode from '../AppMode';

let today = new Date();
let tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
let thirdDay = new Date(tomorrow);
thirdDay.setDate(thirdDay.getDate() + 1);
let fourthDay = new Date(thirdDay);
fourthDay.setDate(fourthDay.getDate() + 1);
let fifthDay = new Date(fourthDay);
fifthDay.setDate(fifthDay.getDate() + 1);
let sixthDay = new Date(fifthDay);
sixthDay.setDate(sixthDay.getDate() + 1);
let seventhDay = new Date(sixthDay);
seventhDay.setDate(seventhDay.getDate() + 1);

let day1 = today.toISOString().substring(0,10);
let day2 = tomorrow.toISOString().substring(0,10);
let day3 = thirdDay.toISOString().substring(0,10);
let day4 = fourthDay.toISOString().substring(0,10);
let day5 = fifthDay.toISOString().substring(0,10);
let day6 = sixthDay.toISOString().substring(0,10);
let day7 = seventhDay.toISOString().substring(0,10);


class BookingPage extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            courseName: this.props.course,
            bookingTime: '',
            bookingDate: day1,
            course: ''
        }
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
                throw Error(response.statusText);
            }
        })
        .then((obj) => 
        {
            console.log("GET SEARCH COURSES SUCCESS!");
            let thisCourse = JSON.parse(obj);
            this.setState({
                course: thisCourse
            });
        }).catch((error) =>{
            console.log(error);
        });
    }

    handleBookTeeTime = (event) => {
        event.preventDefault();
        console.log("Booking tee time");
        let newData = {
            appointments: this.state.course.appointments,
            courseName: this.state.course.courseName,
            id: this.state.course.id,
            rating: this.state.course.rating,
            review: this.state.course.review,
            picture: this.state.course.picture,
            location: this.state.course.location,
            yardage: this.state.course.yardage,
            runningDistance: this.state.course.runningDistance,
            timePar: this.state.course.timePar,
            bestScore: this.state.course.bestScore,
            recordHolder: this.state.course.recordHolder,
            rateSenior: this.state.course.rateSenior,
            rateStandard: this.state.course.rateStandard
        }

        switch(this.state.bookingDate){
            case day1:
                newData.appointments.day1[this.state.bookingTime] = false;
                this.editCourse(newData);
                break;
            case day2:
                newData.appointments.day2[this.state.bookingTime] = false;
                this.editCourse(newData);
                break;
            case day3:
                newData.appointments.day3[this.state.bookingTime] = false;
                this.editCourse(newData);
                break;
            case day4:
                newData.appointments.day4[this.state.bookingTime] = false;
                this.editCourse(newData);
                break;
            case day5:
                newData.appointments.day5[this.state.bookingTime] = false;
                this.editCourse(newData);
                break;
            case day6:
                newData.appointments.day6[this.state.bookingTime] = false;
                this.editCourse(newData);
                break;
            case day7:
                newData.appointments.day7[this.state.bookingTime] = false;
                this.editCourse(newData);
                break;
        }
        this.props.handleClose();
    }

    
    editCourse = async (newData) =>{
        const url = '/courses/' + this.props.course;
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
            // this.toggleReviewClicked();
            // this.props.handleClose();
            alert("Tee Time Booked!");
            if (this.props.mode === AppMode.COURSES)
                this.props.refreshOnUpdate(AppMode.COURSES);
            else 
                this.props.refreshOnUpdate(AppMode.COURSES_ALL);
        } else {
            this.props.refreshOnUpdate(AppMode.COURSES_ALL);
        }
    }


    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleClose = () =>{

    }

    render() {
        return (
            <div className="modal" role="dialog">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                <div className="modal-header">
                    <h3>Booking Tee Time</h3>
                    {/* <button className="modal-close" onClick={this.props.handleClose}>
                        &times;
                    </button> */}
                </div>
                <div className="modal-body">
                <div className="padded-page">
                    <form onSubmit={this.handleBookTeeTime}>
                    <center>
                        <h1>Request Tee Time at {this.state.courseName}</h1><br></br>
                        <label for="bookingDate">Date: <br></br>
                            <input type="date" id="bookingDate" name="bookingDate" min={day1} max={day7} value={this.state.bookingDate} onChange={this.handleChange} required></input>
                        </label>
                        <p></p>
                        <label for="bookingTime">Time: <br></br>
                        <select type="date" id="bookingTime" name="bookingTime" value={this.state.bookingTime} onChange={this.handleChange} required>
                            <option></option>
                            {/* disabled={!this.state.course.appointments.day1[0]} */}
                            <option value="0">9:00 AM</option>
                            <option value="1">10:00 AM</option>
                            <option value="2">11:00 AM</option>
                            <option value="3">12:00 PM</option> 
                            <option value="4">1:00 PM</option>
                            <option value="5">2:00 PM</option> 
                            <option value="6">3:00 PM</option>
                            <option value="7">4:00 PM</option>
                            <option value="8">5:00 PM</option>    
                        </select>
                        </label>
                        <p></p>
                        <button className="btn btn-primary btn-color-theme modal-submit-btn">Request Tee Time</button>
                        <button onClick={this.props.handleClose} className="btn btn-primary btn-color-theme modal-submit-btn">Cancel</button>
                    </center>
                    </form>
                </div>
                </div>
                <div className="modal-footer">
                    {/* <button className="btn btn-primary btn-color-theme"
                    onClick={this.props.close}>OK</button> */}
                </div>
                </div>
            </div>
            </div>
       
        );
    }   
}

export default BookingPage;