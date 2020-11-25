import React from "react";
import { configure, shallow } from "enzyme";
import LazyImage from "./LazyImage";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("LazyImage Reusable image component", () => {
  const component = shallow(<LazyImage src="hello.png" />);
  it("Should render without error", () => {
    // console.log(component.debug());
    expect(component).toMatchSnapshot();
  });
});
