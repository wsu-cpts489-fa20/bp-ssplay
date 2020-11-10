import React from 'react';

class BookingPage extends React.Component {

    constructor () {
        super();

        this.state = {
            courseName: 'Defualt Course'
        }
    }

    componentDidMount() {
        console.log(this.props);
    }


    render() {
        return (
        <div className="padded-page">
            <center>
                <h1>Request Tee Time at {this.state.courseName}</h1>
                <label for="bookingDate">Date: </label>
                <input type="date" id="bookingDate" name="bookingDate"></input>
                <br/>
                <label for="bookingTime">Time: </label>
                <select type="date" id="bookingTime" name="bookingTime"></select>
                <br/>
                <button className="btn btn-primary btn-color-theme modal-submit-btn">Request Tee Time</button>
                <button onClick={() => this.props.changeMode('CoursesMode')} className="btn btn-primary btn-color-theme modal-submit-btn">Cancel</button>
            </center>
        </div>
        );
    }   
}

export default BookingPage;