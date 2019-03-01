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

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Register a property for sale
 * @param {org.dunyalabs.propertysale.RegisterForSale} sale - 
 * @transaction
 */
async function saleRegister(sale) { // eslint-disable-line no-unused-vars
  const factory = getFactory();
  if(sale.seller == sale.property.owner) {
  	const saleProposal = factory.newResource('org.dunyalabs.propertysale', 'SaleProposal', sale.identifier);
  	saleProposal.minimumPrice = sale.price;
  	saleProposal.property = sale.property;
    saleProposal.status = 'OPEN';
    saleProposal.seller = sale.seller;
    const assetRegistry = await getAssetRegistry('org.dunyalabs.propertysale.SaleProposal');

    // persist the state of the proposal
    await assetRegistry.add(saleProposal);
  }
}

/**
 * Register a property for sale
 * @param {org.dunyalabs.propertysale.SubmitQuote} submitQuote - quote for a proposal
 * @transaction
 */
async function submitQuote(submitQuote) { // eslint-disable-line no-unused-vars
  const factory = getFactory();
  if (submitQuote.price >= submitQuote.saleProposal.minimumPrice) {
    const quote = factory.newResource('org.dunyalabs.propertysale', 'Quote', submitQuote.quoteId);
  	//quote.quoteId = submitQuote.quoteId;
  	quote.price = submitQuote.price;
  	quote.saleProposal = submitQuote.saleProposal;
  	quote.buyer = submitQuote.buyer;
    quote.sellerConfirmation = false;
    const assetRegistry = await getAssetRegistry('org.dunyalabs.propertysale.Quote');

    // persist the state of the proposal
    await assetRegistry.add(quote);
  }
}

/**
 * Register a property for sale
 * @param {org.dunyalabs.propertysale.CommitQuote} commitQuote - 
 * @transaction
 */
async function CommitQuote(commitQuote) { // eslint-disable-line no-unused-vars
	const factory = getFactory();
  if (commitQuote.quote.saleProposal.status == 'OPEN' && commitQuote.quote.saleProposal.property.owner == commitQuote.seller) {
  	commitQuote.quote.sellerConfirmation = true;
  	commitQuote.quote.saleProposal.status = 'SETTLED';
  	commitQuote.quote.saleProposal.property.owner = commitQuote.quote.buyer;
    var assetRegistry = await getAssetRegistry('org.dunyalabs.propertysale.Quote');

    // persist the state of the quote
    await assetRegistry.update(commitQuote.quote);
  
   assetRegistry = await getAssetRegistry('org.dunyalabs.propertysale.SaleProposal');

    // persist the state of the proposal
    await assetRegistry.update(commitQuote.quote.saleProposal);
  
   assetRegistry = await getAssetRegistry('org.dunyalabs.propertysale.Property');

    // persist the state of the property
    await assetRegistry.update(commitQuote.quote.saleProposal.property);
  }
}
