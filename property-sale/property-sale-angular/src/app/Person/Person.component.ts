/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PersonService } from './Person.service';
import { BankService } from '../Bank/Bank.service';
import { PropertyService } from '../Property/Property.service';
import { RegisterForSaleService } from '../RegisterForSale/RegisterForSale.service';
import { SubmitQuoteService } from '../SubmitQuote/SubmitQuote.service';
import { CommitQuoteService } from '../CommitQuote/CommitQuote.service';
import { SaleProposalService } from '../SaleProposal/SaleProposal.service';
import { QuoteService } from '../Quote/Quote.service';
import 'rxjs/add/operator/toPromise';
import { json } from 'body-parser';
import { async } from 'q';

@Component({
  selector: 'app-person',
  templateUrl: './Person.component.html',
  styleUrls: ['./Person.component.css'],
  providers: [PersonService, BankService, PropertyService, RegisterForSaleService, SubmitQuoteService,
    CommitQuoteService, SaleProposalService, QuoteService]
})
export class PersonComponent implements OnInit {

  namespace = 'org.dunyalabs.propertysale';
  myForm: FormGroup;
  propertyForm: FormGroup;
  address: FormGroup;
  saleForm: FormGroup;
  submitQuoteForm: FormGroup;
  commitQuoteForm: FormGroup;


  private allParticipants;
  private participant;
  private asset;
  private currentId;
  private errorMessage;

  email = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  bank = new FormControl('resource:' + this.namespace + '.Person#bank', Validators.required);

  propertyId = new FormControl('1', Validators.required);
  street = new FormControl('MG Road', Validators.required);
  city = new FormControl('Bengaluru', Validators.required);
  country = new FormControl('India', Validators.required);
  area = new FormControl('560001', Validators.required);
  owner = new FormControl('', Validators.required);

  identifier = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  property = new FormControl('', Validators.required);
  proposalSeller = new FormControl('', Validators.required);
  transactionId = new FormControl(null, Validators.required);
  timestamp = new FormControl(null, Validators.required);

  quoteId = new FormControl('', Validators.required);
  quotePrice = new FormControl('', Validators.required);
  saleProposal = new FormControl('', Validators.required);
  buyer = new FormControl('', Validators.required);

  quote = new FormControl('', Validators.required);
  quoteSeller = new FormControl('', Validators.required);

  private showProperty = false;
  private showProposal = false;
  private showQuotes = false;

