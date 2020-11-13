import React from 'react';

class CourseRates extends React.Component {
    constructor() {
        super();
        this.state = {CourseName: "Pasco Airport",
                      CourseRate: "$50.00",
                      showRateModal: true
                    };           
    }
    
    handleChange = (event) => {
        const name = event.target.name;
        
    }

    openModal = () => {
        this.setState({ showRateModal: true})
    }
    
    close = () => {
        alert("close modal");
        this.setState({ showRateModal: false})
    }


    render() {
        return (
            <div id="RatesModal" className="modal" role="dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h3>Course Rates</h3>
                <button type="button" className="modal-close" 
                onClick={this.close}>
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
                      <button type="button" className="modal-close" 
                       onClick={this.close}>
                      Close</button>
                </div>
            </div>
            </div>
            );
        }
    }
    
export default CourseRates;