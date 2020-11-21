import React from 'react';
import AppMode from '../AppMode';

// For setting min and max value of <input type="date">
// Also to later usage of actual booking tee time implementation
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
console.log(day1);
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

    // Get information on selected course on render
    componentDidMount(){
        this.getSearchedCourse(this.props.course);
    }

    // Get information on selected course then set it to a state for usage in this component
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

    // Checks for the date and time that were requested for booking
    // Then prepare data to send to the database
    // by calling editCourse(newData)
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

        let newappt = {
            userId: this.props.userObj.id,
            username: this.props.userObj.displayName,
            courseName: this.props.courseName,
            date: '',
            time: '',
            paid: false
        }

        switch(this.state.bookingDate){
            case day1:
                newData.appointments.day1[this.state.bookingTime] = false;
                newappt.date = day1;
                break;
            case day2:
                newData.appointments.day2[this.state.bookingTime] = false;
                newappt.date = day2;
                break;
            case day3:
                newData.appointments.day3[this.state.bookingTime] = false;
                newappt.date = day3;
                break;
            case day4:
                newData.appointments.day4[this.state.bookingTime] = false;
                newappt.date = day4;
                break;
            case day5:
                newData.appointments.day5[this.state.bookingTime] = false;
                newappt.date = day5;
                break;
            case day6:
                newData.appointments.day6[this.state.bookingTime] = false;
                newappt.date = day6;
                break;
            case day7:
                newData.appointments.day7[this.state.bookingTime] = false;
                newappt.date = day7;
                break;
        }
        switch(this.state.bookingTime){
            case '0':
                newappt.time = "9:00 AM";
                break;
            case '1':
                newappt.time = "10:00 AM";
                break;
            case '2':
                newappt.time = "11:00 AM";
                break;
            case '3':
                newappt.time = "12:00 PM";
                break;
            case '4':
                newappt.time = "1:00 PM";
                break;
            case '5':
                newappt.time = "2:00 PM";
                break;
            case '6':
                newappt.time = "3:00 PM";
                break;
            case '7':
                newappt.time = "4:00 PM";
                break;
            case '8':
                newappt.time = "5:00 PM";
                break;
        }
        this.addAppointment(newappt);
        this.addAppointment_op(newappt);
        this.editCourse(newData);
        this.props.handleClose();
    }

    // Sends a PUT request to the backend with the new information
    // new information here is the appointments that were scheduled
    addAppointment_op = async (newData) =>{
        const url = '/appointments_op/';
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(newData)}); 
        const msg = await res.text();
        console.log(msg);
        if (res.status === 200) {
            // this.toggleReviewClicked();
            // this.props.handleClose();
            alert("Appointment_op Added");
            if (this.props.mode === AppMode.COURSES)
                this.props.refreshOnUpdate(AppMode.COURSES);
            else 
                this.props.refreshOnUpdate(AppMode.COURSES_ALL);
        } else {
            this.props.refreshOnUpdate(AppMode.COURSES_ALL);
        }
    }

    // Sends a PUT request to the backend with the new information
    // new information here is the appointments that were scheduled
    addAppointment = async (newData) =>{
        const url = '/appointments/' + this.props.userObj.id;
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(newData)}); 
        const msg = await res.text();
        console.log(msg);
        if (res.status === 200) {
            // this.toggleReviewClicked();
            // this.props.handleClose();
            alert("Appointment Added");
            if (this.props.mode === AppMode.COURSES)
                this.props.refreshOnUpdate(AppMode.COURSES);
            else 
                this.props.refreshOnUpdate(AppMode.COURSES_ALL);
        } else {
            this.props.refreshOnUpdate(AppMode.COURSES_ALL);
        }
    }

    // Sends a PUT request to the backend with the new information
    // new information here is the appointments that were scheduled
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

    // Handles enabling/disabling the time slots option on each date
    // depending on the state of the appointments.day.time
    handleClick = () =>{
        document.getElementById("0").removeAttribute("disabled");
        document.getElementById("1").removeAttribute("disabled");
        document.getElementById("2").removeAttribute("disabled");
        document.getElementById("3").removeAttribute("disabled");
        document.getElementById("4").removeAttribute("disabled");
        document.getElementById("5").removeAttribute("disabled");
        document.getElementById("6").removeAttribute("disabled");
        document.getElementById("7").removeAttribute("disabled");
        document.getElementById("8").removeAttribute("disabled");

        switch(this.state.bookingDate){
            case day1:
                if (!this.state.course.appointments.day1[0])
                    document.getElementById("0").setAttribute("disabled",true);
                if (!this.state.course.appointments.day1[1])
                    document.getElementById("1").setAttribute("disabled",true);
                if (!this.state.course.appointments.day1[2])
                    document.getElementById("2").setAttribute("disabled",true);
                if (!this.state.course.appointments.day1[3])
                    document.getElementById("3").setAttribute("disabled",true);
                if (!this.state.course.appointments.day1[4])
                    document.getElementById("4").setAttribute("disabled",true);
                if (!this.state.course.appointments.day1[5])
                    document.getElementById("5").setAttribute("disabled",true);
                if (!this.state.course.appointments.day1[6])
                    document.getElementById("6").setAttribute("disabled",true);
                if (!this.state.course.appointments.day1[7])
                    document.getElementById("7").setAttribute("disabled",true);
                if (!this.state.course.appointments.day1[8])
                    document.getElementById("8").setAttribute("disabled",true);
                break;
            case day2:
                if (!this.state.course.appointments.day2[0])
                    document.getElementById("0").setAttribute("disabled",true);
                if (!this.state.course.appointments.day2[1])
                    document.getElementById("1").setAttribute("disabled",true);
                if (!this.state.course.appointments.day2[2])
                    document.getElementById("2").setAttribute("disabled",true);
                if (!this.state.course.appointments.day2[3])
                    document.getElementById("3").setAttribute("disabled",true);
                if (!this.state.course.appointments.day2[4])
                    document.getElementById("4").setAttribute("disabled",true);
                if (!this.state.course.appointments.day2[5])
                    document.getElementById("5").setAttribute("disabled",true);
                if (!this.state.course.appointments.day2[6])
                    document.getElementById("6").setAttribute("disabled",true);
                if (!this.state.course.appointments.day2[7])
                    document.getElementById("7").setAttribute("disabled",true);
                if (!this.state.course.appointments.day2[8])
                    document.getElementById("8").setAttribute("disabled",true);
                break;
            case day3:
                if (!this.state.course.appointments.day3[0])
                    document.getElementById("0").setAttribute("disabled",true);
                if (!this.state.course.appointments.day3[1])
                    document.getElementById("1").setAttribute("disabled",true);
                if (!this.state.course.appointments.day3[2])
                    document.getElementById("2").setAttribute("disabled",true);
                if (!this.state.course.appointments.day3[3])
                    document.getElementById("3").setAttribute("disabled",true);
                if (!this.state.course.appointments.day3[4])
                    document.getElementById("4").setAttribute("disabled",true);
                if (!this.state.course.appointments.day3[5])
                    document.getElementById("5").setAttribute("disabled",true);
                if (!this.state.course.appointments.day3[6])
                    document.getElementById("6").setAttribute("disabled",true);
                if (!this.state.course.appointments.day3[7])
                    document.getElementById("7").setAttribute("disabled",true);
                if (!this.state.course.appointments.day3[8])
                    document.getElementById("8").setAttribute("disabled",true);
                break;
            case day4:
                if (!this.state.course.appointments.day4[0])
                    document.getElementById("0").setAttribute("disabled",true);
                if (!this.state.course.appointments.day4[1])
                    document.getElementById("1").setAttribute("disabled",true);
                if (!this.state.course.appointments.day4[2])
                    document.getElementById("2").setAttribute("disabled",true);
                if (!this.state.course.appointments.day4[3])
                    document.getElementById("3").setAttribute("disabled",true);
                if (!this.state.course.appointments.day4[4])
                    document.getElementById("4").setAttribute("disabled",true);
                if (!this.state.course.appointments.day4[5])
                    document.getElementById("5").setAttribute("disabled",true);
                if (!this.state.course.appointments.day4[6])
                    document.getElementById("6").setAttribute("disabled",true);
                if (!this.state.course.appointments.day4[7])
                    document.getElementById("7").setAttribute("disabled",true);
                if (!this.state.course.appointments.day4[8])
                    document.getElementById("8").setAttribute("disabled",true);
                break;
            case day5:
                if (!this.state.course.appointments.day5[0])
                    document.getElementById("0").setAttribute("disabled",true);
                if (!this.state.course.appointments.day5[1])
                    document.getElementById("1").setAttribute("disabled",true);
                if (!this.state.course.appointments.day5[2])
                    document.getElementById("2").setAttribute("disabled",true);
                if (!this.state.course.appointments.day5[3])
                    document.getElementById("3").setAttribute("disabled",true);
                if (!this.state.course.appointments.day5[4])
                    document.getElementById("4").setAttribute("disabled",true);
                if (!this.state.course.appointments.day5[5])
                    document.getElementById("5").setAttribute("disabled",true);
                if (!this.state.course.appointments.day5[6])
                    document.getElementById("6").setAttribute("disabled",true);
                if (!this.state.course.appointments.day5[7])
                    document.getElementById("7").setAttribute("disabled",true);
                if (!this.state.course.appointments.day5[8])
                    document.getElementById("8").setAttribute("disabled",true);
                break;
            case day6:
                if (!this.state.course.appointments.day6[0])
                    document.getElementById("0").setAttribute("disabled",true);
                if (!this.state.course.appointments.day6[1])
                    document.getElementById("1").setAttribute("disabled",true);
                if (!this.state.course.appointments.day6[2])
                    document.getElementById("2").setAttribute("disabled",true);
                if (!this.state.course.appointments.day6[3])
                    document.getElementById("3").setAttribute("disabled",true);
                if (!this.state.course.appointments.day6[4])
                    document.getElementById("4").setAttribute("disabled",true);
                if (!this.state.course.appointments.day6[5])
                    document.getElementById("5").setAttribute("disabled",true);
                if (!this.state.course.appointments.day6[6])
                    document.getElementById("6").setAttribute("disabled",true);
                if (!this.state.course.appointments.day6[7])
                    document.getElementById("7").setAttribute("disabled",true);
                if (!this.state.course.appointments.day6[8])
                    document.getElementById("8").setAttribute("disabled",true);
                break;
            case day7:
                if (!this.state.course.appointments.day7[0])
                    document.getElementById("0").setAttribute("disabled",true);
                if (!this.state.course.appointments.day7[1])
                    document.getElementById("1").setAttribute("disabled",true);
                if (!this.state.course.appointments.day7[2])
                    document.getElementById("2").setAttribute("disabled",true);
                if (!this.state.course.appointments.day7[3])
                    document.getElementById("3").setAttribute("disabled",true);
                if (!this.state.course.appointments.day7[4])
                    document.getElementById("4").setAttribute("disabled",true);
                if (!this.state.course.appointments.day7[5])
                    document.getElementById("5").setAttribute("disabled",true);
                if (!this.state.course.appointments.day7[6])
                    document.getElementById("6").setAttribute("disabled",true);
                if (!this.state.course.appointments.day7[7])
                    document.getElementById("7").setAttribute("disabled",true);
                if (!this.state.course.appointments.day7[8])
                    document.getElementById("8").setAttribute("disabled",true);
                break;
        }
    }

    render() {
        return (
            <div id="bookingPage" className="modal" role="dialog">
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
                        <select type="date" id="bookingTime" name="bookingTime" value={this.state.bookingTime} onChange={this.handleChange} onClick={this.handleClick} required>
                            <option></option>
                            <option id="0" value="0">9:00 AM</option>
                            <option id="1" value="1">10:00 AM</option>
                            <option id="2" value="2">11:00 AM</option>
                            <option id="3" value="3">12:00 PM</option> 
                            <option id="4" value="4">1:00 PM</option>
                            <option id="5" value="5">2:00 PM</option> 
                            <option id="6" value="6">3:00 PM</option>
                            <option id="7" value="7">4:00 PM</option>
                            <option id="8" value="8">5:00 PM</option>    
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