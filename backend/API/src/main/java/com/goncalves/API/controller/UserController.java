package com.goncalves.API.controller;

import com.goncalves.API.DTO.DadosNewUser;
import com.goncalves.API.entities.UserRepository;
import com.goncalves.API.entities.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    UserRepository repository;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity newUser (@RequestBody @Validated DadosNewUser dados){
        var newUser = new Users(
                dados.firstName(),
                dados.lastName(),
                dados.email(),
                dados.birth(),
                LocalDateTime.now()
        );
        repository.save(newUser);

        return ResponseEntity.ok().body(newUser);
    }
}
