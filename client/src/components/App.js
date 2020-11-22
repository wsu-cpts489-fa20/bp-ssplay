import React from 'react';
import NavBar from './NavBar.js';
import SideMenu from './SideMenu.js';
import ModeBar from './ModeBar.js';
import CreateEditAccountDialog from './CreateEditAccountDialog.js'
import LoginPage from './LoginPage.js';
import AppMode from "./../AppMode.js";
import FeedPage from './FeedPage.js';
import Rounds from './Rounds.js';
import CoursesPage from './CoursesPage.js';
import AboutBox from './AboutBox.js';
import AddCardDialog from './AddCardDialog.js';

const modeTitle = {};
modeTitle[AppMode.LOGIN] = "Welcome to SpeedScore";
modeTitle[AppMode.FEED] = "Activity Feed";
modeTitle[AppMode.ROUNDS] = "My Rounds";
modeTitle[AppMode.ROUNDS_LOGROUND] = "Log New Round";
modeTitle[AppMode.ROUNDS_EDITROUND] = "Edit Round";
modeTitle[AppMode.COURSES] = "Search Courses";
modeTitle[AppMode.COURSES_NEARBY] = "Nearby Courses";
modeTitle[AppMode.COURSES_ALL] = "All Speedgolf-Friendly Courses";
modeTitle[AppMode.COURSES_ADD] = "Add a Course";
modeTitle[AppMode.COURSES_APPT] = "All Appointments";
modeTitle[AppMode.COURSES_MYAPPT] = "My Appointments";

const modeToPage = {};
modeToPage[AppMode.LOGIN] = LoginPage;
modeToPage[AppMode.FEED] = FeedPage;
modeToPage[AppMode.ROUNDS] = Rounds;
modeToPage[AppMode.ROUNDS_LOGROUND] = Rounds;
modeToPage[AppMode.ROUNDS_EDITROUND] = Rounds;
modeToPage[AppMode.COURSES] = CoursesPage;
modeToPage[AppMode.COURSES_NEARBY] = CoursesPage;
modeToPage[AppMode.COURSES_ALL] = CoursesPage;
modeToPage[AppMode.COURSES_ADD] = CoursesPage;
modeToPage[AppMode.COURSES_APPT] = CoursesPage;
modeToPage[AppMode.COURSES_MYAPPT] = CoursesPage;


class App extends React.Component {

  constructor() {
    super();
    this.state = {mode: AppMode.LOGIN,
                  menuOpen: false,
                  authenticated: false,
                  userObj: {displayName: "", profilePicURL: ""},
                  editAccount: false,
                  showEditAccountDialog: false,
                  statusMsg: "",
                  showAboutDialog: false,
                  addCardClicked: false,
                  cardExist: false
                 };
  }

  //componentDidMount
  componentDidMount() {
    if (!this.state.authenticated) { 
      //Use /auth/test route to (re)-test authentication and obtain user data
      fetch("/auth/test")
        .then((response) => response.json())
        .then((obj) => {
          if (obj.isAuthenticated) {
            this.setState({
              userObj: obj.user,
              authenticated: true,
              mode: AppMode.COURSES_ALL //We're authenticated so can get into the app.
            });
          }
        }
      )
    } 
  }

  //refreshOnUpdate(newMode) -- Called by child components when user data changes in 
  //the database. The function calls the users/:userid (GET) route to update 
  //the userObj state var based on the latest database changes, and sets the 
  //mode state var is set to newMode. After this method is called, the
  //App will re-render itself, forcing the new data to 
  //propagate to the child components when they are re-rendered.
  refreshOnUpdate = async(newMode) => {
    let response = await fetch("/users/" + this.state.userObj.id);
    response = await response.json();
    const obj = JSON.parse(response);
    this.setState({
      userObj: obj,
      mode: newMode
    });
  }


  handleChangeMode = (newMode) => {
    this.setState({mode: newMode});
  }

