//package com.electronic.userservice.config;
//
//import com.electronic.userservice.model.User;
//import com.electronic.userservice.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//@Configuration
//@RequiredArgsConstructor
//public class UserDataSeeder {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Bean
//    public CommandLineRunner seedUsersOnStartup() {
//        return args -> {
//            createUserIfMissing("admin", "admin@example.com", "0900000000", "System Admin", "ADMIN", "admin123");
//            createUserIfMissing("user01", "user01@example.com", "0900000001", "Nguyen Van A", "USER", "user123");
//            createUserIfMissing("seller01", "seller01@example.com", "0900000002", "Seller Demo", "SELLER", "seller123");
//        };
//    }
//
//    private void createUserIfMissing(
//            String username,
//            String email,
//            String phone,
//            String fullName,
//            String role,
//            String rawPassword
//    ) {
//        boolean exists = userRepository.findByUsername(username).isPresent()
//                || userRepository.findByEmail(email).isPresent()
//                || userRepository.findByPhone(phone).isPresent();
//
//        if (exists) {
//            return;
//        }
//
//        User user = new User();
//        user.setUsername(username);
//        user.setEmail(email);
//        user.setPhone(phone);
//        user.setFullName(fullName);
//        user.setAddress("HCM");
//        user.setRole(role);
//        user.setPassword(passwordEncoder.encode(rawPassword));
//
//        userRepository.save(user);
//    }
//}
//
