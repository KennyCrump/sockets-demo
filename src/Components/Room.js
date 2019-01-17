import React, { Component } from "react";
import io from "socket.io-client";

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: ["hello", "hey"],
      message: "",
      userTyping: false
    };
    this.socket = io.connect(":4777");
    this.socket.on("generate general response", data =>
      this.generalResponse(data)
    );
    this.socket.on("generate room response", data => this.roomResponse(data));
    this.socket.on("user is typing", data => this.setUserTyping(data));
    this.socket.on(`user not typing`, data => this.removeUserTyping(data));
  }
  componentDidMount() {
    if (this.props.room) {
      this.socket.emit("join room", { room: this.props.room });
    }
  }
  generalResponse(data) {
    if (!this.props.room) {
      this.setState({ messages: [...this.state.messages, data.message] });
    }
  }
  roomResponse(data) {
    this.setState({ messages: [...this.state.messages, data.message] });
  }
  setUserTyping(data) {
    if (data.room === this.props.room) this.setState({ userTyping: true });
    else if (!data.room && !this.props.room)
      this.setState({ userTyping: true });
  }
  removeUserTyping(data) {
    if (data.room === this.props.room) this.setState({ userTyping: false });
    else if (!data.room && !this.props.room)
      this.setState({ userTyping: false });
  }

  sendMessage = (type, message) => {
    if (!this.props.room) {
      this.socket.emit(`${type} message to general`, { message });
    } else {
      this.socket.emit(`${type} message to room`, {
        message,
        room: this.props.room
      });
    }
    this.setState({ message: "" }, () =>
      this.socket.emit("user not typing", { room: this.props.room })
    );
  };

  updateInput(val) {
    this.setState({ message: val }, () => {
      if (this.state.message)
        this.socket.emit("user is typing", { room: this.props.room });
      else this.socket.emit("user not typing", { room: this.props.room });
    });
  }

  render() {
    const messages = this.state.messages.map(message => {
      return <p>{message}</p>;
    });
    return (
      <div className="room-container">
        <p>
          {this.props.room ? `Room: ${this.props.room}` : "Global Lobby"}
          <hr />
          <input
            type="text"
            onChange={e => this.updateInput(e.target.value)}
            value={this.state.message}
          />
        </p>
        <button onClick={() => this.sendMessage("emit", this.state.message)}>
          Emit
        </button>
        <button
          onClick={() => this.sendMessage("broadcast", this.state.message)}
        >
          Broadcast
        </button>
        <button onClick={() => this.sendMessage("blast", this.state.message)}>
          Blast
        </button>
        <hr />
        <div className="display-messages">{messages}</div>
        {this.state.userTyping && (
          <p className="user-typing">Another User is Typing</p>
        )}
      </div>
    );
  }
}

export default Room;
