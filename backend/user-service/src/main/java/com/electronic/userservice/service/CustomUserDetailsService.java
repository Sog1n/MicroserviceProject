package com.electronic.userservice.service;

import com.electronic.userservice.model.User;
import com.electronic.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String loginKey) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(loginKey)
                .or(() -> userRepository.findByEmail(loginKey))
                .or(() -> userRepository.findByPhone(loginKey))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String role = user.getRole() == null ? "USER" : user.getRole().trim();
        String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role;

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(authority)))
                .build();
    }
}

