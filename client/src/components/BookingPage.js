import React from 'react';
import AppMode from '../AppMode';

// For setting min and max value of <input type="date">
let today = new Date(Date.now()-(new Date()).getTimezoneOffset()*60000);
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
            course: '',
            setTeeTimeClick: false,
            teeTime: [], 
            nine: false,
            ten: false,
            eleven: false,
            twelve: false,
            one: false,
            two: false,
            three: false,
            four: false,
            five: false,
            setTimeAvailDate: day1
        }
    }

    // Get information on selected course on render
    componentDidMount(){
        this.getSearchedCourse(this.props.course);
        this.getAllAppointments();
    }

    toggleSetTeeTimeClicked = () => {
        this.setState(state => ({setTeeTimeClick: !state.setTeeTimeClick}));
        console.log(this.state.setTeeTimeClick);
        if(!this.state.setTeeTimeClick)
        {
            document.getElementById("bookingTeeTimeForm").setAttribute("hidden",true); 
        }
        else
        {
            document.getElementById("bookingTeeTimeForm").removeAttribute("hidden"); 
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

        console.log(this.state.course.availability);
        this.bruhFunction();
        let updateCourse = {
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
            rateStandard: this.state.course.rateStandard,
            courseName: this.state.course.courseName,
            availability: this.state.course.availability
        }
        console.log(this.state.course.availability);

        this.editCourse(updateCourse);
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
        document.getElementById("9:00 AM").setAttribute("hidden",true);
        document.getElementById("10:00 AM").setAttribute("hidden",true);
        document.getElementById("11:00 AM").setAttribute("hidden",true);
        document.getElementById("12:00 PM").setAttribute("hidden",true);
        document.getElementById("1:00 PM").setAttribute("hidden",true);
        document.getElementById("2:00 PM").setAttribute("hidden",true);
        document.getElementById("3:00 PM").setAttribute("hidden",true);
        document.getElementById("4:00 PM").setAttribute("hidden",true);
        document.getElementById("5:00 PM").setAttribute("hidden",true);

        console.log(this.state.course.availability);

        switch (this.state.bookingDate){
            case day1:
                for (var i = 0; i < this.state.course.availability.day1.length; i++)
                {
                    if (this.state.course.availability.day1[i])
                    {
                        switch (i){
                            case 0:
                                document.getElementById("9:00 AM").removeAttribute("hidden");
                                break;
                            case 1:
                                document.getElementById("10:00 AM").removeAttribute("hidden");
                                break;
                            case 2:
                                document.getElementById("11:00 AM").removeAttribute("hidden");
                                break;
                            case 3:
                                document.getElementById("12:00 PM").removeAttribute("hidden");
                                break;
                            case 4:
                                document.getElementById("1:00 PM").removeAttribute("hidden");
                                break;
                            case 5:
                                document.getElementById("2:00 PM").removeAttribute("hidden");
                                break;
                            case 6:
                                document.getElementById("3:00 PM").removeAttribute("hidden");
                                break;
                            case 7:
                                document.getElementById("4:00 PM").removeAttribute("hidden");
                                break;
                            case 8:
                                document.getElementById("5:00 PM").removeAttribute("hidden");
                                break;
                        }
                    }
                }
                break;
            case day2:
                for (var i = 0; i < this.state.course.availability.day2.length; i++)
                {
                    if (this.state.course.availability.day2[i])
                    {
                        switch (i){
                            case 0:
                                document.getElementById("9:00 AM").removeAttribute("hidden");
                                break;
                            case 1:
                                document.getElementById("10:00 AM").removeAttribute("hidden");
                                break;
                            case 2:
                                document.getElementById("11:00 AM").removeAttribute("hidden");
                                break;
                            case 3:
                                document.getElementById("12:00 PM").removeAttribute("hidden");
                                break;
                            case 4:
                                document.getElementById("1:00 PM").removeAttribute("hidden");
                                break;
                            case 5:
                                document.getElementById("2:00 PM").removeAttribute("hidden");
                                break;
                            case 6:
                                document.getElementById("3:00 PM").removeAttribute("hidden");
                                break;
                            case 7:
                                document.getElementById("4:00 PM").removeAttribute("hidden");
                                break;
                            case 8:
                                document.getElementById("5:00 PM").removeAttribute("hidden");
                                break;
                        }
                    }
                }
                break;
            case day3:
                for (var i = 0; i < this.state.course.availability.day3.length; i++)
                {
                    if (this.state.course.availability.day3[i])
                    {
                        switch (i){
                            case 0:
                                document.getElementById("9:00 AM").removeAttribute("hidden");
                                break;
                            case 1:
                                document.getElementById("10:00 AM").removeAttribute("hidden");
                                break;
                            case 2:
                                document.getElementById("11:00 AM").removeAttribute("hidden");
                                break;
                            case 3:
                                document.getElementById("12:00 PM").removeAttribute("hidden");
                                break;
                            case 4:
                                document.getElementById("1:00 PM").removeAttribute("hidden");
                                break;
                            case 5:
                                document.getElementById("2:00 PM").removeAttribute("hidden");
                                break;
                            case 6:
                                document.getElementById("3:00 PM").removeAttribute("hidden");
                                break;
                            case 7:
                                document.getElementById("4:00 PM").removeAttribute("hidden");
                                break;
                            case 8:
                                document.getElementById("5:00 PM").removeAttribute("hidden");
                                break;
                        }
                    }
                }
                break;
            case day4:
                for (var i = 0; i < this.state.course.availability.day4.length; i++)
                {
                    if (this.state.course.availability.day4[i])
                    {
                        switch (i){
                            case 0:
                                document.getElementById("9:00 AM").removeAttribute("hidden");
                                break;
                            case 1:
                                document.getElementById("10:00 AM").removeAttribute("hidden");
                                break;
                            case 2:
                                document.getElementById("11:00 AM").removeAttribute("hidden");
                                break;
                            case 3:
                                document.getElementById("12:00 PM").removeAttribute("hidden");
                                break;
                            case 4:
                                document.getElementById("1:00 PM").removeAttribute("hidden");
                                break;
                            case 5:
                                document.getElementById("2:00 PM").removeAttribute("hidden");
                                break;
                            case 6:
                                document.getElementById("3:00 PM").removeAttribute("hidden");
                                break;
                            case 7:
                                document.getElementById("4:00 PM").removeAttribute("hidden");
                                break;
                            case 8:
                                document.getElementById("5:00 PM").removeAttribute("hidden");
                                break;
                        }
                    }
                }
                break;
            case day5:
                for (var i = 0; i < this.state.course.availability.day5.length; i++)
                {
                    if (this.state.course.availability.day5[i])
                    {
                        switch (i){
                            case 0:
                                document.getElementById("9:00 AM").removeAttribute("hidden");
                                break;
                            case 1:
                                document.getElementById("10:00 AM").removeAttribute("hidden");
                                break;
                            case 2:
                                document.getElementById("11:00 AM").removeAttribute("hidden");
                                break;
                            case 3:
                                document.getElementById("12:00 PM").removeAttribute("hidden");
                                break;
                            case 4:
                                document.getElementById("1:00 PM").removeAttribute("hidden");
                                break;
                            case 5:
                                document.getElementById("2:00 PM").removeAttribute("hidden");
                                break;
                            case 6:
                                document.getElementById("3:00 PM").removeAttribute("hidden");
                                break;
                            case 7:
                                document.getElementById("4:00 PM").removeAttribute("hidden");
                                break;
                            case 8:
                                document.getElementById("5:00 PM").removeAttribute("hidden");
                                break;
                        }
                    }
                }
                break;
            case day6:
                for (var i = 0; i < this.state.course.availability.day6.length; i++)
                {
                    if (this.state.course.availability.day6[i])
                    {
                        switch (i){
                            case 0:
                                document.getElementById("9:00 AM").removeAttribute("hidden");
                                break;
                            case 1:
                                document.getElementById("10:00 AM").removeAttribute("hidden");
                                break;
                            case 2:
                                document.getElementById("11:00 AM").removeAttribute("hidden");
                                break;
                            case 3:
                                document.getElementById("12:00 PM").removeAttribute("hidden");
                                break;
                            case 4:
                                document.getElementById("1:00 PM").removeAttribute("hidden");
                                break;
                            case 5:
                                document.getElementById("2:00 PM").removeAttribute("hidden");
                                break;
                            case 6:
                                document.getElementById("3:00 PM").removeAttribute("hidden");
                                break;
                            case 7:
                                document.getElementById("4:00 PM").removeAttribute("hidden");
                                break;
                            case 8:
                                document.getElementById("5:00 PM").removeAttribute("hidden");
                                break;
                        }
                    }
                }
                break;
            case day7:
                for (var i = 0; i < this.state.course.availability.day7.length; i++)
                {
                    if (this.state.course.availability.day7[i])
                    {
                        switch (i){
                            case 0:
                                document.getElementById("9:00 AM").removeAttribute("hidden");
                                break;
                            case 1:
                                document.getElementById("10:00 AM").removeAttribute("hidden");
                                break;
                            case 2:
                                document.getElementById("11:00 AM").removeAttribute("hidden");
                                break;
                            case 3:
                                document.getElementById("12:00 PM").removeAttribute("hidden");
                                break;
                            case 4:
                                document.getElementById("1:00 PM").removeAttribute("hidden");
                                break;
                            case 5:
                                document.getElementById("2:00 PM").removeAttribute("hidden");
                                break;
                            case 6:
                                document.getElementById("3:00 PM").removeAttribute("hidden");
                                break;
                            case 7:
                                document.getElementById("4:00 PM").removeAttribute("hidden");
                                break;
                            case 8:
                                document.getElementById("5:00 PM").removeAttribute("hidden");
                                break;
                        }
                    }
                }
                break;
        }
    }

    bruhFunction = () => {
        switch (this.state.bookingDate){
            case day1:
                if (this.state.bookingTime === "9:00 AM")
                {
                    this.state.course.availability.day1[0] = false;
                }
                if (this.state.bookingTime === "10:00 AM")
                {
                    this.state.course.availability.day1[1] = false;
                }
                if (this.state.bookingTime === "11:00 AM")
                {
                    this.state.course.availability.day1[2] = false;
                }
                if (this.state.bookingTime === "12:00 PM")
                {
                    this.state.course.availability.day1[3] = false;
                }
                if (this.state.bookingTime === "1:00 PM")
                {
                    this.state.course.availability.day1[4] = false;
                }
                if (this.state.bookingTime === "2:00 PM")
                {
                    this.state.course.availability.day1[5] = false;
                }
                if (this.state.bookingTime === "3:00 PM")
                {
                    this.state.course.availability.day1[6] = false;
                }
                if (this.state.bookingTime === "4:00 PM")
                {
                    this.state.course.availability.day1[7] = false;
                }
                if (this.state.bookingTime === "5:00 PM")
                {
                    this.state.course.availability.day1[8] = false;
                }
                break;
            case day2:
                if (this.state.bookingTime === "9:00 AM")
                {
                    this.state.course.availability.day2[0] = false;
                }
                if (this.state.bookingTime === "10:00 AM")
                {
                    this.state.course.availability.day2[1] = false;
                }
                if (this.state.bookingTime === "11:00 AM")
                {
                    this.state.course.availability.day2[2] = false;
                }
                if (this.state.bookingTime === "12:00 PM")
                {
                    this.state.course.availability.day2[3] = false;
                }
                if (this.state.bookingTime === "1:00 PM")
                {
                    this.state.course.availability.day2[4] = false;
                }
                if (this.state.bookingTime === "2:00 PM")
                {
                    this.state.course.availability.day2[5] = false;
                }
                if (this.state.bookingTime === "3:00 PM")
                {
                    this.state.course.availability.day2[6] = false;
                }
                if (this.state.bookingTime === "4:00 PM")
                {
                    this.state.course.availability.day2[7] = false;
                }
                if (this.state.bookingTime === "5:00 PM")
                {
                    this.state.course.availability.day2[8] = false;
                }
                break;
            case day3:
                if (this.state.bookingTime === "9:00 AM")
                {
                    this.state.course.availability.day3[0] = false;
                }
                if (this.state.bookingTime === "10:00 AM")
                {
                    this.state.course.availability.day3[1] = false;
                }
                if (this.state.bookingTime === "11:00 AM")
                {
                    this.state.course.availability.day3[2] = false;
                }
                if (this.state.bookingTime === "12:00 PM")
                {
                    this.state.course.availability.day3[3] = false;
                }
                if (this.state.bookingTime === "1:00 PM")
                {
                    this.state.course.availability.day3[4] = false;
                }
                if (this.state.bookingTime === "2:00 PM")
                {
                    this.state.course.availability.day3[5] = false;
                }
                if (this.state.bookingTime === "3:00 PM")
                {
                    this.state.course.availability.day3[6] = false;
                }
                if (this.state.bookingTime === "4:00 PM")
                {
                    this.state.course.availability.day3[7] = false;
                }
                if (this.state.bookingTime === "5:00 PM")
                {
                    this.state.course.availability.day3[8] = false;
                }
                break;
            case day4:
                if (this.state.bookingTime === "9:00 AM")
                {
                    this.state.course.availability.day4[0] = false;
                }
                if (this.state.bookingTime === "10:00 AM")
                {
                    this.state.course.availability.day4[1] = false;
                }
                if (this.state.bookingTime === "11:00 AM")
                {
                    this.state.course.availability.day4[2] = false;
                }
                if (this.state.bookingTime === "12:00 PM")
                {
                    this.state.course.availability.day4[3] = false;
                }
                if (this.state.bookingTime === "1:00 PM")
                {
                    this.state.course.availability.day4[4] = false;
                }
                if (this.state.bookingTime === "2:00 PM")
                {
                    this.state.course.availability.day4[5] = false;
                }
                if (this.state.bookingTime === "3:00 PM")
                {
                    this.state.course.availability.day4[6] = false;
                }
                if (this.state.bookingTime === "4:00 PM")
                {
                    this.state.course.availability.day4[7] = false;
                }
                if (this.state.bookingTime === "5:00 PM")
                {
                    this.state.course.availability.day4[8] = false;
                }
                break;
            case day5:
                if (this.state.bookingTime === "9:00 AM")
                {
                    this.state.course.availability.day5[0] = false;
                }
                if (this.state.bookingTime === "10:00 AM")
                {
                    this.state.course.availability.day5[1] = false;
                }
                if (this.state.bookingTime === "11:00 AM")
                {
                    this.state.course.availability.day5[2] = false;
                }
                if (this.state.bookingTime === "12:00 PM")
                {
                    this.state.course.availability.day5[3] = false;
                }
                if (this.state.bookingTime === "1:00 PM")
                {
                    this.state.course.availability.day5[4] = false;
                }
                if (this.state.bookingTime === "2:00 PM")
                {
                    this.state.course.availability.day5[5] = false;
                }
                if (this.state.bookingTime === "3:00 PM")
                {
                    this.state.course.availability.day5[6] = false;
                }
                if (this.state.bookingTime === "4:00 PM")
                {
                    this.state.course.availability.day5[7] = false;
                }
                if (this.state.bookingTime === "5:00 PM")
                {
                    this.state.course.availability.day5[8] = false;
                }
                break;
            case day6:
                if (this.state.bookingTime === "9:00 AM")
                {
                    this.state.course.availability.day6[0] = false;
                }
                if (this.state.bookingTime === "10:00 AM")
                {
                    this.state.course.availability.day6[1] = false;
                }
                if (this.state.bookingTime === "11:00 AM")
                {
                    this.state.course.availability.day6[2] = false;
                }
                if (this.state.bookingTime === "12:00 PM")
                {
                    this.state.course.availability.day6[3] = false;
                }
                if (this.state.bookingTime === "1:00 PM")
                {
                    this.state.course.availability.day6[4] = false;
                }
                if (this.state.bookingTime === "2:00 PM")
                {
                    this.state.course.availability.day6[5] = false;
                }
                if (this.state.bookingTime === "3:00 PM")
                {
                    this.state.course.availability.day6[6] = false;
                }
                if (this.state.bookingTime === "4:00 PM")
                {
                    this.state.course.availability.day6[7] = false;
                }
                if (this.state.bookingTime === "5:00 PM")
                {
                    this.state.course.availability.day6[8] = false;
                }
                break;
            case day7:
                if (this.state.bookingTime === "9:00 AM")
                {
                    this.state.course.availability.day7[0] = false;
                }
                if (this.state.bookingTime === "10:00 AM")
                {
                    this.state.course.availability.day7[1] = false;
                }
                if (this.state.bookingTime === "11:00 AM")
                {
                    this.state.course.availability.day7[2] = false;
                }
                if (this.state.bookingTime === "12:00 PM")
                {
                    this.state.course.availability.day7[3] = false;
                }
                if (this.state.bookingTime === "1:00 PM")
                {
                    this.state.course.availability.day7[4] = false;
                }
                if (this.state.bookingTime === "2:00 PM")
                {
                    this.state.course.availability.day7[5] = false;
                }
                if (this.state.bookingTime === "3:00 PM")
                {
                    this.state.course.availability.day7[6] = false;
                }
                if (this.state.bookingTime === "4:00 PM")
                {
                    this.state.course.availability.day7[7] = false;
                }
                if (this.state.bookingTime === "5:00 PM")
                {
                    this.state.course.availability.day7[8] = false;
                }
                break;
        }

    }

    handleSetTeeTime = (e) => {
        e.preventDefault();

        switch (this.state.setTimeAvailDate){
            case day1:
                if (this.state.nine)
                {
                    this.state.course.availability.day1[0] = true;
                }
                if (this.state.ten)
                {
                    this.state.course.availability.day1[1] = true;
                }
                if (this.state.eleven)
                {
                    this.state.course.availability.day1[2] = true;
                }
                if (this.state.twelve)
                {
                    this.state.course.availability.day1[3] = true;
                }
                if (this.state.one)
                {
                    this.state.course.availability.day1[4] = true;
                }
                if (this.state.two)
                {
                    this.state.course.availability.day1[5] = true;
                }
                if (this.state.three)
                {
                    this.state.course.availability.day1[6] = true;
                }
                if (this.state.four)
                {
                    this.state.course.availability.day1[7] = true;
                }
                if (this.state.five)
                {
                    this.state.course.availability.day1[8] = true;
                }
                break;
            case day2:
                if (this.state.nine)
                {
                    this.state.course.availability.day2[0] = true;
                }
                if (this.state.ten)
                {
                    this.state.course.availability.day2[1] = true;
                }
                if (this.state.eleven)
                {
                    this.state.course.availability.day2[2] = true;
                }
                if (this.state.twelve)
                {
                    this.state.course.availability.day2[3] = true;
                }
                if (this.state.one)
                {
                    this.state.course.availability.day2[4] = true;
                }
                if (this.state.two)
                {
                    this.state.course.availability.day2[5] = true;
                }
                if (this.state.three)
                {
                    this.state.course.availability.day2[6] = true;
                }
                if (this.state.four)
                {
                    this.state.course.availability.day2[7] = true;
                }
                if (this.state.five)
                {
                    this.state.course.availability.day2[8] = true;
                }
                break;
            case day3:
                if (this.state.nine)
                {
                    this.state.course.availability.day3[0] = true;
                }
                if (this.state.ten)
                {
                    this.state.course.availability.day3[1] = true;
                }
                if (this.state.eleven)
                {
                    this.state.course.availability.day3[2] = true;
                }
                if (this.state.twelve)
                {
                    this.state.course.availability.day3[3] = true;
                }
                if (this.state.one)
                {
                    this.state.course.availability.day3[4] = true;
                }
                if (this.state.two)
                {
                    this.state.course.availability.day3[5] = true;
                }
                if (this.state.three)
                {
                    this.state.course.availability.day3[6] = true;
                }
                if (this.state.four)
                {
                    this.state.course.availability.day3[7] = true;
                }
                if (this.state.five)
                {
                    this.state.course.availability.day3[8] = true;
                }
                break;
            case day4:
                if (this.state.nine)
                {
                    this.state.course.availability.day4[0] = true;
                }
                if (this.state.ten)
                {
                    this.state.course.availability.day4[1] = true;
                }
                if (this.state.eleven)
                {
                    this.state.course.availability.day4[2] = true;
                }
                if (this.state.twelve)
                {
                    this.state.course.availability.day4[3] = true;
                }
                if (this.state.one)
                {
                    this.state.course.availability.day4[4] = true;
                }
                if (this.state.two)
                {
                    this.state.course.availability.day4[5] = true;
                }
                if (this.state.three)
                {
                    this.state.course.availability.day4[6] = true;
                }
                if (this.state.four)
                {
                    this.state.course.availability.day4[7] = true;
                }
                if (this.state.five)
                {
                    this.state.course.availability.day4[8] = true;
                }
                break;
            case day5:
                if (this.state.nine)
                {
                    this.state.course.availability.day5[0] = true;
                }
                if (this.state.ten)
                {
                    this.state.course.availability.day5[1] = true;
                }
                if (this.state.eleven)
                {
                    this.state.course.availability.day5[2] = true;
                }
                if (this.state.twelve)
                {
                    this.state.course.availability.day5[3] = true;
                }
                if (this.state.one)
                {
                    this.state.course.availability.day5[4] = true;
                }
                if (this.state.two)
                {
                    this.state.course.availability.day5[5] = true;
                }
                if (this.state.three)
                {
                    this.state.course.availability.day5[6] = true;
                }
                if (this.state.four)
                {
                    this.state.course.availability.day5[7] = true;
                }
                if (this.state.five)
                {
                    this.state.course.availability.day5[8] = true;
                }
                break;
            case day6:
                if (this.state.nine)
                {
                    this.state.course.availability.day6[0] = true;
                }
                if (this.state.ten)
                {
                    this.state.course.availability.day6[1] = true;
                }
                if (this.state.eleven)
                {
                    this.state.course.availability.day6[2] = true;
                }
                if (this.state.twelve)
                {
                    this.state.course.availability.day6[3] = true;
                }
                if (this.state.one)
                {
                    this.state.course.availability.day6[4] = true;
                }
                if (this.state.two)
                {
                    this.state.course.availability.day6[5] = true;
                }
                if (this.state.three)
                {
                    this.state.course.availability.day6[6] = true;
                }
                if (this.state.four)
                {
                    this.state.course.availability.day6[7] = true;
                }
                if (this.state.five)
                {
                    this.state.course.availability.day6[8] = true;
                }
                break;
            case day7:
                if (this.state.nine)
                {
                    this.state.course.availability.day7[0] = true;
                }
                if (this.state.ten)
                {
                    this.state.course.availability.day7[1] = true;
                }
                if (this.state.eleven)
                {
                    this.state.course.availability.day7[2] = true;
                }
                if (this.state.twelve)
                {
                    this.state.course.availability.day7[3] = true;
                }
                if (this.state.one)
                {
                    this.state.course.availability.day7[4] = true;
                }
                if (this.state.two)
                {
                    this.state.course.availability.day7[5] = true;
                }
                if (this.state.three)
                {
                    this.state.course.availability.day7[6] = true;
                }
                if (this.state.four)
                {
                    this.state.course.availability.day7[7] = true;
                }
                if (this.state.five)
                {
                    this.state.course.availability.day7[8] = true;
                }
                break;
        }

        let updateCourse = {
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
            rateStandard: this.state.course.rateStandard,
            courseName: this.state.course.courseName,
            availability: this.state.course.availability
        }

        console.log(updateCourse);

        this.editCourse(updateCourse);
        document.getElementById("bookingTeeTimeForm").removeAttribute("hidden"); 
        this.props.handleClose();
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
                    {this.props.userObj.type === "operator" ? 
                    <button onClick={this.toggleSetTeeTimeClicked}
                    className="btn btn-primary btn-color-theme modal-submit-btn">Set Tee Time Availability</button> 
                    : null}
                    {this.state.setTeeTimeClick ? 
                    <form style={{backgroundColor: 'lightgray'}}>
                        <label for="setTimeAvailDate">Date: <br></br>
                            <input type="date" id="bookingDate" name="setTimeAvailDate" min={day1} max={day7} value={this.state.setTimeAvailDate}
                             onChange={(event) => {this.setState({[event.target.name]: event.target.value})}} required></input>
                        </label>
                        <p></p>
                        <input id="9:00 AM" value="9:00 AM" type="checkbox" onChange={() => {this.setState(state => ({nine: !state.nine}))}}></input>&nbsp;9:00 AM<br></br>
                        <input id="10:00 AM" value="10:00 AM" type="checkbox" onChange={() => {this.setState(state => ({ten: !state.ten}))}}></input>&nbsp;10:00 AM<br></br>
                        <input id="11:00 AM" value="11:00 AM" type="checkbox" onChange={() => {this.setState(state => ({eleven: !state.eleven}))}}></input>&nbsp;11:00 AM<br></br>
                        <input id="12:00 PM" value="12:00 PM" type="checkbox" onChange={() => {this.setState(state => ({twelve: !state.twelve}))}}></input>&nbsp;12:00 PM<br></br>
                        <input id="1:00 PM" value="1:00 PM" type="checkbox" onChange={() => {this.setState(state => ({one: !state.one}))}}></input>&nbsp;1:00 PM<br></br>
                        <input id="2:00 PM" value="2:00 PM" type="checkbox" onChange={() => {this.setState(state => ({two: !state.two}))}}></input>&nbsp;2:00 PM<br></br>
                        <input id="3:00 PM" value="3:00 PM" type="checkbox" onChange={() => {this.setState(state => ({three: !state.three}))}}></input>&nbsp;3:00 PM<br></br>
                        <input id="4:00 PM" value="4:00 PM" type="checkbox" onChange={() => {this.setState(state => ({four: !state.four}))}}></input>&nbsp;4:00 PM<br></br>
                        <input id="5:00 PM" value="5:00 PM" type="checkbox" onChange={() => {this.setState(state => ({five: !state.five}))}}></input>&nbsp;5:00 PM<br></br>
                        <button onClick={this.handleSetTeeTime} className="btn btn-primary btn-color-theme">Set</button> 
                    </form>
                    : null}
                <div className="padded-page">
                    <form onSubmit={this.handleBookTeeTime} id="bookingTeeTimeForm">
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
                        <button id="TeeTR" className="btn btn-primary btn-color-theme modal-submit-btn">Request Tee Time</button>
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