import React from 'react';

class BookingPage extends React.Component {

    constructor () {
        super();
        
        this.state = {
            courseName: 'Defualt Course'
        }
    }


    render() {
        return (
        <div className="padded-page">
            <center>
                <h1>Request Tee Time at {this.state.courseName}</h1>
            </center>
        </div>
        );
    }   
}

export default BookingPage;