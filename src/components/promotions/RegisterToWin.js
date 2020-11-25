import React, {Component} from 'react';
import { connect } from 'react-redux'
import Modal from 'react-modal';
import {modalStyles} from '../../consts/consts';
import {registerToWinStore} from '../../actions/PromotionAction'



class RegisterToWin extends Component{
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            email: '',
            zipcode: '',
            error: null,
            shwoRules: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillMount(){
        if(this.props.authenticated === false && (typeof(localStorage.registerToWinPopIsClosed) === "undefined" || localStorage.registerToWinPopIsClosed === false)) {
          this.setState({showModal:true})
          console.log('here')
        }
      }


    componentWillReceiveProps(nextProps){
        if(this.props.error !== nextProps.error && nextProps.error !== false){
            this.setState({error:nextProps.error});
        }
    }

    handleSubmit(e){
        const {email,zipcode} = this.state;
        const {dispatch} = this.props;
        if(!email){
            this.setState({error:'Email address Required'});
        }else if(email  && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
            this.setState({error:'Invalid email address'});
        }else if(zipcode == ''){
            this.setState({error:'zipcode Required'});
        }else{
            this.setState({error:null});
            dispatch(registerToWinStore({
                email:email,
                zipcode:zipcode
            }))


        }
    }

    handleCloseModal(){
        this.setState({ showModal: false })
        localStorage.setItem('registerToWinPopIsClosed',true)
    }
    render(){
        return(
            <Modal className="coupon-modal" isOpen={this.state.showModal}
           // onRequestClose={this.handleCloseModal}
            contentLabel="Modal"
            shouldCloseOnOverlayClick={true}
            style={modalStyles}
            >
            <a style={{fontSize:'25px'}} className="pull-right" onClick={()=> this.handleCloseModal()}><img role="presentation" className="img-responsive" src="images/close.png"/></a>
            <div className="modal-content-wrap">
                <div className="col-md-6">
                    <h3>Enter your e-mail address to</h3>
                    <h1>Win $1000 !<sup>*</sup></h1>
                    <form onSubmit={(e)=>{this.handleSubmit(); e.preventDefault()}}>
                        <input type="text" className="form-control" placeholder="Your e-mail address" name="emial" value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}} />
                        <br></br>
                        <input type="tyext" className="form-control" placeholder="Zip" name="zipcode" value={this.state.zipcode} onChange={(e)=>{this.setState({zipcode:e.target.value})}} />
                        <br></br>
                        <span style={{color:'red'}}>{ this.state.error }</span><br/>
                        <button type="submit" className="btn btn-success">JOIN NOW</button>
                    </form>

