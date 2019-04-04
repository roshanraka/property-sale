import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.dunyalabs.propertysale{
   export class Bank extends Participant {
      bankId: string;
      name: string;
   }
   export class Person extends Participant {
      email: string;
      name: string;
      bank: Bank;
   }
   export class Address {
      street: string;
      city: string;
      country: string;
   }
   export class Property extends Asset {
      propertyId: string;
      address: Address;
      area: number;
      owner: Person;
   }
   export enum ProposalStatus {
      OPEN,
      CLOSED,
      SETTLED,
   }
   export class SaleProposal extends Asset {
      proposalId: string;
      minimumPrice: number;
      status: ProposalStatus;
      property: Property;
      seller: Person;
   }
   export class Quote extends Asset {
      quoteId: string;
      price: number;
      sellerConfirmation: boolean;
      saleProposal: SaleProposal;
      buyer: Person;
   }
   export class RegisterForSale extends Transaction {
      identifier: string;
      price: number;
      property: Property;
      seller: Person;
   }
   export class SubmitQuote extends Transaction {
      quoteId: string;
      price: number;
      saleProposal: SaleProposal;
      buyer: Person;
   }
   export class CommitQuote extends Transaction {
      quote: Quote;
      seller: Person;
   }
// }
