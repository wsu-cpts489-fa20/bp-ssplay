import React from 'react';

class AddCardDialog extends React.Component {
    constructor() {
        super();
        this.state = {
                    name: '',
                    number: 0,
                    expDate: ''
                };
    }
    
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (event) =>{
        event.preventDefault();
        let data = this.state;
        this.props.addCard(data);
    }

    render() {
        return (
        <div id="aboutModal" className="modal" role="dialog">
        <div className="modal-content">
            <div className="modal-header">
              <center>
                <h3 className="modal-title"><b>Enter Card Information</b></h3>
              </center>
               <button id="modalClose" className="modal-close" onClick={this.props.close}>
                 &times;</button>
            </div>
            <div className="modal-body">
              <form>
                  <center>
                    <label>
                        Name on Card: <br></br>
                        <input id="name" name="name" placeholder="name" value={this.state.name} onChange={this.handleChange} required></input>
                    </label>
                    <p></p>
                    <label>
                        Card Number: <br></br>
                        <input id="number" name="number" placeholder="number" value={this.state.number} onChange={this.handleChange} required></input>
                    </label>
                    <p></p>
                    <label>
                        Expiration Date: (format: MM/YY)<br></br>
                        <input id="expDate" name="expDate" placeholder="expDate" value={this.state.expDate} onChange={this.handleChange} required></input>
                    </label>
                    <p></p>
                  </center>
              </form>
            </div>
            <div className="modal-footer">
                  <button className="btn btn-danger" onClick={this.handleSubmit}>
                  Add Card</button>
            </div>
        </div>
        </div>
        );
    }
}

export default AddCardDialog;