  constructor(
    public servicePerson: PersonService, public serviceBank: BankService, public serviceProperty: PropertyService,
    public serviceRegisterForSale: RegisterForSaleService, public serviceSubmitQuote: SubmitQuoteService,
    public serviceCommitQuote: CommitQuoteService, public serviceSaleProposal: SaleProposalService,
    public serviceQuote: QuoteService, public fb: FormBuilder) {
    this.myForm = fb.group({
      email: this.email,
      name: this.name,
      bank: this.bank
    });
    this.address = fb.group({
      street: this.street,
      city: this.city,
      country: this.country,
    });
    this.propertyForm = fb.group({
      propertyId: this.propertyId,
      address: fb.group({
        street: this.street,
        city: this.city,
        country: this.country,
      }),
      area: this.area,
      owner: this.owner
    });
    this.saleForm = fb.group({
      identifier: this.identifier,
      price: this.price,
      property: this.property,
      proposalSeller: this.proposalSeller,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
    this.submitQuoteForm = fb.group({
      quoteId: this.quoteId,
      quotePrice: this.quotePrice,
      saleProposal: this.saleProposal,
      buyer: this.buyer,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
    this.commitQuoteForm = fb.group({
      quote: this.quote,
      quoteSeller: this.quoteSeller,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  async ngOnInit() {
    await this.loadAllParticipants();
    console.log(this.allParticipants);
    let bankObj;
    await this.serviceBank.getAll().toPromise().then((result) => {
      console.log(result);
      bankObj = result;
    });
    if (bankObj.length === 0) {
      bankObj = {
        $class: 'org.dunyalabs.propertysale.Bank',
        'bankId': 'bank',
        'name': 'Dunya Bank'
      };
      await this.serviceBank.addParticipant(bankObj).toPromise();
      this.bank.setValue('resource:' + this.namespace + '.Bank#bank');
    } else {
      console.log(bankObj[0]);
      this.bank.setValue('resource:' + this.namespace + '.Bank#' + bankObj[0].bankId);
    }
    console.log(this.bank.value);
    if (this.allParticipants.length === 0 || this.allParticipants == null) {
      // adding Persons
      const participant1 = {
        $class: 'org.dunyalabs.propertysale.Person',
        'email': 'jon.doe',
        'name': 'Jon Doe',
        'bank': this.bank.value
      };
      const participant2 = {
        $class: 'org.dunyalabs.propertysale.Person',
        'email': 'richard.roe',
        'name': 'Richard Roe',
        'bank': this.bank.value
      };
      const participant3 = {
        $class: 'org.dunyalabs.propertysale.Person',
        'email': 'jane.austen',
        'name': 'Jane Austen',
        'bank': this.bank.value
      };
      await this.servicePerson.addParticipant(participant1).toPromise().then();
      await this.servicePerson.addParticipant(participant2).toPromise().then();
      await this.servicePerson.addParticipant(participant3).toPromise().then();
      this.loadAllParticipants();
    }
    console.log(this.bank.value);
  }

  loadAllParticipants(): Promise<any> {
    const tempList = [];
    return this.servicePerson.getAll()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(participant => {
          tempList.push(participant);
        });
        this.allParticipants = tempList;
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
          this.errorMessage = error;
        }
      });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.dunyalabs.propertysale.Person',
      'email': this.email.value,
      'name': this.name.value,
      'bank': this.bank.value
    };

    this.myForm.setValue({
      'email': null,
      'name': null,
      'bank': this.bank.value
    });

    return this.servicePerson.addParticipant(this.participant)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.myForm.setValue({
          'email': null,
          'name': null,
          'bank': this.bank.value
        });
        this.loadAllParticipants();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else {
          this.errorMessage = error;
        }
      });
  }

  addProperty(form1: any): Promise<any> {
    console.log(this.street.value);
    this.asset = {
      $class: 'org.dunyalabs.propertysale.Property',
      'propertyId': this.propertyId.value,
      address: {
        $class: 'org.dunyalabs.propertysale.Address',
        'street': this.street.value,
        'city': this.city.value,
        'country': this.country.value
      },
      'area': this.area.value,
      'owner': this.owner.value
    };

    this.propertyForm.setValue({
      'propertyId': null,
      address: {
        'street': null,
        'city': null,
        'country': null
      },
      'area': null,
      'owner': null
    });

    return this.serviceProperty.addAsset(this.asset)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.propertyForm.setValue({
          'propertyId': null,
          address: {
            'street': null,
            'city': null,
            'country': null
          },
          'area': null,
          'owner': null
        });
        this.loadProperty();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else {
          console.log
          this.errorMessage = error;
        }
      });
  }

  private Transaction;

  registerForSaleTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.dunyalabs.propertysale.RegisterForSale',
      'identifier': this.identifier.value,
      'price': this.price.value,
      'property': this.property.value,
      'seller': this.proposalSeller.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.saleForm.setValue({
      'identifier': null,
      'price': null,
      'property': null,
      'proposalSeller': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceRegisterForSale.addTransaction(this.Transaction)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.saleForm.setValue({
          'identifier': null,
          'price': null,
          'property': null,
          'proposalSeller': null,
          'transactionId': null,
          'timestamp': null
        });
        this.loadProperty();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else {
          this.errorMessage = error;
        }
      });
  }

  setQuote(quoteId: string) {
    this.quote.setValue('resource:' + this.namespace + '.Quote#' + quoteId);
  }

  commitQuoteTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.dunyalabs.propertysale.CommitQuote',
      'quote': this.quote.value,
      'seller': this.quoteSeller.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.commitQuoteForm.setValue({
      'quote': null,
      'quoteSeller': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceCommitQuote.addTransaction(this.Transaction)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.commitQuoteForm.setValue({
          'quote': null,
          'quoteSeller': null,
          'transactionId': null,
          'timestamp': null
        });
        this.loadProperty();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else {
          this.errorMessage = error;
        }
      });
  }

  submitQuoteTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.dunyalabs.propertysale.SubmitQuote',
      'quoteId': this.quoteId.value,
      'price': this.quotePrice.value,
      'saleProposal': this.saleProposal.value,
      'buyer': this.buyer.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.submitQuoteForm.setValue({
      'quoteId': null,
      'quotePrice': null,
      'saleProposal': null,
      'buyer': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceSubmitQuote.addTransaction(this.Transaction)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.submitQuoteForm.setValue({
          'quoteId': null,
          'quotePrice': null,
          'saleProposal': null,
          'buyer': null,
          'transactionId': null,
          'timestamp': null
        });
        this.loadProperty();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else {
          this.errorMessage = error;
        }
      });
  }


  updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.dunyalabs.propertysale.Person',
      'name': this.name.value,
      'bank': this.bank.value
    };

    return this.servicePerson.updateParticipant(form.get('email').value, this.participant)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.loadAllParticipants();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        } else {
          this.errorMessage = error;
        }
      });
  }


  deleteParticipant(): Promise<any> {

    return this.servicePerson.deleteParticipant(this.currentId)
      .toPromise()
      .then(() => {
        this.errorMessage = null;
        this.loadAllParticipants();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        } else {
          this.errorMessage = error;
        }
      });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.servicePerson.getparticipant(id)
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        const formObject = {
          'email': null,
          'name': null,
          'bank': null
        };

        if (result.email) {
          formObject.email = result.email;
        } else {
          formObject.email = null;
        }

        if (result.name) {
          formObject.name = result.name;
        } else {
          formObject.name = null;
        }

        if (result.bank) {
          formObject.bank = result.bank;
        } else {
          formObject.bank = null;
        }

        this.myForm.setValue(formObject);
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        } else {
          this.errorMessage = error;
        }
      });

  }

  resetForm(): void {
    this.myForm.setValue({
      'email': null,
      'name': null,
      'bank': this.bank.value
    });
  }
  async onChange(participantEmail: string) {

    console.log('in onChange');
    console.log(participantEmail);
    this.participant = this.allParticipants.find((x: any) => x.email == participantEmail);
    if (this.participant != null) {
      await this.loadProperty();
      const person = 'resource:' + this.namespace + '.Person#' + this.participant.email;
      this.owner.setValue(person);
      this.buyer.setValue(person);
      this.quoteSeller.setValue(person);
      this.proposalSeller.setValue(person);
      if (this.propertyAsset.length > 0) {
        this.property.setValue('resource:' + this.namespace + '.Property#' + this.propertyAsset[this.propertyAsset.length - 1].propertyId);
      }
      console.log(this.proposalAsset.length);
      if (this.proposalAsset.length > 0) {
        this.saleProposal.setValue('resource:' + this.namespace + '.SaleProposal#' +
         this.proposalAsset[this.proposalAsset.length - 1].proposalId);
      }
    } else {
      this.propertyAsset = [];
      this.proposalAsset = [];
      this.quotesSubmitted = [];
      this.quotesToCommit = [];
    }
  }

  private propertyAsset = [];

  loadProperty(): Promise<any> {
    if (this.participant === null) {
      return;
    }
    const tempList = [];
    return this.servicePerson.getAllProperty()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(asset => {
          if (asset.owner.split('#')[1] === this.participant.email) {
            tempList.push(asset);
          }
        });
        this.propertyAsset = tempList;
        this.loadPropasals();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        } else {
          this.errorMessage = error;
        }
      });
  }

  private proposalAsset = [];

  loadPropasals(): Promise<any> {
    const tempList = [];

    return this.servicePerson.getAllProposal()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(asset => {
          tempList.push(asset);
        });
        this.proposalAsset = tempList;
        this.loadQuotes();
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        } else {
          this.errorMessage = error;
        }
      });
  }

  private quotesToCommit = [];
  private quotesSubmitted = [];

  loadQuotes(): Promise<any> {
    const tempList = [];
    const tempList2 = [];
    return this.servicePerson.getAllQuotes()
      .toPromise()
      .then((result) => {
        this.errorMessage = null;
        result.forEach(asset => {
          this.proposalAsset.forEach(proposal => {
            if (asset.saleProposal.split('#')[1] === proposal.proposalId && proposal.seller.split('#')[1] === this.participant.email) {
              tempList.push(asset);
            }
          });
          if (asset.buyer.split('#')[1] === this.participant.email) {
            tempList2.push(asset);
          }
        });
        this.quotesToCommit = tempList;
        this.quotesSubmitted = tempList2;
      })
      .catch((error) => {
        if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
        } else if (error === '404 - Not Found') {
          this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        } else {
          this.errorMessage = error;
        }
      });
  }

  reset() {
    // this.servicePerson.getAll().toPromise().then((result) => {
    //   result.forEach(participant => {
    //     this.servicePerson.deleteParticipant(participant.email).toPromise();
    //   });
    // });
    this.serviceProperty.getAll().toPromise().then((result) => {
      result.forEach(asset => {
        this.serviceProperty.deleteAsset(asset.propertyId).toPromise();
      });
    });
    this.serviceSaleProposal.getAll().toPromise().then((result) => {
      result.forEach(asset => {
        this.serviceSaleProposal.deleteAsset(asset.proposalId).toPromise().then(() => {
          this.errorMessage = null;
        });
      });
    });
    this.serviceQuote.getAll().toPromise().then((result) => {
      result.forEach(asset => {
        this.serviceQuote.deleteAsset(asset.quoteId).toPromise();
      });
    });
    this.loadProperty();
  }

}


