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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { PropertyComponent } from './Property/Property.component';
import { SaleProposalComponent } from './SaleProposal/SaleProposal.component';
import { QuoteComponent } from './Quote/Quote.component';

import { BankComponent } from './Bank/Bank.component';
import { PersonComponent } from './Person/Person.component';

import { RegisterForSaleComponent } from './RegisterForSale/RegisterForSale.component';
import { SubmitQuoteComponent } from './SubmitQuote/SubmitQuote.component';
import { CommitQuoteComponent } from './CommitQuote/CommitQuote.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Property', component: PropertyComponent },
  { path: 'SaleProposal', component: SaleProposalComponent },
  { path: 'Quote', component: QuoteComponent },
  { path: 'Bank', component: BankComponent },
  { path: 'Person', component: PersonComponent },
  { path: 'RegisterForSale', component: RegisterForSaleComponent },
  { path: 'SubmitQuote', component: SubmitQuoteComponent },
  { path: 'CommitQuote', component: CommitQuoteComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
