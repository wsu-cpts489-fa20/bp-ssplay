import React from 'react';
import AppMode from '../AppMode';

class BookingPage extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            courseName: this.props.course,
            bookingTime: '',
            bookingDate: ''
        }
    }

    handleBookTeeTime = () => {
        console.log("Booking tee time");
        console.log(this.state);
        this.props.handleClose();
        alert("Tee Time Booked!");
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
                        <h1>Request Tee Time at {this.state.courseName}</h1>
                        <label for="bookingDate">Date: </label>
                        <input type="date" id="bookingDate" name="bookingDate" value={this.state.bookingDate} onChange={this.handleChange} required></input>
                        <br/>
                        <label for="bookingTime">Time: </label>
                        <select type="date" id="bookingTime" name="bookingTime" value={this.state.bookingTime} onChange={this.handleChange} required>
                            <option></option>
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