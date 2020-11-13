import React from 'react';
import AppMode from "./../AppMode.js"

class CoursesPage extends React.Component {

render() {
    return (
    <div className="padded-page">
        <center>
        <h1 >Courses</h1>
        <button  className="btn btn-primary btn-color-theme modal-submit-btn" 
        onClick={() => this.props.changeMode(AppMode.COURSE_RATES)}>
            Course Rates
        </button>
        </center>
    </div>
    );
}   
}

export default CoursesPage;