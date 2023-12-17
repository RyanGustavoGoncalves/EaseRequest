package com.goncalves.API.DTO;

import com.goncalves.API.entities.Users;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record DadosNewUser(String firstName,
                           String lastName,
                           String email,
                           String birth,
                           LocalDateTime createAccount) {
    public DadosNewUser (Users users){
        this(users.getFirstName(),users.getLastName(),users.getEmail(), users.getBirth(),users.getCreationAccount());
    }
}
