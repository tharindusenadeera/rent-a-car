import React, { Component } from "react";
import Modal from "react-modal";
import { isMobileOnly } from "react-device-detect";
import {
    defaultModelPopup,
    defaultMobileModelPopup
} from "../../consts/consts.js";
import { Checkbox } from "antd";
import "antd/lib/checkbox/style/index.css";

class TermsConditionCheckbox extends Component{
    constructor(props) {
        super(props);
        this.state = {
          showModalTerms: false
        };
    }
    _toggleModalTerms = () => {
        this.setState({
            showModalTerms: !this.state.showModalTerms
        })
    }
    

    render(){
        const { submitting } = this.state;
        const { onChange,value } = this.props
        return(
            <div>
                <Checkbox value={value}  onChange={(e)=> onChange(e.target.checked)} >
                    I agree to the 
                </Checkbox>
                <a onClick={() => this._toggleModalTerms()}>terms and conditions</a>
                <Modal
                    isOpen={this.state.showModalTerms}
                    onRequestClose={() => this.setState({ showModalTerms: false })}
                    shouldCloseOnOverlayClick={true}
                    contentLabel="Modal"
                    style={isMobileOnly ? defaultMobileModelPopup : defaultModelPopup}
                >
                    <div className="booktrip-popup">
                        <div className="termscondition-modal">
                            <div className="form-inner">
                                <div className="booktrip-header">
                                    <h1>Terms of service</h1>
                                    <div className="close-popup">
                                        <span
                                        className="icon-cancel"
                                        onClick={() => !submitting && this._toggleModalTerms()}
                                        />
                                    </div>
                                </div>
                                <div className="popupform-inner">
                                    <div className="popupform-inner-scroll">
                                    {/* Content - Start */}
                                    <div className="popupform-section">
                                        <h5>Term</h5>
                                        <p>The term of this Agreement begins as of the date You click on “I Agree” and/or by downloading “End-User Agreement” and Company is in receipt of Your agreement to be bound by the Agreement. The terms of the Agreement shall end after all fees have been satisfactorily paid and the vehicle has been satisfactorily returned and accepted by Owner.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Type of service</h5>
                                        <p>Company is engaging in the business of providing an online platform that connects Owners seeking to rent their vehicles to Renters. Company is accessible online including at www.rydecars.com and as an application for mobile devices (Company’s websites, blog, and mobile applications are hereinafter collectively referred to as “the Services”).</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>User account</h5>
                                        <p>You agree to create a User Account on Company’s website at the time of rental and maintain this User Account as Your sole User Account. You agree to be bound by all terms of the User Account and agree that you will not disclose your password to any third parties, entities, and that you will take sole responsibility for any activities or actions under Your User-Account, whether or not you have authorized such activities or actions. You will immediately notify Company of any actual or suspected unauthorized use of Your User Account. Company is not responsible for Your failure to comply with this clause, or for any delay in shutting down or protecting Your account after You have reported unauthorized access to us. You further agree to permit access to Your User Account if Company deems needed.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Authorization for credit check</h5>
                                        <p>By agreeing to rent vehicles from Owners, You agree and authorize that Company has the sole discretion to conduct and obtain, in accordance with the Fair Credit Reporting Act, applicable consumer reporting laws, or any similar laws, Your personal and/or business auto insurance score, credit report and/or conduct a background check, including a criminal background check where permissible under applicable law. You are also authorizing Company to obtain your personal and/or business auto insurance score, credit report or conduct a background check when Company reasonably believes there may be an increased level of risk associated with your rental. <strong>In addition the forgoing, You consent and authorize Company to conduct a Motor Vehicle Report Check (MVR) prior to the rental of the vehicle.</strong></p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Duty to provide truthful information</h5>
                                        <p>As user of Company Services, You agree to disclose all information that is truthful as requested by Company and agree to update Your information in the event of any changes to Your driving record, contact information, or background.<br/><br/>
Company may deliver notices to you at the most recent email, telephone, or billing address provided by You, and those notices will be considered valid even if You no longer maintain the email account, telephone number, or receive mail at that address unless you provide updated contact information to us. Also, you are and will be solely responsible for all of the activity that occurs through your account, so please keep your password and account information secure.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Duties</h5>
                                        <p>You agree to use Your User Account and the Services provided by Company in compliance with the terms of this Agreement, all applicable law, and any other policies and standards provided to You by Company at the time of rental.<br/><br/>
As an Owner, you commit that you will provide a safe and legally registered and insured vehicle, with a clean (non-salvage/branded) title, in good mechanical condition, on-time to the Renter.<br/><br/>
As Renter, you commit that you’ll be a legally licensed driver, who will treat the vehicle well and will take all reasonable measures to return the vehicle on time in essentially the same condition that you received it. In connection with Your use of or access to the Services <strong>You agree, as Owner, Renter that:</strong>
                                        </p>
                                        <p>
                                        <ul>
                                            <li>
                                                Not violate any State of Federal laws, City Ordinances, or other applicable rules and regulations governing the terms of the Services provided herein;
                                            </li>
                                            <li>
                                                Not post false, inaccurate, misleading, defamatory, or libelous content;
                                            </li>
                                            <li>
                                                Not act in such a manners as to damage the vehicle or modify, change, destroy the Vehicle;
                                            </li>
                                            <li>
                                                No submit any false information in reference to Your, name, date of birth, drivers’ license, credit card, insurance, or other personal information;
                                            </li>
                                            <li>
                                                Not offer, as an Owner, of any vehicle that you do not yourself own or have authority to rent;
                                            </li>
                                            <li>
                                                Not offer, as an owner, any vehicle that may not be rented pursuant to the terms and conditions of an agreement with a third party, including, but not limited to, a lease or financing agreement;
                                            </li>
                                            <li>
                                                Not offer, as an owner, any vehicle that has a salvaged, branded, or unclean title or that is not safe, legally registered, (and insured) to be driven on public roads;
                                            </li>
                                            <li>Not rent or drive any vehicle without a valid driver’s license;</li>
                                            <li>
                                                Not submit any listing with false or misleading information, or submit any listing with a price that you do not intend to honor;
                                            </li>
                                            <li>
                                                Not create or register for a User Account on behalf of an individual other than Yourself;
                                            </li>
                                            <li>
                                                Not impersonate any person or entity, or falsify or otherwise misrepresent Yourself or Your affiliation with any person or entity;
                                            </li>
                                            <li>
                                                Timely pay your fees or other amounts owed to Company or another user;
                                            </li>
                                            <li>
                                                Will, as either an Owner, Renter, timely deliver, make available, or return any vehicle;
                                            </li>
                                            <li>
                                                Refrain from independently, without knowledge to Company, contact, entice, agree to rent, directly from either Owner or Renter and/or utilize third parties to contact, entice, Owners and/or Renters to perform services provided herein directly to You;
                                            </li>
                                            <li>
                                                Not allow anyone other than the Renter to drive the vehicle you have rented;
                                            </li>
                                            <li>
                                                At the time of taking custody of the rental vehicle, Renter agrees to be present to pick up vehicle
                                            </li>
                                            <li>
                                                Not rent any vehicles that are the subject of any recalls, damages, engine defects, defective in any manner whatsoever;
                                            </li>
                                            <li>
                                                Not use the rented vehicle for unlawful purposes and/or constitutes a violation of State and Federal Law;
                                            </li>
                                            <li>
                                                Not interfere in any manner whatsoever that results in the obstruction of Services provided by Company.
                                            </li>
                                            <li>
                                                Maintain or purchase a valid Insurance coverage under Your name that will cover the rented vehicle against damage or destruction or third party claims;
                                            </li>
                                            <li>Return the vehicle in the condition that You rented.</li>
                                        </ul>
                                        </p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Scope of use:</h5>
                                        <p>Renter will use the vehicle only for personal use, and operate the vehicle only on properly maintained roads and parking lots.  Renter will comply with all applicable laws relating to holding of licensure to operate the vehicle, and pertaining to operation of motor vehicles.  Renter will not sublease the Rental Vehicle or use it as a vehicle for hire. Renter will not take the vehicle to foreign countries or states and will agree to use the vehicle within the borders of the governing state that rental initiated.<br/><br/>
                                        Renter is stickily prohibited driving under influence, handing the car to another driver. It is also prohibited to take the vehicle out of the state where it’s initially rented from, without prior permission from the company, Ryde.<br/><br/>
                                        Renter agrees that when renting a vehicle from an Owner, Renter must use the vehicle only for his/her personal use and not for any commercial purposes (e.g. driving for Uber or Lyft) unless Renter has express written permission from Company or Owner. Renter may not access a vehicle until the beginning the rental period and Renter must return the vehicle on time and in the correct location. Renter must exercise reasonable care in use of the vehicle. You are required at all times to operate the vehicle safely, and in compliance with all applicable laws, including without limitation, speed limits and prohibitions on impaired or distracted driving. In the event Company has any concern about Your use of a vehicle, Company reserves the right to terminate Your reservation in its discretion at any time and require the return of the vehicle, including recovering the vehicle on behalf of the Owner. Renter is also required to wear seat belts during the operation of the vehicle and to require that all of Renter’s passengers wear seat belts. Renters are also required to meet any laws or regulations concerning car seats and other protections for young passengers.
                                        </p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Inspection of vehicle:</h5>
                                        <p>You understand that third parties own the vehicles offered through the Services. Each Owner is responsible for complying with all legal requirements (including ensuring the vehicle is registered and insured) and maintaining their vehicle(s) in safe and roadworthy condition. Renter is advised to complete a visual inspection before Renter begins use of the vehicle. If there are damages in Renter’s initial inspection, Renter must inform Owner and Company of such pre-existing damage at the start of the reservation to ensure Renter is not held responsible for pre-existing damage. If Renter fails to report any damages to the vehicle at the time of initial inspection, Company may assume that the damage occurred during the rental period. Further if, during the initial inspection, you believe that the vehicle is not safe to drive, please do not use the vehicle; in that event, please contact the Company and inform Owner.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Incident reporting:</h5>
                                        <p>It is Your primary responsibility to notice Company of any incidents, damages, claims against You that arise out of the use of the vehicle during the rental period and thereafter. If there has been a collision, You must inform the police or law enforcement entity and obtain a collision report and present it to Company and Owner. It is Your responsibility to employ all reasonable efforts to secure evidence from any available witnesses and to provide Company, Owner, or third party claims administrators with a written description of the incident and any other information requested, including identity and insurance information of any parties involved in the incident. You are also required to cooperate in any loss investigation conducted by Company, third party claims administrators, or insurers.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Security deposit:</h5>
                                        <p>Renter will be required to provide valid credit card information sufficient to cover the rental and any losses therefrom to Company. In the event of excess use (ie driving over the permitted scope of consent), maintenance costs incurred from post rental, damage to the Vehicle, etc., Company retains the right, and You authorize Company, to charge Your credit card if you fail to pay Company for these expenses within 48 hours of Company notifying You of these charges.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Insurance:</h5>
                                        <p>Unless Renter agrees to obtain insurance from Company prior to rental, Renter must provide to Owner with proof of insurance that would cover damage to the Rental Vehicle at the time this Car Rental Agreement is signed, as well as personal injury to the Renter, passengers in the Rented Vehicle, and other persons or property.
                                        <br/><br/>
                                        Even if Renter purchases insurance from Company at the time of Rental, if the Rental Vehicle is damaged, destroyed and/or results in injury to individuals or property as a result of Renter’s possession of Vehicle, Renter agrees to pay any required insurance deductible and also assign all rights to collect insurance proceeds to Owner.
                                        <br/><br/>
                                        In the event Renter refuses to get insurance offered by Company and elects to have the Vehicle covered under Renter’s own insurance, Renter shall be held liable to Company and Owner if the Rental Vehicle is damaged, destroyed and/or results in injury to individuals or property as a result of Renter’s possession of Vehicle.
                                        <br/><br/>
                                        In the event Owner and/or Renter declines to get insurance offered by the Company, and the Vehicle is damaged, destroyed and/or results in injury to individuals or property as a result of Renter’s possession of Vehicle, Owner and Renter will utilize their own insurance coverage to pay for any and all damages and not seek liability under the Company’s insurance coverages, if any.
                                        <br/><br/>
                                        Coverage will be denied if any of the following occurs; if renter drives under influence, hand keys to another driver without prior permission from the company, Ryde or takes the car out of the state where it was rented without company permission.
                                        <br/><br/>
                                        In any event, Company shall not be held personally liable to any third parties, Owners, Renters other than the Company Insurance Policy limits. In the event Renter refuses to get insurance offered by Company and elects to have the Vehicle covered under Renter’s own insurance, Renter shall be personally liable to any damages caused to the vehicle or third parties and agree to indemnify any claims filed by Owner or third parties for damages sustained to including but not limited to, the rental, third party bodily injuries, third party property damage. In the event Owner refuses to get insurance offered by Company and elects to have the Vehicle covered under Owner’s own insurance, Owner shall be personally liable to any damages caused to the vehicle or third parties and agree to indemnify any claims filed by Renter or third parties for damages sustained including but not limited to, the rental, third party bodily injuries, third party property damage.
                                        <br/><br/>
                                        Under Ryde insurance coverage vehicle is not covered or denied coverage if the vehicle damage caused by fire, flood or defect of manufacture.
                                        </p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Price of car:</h5>
                                        <p>Ryde will determine the rental value of Rental if Owner does not allocate a rental price. If owner gives the rental then Ryde will not state the rental price.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Indemnification:</h5>
                                        <p>Renter agrees to indemnify, defend, and hold harmless the Owner for any loss, damage, or legal actions against Owner as a result of Renter’s operation or use of the Rented Vehicle during the term of this Car Rental Agreement.  This includes any attorney fees necessarily incurred for these purposes.  Renter will also pay for any parking tickets, moving violations, or other citations received while in possession of the Rented Vehicle.
                                        <br/><br/>
Owner agrees to indemnify, defend, and hold harmless the Renter for any loss, damage, or legal actions against Renter as a result of any defective vehicle rented to Renter. This includes any attorney fees necessarily incurred for these purposes.  
<br/><br/>
Both Owner and Renter agrees to indemnify, defend, and hold harmless the Company for any loss, damage, or legal actions against Company as a result of Owner’s renting and/or Renter’s operation or use of the vehicle during the term of this Agreement.  This includes any attorney fees necessarily incurred for these purposes.  </p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Theft of vehicle:</h5>
                                        <p>In most states it is a felony to fail to return a rental vehicle within a certain period of time after the rental period has expired. As such, unless otherwise agreed, if You fail to return the vehicle by the due date and time, Company, Owner, retains the right inform authorities that the vehicle was the subject of theft. Additionally, the following instances may result in the reporting of the vehicle as a theft if: If You misrepresent facts to the Owner, Company, pertaining to rental, use, or operation of vehicle; If the vehicle’s interior components are stolen or damaged when vehicle is unlocked or keys are not secured during the rental period; If you fail or refuse to communicate in “good faith” with vehicle owner, police, Company, or other authorities with a full report of any accident or vandalism involving the vehicle or otherwise fails to cooperate in the investigation of any accident or vandalism; If the vehicle is operated by anyone who has given a fictitious name, false address, or a false or invalid driver’s license; whose driver’s license becomes invalid during the rental period; who has obtained the keys without permission of the vehicle owner; or who misrepresents or withholds facts to/from the Owner and/or Company material to rental, use or operation of Vehicle.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Right to take custody of the vehicle:</h5>
                                        <p>Either Company, Owner and/or their hired agents may repossess any vehicle rented without demand, at the Renter’s expense, if the vehicle is not returned by the end of the reservation, is found illegally parked, apparently abandoned, or used in violation of applicable law or these Terms.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Vehicle lost or stolen:</h5>
                                        <p>If a vehicle you have rented through Company is deemed missing and/or is stolen during the rental period (or extension period), Renter, must immediately make arrangements to notify Company and Owner and return the original ignition keys to the Owner; cause to be filed a police report immediately after discovering the vehicle is missing or stolen, but in no event more than 24 hours after discovering it has gone missing; and cooperate fully with the Owner, law enforcement, Company, and other authorities in all matters related to the investigation.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Reserved vehicles:</h5>
                                        <p>Upon reservation by Renter, Owner must make the vehicle available or deliver the vehicle as expected by the Renter. Owner may offer Renter the option to pick up Owner’s vehicle at a persistent specified location, in such event Owner must supply the location of the vehicle accurately to Company and ensure that the vehicle is available at that location at the beginning of the rental period. It is the Owner’s responsibility to verify Renters information prior to release of the Vehicle.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Maintenance:</h5>
                                        <p>As Owner, you are required to regularly check the vehicle for any defects in its operations or safety. As Owner, you promise that, at all times, the vehicle will be in safe and roadworthy condition, in good mechanical condition, and in full compliance with all applicable inspection and registration requirements. As Owner, you will only list vehicles with a clean, non-salvaged, and non-branded title. As Owner, you agree to respond to any applicable recall or similar safety notices and to complete any recommended action before allowing your vehicle to be rented. In addition, if Company has information to believe that the vehicle does not conform to reasonable standards, Company reserves the right to remove or decline listing the vehicle until its concerns have been resolved.
                                        <br/><br/>
Both Owner and Renter acknowledge that Company does not commit to undertake efforts to ensure the safety of vehicles rented through the Services.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Roadside assistant:</h5>
                                        <p>Company will provide Roadside assistants all the times however, You acknowledge and agree, that You will be liable to pay the Company any and all fees incurred in providing such Roadside assistance to You.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Renter’s election to repair</h5>
                                        <p>With the consent of Owner and Company, in the event Renter elects to repair any damages caused to the vehicle as a result of his/her fault, Renter agrees to conduct any such repairs per the requirements of the Owner and Company. Regardless, Renter shall be liable to Company and Owner, if such repairs do not conform/restore the Vehicle to its original condition that existed at the time of the rental.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Representations and warranties:</h5>
                                        <p>Owner represents and warrants that to Owner’s knowledge, the Vehicle is in good condition and is safe for ordinary operation of the vehicle.
                                        <br/><br/>
Renter represents and warrants that Renter is legally entitled to operate a motor vehicle under the laws of this jurisdiction and will not operate it in violation of any laws, or in any negligent or illegal manner. Renter has been given an opportunity to examine the Vehicle in advance of taking possession of it, and upon such inspection, is not aware of any damage existing on the vehicle other than that notated by between Renter and Owner.
<br/><br/>
Each of the Parties to this Agreement represents, warrants, and agrees that neither Party to this Agreement nor their Agents, officers, employees, representatives, or attorneys have made any statement or representation to any other Party and/or third party regarding any fact relied upon in entering into this Agreement, and neither Party relies upon any statement, representation or promise of any other Party or its Agents, officers, employees, representatives, or attorneys, in executing this Agreement unless, as expressly stated in this Agreement. Each Party to this Agreement has read this Agreement and consulted with their attorneys and understands the contents hereof. Each term of this Agreement is contractual and not merely a recital.
<br/><br/>
You acknowledge and agree that Company makes no warranty that the Services, including, but not limited to, the listing and/or any vehicle, will meet Your requirements or be available on an uninterrupted, secure, or error-free basis. Company makes no warranty regarding the quality of any listings, vehicles, owners, travelers, the Services, or any content or the accuracy, timeliness, truthfulness, completeness, or reliability of any content obtained through the Services.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Images of vehicles :</h5>
                                        <p>You agree that any images of vehicles listed on Company’s website, including other images, are the copyrights, trademarks, of the Company and You will not use, copy or otherwise, for Your personal use or use of other third parties. All vehicles listed on the Company’s website are consented for such use by You. Additionally, Company, by listing such vehicles, does not make any representations about, confirm, or endorse the safety or roadworthiness of any vehicles. It is the sole responsibility of the Owner of the vehicle to ensure their vehicles are in safe and operable condition, legally registered to be driven on public roads, have a clean (non-salvaged/non-branded title), not subject to any applicable safety recalls, and otherwise satisfy our eligibility requirements.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Waiver of liability:</h5>
                                        <p>TO THE EXTENT PERMITTED BY APPLICABLE LAW, YOU WAIVE ANY AND ALL RIGHTS YOU HAVE TO SUE OR MAKE CLAIMS AGAINST COMPANY AND ITS RESPECTIVE SUBSIDIARIES, DIRECTORS, OFFICERS, AGENTS, OR EMPLOYEES (EXCEPT IN THE EVENT WHERE THE COMPANY PROVIDES ITS OWN INSURANCE/PROTECTION) FOR ANY DAMAGES OR LOSSES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICES INCLUDING, WITHOUT LIMITATION, A VEHICLE NOT BEING AVAILABLE WHEN IT WAS SUPPOSED TO BE, ANY MALFUNCTION OF OR DEFECT IN A VEHICLE, ANY BREACH OF WARRANTY OR OTHER OBLIGATION BY ANY MANUFACTURER OR OTHER THIRD PARTY, ANY PERSONAL INJURY OR PROPERTY DAMAGE SUFFERED BY YOU OR ANY OF YOUR PASSENGERS.
                                        <br/><br/>
TO THE EXTENT PERMITTED BY APPLICABLE LAW, YOU WAIVE ANY AND ALL RIGHTS YOU HAVE TO SUE OR MAKE CLAIMS AGAINST ANY COMPANY USER FOR ANY DAMAGES OR LOSSES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE RENTAL VEHICLE IF (1) YOU, AS OWNER DECLINED A PROTECTION PACKAGE VIA COMPANY OR (2) YOU, AS RENTER OPTED TO DECLINE A PROTECTION PACKAGE VIA COMPANY
                                        <br/><br/>
YOU WAIVE CALIFORNIA CIVIL CODE §1542, WHICH STATES: “A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH IF KNOWN BY HIM OR HER MUST HAVE MATERIALLY AFFECTED HIS OR HER SETTLEMENT WITH THE DEBTOR.”</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Arbitration, applicable law, class action waiver:</h5>
                                        <p>You agree that, except to the extent inconsistent with or preempted by federal law, the laws of the State of California , without regard to principles of conflict of laws, will govern the Terms of Service and any claim or dispute that has arisen or may arise between You and Company. You and Company to submit to the personal jurisdiction of Superior Court of California, in the county of Los Angeles and in the Federal Districts in proximity to these county.
                                        <br/><br/>
Any claim or controversies arising among or between the Parties hereto pertaining to the Agreement, or any claim or controversy arising out of or respecting any matter contained in this Agreement or any differences as to the interpretation or performance of any of the provisions of this Agreement, shall be first settled by way of Mediation. If Parties are unable to settle the arisen dispute by way of Mediation, then Parties agree to submit to Binding Arbitration under the prevailing rules and the laws of the State of California. Parties shall choose a neutral Arbitrator and shall share the fees and costs equally. Discovery and investigation in such Arbitration proceedings shall be governed in accordance to the California Code of Civil Procedure. In any arbitration involving this Agreement, the Arbitrator shall not make any award which will alter, change, cancel or rescind any provision of this Agreement, and the award shall be consistent with the provisions of this Agreement. Any such arbitration must be commenced no later than one (1) year from the date such claim or controversy arose, or such claim shall be deemed to have been waived. The award of the Arbitrator shall be final and binding and judgment may be entered thereon in any court of competent jurisdiction. The prevailing Party shall be entitled to attorneys’ fees.
                                        <br/><br/>
YOU AND COMPANY AGREE THAT EITHER PARTY MAY BRING CLAIMS AGAINST THE OTHER ONLY ON AN INDIVIDUAL BASIS AND NOT AS A CLASS MEMBER OF ANY PURPORTED CLASS OR REPRESENTATIVE ACTION OR PROCEEDING. UNLESS BOTH PARTIES AGREE, THE ARBITRATOR MAY NOT CONSOLIDATE OR JOIN MORE THAN ONE PERSON’S OR PARTY’S CLAIMS, AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A CONSOLIDATED, REPRESENTATIVE, OR CLASS PROCEEDING.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Modifications:</h5>
                                        <p>This Agreement cannot be modified by conduct of either of the You, by the express or implied wavier of terms by either of You, by the express or implied excuse of terms by either of You, by the express or implied refusal to enforce the terms of the Agreement by either of You, and/or any other express or implied manner other than by a written separate agreement, addendum, or written instrument executed by Company.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Amendment and wavier:</h5>
                                        <p>No modification, amendment or waiver of any provision of this Agreement will be effective against the Parties and their Agents unless such modification, amendment or waiver is approved by the Company. The failure of any Party hereto to enforce any of the provisions of this Agreement will in no way be construed as a waiver of such provisions and will not affect the right of such Party thereafter to enforce each and every provision of this Agreement in accordance with its terms.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Termination:</h5>
                                        <p>Ryde reserves the right, at any time and without prior notice, in accordance with applicable law, to remove or disable access to any content that Ryde, at its sole discretion, considers to be objectionable for any reason, in violation of this Agreement, or otherwise harmful to the Services or our community. If we believe you are abusing Ryde, our users, or employees in any way or violating the letter or spirit of any of this Agreement, we may, in our sole discretion and without limiting other remedies, limit, suspend, or terminate your Ryde Account(s) and access to our Services, remove hosted content, deny a claim for coverage, remove and demote your listings, reduce or eliminate any discounts, and take technical and/or legal steps to prevent you from using our Services. Additionally, we reserve the right to refuse or terminate our Services to anyone for any reason at our discretion to the full extent permitted under applicable law.
                                        <br/><br/>
Termination of access to the Services will not release either party from any obligations incurred prior to the termination and Company may retain and continue to use any information previously provided by You. Termination of this Agreement will not have any effect on the disclaimers, waiver or liability limitations, or legal disputes provisions under this Agreement and/or any fees due, and all of those terms will survive any termination of this Agreement.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Transfer and assignments:</h5>
                                        <p>Except as otherwise provided herein, You agree that nothing in the terms of this Agreement constitutes an actual or purported transfer or assignment of any right or interest in a vehicle shared through the Company.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Disclaimers:</h5>
                                        <p>YOU AGREE THAT COMPANY PROVIDES SERVICES THAT ENABLE VEHICLE RENTALS BETWEEN THE OWNERS AND RENTERS. EXCEPT AS OTHERWISE PROVIDED IN THESE TERMS, COMPANY DOES NOT ITSELF PROVIDE VEHICLE RENTAL SERVICES AND IS NOT RESPONSIBLE FOR ANY OF THE ACTS OR OMISSIONS OF ANY OF THE USERS OF ITS SERVICES, THE VEHICLE MANUFACTURER, OR ANY THIRD PARTY PROVIDER OF SERVICES (E.G. IN-VEHICLE GPS OR OTHER SYSTEMS). THE SERVICES ARE PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE EXTENT PERMITTED BY APPLICABLE LAW, WITHOUT LIMITING THE FOREGOING, COMPANY EXPLICITLY DISCLAIMS ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT OR NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Severability:</h5>
                                        <p>Whenever possible, each provision of this Agreement will be interpreted in such manner as to be effective and valid under applicable law, but if any provision of this Agreement is held to be invalid, illegal or unenforceable in any respect under any applicable law or rule in any jurisdiction, such invalidity, illegality or unenforceability will not affect any other provision or any other jurisdiction, but this Agreement will be reformed, construed and enforced in such jurisdiction as if such invalid, illegal or unenforceable provision had never been contained herein.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Agreement is final & complete:</h5>
                                        <p>This Agreement embodies and constitutes the entire understanding between the Parties with respect to the transaction contemplated herein. All prior agreements, understandings, representations, and statements, oral as well as written, are merged into this Agreement. Any representations, promises or agreements not specifically included in this Agreement shall not be binding or enforceable against either Party to this Agreement and their parent corporations, subsidiary corporations, officers, directors, partners, member, joint ventures, predecessors, successors, assigns, agents, employers, employees, and/or representatives.  This is an integrated document.  Neither this Agreement nor any provision hereof may be waived, modified, amended, and/or terminated except by in writing signed by the Parties to this Agreement.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Governing law:</h5>
                                        <p>All questions concerning the construction, validity and interpretation of this agreement and any breach thereof, will be governed by the laws of the State of California without regard to principles of conflict of law.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Direct dealings independent of company:</h5>
                                        <p>In the event, Owner and Renter independently negotiate/complete rentals outside of this User Agreement and/or without knowledge to Company, Owner and Renter acknowledge that such will constitute a breach of the terms of this Agreement and Owner and Renter will be individually liable to each other for any damages that result to the Vehicle, its passengers, third parties, and/or property.</p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Miscellaneous terms:</h5>
                                        <p>
                                            <ul>
                                                <li>
                                                    This Agreement is binding upon and shall inure to the benefit of the Parties hereto, their respective agents, attorneys, employees, representatives, officers, directors, divisions, subsidiaries, affiliates, tenants, assigns, heirs, spouses, sons, daughters, predecessors, dealers, franchisees, successors in interest and shareholders.
                                                </li>
                                                <li>
                                                    This Agreement may be executed in counterparts and/or by facsimile, and when each Party has signed and delivered at least one such counterpart, each counterpart shall be deemed an original, and, when taken together with other signed counterparts, shall constitute one Agreement, which shall be binding upon and effective as to all Parties.
                                                </li>
                                                <li>
                                                    This Agreement is made and entered into on and is effective as of the date of the last signature below.{" "}
                                                </li>
                                            </ul>
                                        </p>
                                    </div>
                                    <div className="popupform-section">
                                        <h5>Construction of terms:</h5>
                                        <p>As used in this Agreement, wherever necessary or appropriate, the singular shall be deemed to include the plural and vice versa, and the masculine gender shall be deemed to include the feminine and vice versa, as the context may require.</p>
                                    </div>
                                    {/* Content - End */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default TermsConditionCheckbox;