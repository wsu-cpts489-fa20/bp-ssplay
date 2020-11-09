import React from 'react';
import ReactTooltip from "react-tooltip";

class SpecificCourses extends React.Component {

    render() {
        return (
            <div>
                <div style={{display: 'flex'}}>
                    <h3>Find Speedgolf-Friendly Courses:&nbsp;</h3>
                    <h3>
                        <a data-tip="React-tooltip">&#9432;</a>
                        <ReactTooltip effect="solid">
                            <span>
                                Enter search term or course name to see matching courses, or enter a space to see ALL courses in the database.
                                Click on course in the list to select it, or click on 'Select' button to select all matching courses.
                            </span>
                        </ReactTooltip>
                    </h3>
                </div>
                <input style={{width: '60%'}} placeholder="Enter course name or search term"></input>
                <button>Select Course</button>
            </div>
        );
    }   
}

export default SpecificCourses;