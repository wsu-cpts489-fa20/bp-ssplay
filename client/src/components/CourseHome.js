import React from 'react'; 
import AppMode from './../AppMode.js'


class CourseHome extends React.Component {
    
        
    render(){
          return(
            <div>
            <button type="button"
             className="btn-color-theme btn btn-primary btn-block login-btn"
              onClick={() => this.handleClick} >
              <span className="fa fa-th-list"></span>
              &nbsp;Course Rates</button>
            </div>
          );
      
}}

export default CourseHome;