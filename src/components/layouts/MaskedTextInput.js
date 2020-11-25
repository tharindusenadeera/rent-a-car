import React , {Component} from 'react'
import MaskedInput from 'react-text-mask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'

const autoCorrectedDatePipe = createAutoCorrectedDatePipe('mm/dd/yyyy HH:MM')

class MaskedTextInput extends Component{
    render() {
        console.log('autoCorrectedDatePipe',autoCorrectedDatePipe())
        return (
          <div>
            <MaskedInput mask={this.props.mask} autoCorrectedDatePipe={autoCorrectedDatePipe} />
          </div>
        )
      }
}
export default MaskedTextInput;