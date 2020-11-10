import React from 'react';

class CoursesPage extends React.Component {
    constructor () {
        super();

    }


    componentDidMount() {
        console.log(this.props);
    }

    render() {
        return (
        <div className="padded-page">
            <center>
            <h1 >Courses</h1>
            <button onClick={() => this.props.changeMode('Booking')} className="btn btn-primary btn-color-theme modal-submit-btn">
                Book tee time
            </button>
            </center>
        </div>
        );
    }   
}

export default CoursesPage;