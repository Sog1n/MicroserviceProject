package com.electronic.userservice.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {
    @org.springframework.beans.factory.annotation.Value("${jwt.secret:eb82f768-3e9b-4e8c-8f2a-d8c9a5b3e1f0-dummy-secret-key-for-electronics-store}")
    private String SECRET_KEY;

    @org.springframework.beans.factory.annotation.Value("${jwt.access-validity:900000}")
    private long ACCESS_TOKEN_VALIDITY; // 15 minutes default
}
