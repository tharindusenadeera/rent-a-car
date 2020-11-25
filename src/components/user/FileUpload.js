import React , {Component} from 'react'
import ReactDOM from "react-dom"

class FileUpload extends Component{
  
  constructor(){
      super()
      this.handleFile = this.handleFile.bind(this)
  }

  handleFile(e) {
    var reader = new FileReader();
    var file = e.target.files[0];
    if (!file) return;

    reader.onload = function(img) {
      ReactDOM.findDOMNode(this.refs.in).value = '';
      this.props.handleFileChange(img.target.result);
    }.bind(this);
    reader.readAsDataURL(file);
  }

  render(){
    return (
      <input ref="in" type="file" accept="image/*" onChange={this.handleFile} />
    );
  }
}

export default FileUpload