  openMenu = () => {
    this.setState({menuOpen : true});
  }
  
  closeMenu = () => {
    this.setState({menuOpen : false});
  }

  toggleMenuOpen = () => {
    this.setState(prevState => ({menuOpen: !prevState.menuOpen}));
  }

  setUserId = (Id) => {
    this.setState({userId: Id,
                   authenticated: true});
  }

  showEditAccount = () => {
    this.setState({showEditAccountDialog: true});

  }

  cancelEditAccount = () => {
    this.setState({showEditAccountDialog: false});
  }

  setUserObjType = (newType) => {
    this.setState({userObj: newType});
  }

  toggleAddCardClicked = () => {
    this.setState(state => ({addCardClicked: !state.addCardClicked}));
  }

  //editAccountDone -- called after successful edit or
  //deletion of user account. msg contains the status
  //message and deleted indicates whether an account was
  //edited (deleted == false) or deleted (deleted == true)
  editAccountDone = (msg, deleted) => {
    if (deleted) {
      this.setState({showEditAccountDialog: false,
                     statusMsg: msg,
                     mode: AppMode.LOGIN});
      } else {
        this.setState({showEditAccountDialog: false,
          statusMsg: msg});
      }
  }

  closeStatusMsg = () => {
    this.setState({statusMsg: ""});
  }

  render() {
    const ModePage = modeToPage[this.state.mode];
    return (
      <div className="padded-page">
        {this.state.showAboutDialog ? 
          <AboutBox close={() => this.setState({showAboutDialog: false})}/> : null}
        {this.state.statusMsg != "" ? <div className="status-msg">
              <span>{this.state.statusMsg}</span>
              <button className="modal-close" onClick={this.closeStatusMsg}>
                  <span className="fa fa-times"></span></button></div> : null}
        {this.state.showEditAccountDialog ? 
            <CreateEditAccountDialog 
              create={false} 
              userId={this.state.userObj.id} 
              done={this.editAccountDone} 
              cancel={this.cancelEditAccount}/> : null}
        {this.state.addCardClicked ? 
          <AddCardDialog 
              userObj={this.state.userObj}  
              cardExist={this.state.cardExist}
              setCardDeleted={() => (this.setState({cardExist: false}))}
              setCardExist={() => (this.setState({cardExist: true}))}
              userId={this.state.userObj.id}
              close={() => (this.setState({addCardClicked: false}))} /> : null}
        <NavBar 
          aboutOpen={this.state.showAboutDialog}
          title={modeTitle[this.state.mode]} 
          mode={this.state.mode}
          changeMode={this.handleChangeMode}
          menuOpen={this.state.menuOpen}
          toggleMenuOpen={this.toggleMenuOpen}/>
          <SideMenu 
            toggleAddCardClicked={this.toggleAddCardClicked}
            type={this.state.userObj.type}
            changeMode={this.handleChangeMode}
            menuOpen = {this.state.menuOpen}
            mode={this.state.mode}
            toggleMenuOpen={this.toggleMenuOpen}
            displayName={this.state.userObj.displayName}
            profilePicURL={this.state.userObj.profilePicURL}
            localAccount={this.state.userObj.authStrategy === "local"}
            editAccount={this.showEditAccount}
            logOut={() => this.handleChangeMode(AppMode.LOGIN)}
            showAbout={() => {this.setState({showAboutDialog: true})}}/>
          <ModeBar 
            aboutOpen={this.state.showAboutDialog}
            mode={this.state.mode} 
            changeMode={this.handleChangeMode}
            menuOpen={this.state.menuOpen}/>
          <ModePage 
            setUserObjType={this.setUserObjType}
            menuOpen={this.state.menuOpen}
            mode={this.state.mode}
            changeMode={this.handleChangeMode}
            userObj={this.state.userObj}
            refreshOnUpdate={this.refreshOnUpdate}/>
      </div>
    );  
  }
}

export default App;