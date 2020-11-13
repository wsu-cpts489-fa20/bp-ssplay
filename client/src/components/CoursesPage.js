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
                return (<CourseRates 
                    handleClick={() => 
                    this.props.changeMode(AppMode.COURSE_RATES)} />);
            case AppMode.COURSE_RATES:
                return (<CourseRates />);
        }
    }   
}

export default CoursesPage;