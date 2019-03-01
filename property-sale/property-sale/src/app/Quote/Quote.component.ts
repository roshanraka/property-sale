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
import { QuoteService } from './Quote.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-quote',
  templateUrl: './Quote.component.html',
  styleUrls: ['./Quote.component.css'],
  providers: [QuoteService]
})
export class QuoteComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  quoteId = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  sellerConfirmation = new FormControl('', Validators.required);
  saleProposal = new FormControl('', Validators.required);
  buyer = new FormControl('', Validators.required);

  constructor(public serviceQuote: QuoteService, fb: FormBuilder) {
    this.myForm = fb.group({
      quoteId: this.quoteId,
      price: this.price,
      sellerConfirmation: this.sellerConfirmation,
      saleProposal: this.saleProposal,
      buyer: this.buyer
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceQuote.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
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

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
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
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.dunyalabs.propertysale.Quote',
      'quoteId': this.quoteId.value,
      'price': this.price.value,
      'sellerConfirmation': this.sellerConfirmation.value,
      'saleProposal': this.saleProposal.value,
      'buyer': this.buyer.value
    };

    this.myForm.setValue({
      'quoteId': null,
      'price': null,
      'sellerConfirmation': null,
      'saleProposal': null,
      'buyer': null
    });

    return this.serviceQuote.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'quoteId': null,
        'price': null,
        'sellerConfirmation': null,
        'saleProposal': null,
        'buyer': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.dunyalabs.propertysale.Quote',
      'price': this.price.value,
      'sellerConfirmation': this.sellerConfirmation.value,
      'saleProposal': this.saleProposal.value,
      'buyer': this.buyer.value
    };

    return this.serviceQuote.updateAsset(form.get('quoteId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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


  deleteAsset(): Promise<any> {

    return this.serviceQuote.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
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

    return this.serviceQuote.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'quoteId': null,
        'price': null,
        'sellerConfirmation': null,
        'saleProposal': null,
        'buyer': null
      };

      if (result.quoteId) {
        formObject.quoteId = result.quoteId;
      } else {
        formObject.quoteId = null;
      }

      if (result.price) {
        formObject.price = result.price;
      } else {
        formObject.price = null;
      }

      if (result.sellerConfirmation) {
        formObject.sellerConfirmation = result.sellerConfirmation;
      } else {
        formObject.sellerConfirmation = null;
      }

      if (result.saleProposal) {
        formObject.saleProposal = result.saleProposal;
      } else {
        formObject.saleProposal = null;
      }

      if (result.buyer) {
        formObject.buyer = result.buyer;
      } else {
        formObject.buyer = null;
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
      'quoteId': null,
      'price': null,
      'sellerConfirmation': null,
      'saleProposal': null,
      'buyer': null
      });
  }

}
