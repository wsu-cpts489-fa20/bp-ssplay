import React from 'react';
import AppMode from './../AppMode.js'
import App from './App.js';

class SideMenu extends React.Component {

//renderModeItems -- Renders correct subset of mode menu items based on
//current mode, which is stored in this.prop.mode. Uses switch statement to
//determine mode.
renderModeMenuItems = () => {
  switch (this.props.mode) {
    case AppMode.FEED:
      return(
        <div>
        <a className="sidemenu-item">
            <span className="fa fa-users"></span>&nbsp;Followed Users</a>
        <a className="sidemenu-item ">
            <span className="fa fa-search"></span>&nbsp;Search Feed</a>
        </div>
      );
    break;
    case AppMode.ROUNDS:
      return(
        <div>
          <a className="sidemenu-item">
            <span className="fa fa-plus"></span>&nbsp;Log New Round</a>
          <a className="sidemenu-item">
            <span className="fa fa-search"></span>&nbsp;Search Rounds</a>
        </div>
      );
    break;
    case AppMode.COURSES:
    case AppMode.COURSES_NEARBY:
    case AppMode.COURSES_ALL:
    case AppMode.COURSES_ADD:
      return(
        <div>
        <a className="sidemenu-item" onClick={() => this.props.changeMode(AppMode.COURSES)}>
            <span className="fa fa-search"></span>&nbsp;Specific Course</a>
        <a className="sidemenu-item" onClick={() => this.props.changeMode(AppMode.COURSES_NEARBY)}>
            <span className="fa fa-map-marker"></span>&nbsp;Nearby Courses</a>
        <a className="sidemenu-item" onClick={() => this.props.changeMode(AppMode.COURSES_ALL)}>
            <span className="fa fa-th-list"></span>&nbsp;All Speedgolf-Friendly Courses</a>
        {this.props.type === "operator" ? <a id="addCourse" className="sidemenu-item" onClick={() => this.props.changeMode(AppMode.COURSES_ADD)}>
            <span className="fa fa-plus"></span>&nbsp;Add a Course</a> : null}
        </div>
      );
    default:
        return null;
    }
}

    render() {
       return (
        <div className={"sidemenu " + (this.props.menuOpen ? "sidemenu-open" : "sidemenu-closed")}
             onClick={this.props.toggleMenuOpen}>
          {/* SIDE MENU TITLE */}
          <div className="sidemenu-title">
            <img src={this.props.profilePicURL} height='60' width='60' />
            <span id="userID" className="sidemenu-userID">&nbsp;{this.props.displayName}</span>
        </div>
          {/* MENU CONTENT */}
          {this.renderModeMenuItems()}
          {/* The following menu items are present regardless of mode */}
          {this.props.localAccount ? 
            <a id="accountBtn" className="sidemenu-item" onClick={this.props.editAccount}>
              <span className="fa fa-user"></span>&nbsp;Account</a> : null}
          <a id="aboutBtn" className="sidemenu-item" onClick={this.props.showAbout}>
            <span className="fa fa-info-circle"></span>&nbsp;About</a>
          <a id="logOutBtn" className="sidemenu-item" onClick={this.props.logOut}>
            <span className="fa fa-sign-out-alt"></span>&nbsp;Log Out</a>
        </div>
       );
    }
}

export default SideMenu;
