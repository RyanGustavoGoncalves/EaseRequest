package com.goncalves.API.DTO;

import com.goncalves.API.entities.Users;

import java.time.LocalDateTime;

public record DadosNewUser(String username,
                           String firstName,
                           String lastName,
                           String email,
                           String password,
                           String birth,
                           LocalDateTime createAccount) {
    public DadosNewUser (Users users){
        this(users.getUsername(), users.getFirstName(),users.getLastName(),users.getEmail(), users.getPassword(),users.getBirth(),users.getCreationAccount());
    }
}