                    <br></br>
                    <small style={{marginLeft:'0px'}}>
                        <ul>
                            <li>Click here to win $1000 and make money on your car, You need to sign up in order to enter the contest.  One entry per household  One guaranteed winner announced on 02/01/2018  (<strong><a href="#" onClick={()=> { (this.state.shwoRules)? this.setState({shwoRules:false}) : this.setState({shwoRules:true}) }}> {(this.state.shwoRules)? 'X': 'Terms'}</a></strong>)</li>
                        </ul>
                    </small>
                    { (this.state.shwoRules)?
                    <div style={{height:'400px', overflowY:'scroll'}}>
                        <p>
                            OFFICIAL REGISTER TO WIN $1000 ONLINE CONTEST RULES NO PURCHASE IS NECESSARY TO ENTER OR WIN A PRIZE<br/>
                            Ryde is giving Ryde users the  chance to REGISTER TO WIN $1000 ONLINE Contest (the “Contest”), a chance to win one (1) $1000.00 check. This Contest is governed by these Rules, as well as by Ryde, Inc’ Official General Contest Rules (“General Rules”). In the event there is a discrepancy or inconsistency between these Rules and the General Rules, these Rules shall govern. Any individual who enters, attempts to enter or in any way participates or attempts to participate in the Contest (“Participant”) agrees to be bound by the terms and conditions provided in these Rules and to the extent applicable the General Rules, as well as by all interpretations of these Rules by Ryde.<br/>
                            NO PURCHASE NECESSARY:<br/>
                            No purchase is necessary to enter or win a prize. A purchase will not improve your chances of winning.<br/>
                            APPLICABLE LAW (VOID WHERE PROHIBITED):<br/>
                            All Contests are subject to and governed by applicable federal, state and local laws and regulations. Participation in this Contest is void where prohibited or otherwise restricted by law.<br/>
                            CONTEST SPONSORS:<br/>
                            The sponsor of the contest is Ryde, Inc (the “Sponsors”).<br/>
                            CONTEST CANCELLATION, SUSPENSION OR MODIFICATION:<br/>
                            Ryde reserve the right to cancel, terminate, modify or suspend the Contest if it is not capable of being completed as planned for any reason, including, but not limited to, infection by computer virus, “bugs”, tampering, unauthorized intervention, fraud, or technical failures of any kind or any other causes which corrupt or affect the administration, security, fairness, integrity, or proper conduct of any such Contest.<br/>
                            ELIGIBILITY:<br/>
                            Geographical, Age and Parental Consent Requirements: The Contest is open to the legal United States residents of the states of California in Southern California who are at least 18 years of age or older at time of entry (unless otherwise specified). If the Participant has not reached the age of majority in the jurisdiction in which the Participant resides, they must obtain permission from their parent or legal guardian prior to entering the Contest. Ryde reserve the right to refuse to award a prize to or on behalf of a minor.<br/>
                                
                            Contest Entity and Immediate Family Member Ineligibility: The officers, directors, employees, contractors, and agents of Ryde Inc Operating Company, any other Sponsor(s) and any entity involved in the sponsorship, development, production, implementation and distribution of any Contest as well as their respective parents, affiliates, divisions, subsidiaries and successor companies (collectively the “Contest Entities”), and their immediate family members (and those living in the same household, whether or not related), are prohibited from participating in any Contest and do not qualify as Participants. “Immediate family members” shall include spouses, siblings, parents, children, grandparents, and grandchildren, whether as “in-laws”, or by current or past marriage, remarriage, adoption, co-habitation or other familial extension.<br/>

                            HOW TO ENTER:<br/>
                            The Contest begins on December 11th, 2017 at 12:01am PST and ends on January 30th, 2018 at 9am PST (the “Entry Period”). During the Entry Period, eligible Participants will be required to register at www.rydecars.com, fully email entrant’s full name, mailing address, phone number and date of birth to support@rydecars.com All entries must be received no later than January 30th, 2018 at 9am PST.<br/>
                            One (1) confirmed grand prize winner(s) will be randomly chosen during the contest period from all entries and will be awarded one (1) $1000.00USD check. Grand prize winners will be randomly chosen on February 1st, 2018 at 10am PST.<br/>
                            Entries Are the Sole and Exclusive Property of Sponsors: All Contest entries and/or related submissions become the sole and exclusive property of the Sponsors upon transmission. Contest entries will not be returned and may be used by any Contest Entity for any purpose whatsoever related to any Contest, without additional compensation to the participant or any other individual or entity.<br/>
                            Disclaimer of Responsibility for Entries: Ryde is not responsible for problems with Contest entries, including but not limited to, entries which are lost, late, misdirected, damaged, incomplete, illegible, or cannot be completed due to electronic or technical difficulties, even if the problem is the result of the sole or partial negligence of Ryde.<br/>
                             

                            False Fraudulent or Deceptive Entries or Acts: Participants who, in the view of Sponsors, provide false, fraudulent or deceptive entries or who engage in false, fraudulent or deceptive acts in connection with the Contest will be disqualified and subject to criminal prosecution.<br/>

                            PRIZES:<br/>
                            Incorrect, incomplete or inaccurate entry information;<br/>
                            Human errors;<br/>
                            Failures, omissions, interruptions, deletions or defects of any wireless network, telephone network, internet service, computer systems, servers, utility providers, or software;<br/>
                            Inability to send a text-message;<br/>
                            Identity theft;<br/>
                            Tampering, destruction or unauthorized access to, or alteration of, entries or
                            Network hackers or other unauthorized access to Ryde’s computer network;<br/>
                            computer data;<br/>
                            Data that is processed late or incorrectly or is incomplete or lost due to wireless network, telephone network, computer or electronic malfunction or traffic congestion on wireless or telephone networks;<br/>
                            Printing errors;<br/>
                            Equipment malfunctions; and<br/>
                            Late, misdirected, lost, misplaced, illegible, mutilated or postage-due entries.<br/>
                             One (1) Total Winner: The one (1) confirmed randomly chosen winner from all entries will be awarded with one (1) $1000.00 USD check (Retail value: $1000.00 USD). No transfer, assignment or substitution of a prize is permitted, except Ryde reserve the right to substitute a prize for an item of equal or greater value in the event an advertised prize is unavailable. Any difference between the actual value and the approximate retail value of any prize will not be awarded. No substitution or cash equivalent will be made.<br/>



                            Sponsors are not responsible for cancellations or delays in travel accommodations and has no obligation to reimburse, refund or otherwise substitute any tickets awarded as a part of a travel prize due to such cancellations or delays.<br/>
                            Sponsors are not responsible for any cancellation or rescheduling of the performance for any reason and has no obligation to reimburse, refund or otherwise substitute the tickets for another prize should the performance not be rescheduled or vouchers not issued.<br/>
                            TAXES:<br/>
                            The Participant prize-winner is solely responsible for determining and paying all federal, state and local taxes (including any sales taxes). Any person winning over $600 in prizes during any one year period will receive an IRS Form 1099 at the end of the calendar year, and a copy of such form will be filed with the IRS.<br/>
                            ODDS OF WINNING:<br/>
                            The odds of winning will depend on the number of eligible entries received.<br/>
                            WINNER SELECTION:<br/>
                            One (1) confirmed grand prize winner(s) will be randomly chosen on February 1st 2018 at 10am PST during the contest period from all entries and will be awarded one (1) $1000.00 USD check or fully paid for trip for two to Las Vegas (airfare and hotel to be chosen by Ryde).<br/>
                            HOW TO CLAIM A PRIZE:<br/>
                            Claiming the Prize: The Participant prize-winner must pick up their prize at Ryde-see address below. Winners will be contacted and provided with information on how to claim prize. Ryde has the right in their sole discretion to mail the prize to the winner. Where this occurs, the winner will initially be sent the required releases and prize claim forms along with a return, pre-paid overnight delivery air bill. Failure by the winner to return completed forms within five (5) business days of receipt of the forms may lead to forfeiture of the prize. Additionally, in the event the prize is mailed to the winner, the winner assumes the risk of the prize's safe and timely arrival.<br/>
                            Prerequisites to Prize Award: Prior to being awarded a prize, winners are required to provide: (1) a valid government-issued photo identification depicting proof of age and (2) a valid taxpayer identification number or social security number. The social security number will be used for tax- reporting purposes. Sponsors reserve the right to deny awarding the prize if the winner fails to provide satisfactory identification, as determined in the Sponsors' sole discretion.<br/>
                               

                            Winner(s) are required to execute an Affidavit of Eligibility, Release of Liability, Indemnification and Publicity Release Agreement and a completed IRS W-9 before any prize is awarded. Winner must be at least 18 years of age and are required to execute an Affidavit of Eligibility, Release of Liability, Indemnification and Publicity Release Agreement prior to receiving the prize. By entering the Contest, Participant agrees to execute these documents if selected as a winner. Except where prohibited by law, failure to execute any of these documents or comply with any of these terms will result in forfeiture of the prize.<br/>
                            Prize Forfeiture: Any winner who fails to pick up the prize within thirty (30) days from the date of winning for any reason, and fails to obtain an extension from Ryde, Inc, will forfeit the prize. Ryde, Inc reserves the right, in its sole discretion, to award unclaimed prizes to alternate contestants or not to award the unclaimed prizes.<br/>
                            Additional Costs: Any costs relating to the prizes are the sole responsibility of the winner. <br/>
                            WARRANTIES AND REPRESENTATIONS:<br/>
                            By entering and participating in the Contest, and in consideration thereof, each Participant individually warrants and represents to Sponsors that they: (i) meet the residency and age requirements at the time of entry; (ii) will be bound by these Rules and the General Rules, and by all applicable laws and regulations, and the decisions of the Sponsors; and (iii) waive any rights to claim ambiguity with respect to these Rules and the General Rules.<br/>
                            RELEASE OF LIABILITY AND INDEMNIFICATION:<br/>
                            As consideration for entering the Contest, all Participants agree to RELEASE, DISCHARGE AND COVENANT NOT TO SUE Ryde, Inc, and any other Contest Entities (as described above) and each of their respective direct and indirect affiliates, divisions, parent and subsidiary companies, officers, employees, shareholders, representatives, managers, members, directors, owners, agents, insurers, attorneys, predecessors, successors, and assigns thereof (collectively, the “Released Parties”), from and against all claims, damages, charges, injuries, losses, proceedings, suits, actions (including but not limited to tort actions, product liability actions, wrongful death actions, warranty actions, breach of contract actions, privacy and defamation actions, misappropriation of likeness actions, identity theft, loss of consortium claims), expenses and attorney fees that they or anyone on their behalf (including but not limited to their heirs, representatives or next of kin) have or might have for any death, injury, damage or claimed injury or damage arising out of, involving or relating to their participation in the Contest, including, but not limited to, any claim that the act or omission complained of was caused in whole or in part by the strict liability or negligence in any form of the Released Parties.<br/>
                            Additionally, as consideration for entering the Contest, all Participants agree to INDEMNIFY, HOLD HARMLESS, AND DEFEND the Released Parties in any action or proceeding from and against all claims, damages, charges, injuries, losses, proceedings, suits, actions (including but not limited to tort actions, product liability actions, wrongful death actions, warranty actions, breach of contract actions, privacy and defamation actions, misappropriation of likeness actions, identity theft, loss of consortium<br/>
                                    
                            claims), expenses and attorney fees that they or anyone on their behalf (including but not limited to their heirs, representatives or next of kin) have or might have for any death, injury, damage or claimed injury or damage arising out of, involving or relating to their participation in the Contest or for their failure to comply with the terms of the above release provision. This agreement to indemnify, hold harmless and defend applies even if the act or omission complained of was allegedly caused in whole or in part by the strict liability or negligence in any form of the Released Parties.<br/>
                            Furthermore, Participant expressly waives and relinquishes all rights and benefits afforded by Section 1542 of the Civil Code of the State of California, and does so understanding and acknowledging the significance and consequence of such specific waiver of Section 1542. Section 1542 of the Civil Code of the State of California states:<br/>
                            “A general release does not extend to claims which the creditor does not know or suspect to exist in his favor at the time of executing the release, which if known by him must have materially affected his settlement with the debtor.”<br/>
                            Thus, notwithstanding the provisions of Section 1542, and for the purpose of implementing a full and complete release and discharge of the Released Parties, Participant expressly acknowledges that this release is intended to include, in its effect, without limitation, all claims which Participant does not know or suspect to exist in Participant’s favor at the time of execution hereof, and that this release contemplates the extinguishment of any such claim or claims. Participant acknowledges and agrees that this general release is specifically intended to be as broad and comprehensive as permitted by California law.<br/>
                            PUBLICITY RELEASE:<br/>
                            Unless prohibited by applicable law, Participant authorizes and irrevocably grants to Ryde  permission to, from time to time, reference and discuss Participant and their participation in the Contest in advertising and/or on their website(s) in photographs, video recordings, digital images, audio recordings, as well as in publications, newsletters, news releases, other printed materials, and in materials made available on the Internet or in other media now known or hereafter developed for any purpose Ryde, Inc and/or the Released Parties deem proper. Such reference and discussion may involve Participant's name and voice, and other personal/biographical material.<br/>
                            DISQUALIFICATION:<br/>
                            All participants agree to be bound by these Rules. Non-compliance with any of these Rules will result in disqualification and all privileges as a Participant will be immediately terminated. Sponsors, in their sole discretion, further reserve the right to disqualify any person for: (i) tampering with the entry process or the operation of the Contest; (ii) gaining an unfair advantage in participating in the Contest; (iii) obtaining winner status using false, fraudulent or deceptive means; or (iv) engaging in otherwise unsportsmanlike, disruptive, annoying, harassing, or threatening behavior.<br/>
                            CAUTION: ANY ATTEMPT BY ANY PARTICIPANT OR ANY OTHER INDIVIDUAL TO DELIBERATELY CIRCUMVENT,
                               

                            DISRUPT OR DAMAGE ORDINARY AND NORMAL OPERATION OF ANY CONTEST, TELEPHONE SYSTEMS OR WEB SITE, OR UNDERMINE THE LEGITIMATE OPERATION OF ANY CONTEST IS A VIOLATION OF CRIMINAL AND CIVIL LAWS. SHOULD SUCH AN ATTEMPT BE MADE, SPONSORS RESERVE THE RIGHT TO SEEK DAMAGES FROM ANY SUCH INDIVIDUAL TO THE FULLEST EXTENT PERMITTED BY LAW.<br/>
                            RULES CHANGES AND INTERPRETATIONS:<br/>
                            Ryde reserve the right in its sole discretion to supplement or make changes to these Rules as well as the rules of any contest at any time without notice. Ryde reserve the right in its sole discretion to interpret the rules of any contest, and such interpretation shall be binding upon all participants.<br/>

                            GOVERNING LAW AND JURISDICTION:<br/>
                            This Contest shall be governed by and construed in accordance with the laws of the State of California, without reference to its conflict of laws principles. By entering the Contest, Participants hereby submit to the jurisdiction and venue of the federal and state courts of California and waive the right to have disputes arising out of the subject matter hereof adjudicated in any other forum. In no event, will any Participant be entitled to injunctive relief or equitable relief of any kind, or restrain the continuation of any Contest.<br/>

                            LIST OF WINNERS: <br/>

                            For a list of any Contest winners send a self-addressed, stamped envelope to: 5757 W. Century Blvd.-7th floor, Los Angeles, CA. 90045 <br/>
                        </p>
                    </div>
                :null }
                </div>
                <div className="col-md-6">
                    <img role="presentation" className="img-responsive" src="images/wallet.png" />
                </div>
            </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    error: state.promotion.registerToWin.error,
    authenticated : state.user.authenticated,
})
export default connect(mapStateToProps)(RegisterToWin);
