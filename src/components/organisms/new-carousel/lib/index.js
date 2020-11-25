import React, { Component, Fragment } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  white-space: nowrap;
  overflow-x: scroll;
  display: flex;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChildWrapper = styled.div`
  height: 100%;
  min-width: ${porps => porps.width}px !important;
`;

const INNER_WIDTH = window.innerWidth;
const WAIT_INTERVAL = 200;
const INITAL_INDEX = 0;
class NewCarousel extends Component {
  constructor(porps) {
    super(porps);
    this.state = {
      wraperClientWidth: null,
      index: INITAL_INDEX,
      nav: false
    };
  }

  componentDidMount() {
    const { autoplay, nav } = this.props;
    this.timer = null;
    const wraperDiv = document.getElementsByClassName("wraper-div");
    const wraperClientWidth = wraperDiv[0].clientWidth;
    this.setState({ wraperClientWidth });
    this.setState({ nav });
    if (autoplay) {
      this.autoplay();
    }
  }

  componentDidUpdate(prevProps) {
    const { autoplay, nav } = this.props;
    if (prevProps.autoplay != autoplay) {
      if (autoplay) {
        this.autoplay();
      } else {
        this.end();
      }
    }

    if (prevProps.nav != nav) {
      this.setState({ nav });
    }
  }

  autoplay = () => {
    this.next();
    setTimeout(() => {
      this.autoplay();
    }, 2000);
  };

  end = () => {
    clearTimeout(0);
  };

  setItems = items => {
    const { wraperClientWidth } = this.state;
    const { responsive } = this.props;
    if (!wraperClientWidth) {
      return [];
    }
    let range = responsive.find(({ range }) => {
      return range.min <= INNER_WIDTH && range.max >= INNER_WIDTH;
    });

    const numberOfItems = wraperClientWidth / range.items;

    return items.map((item, index) => {
      return (
        <ChildWrapper
          id={`carousal-item-${index}`}
          width={numberOfItems}
          key={index}
          elementindex={index}
        >
          {item}
        </ChildWrapper>
      );
    });
  };
  back = () => {
    const index = this.state.index - 1;
    if (0 <= index) {
      this.setState({ index }, () => {
        const selectedDev = document.getElementById(
          `carousal-item-${this.state.index}`
        );
        selectedDev.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "start"
        });
      });
    }
  };
  next = () => {
    let index = this.state.index + 1;

    if (
      !(this.props.children.length > index) ||
      index == this.props.children.length - 1
    ) {
      index = INITAL_INDEX;
    }
    this.setState({ index }, () => {
      this.scrollTo(`carousal-item-${this.state.index}`);
    });
  };

  scrollTo(id) {
    const selectedDev = document.getElementById(id);
    selectedDev.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start"
    });
  }

  onScroll = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.onScrollEnd, WAIT_INTERVAL);
  };
  onScrollEnd = () => {
    const parentDiv = document.getElementById("wraper-div-id");
    const p = parentDiv.scrollLeft;
    const q = INNER_WIDTH;

    const i = Array.prototype.slice.call(parentDiv.childNodes).find(j => {
      const n = j.offsetLeft;
      const x = j.clientWidth;
      return n + 0.25 * x >= p && n + 0.25 * x <= p + q;
    });

    const index = parseInt(i.getAttribute("id").split("-")[2]);
    this.setState({ index });
  };

  render() {
    const items = this.setItems(this.props.children);

    return (
      <Fragment>
        {this.state.nav ? (
          <button onClick={this.next}> Next </button>
        ) : (
          <Fragment />
        )}

        <Wrapper
          className="wraper-div"
          id="wraper-div-id"
          onScroll={this.onScroll}
        >
          {items}
        </Wrapper>
        {this.state.nav ? (
          <button onClick={this.back}> Back </button>
        ) : (
          <Fragment />
        )}
      </Fragment>
    );
  }
}

export default NewCarousel;
