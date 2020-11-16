import React from 'react';
import AppMode from '../AppMode';

class AddCourses extends React.Component {

    constructor(){
        super();

        this.state={
            id: "",
            rating: "",
            review: "",
            picture: "",
            location: "",
            yardage: "",
            runningDistance: "",
            timePar: "",
            bestScore: "",
            recordHolder: ""
        };
    }

    handleChange = (event) =>{
        this.setState({[event.target.name]: event.target.value});
    }

    addCourse = async (newData) => {
        console.log(newData);
        const url = '/courses/' + this.state.id;
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            method: 'POST',
            body: JSON.stringify(newData)}); 
        const msg = await res.text();
        if (res.status == 200) {
            console.log("SUCCESS");
            console.log(msg);
            // this.setState({errorMsg: msg});
            this.props.changeMode(AppMode.COURSES);
        } else {
            console.log("FAILURE");
            console.log(msg);
            // this.setState({errorMsg: ""});
            // this.props.refreshOnUpdate(AppMode.COURSE);
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let courseData = this.state;
        this.addCourse(courseData);

    }

    render() {
        return(
            <div id="addCoursePage">
                <form onSubmit={this.handleSubmit} style={{marginBottom: "50px"}}>
                    <center>
                    <h3>Add Course</h3>
                    <label>
                        Course Name:<br></br>
                        <input id="id" name="id" placeholder="id" value={this.state.id} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <label>
                        Rating:<br></br>
                        <input id="rating" name="rating" placeholder="rating" value={this.state.rating} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <label>
                        Review:<br></br>
                        <input id="review" name="review"  placeholder="review" value={this.state.review} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <label>
                        Picture:<br></br>
                        <input id="picture" name="picture"  placeholder="picture" value={this.state.picture} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <label>
                        Location:<br></br>
                        <input id="location" name="location"  placeholder="location" value={this.state.location} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <label>
                        Yardage:<br></br>
                        <input id="yardage" name="yardage"  placeholder="yardage" value={this.state.yardage} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <label>
                        Running Distance:<br></br>
                        <input id="runningDistance" name="runningDistance"  placeholder="runningDistance" value={this.state.runningDistance} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <label>
                        Time Par:<br></br>
                        <input id="timePar" name="timePar"  placeholder="timePar" value={this.state.timePar} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <label>
                        Best Score:<br></br>
                        <input id="bestScore" name="bestScore"  placeholder="bestScore" value={this.state.bestScore} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <label>
                        Record Holder:<br></br>
                        <input id="recordHolder" name="recordHolder"  placeholder="recordHolder" value={this.state.recordHolder} onChange={this.handleChange}></input>
                    </label>
                    <p></p>
                    <button id="submitBtn" type="submit" style={{width: "70%",fontSize: "36px"}} 
                        className="btn btn-primary btn-color-theme">
                        &nbsp;Submit
                    </button>
                    </center>
                </form>
            </div>
        );
    }   
}

export default AddCourses;