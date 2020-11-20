import React from 'react';
import { Navbar, Container, Row, Col, Card, Button, Modal } from "react-bootstrap";

class FeedPage extends React.Component {

    // handleClick = (type) => {
    //     this.props.userObj.type = type;
    //     this.props.setUserObjType(this.props.userObj);
    // }


    render() {
        return (
        <div id="feedMode" className="padded-page">
            <center>
            {/* {(this.props.userObj.authStrategy === "google") || (this.props.userObj.authStrategy === "github") ?
                <div className="modal" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>What do you want to be?</h3>
                            </div>
                            <div className="modal-body">
                            <Button onClick={() => this.handleClick("user")}>User</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button onClick={() => this.handleClick("operator")}>Operator</Button>
                            </div>
                        </div>
                    </div>
                </div> : null} */}
            <h1 >Activity Feed</h1>
            <h2>This page is under construction.</h2>
            <img src="https://dl.dropboxusercontent.com/s/qpjhy9x9gwdxpob/SpeedScoreLogo64Trans.png" 
             height="200" width="200"/>
            <p style={{fontStyle: "italic"}}>Version CptS 489 React Demo</p>
            </center>
        </div>
        );
    }   
}

export default FeedPage;