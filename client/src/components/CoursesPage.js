import React from 'react';
import AppMode from '../AppMode';
import AllCourses from './AllCourses.js';
import NearbyCourses from './NearbyCourses.js';
import SpecificCourses from './SpecificCourses.js';

class CoursesPage extends React.Component {

    render() {
        switch(this.props.mode){
            case AppMode.COURSES:
                return (<SpecificCourses userObj={this.props.userObj} />);
            case AppMode.COURSES_NEARBY:
                return (<NearbyCourses />);
            case AppMode.COURSES_ALL:
                return (<AllCourses />);
        }
    }   
}

export default CoursesPage;