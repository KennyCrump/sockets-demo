import React, { Component } from 'react';
import './App.css';
import Room from './Components/Room'

class App extends Component {
  state={
    rooms: [],
    room: ''
  }

  addRoom = () => {
    this.setState({
      rooms: [...this.state.rooms, this.state.room],
      room: ''
    })
  }
  render() {
    let rooms = this.state.rooms.map(room => {
      return <Room room={room} />
    })
    return (
      <div className="App">
          <p>Join Room: <input onChange={(e) => this.setState({room: e.target.value})} value={this.state.room} type="text"/><button onClick={this.addRoom}>Join</button></p>
          <div className="dashboard">
          <Room /> {/* This Room represents the Global Chat Room */}
          {rooms}
          </div>
      </div>
    );
  }
}

export default App;
