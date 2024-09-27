using BusinessObject.Entities;
using ProductApp.DTOs;

namespace ProductApp.Extensions
{
    public static class AddressMappingExtensions
    {
        public static Address ToEntity(this AddressDTOs addressDTOs)
        {
            if (addressDTOs == null) throw new ArgumentNullException(nameof(addressDTOs));
            return new Address
            {
                Line1 = addressDTOs.Line1,
                Line2 = addressDTOs.Line2,
                City = addressDTOs.City,
                State = addressDTOs.State,
                Country = addressDTOs.Country,
                PostalCode = addressDTOs.PostalCode,
            };
        }
        public static AddressDTOs? ToDtos(this Address? address)
        {
            if (address == null) return null;
            return new AddressDTOs
            {
                Line1 = address.Line1,
                Line2 = address.Line2,
                City = address.City,
                State = address.State,
                Country = address.Country,
                PostalCode = address.PostalCode,
            };
        }
        public static void UpdateFromDto( this Address address,AddressDTOs addressDTOs)
        {
            if (addressDTOs == null) throw new ArgumentNullException(nameof(addressDTOs));
            if (address == null) throw new ArgumentNullException(nameof(address));
            address.Line1 = addressDTOs.Line1;
            address.Line2 = addressDTOs.Line2;
            address.City = addressDTOs.City;
            address.State = addressDTOs.State;
            address.Country = addressDTOs.Country;
            address.PostalCode = addressDTOs.PostalCode;
        }
    }
}
