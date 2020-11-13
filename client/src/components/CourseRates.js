import React from 'react';

//work on getting the actual course name to go with
class CourseRates extends React.Component {
    constructor() {
        super();
        this.state = {CourseName: "Pasco Airport",
                      CourseRate: "$50.00"
                    };           
    }
    
    handleChange = (event) => {
        const name = event.target.name;
        
    }
    render() {
        return (
            <div id="aboutModal" className="modal" role="dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h3>Course Rates</h3>
                <button className="modal-close" onClick={this.props.close}>
                    &times;
                </button>
            </div>
                <center>
                <h1 > Course Rates</h1>
                <h2></h2>
                <label>
              Course Name:
              <input name="CourseName" className="form-control form-center" CourseName="text"
                value={this.state.CourseName} onChange={this.handleChange} />
            </label>
            <label>
              Course Rate Per Hour:
              <input name="CourseRate" className="form-control form-center" 
             value={this.state.CourseRate} onChange={this.handleChange} />
            </label>
            <p></p>
                </center>
                <div className="modal-footer">
                      <button className="btn btn-danger" onClick={this.props.deleteRound}>
                      Close</button>
                </div>
            </div>
            </div>
            );
        }
    }
    
export default CourseRates;