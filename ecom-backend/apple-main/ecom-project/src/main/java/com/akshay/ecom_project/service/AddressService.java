package com.akshay.ecom_project.service;

import com.akshay.ecom_project.dto.AddressRequest;
import com.akshay.ecom_project.dto.AddressResponse;
import com.akshay.ecom_project.model.Address;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.repo.AddressRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AddressService {

    @Autowired
    private AddressRepo addressRepo;

    public List<AddressResponse> getAddressesByUser(User user) {
        return addressRepo.findByUser(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Address addAddress(User user, AddressRequest request) {
        if (request.isDefault()) {
            resetDefaultAddress(user);
        }

        Address address = new Address();
        address.setUser(user);
        mapRequestToEntity(request, address);

        return addressRepo.save(address);
    }

    public Address updateAddress(User user, Long addressId, AddressRequest request) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this address");
        }

        if (request.isDefault() && !address.isDefault()) {
            resetDefaultAddress(user);
        }

        mapRequestToEntity(request, address);
        return addressRepo.save(address);
    }

    public void deleteAddress(User user, Long addressId) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this address");
        }

        addressRepo.delete(address);
    }

    public Address setDefaultAddress(User user, Long addressId) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this address");
        }

        resetDefaultAddress(user);
        address.setDefault(true);
        return addressRepo.save(address);
    }

    private void resetDefaultAddress(User user) {
        List<Address> addresses = addressRepo.findByUser(user);
        for (Address addr : addresses) {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepo.save(addr);
            }
        }
    }

    private void mapRequestToEntity(AddressRequest request, Address address) {
        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setCountry(request.getCountry());
        address.setPincode(request.getPincode());
        address.setDefault(request.isDefault());
    }

    public AddressResponse convertToResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getPhoneNumber(),
                address.getAddressLine1(),
                address.getAddressLine2(),
                address.getCity(),
                address.getState(),
                address.getCountry(),
                address.getPincode(),
                address.isDefault()
        );
    }
}
