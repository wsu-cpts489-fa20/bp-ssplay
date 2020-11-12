import React from 'react';

class BookingPage extends React.Component {

    constructor () {
        super();

        this.state = {
            courseName: 'Defualt Course',
            bookingTime: '',
            bookingDate: ''
        }
    }

    handleBookTeeTime = () => {
        console.log("Booking tee time");
        console.log(this.state);
    }


    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }


    render() {
        return (
        <div className="padded-page">
            <center>
                <h1>Request Tee Time at {this.state.courseName}</h1>
                <label for="bookingDate">Date: </label>
                <input type="date" id="bookingDate" name="bookingDate" value={this.state.bookingDate} onChange={this.handleChange}></input>
                <br/>
                <label for="bookingTime">Time: </label>
                <select type="date" id="bookingTime" name="bookingTime" value={this.state.bookingTime} onChange={this.handleChange}>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 AM">12:00 PM</option> 
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option> 
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>    
                </select>
                <br/>
                <button onClick={this.handleBookTeeTime} className="btn btn-primary btn-color-theme modal-submit-btn">Request Tee Time</button>
                <button onClick={() => this.props.changeMode('CoursesMode')} className="btn btn-primary btn-color-theme modal-submit-btn">Cancel</button>
            </center>
        </div>
        );
    }   
}

export default BookingPage;