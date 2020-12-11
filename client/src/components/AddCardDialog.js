import React from 'react';

class AddCardDialog extends React.Component {
    constructor() {
        super();
        this.state = {
                    name: '',
                    number: 0,
                    expDate: '',
                    cardId: '',
                    deleteClicked: false
                };
    }
    
    //componentDidMount -- If we are editing an existing card, we need to grab the data from
    //the database and push them into the state.
    async componentDidMount() {
        //obtain current card data from database and push into state
        const url = '/cards/' + this.props.userId;
        const res = await fetch(url);
        const json = await res.json();
        const thisCard = JSON.parse(json);
        if (thisCard.length !== 0)
        {
            this.props.setCardExist();
            this.setState({
                name: thisCard[0].name,
                number: thisCard[0].number,
                expDate: thisCard[0].expDate,
                cardId: thisCard[0]._id
            });
        }
        else{
            this.setState({
                name: '',
                number: 0,
                expDate: ''
            }); 
        }
    }
    
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    
    addCard = async(data) =>{
        console.log(data);
        if (this.props.cardExist)
        {
            const url = '/cards/' + this.props.userId + '/' + this.state.cardId;
            let res;
            res = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                method: 'PUT',
                body: JSON.stringify(data)}); 
            if (res.status == 200) { //successful account creation!
            {
                alert("Card Edited");
                this.props.setCardExist();
            }
            } else { //Unsuccessful account update
                //Grab textual error message
                const resText = await res.text();
                alert(resText);
            }
        }
        else
        {
            const url = '/cards/' + this.props.userId;
            let res;
            res = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                method: 'POST',
                body: JSON.stringify(data)}); 
            if (res.status == 200) { //successful account creation!
            {
                 alert("Card Added");
                this.props.setCardExist();
            }
            } else { //Unsuccessful account update
                //Grab textual error message
                const resText = await res.text();
                alert(resText);
            }
        }
        this.props.close();
    }

    handleSubmit = (event) =>{
        event.preventDefault();
        let data = {
            name: this.state.name,
            number: parseInt(this.state.number),
            expDate: this.state.expDate
        }
        this.addCard(data);
    }

    handleDelete = async() => {
        const url = '/cards/' + this.props.userObj.id + '/' + this.state.cardId;
        const res = await fetch(url, {method: 'DELETE'}); 
        const msg = await res.text();
        if (res.status == 200) {
            alert("Card Deleted!");
            this.setState({deleteClicked: false});
            this.props.close();
            this.props.setCardDeleted();
        } else {
            alert(msg);
        }  
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
                  <button id="EditBtn"className="btn btn-success" onClick={this.handleSubmit}>
                  {this.props.cardExist ? "Edit Card" : "Add Card"}</button>
                  {this.props.cardExist ? <button id="remove"className="btn btn-danger" onClick={() => this.setState({deleteClicked: true})}>
                  Delete Card</button> : null}
            </div>
        </div>
        {this.state.deleteClicked ? 
                <div className="modal" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Are you sure you want to delete the card?</h3>
                            </div>
                            <div className="modal-body">
                                <button id="Agree" className="btn btn-danger" onClick={this.handleDelete}>
                                    YES
                                </button>
                                <button className="btn btn-success" onClick={() => this.setState({deleteClicked: false})}>
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        : null}
        </div>
        );
    }
}

export default AddCardDialog;