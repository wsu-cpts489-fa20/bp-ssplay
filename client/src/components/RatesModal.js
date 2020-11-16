import React from 'react';

class RatesModal extends React.Component {

render() {
    return (
        <div className="modal" role="dialog">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
            <div className="modal-header">
                <h3>About SpeedScore</h3>
                <button className="modal-close" onClick={this.props.handleClose}>
                    &times;
                </button>
            </div>
            <div className="modal-body">
                <img
                src="https://dl.dropboxusercontent.com/s/awuwr1vpuw1lkyl/SpeedScore4SplashLogo.png"
                height="200" width="200"/>
                <h3>The World's First and Only Suite of Apps for
                Speedgolf</h3>
                <p>Version CptS 489 Fa20 Complete (MERN)<br/>
                &copy; 2017-20 The Professor of Speedgolf. All rights
                reserved.
                </p>
                <div style={{textAlign: "left"}}>
                <p>SpeedScore apps support</p>
                <ul>
                <li>live touranment scoring (<i>SpeedScore Live&reg;</i>)</li>
                <li>tracking personal speedgolf rounds and sharing results
                (<i>SpeedScore Track&reg;</i>)</li>
                <li>finding speedgolf-friendly courses, booking tee times, and
                paying to play speedgolf by the minute (<i>SpeedScore
                Play&reg;</i>)</li>
                </ul>
                <p>SpeedScore was first developed by Dr. Chris Hundhausen,
                associate professor of computer science at Washington State
                University and the <i>Professor of Speedgolf</i>, with support
                from Scott Dawley, CEO of Speedgolf USA, LLC.</p>
                <p>For more information on SpeedScore, visit <a
                href="http://speedscore.live" target="_blank">SpeedScore's web
                site</a>. For more information on speedgolf, visit <a
                href="http://playspeedgolf.com"
                target="_blank">playspeedgolf.com</a> and <a
                href="http://usaspeedgolf.com" target="_blank">Speedgolf
                USA</a>.</p>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn btn-primary btn-color-theme"
                onClick={this.props.handleClose}>OK</button>
                </div>
            </div>
        </div>
        </div>
    );
    }
}

export default RatesModal;


/* import React from 'react';

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
    
export default CourseRates; */