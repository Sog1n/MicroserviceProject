package com.electronic.userservice.repository;

import com.electronic.userservice.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByLoginKeyAndCode(String loginKey, String code);
    void deleteByLoginKey(String loginKey);
}
