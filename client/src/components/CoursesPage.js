import React from 'react';
import AppMode from '../AppMode';
import AllCourses from './AllCourses.js';
import NearbyCourses from './NearbyCourses.js';
import SpecificCourses from './SpecificCourses.js';
import AddCourses from './AddCourses.js';

class CoursesPage extends React.Component {

    render() {
        switch(this.props.mode){
            case AppMode.COURSES:
                return (<SpecificCourses userObj={this.props.userObj} />);
            case AppMode.COURSES_NEARBY:
                return (<NearbyCourses />);
            case AppMode.COURSES_ALL:
                return (<AllCourses />);
            case AppMode.COURSES_ADD:
                return (<AddCourses />);
        }
    }   
}

export default CoursesPage;