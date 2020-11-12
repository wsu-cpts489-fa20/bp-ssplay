import React from 'react';
import AppMode from "./../AppMode.js"
import CourseHome from './CourseHome.js';
import CourseRates from './CourseRates.js';

class CoursesPage extends React.Component {

    render() {
        switch(this.props.mode) {
            case AppMode.COURSES:
                return (<CourseHome userObj={this.props.userObj} />);
            case AppMode.COURSES_HOME:
                return (<CourseHome  />);
            case AppMode.COURSE_RATES:
                return (<CourseRates />);
        }
    }   
}

export default CoursesPage;