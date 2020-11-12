import React from 'react'; 
import AppMode from './../AppMode.js'


class CourseHome extends React.Component {
    
        
    render()     {
          return(
            <div>
            
            <a className="sidemenu-item" onClick={() => this.props.changeMode(AppMode.COURSE_RATES)} >
                <span className="fa fa-th-list"></span>&nbsp;Course Rates</a>
            </div>
          );
      
}}

export default CourseHome;