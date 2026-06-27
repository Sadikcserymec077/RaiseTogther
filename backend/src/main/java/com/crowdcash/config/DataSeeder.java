package com.crowdcash.config;

import com.crowdcash.model.Role;
import com.crowdcash.model.User;
import com.crowdcash.repository.RoleRepository;
import com.crowdcash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create Admin Role if not exists
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> {
            Role role = new Role();
            role.setName("ROLE_ADMIN");
            return roleRepository.save(role);
        });

        // Create User Role if not exists
        Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> {
            Role role = new Role();
            role.setName("ROLE_USER");
            return roleRepository.save(role);
        });

        // Seed Admin User
        if (!userRepository.existsByEmail("admin@raisetogether.com")) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@raisetogether.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhone("1234567890");
            admin.setEmailVerified(true);
            admin.getRoles().add(adminRole);
            admin.getRoles().add(userRole);
            userRepository.save(admin);
            System.out.println("=========================================");
            System.out.println("Seeded Admin User:");
            System.out.println("Email: admin@raisetogether.com");
            System.out.println("Password: admin123");
            System.out.println("=========================================");
        }
    }
}
