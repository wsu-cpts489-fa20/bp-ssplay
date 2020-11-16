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
                return (<SpecificCourses userObj={this.props.userObj} mode={this.props.mode} changeMode={this.props.changeMode} refreshOnUpdate={this.props.refreshOnUpdate}/>);
            case AppMode.COURSES_NEARBY:
                return (<NearbyCourses changeMode={this.props.changeMode} mode={this.props.mode} refreshOnUpdate={this.props.refreshOnUpdate}/>);
            case AppMode.COURSES_ALL:
                return (<AllCourses changeMode={this.props.changeMode} mode={this.props.mode} refreshOnUpdate={this.props.refreshOnUpdate}/>);
            case AppMode.COURSES_ADD:
                return (<AddCourses />);
        }
    }   
}

export default CoursesPage;