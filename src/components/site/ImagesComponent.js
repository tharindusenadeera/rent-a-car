import React, {Component} from "react";
import RydeUpload from "../file-processing/lib/Upload";

/* Profile */
const defaultAvatar = (
    <div>
      <img src={"/images/defaultprofile.jpg"} width="100%" />
    </div>
  );

class ImagesComponent extends React.Component{
    render(){
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <div style={{marginTop:"35px", border:"1px solid #ddd"}}>
                            <RydeUpload
                            cropper
                            folder="tmp/profile"
                            max={1}
                            onUpload={this.getUploadedFiles}
                            uploadBtn={defaultAvatar}
                            />
                        </div>
                    </div>
                    <div className="col-md-9"></div>
                </div>
            </div>
        )
    }
}

export default ImagesComponent;