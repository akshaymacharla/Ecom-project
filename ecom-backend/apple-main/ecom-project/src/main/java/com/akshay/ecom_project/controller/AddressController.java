package com.akshay.ecom_project.controller;

import com.akshay.ecom_project.dto.AddressRequest;
import com.akshay.ecom_project.dto.AddressResponse;
import com.akshay.ecom_project.model.Address;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.service.AddressService;
import com.akshay.ecom_project.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/address")
@CrossOrigin
@PreAuthorize("isAuthenticated()")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getMyAddresses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(addressService.getAddressesByUser(user));
    }

    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Address address = addressService.addAddress(user, request);
        return ResponseEntity.ok(addressService.convertToResponse(address));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Address address = addressService.updateAddress(user, id, request);
        return ResponseEntity.ok(addressService.convertToResponse(address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        try {
            User user = userService.getUserByEmail(userDetails.getUsername());
            addressService.deleteAddress(user, id);
            return ResponseEntity.ok(Map.of("message", "Address deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/default/{id}")
    public ResponseEntity<AddressResponse> setDefaultAddress(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userService.getUserByEmail(userDetails.getUsername());
        Address address = addressService.setDefaultAddress(user, id);
        return ResponseEntity.ok(addressService.convertToResponse(address));
    }
}
