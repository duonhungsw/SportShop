import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken, ShippingAddress } from '@stripe/stripe-js';

@Pipe({
  name: 'address',
  standalone: true
})
export class AddressPipe implements PipeTransform {

  transform(value?: ConfirmationToken['shipping'] | ShippingAddress, ...args: unknown[]): unknown {
    if (value && 'address' in value && value.name) {
      const { line1, line2, city, state, country, postal_code } =
        (value as ConfirmationToken['shipping'])?.address!;
      return `${value.name}, ${line1}${line2 ? ', ' + line2 : ''}, 
        ${city}, ${state}, ${postal_code}, ${country}`;
    
    // } else if (value && 'line1' in value) {
    //   const { line1, line2, city, state, country, postalCode } =
    //     value as ShippingAddress;
    //   return `${value.name}, ${line1}${line2 ? ', ' + line2 : ''}, 
    //     ${city}, ${state}, ${postalCode}, ${country}`;
    } else {
      return 'Unknown address'
    }
  }


}
