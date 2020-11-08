import React from 'react';
import AppMode from '../AppMode';

class CoursesPage extends React.Component {

    render() {
        switch(this.props.mode){
            case AppMode.COURSES:
                return (
                    <div className="padded-page">
                        <center>
                        <h1 >Courses</h1>
                        <h2>This page is under construction.</h2>
                        <img src="https://dl.dropboxusercontent.com/s/qpjhy9x9gwdxpob/SpeedScoreLogo64Trans.png" 
                         height="200" width="200"/>
                        <p style={{fontStyle: "italic"}}>Version CptS 489 React Demo</p>
                        </center>
                    </div>
                );
            case AppMode.COURSES_NEARBY:
                return (
                    <div className="padded-page">
                        <center>
                        <h1 >Nearby Courses</h1>
                        <h2>This page is under construction.</h2>
                        <img src="https://dl.dropboxusercontent.com/s/qpjhy9x9gwdxpob/SpeedScoreLogo64Trans.png" 
                         height="200" width="200"/>
                        <p style={{fontStyle: "italic"}}>Version CptS 489 React Demo</p>
                        </center>
                    </div>
                );
            case AppMode.COURSES_ALL:
                return (
                    <div className="padded-page">
                        <center>
                        <h1 >All Speedgolf-Friendly Courses</h1>
                        <h2>This page is under construction.</h2>
                        <img src="https://dl.dropboxusercontent.com/s/qpjhy9x9gwdxpob/SpeedScoreLogo64Trans.png" 
                         height="200" width="200"/>
                        <p style={{fontStyle: "italic"}}>Version CptS 489 React Demo</p>
                        </center>
                    </div>
                );
        }
    }   
}

export default CoursesPage;