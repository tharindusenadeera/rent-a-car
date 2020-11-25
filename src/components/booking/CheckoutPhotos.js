import React, { Component } from "react";
import Lightbox from "react-images";
import Image from "react-shimmer";

class CheckoutPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImage: 0,
      lightboxIsOpen: false
    };
  }

  lightBoxImages = () => {
    const { car_checkout_photo } = this.props;
    return car_checkout_photo.map(img => {
      return { src: img.image_path };
    });
  };
  gotoPrevLightboxImage() {
    this.setState({ currentImage: this.state.currentImage - 1 });
  }
  gotoNextLightboxImage() {
    this.setState({ currentImage: this.state.currentImage + 1 });
  }

  render() {
    const images = this.lightBoxImages();
    return (
      <div className="previewCarImage">
        <div className="label-sm">
          <span className="bold-label">Final Checkout Photos</span>
        </div>
        <div className="previewCarImageInner">
          {images.map((img, index) => {
            return (
              <div className="dz-details" key={index}>
                <Image
                  className="car-preview-thumb"
                  src={img.src}
                  onClick={() => {
                    this.setState({
                      currentImage: index,
                      lightboxIsOpen: true
                    });
                  }}
                  width={214}
                  height={135}
                  style={{ objectFit: "cover" }}
                />
              </div>
            );
          })}
        </div>
        <Lightbox
          images={images}
          currentImage={this.state.currentImage}
          enableKeyboardInput={true}
          backdropClosesModal={true}
          onClickThumbnail={e => {
            this.setState({ currentImage: e });
          }}
          isOpen={this.state.lightboxIsOpen}
          onClickPrev={this.gotoPrevLightboxImage.bind(this)}
          onClickNext={this.gotoNextLightboxImage.bind(this)}
          showThumbnails={true}
          onClose={() => {
            this.setState({ lightboxIsOpen: false });
          }}
        />
      </div>
    );
  }
}

export default CheckoutPhotos;
