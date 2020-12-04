import React from 'react';
import AppMode from '../AppMode';

// For setting min and max value of <input type="date">
let today = new Date(Date.now()-(new Date()).getTimezoneOffset()*60000);
let seventhDay = new Date(today);
seventhDay.setDate(seventhDay.getDate() + 6);

let day1 = today.toISOString().substring(0,10);
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
        this.getAllAppointments();
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
                appointments: thisCourse.map((c) =>(
                    {
                        username: c.username,
                        courseName: c.courseName,
                        date: c.date,
                        time: c.time
                    }
                ))
            });
        }).catch((error) =>{
            console.log("GET ERROR!");
        });
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

        let newappt = {
            userId: this.props.userObj.id,
            username: this.props.userObj.displayName,
            courseName: this.props.courseName,
            date: this.state.bookingDate,
            time: this.state.bookingTime,
            paid: "false"
        }

        this.addAppointment(newappt);
        this.addAppointment_op(newappt);
        alert("Tee Time Booked!");
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
        document.getElementById("9:00 AM").removeAttribute("disabled");
        document.getElementById("10:00 AM").removeAttribute("disabled");
        document.getElementById("11:00 AM").removeAttribute("disabled");
        document.getElementById("12:00 PM").removeAttribute("disabled");
        document.getElementById("1:00 PM").removeAttribute("disabled");
        document.getElementById("2:00 PM").removeAttribute("disabled");
        document.getElementById("3:00 PM").removeAttribute("disabled");
        document.getElementById("4:00 PM").removeAttribute("disabled");
        document.getElementById("5:00 PM").removeAttribute("disabled");

        console.log(this.state.appointments);
        for (var i = 0; i < this.state.appointments.length; i++)
        {
            if ((this.state.bookingDate === this.state.appointments[i].date) && (this.state.course.courseName === this.state.appointments[i].courseName))
            {
                switch(this.state.appointments[i].time){
                    case "9:00 AM":
                        document.getElementById("9:00 AM").setAttribute("disabled",true);
                        break;
                    case "10:00 AM":
                        document.getElementById("10:00 AM").setAttribute("disabled",true);
                        break;
                    case "11:00 AM":
                        document.getElementById("11:00 AM").setAttribute("disabled",true);
                        break;
                    case "12:00 PM":
                        document.getElementById("12:00 PM").setAttribute("disabled",true);
                        break;
                    case "1:00 PM":
                        document.getElementById("1:00 PM").setAttribute("disabled",true);
                        break;
                    case "2:00 PM":
                        document.getElementById("2:00 PM").setAttribute("disabled",true);
                        break;
                    case "3:00 PM":
                        document.getElementById("3:00 PM").setAttribute("disabled",true);
                        break;
                    case "4:00 PM":
                        document.getElementById("4:00 PM").setAttribute("disabled",true);
                        break;
                    case "5:00 PM":
                        document.getElementById("5:00 PM").setAttribute("disabled",true);
                        break;
                }
            }
        }
    }

    render() {
        return (
            <div id="bookingPage" className="modal" role="dialog">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                <div className="modal-header">
                    <h3>Booking Tee Time</h3>
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
                            <option id="9:00 AM" value="9:00 AM">9:00 AM</option>
                            <option id="10:00 AM" value="10:00 AM">10:00 AM</option>
                            <option id="11:00 AM" value="11:00 AM">11:00 AM</option>
                            <option id="12:00 PM" value="12:00 PM">12:00 PM</option> 
                            <option id="1:00 PM" value="1:00 PM">1:00 PM</option>
                            <option id="2:00 PM" value="2:00 PM">2:00 PM</option> 
                            <option id="3:00 PM" value="3:00 PM">3:00 PM</option>
                            <option id="4:00 PM" value="4:00 PM">4:00 PM</option>
                            <option id="5:00 PM" value="5:00 PM">5:00 PM</option>    
                        </select>
                        </label>
                        <p></p>
                        <button className="btn btn-primary btn-color-theme modal-submit-btn">Request Tee Time</button>
                        <button onClick={this.props.handleClose} className="btn btn-primary btn-color-theme modal-submit-btn">Cancel</button>
                    </center>
                    </form>
                </div>
                </div>
                </div>
            </div>
            </div>
       
        );
    }   
}

export default BookingPage;