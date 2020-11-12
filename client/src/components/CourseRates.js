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
    //only used placeholder because i did not see where the rates where in the database
    render() {
        return (
            <div className="padded-page">
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
            </div>
        );
    }   
}

export default CourseRates;