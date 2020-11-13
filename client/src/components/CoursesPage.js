import React from 'react';

class CoursesPage extends React.Component {
    constructor(){
        super()
        this.state ={time:new Date()}

    }


    currentTime(){
        this.setState({time : new Date()})
        // time = new Date()

    }
    componentWillMount(){
        setInterval(()=>this.currentTime(),1000)

    }



    render() {
        return (

            <div className="padded-page">
            <center>
           
            <h1 >{this.state.time.toLocaleTimeString()}</h1>
            <h2>Request Tee Time At ab</h2>
            <img/>
            <p></p>

            <label>
              Date:
              <input name="date" className="form-control form-center" 
                type="date" value={this.state.date}  />
            </label>
            <p></p>

            <label>Time: <br></br>
            <input name="minutes" type="number" size="3"
            min="10" max="400" value={this.state.minutes}
           />:  
          <input name="seconds" type="number" size="2"
            min="0" max="60" value={this.state.seconds} 
             />
          </label>

          <p></p>
          <button >Request Tee Time</button>  <button>Cancel</button>

            </center>
        </div>

            

            
        
        );
    }   
}

export default CoursesPage;