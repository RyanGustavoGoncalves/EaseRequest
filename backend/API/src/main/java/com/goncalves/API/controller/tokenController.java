package com.goncalves.API.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/token")
public class tokenController {

    @GetMapping
    public ResponseEntity<String> testToken() {
        return ResponseEntity.ok("Token válido");
    }
}
