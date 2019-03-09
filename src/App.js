import React, { Component } from 'react';

import Battleship from "./model/Battleship";

import './App.css';

class App extends Component {

  state = {
    board: [0,1,2,3,4,5,6], 
    shipStatus: {},
    messageText: "",
    gameEnd: false,
    countFire: 0,
  }

  battleshipModel = null

  constructor() {
    super();
    this.gameRefresh();
  }

  gameRefresh = () => {
    this.setState({
      shipStatus: {},
      messageText: "",
      gameEnd: false,
      countFire: 0,
    });
    this.battleshipModel = new Battleship({
      onHit: this.hit,
      onMiss: this.miss,
      displayMessage: this.messageText,
    });
    this.battleshipModel.generateShipLocations();
  }

  hit = shipPosition => {
    this.setState({
      shipStatus: {...this.state.shipStatus, [shipPosition]: "hit"}
    });
  }

  miss = shipPosition => {
    this.setState({
      shipStatus: {...this.state.shipStatus, [shipPosition]: "miss"}
    });
  }

  fire = guessValue => {
    if (this.state.gameEnd || this.state.shipStatus[guessValue]) {
      return;
    }
    
    const countFire = this.state.countFire + 1;

    this.setState({countFire});

    this.battleshipModel.fire(guessValue);
    if (this.battleshipModel.shipsSunk === this.battleshipModel.numShips) {
      this.messageText("You sank all my battleships, in " + countFire + " guesses");
      this.setState({gameEnd: true});
    }
  }

  handerClickFire = guessValue => () => {
      this.fire(guessValue);
  }

  messageText = messageText => { this.setState({messageText}) }
 
  render() {
    return (
      <div className="board">
        {this.state.gameEnd ? <div className="overlay">
          <button className="gameRefresh" onClick={this.gameRefresh}>Play again</button>
        </div> : ""}
        <div className="message-area">
          <p>You did {this.state.countFire} guesses</p>
          <p>{this.state.messageText}</p>
        </div>
        <table className="board-table">
          <tbody>
            {this.state.board.map(leftNum => (
              <tr>
                {this.state.board.map(rightNum => (
                  <td onClick={this.handerClickFire(leftNum +""+ rightNum)} 
                  className={'board-cell ' + this.state.shipStatus[leftNum +""+ rightNum]}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
