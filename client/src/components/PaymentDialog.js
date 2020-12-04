import React from 'react';

class PaymentDialog extends React.Component {
    constructor() {
        super();
        this.state = {
                    name: '',
                    number: 0,
                    expDate: ''
                };
    }

    componentDidMount(){
        this.getCard();
    }

    getCard = async() => {
        const url = '/cards/'+this.props.userObj.id;
        fetch(url)
        .then((response) => {
            if (response.status == 200)
                return response.json();
            else
            {
                throw Error(response.statusText);
            }
        })
        .then((obj) => 
        {
            console.log("GET SUCCESS!");
            let thisCard = JSON.parse(obj);
            this.setState({
                card: thisCard.map((c) =>(
                    {
                        name: c.name,
                        number: c.number,
                        expDate: c.expDate
                    }
                ))
            });
            
        }).catch((error) =>{
            console.log("GET ERROR!");
        });
    }
    
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit = (event) =>{
        event.preventDefault();
        let data = this.state;
        console.log(data);
        console.log(this.state.card);
        if (this.state.card[0].name === data.name && this.state.card[0].number === parseInt(data.number) && this.state.card[0].expDate === data.expDate)
        {
            let i = this.props.info;
            this.props.handlePayment(i.userId,i.username,i.courseName,i.date,i.time,i.paid);
            this.props.handleUserPayment(i.mmId,i.userId,i.username,i.courseName,i.date,i.time,i.paid);
            this.props.close();
        }
        else {
            alert("INVALID CARD");
        }
    }

    render() {
        return (
        <div id="aboutModal" className="modal payment-dialogue" role="dialog">
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
                  Verify Card</button>
            </div>
        </div>
        </div>
        );
    }
}

export default PaymentDialog;