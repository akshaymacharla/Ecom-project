package com.akshay.ecom_project.service;

import com.akshay.ecom_project.dto.AuthResponse;
import com.akshay.ecom_project.dto.LoginRequest;
import com.akshay.ecom_project.dto.RegisterRequest;
import com.akshay.ecom_project.model.User;
import com.akshay.ecom_project.repo.UserRepo;
import com.akshay.ecom_project.model.Cart;
import com.akshay.ecom_project.model.Wishlist;
import com.akshay.ecom_project.repo.CartRepo;
import com.akshay.ecom_project.repo.WishlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private WishlistRepo wishlistRepo;

    @Autowired
    private EmailService emailService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.isEnabled(),
                true, true, true,
                List.of(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User.Role role = User.Role.ROLE_USER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ROLE_ADMIN")) {
            role = User.Role.ROLE_ADMIN;
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setEnabled(true);
        user = userRepo.save(user);

        // Auto-create Cart and Wishlist
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepo.save(cart);

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlistRepo.save(wishlist);

        // Send welcome email
        emailService.sendWelcomeEmail(user);

        UserDetails userDetails = loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getEmail(), user.getId());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserDetails userDetails = loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getEmail(), user.getId());
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    public User updateUser(Long id, String name) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(name);
        return userRepo.save(user);
    }

    public void toggleUserStatus(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(!user.isEnabled());
        userRepo.save(user);
    }
}
