package com.goncalves.API.controller;

import com.goncalves.API.DTO.DadosNewRequest;
import com.goncalves.API.entities.request.Request;
import com.goncalves.API.entities.request.RequestRepository;
import com.goncalves.API.entities.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/request")
public class RequestController {

    @Autowired
    private RequestRepository repository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public String hello (String helloWrld){
        helloWrld = "Hello World";

        return helloWrld;
    }

    @PostMapping
    public ResponseEntity postRequest (@RequestBody @Validated DadosNewRequest dados){
        Request newRequest = new Request(
                dados.priority(),
                dados.status(),
                dados.problem()
        );

        return ResponseEntity.ok().body(repository.save(newRequest));
    }

}
