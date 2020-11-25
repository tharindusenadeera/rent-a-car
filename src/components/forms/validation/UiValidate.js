import { Component } from 'react';
import {findDOMNode} from 'react-dom';

const $ = window.$;

export default class UiValidate extends Component {

  componentDidMount() {

    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  isValid(){

    let form = $(findDOMNode(this));
    let errorElement = "<span class='fields-error'></span>";
    let isValid = true;
    const { validateCommonOptions } = this.props;
    //clear all errors

    form.find('[data-validate-input]').each(function () {
      var $input = $(this), fieldName = $input.attr('name');
      if (validateCommonOptions.rules[fieldName]['required'] && $input.val() === '' ) {
        isValid = isValid === true? false : isValid;
        $input.addClass('error');
        $input.parent().parent().find("span").remove();
        $input.parent().parent().append($(errorElement).text(validateCommonOptions.messages[fieldName]['required']));
      }
      else if (validateCommonOptions.rules[fieldName]['email'] && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test($input.val())) {
        isValid = isValid === true? false : isValid;
        $input.addClass('error');
        $input.parent().parent().find("span").remove();
        $input.parent().parent().append($(errorElement).text(validateCommonOptions.messages[fieldName]['email']));
      }
      else if (validateCommonOptions.rules[fieldName]['maxlength'] && $input.val().length > validateCommonOptions.rules[fieldName]['maxlength'] ) {
        isValid = isValid === true? false : isValid;
        $input.addClass('error');
        $input.parent().parent().find("span").remove();
        $input.parent().parent().append($(errorElement).text(validateCommonOptions.messages[fieldName]['maxlength']));
      }
      else if (validateCommonOptions.rules[fieldName]['minlength'] && $input.val().length < validateCommonOptions.rules[fieldName]['minlength'] ) {
        isValid = isValid === true? false : isValid;
        $input.addClass('error');
        $input.parent().parent().find("span").remove();
        $input.parent().parent().append($(errorElement).text(validateCommonOptions.messages[fieldName]['minlength']));
      }
      else if (validateCommonOptions.rules[fieldName]['tac'] && !$input.prop('checked') ) {
        isValid = isValid === true? false : isValid;
        $input.addClass('error');
        $input.parent().parent().find("span").remove();
        $input.parent().parent().append($(errorElement).text(validateCommonOptions.messages[fieldName]['tac']));
      }
      else{
        $input.parent().parent().find("span").remove();
        $input.removeClass('error');
      }
    });

    return isValid;
  }

  applyFieldError(fieldName, value, errorMessage){
    var $input = $("input[name=" + fieldName + "]");
    if(value !== '') {
      let errorElement = "<span class='fields-error'></span>";
      $input.addClass('error');
      $input.parent().parent().find("span").remove();
      $input.parent().parent().append($(errorElement).text(errorMessage));
    }
    else {
      $input.removeClass('error');
      $input.parent().parent().find("span").remove();
    }
  }

  render() {
    return (
      this.props.children
    )
  }
}
