import React from "react";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

// import App from "./App";

configure({ adapter: new Adapter() });

// // it('renders without crashing', () => {
// //   const div = document.createElement('div');
// //   ReactDOM.render(<App />, div);
// // });

describe("Test App component", () => {
  it("Shoud one + one be two", () => {
    expect(1 + 1).toEqual(2);
  });
});
