import React, { Component, Fragment } from "react";

export default class TrackCloseWraper extends Component {
  constructor(props) {
    super(props);
    this.setupBeforeUnloadListener();
  }
  // Things to do before unloading/closing the tab
  doSomethingBeforeUnload = () => {
    // Do something
    console.log("hutaaa");
    return false;
  };

  // Setup the `beforeunload` event listener
  setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", ev => {
      //   console.log("ev", ev);
      //   localStorage.setItem("ev", JSON.stringify(ev));
      ev.preventDefault();
      ev.stopPropagation();
      return this.doSomethingBeforeUnload();
    });
  };
  //   componentWillUnmount() {
  //     this.setupBeforeUnloadListener();
  //   }

  componentDidMount() {
    // Activate the event listener
    this.setupBeforeUnloadListener();
  }
  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}
