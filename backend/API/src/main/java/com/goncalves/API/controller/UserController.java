package com.goncalves.API.controller;

import com.goncalves.API.DTO.AutenticarDados;
import com.goncalves.API.DTO.DadosAtualizarUser;
import com.goncalves.API.DTO.DadosListagemUser;
import com.goncalves.API.DTO.DadosNewUser;
import com.goncalves.API.entities.UserRepository;
import com.goncalves.API.entities.Users;
import com.goncalves.API.infra.security.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.Collection;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    UserRepository repository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private ErrorHandling errorHandling;


    @GetMapping
    public ResponseEntity<Page<DadosListagemUser>> getUsers(@PageableDefault(size = 10, sort = {"creationAccount"})Pageable paginacao){
        var page = repository.findAll(paginacao).map(DadosListagemUser::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{idUser}")
    public ResponseEntity UserId(@PathVariable String idUser){
        var user = repository.findById(idUser);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid AutenticarDados dados, StandardError standardError , UriComponentsBuilder uriComponentsBuilder) {
        // Verificar se o usuário já existe
        if (repository.findByUsername(dados.username()) != null) {
            return ResponseEntity.badRequest().body("Já existe um usuário com este nome!");
        }

        if (dados.username().isBlank() || dados.username().length() < 3) {
            StandardError err = new StandardError("username: ", " Campo usuário deve ter no mínimo 3 caracteres!");
            return ResponseEntity.badRequest().body(err);
        }
        if (dados.email().isBlank()) {
            throw new BadRequestException("email: ", " Campo email vazio!");
        }
        if (dados.password().isBlank() || dados.password().length() < 8) {
            throw new BadRequestException("password: ", " Campo senha deve ter no mínimo 8 caracteres!");
        }

        // Criar um novo usuário com a senha criptografada
        String encryptedPassword = new BCryptPasswordEncoder().encode(dados.password());
        Users newUser = new Users(dados.username(), dados.firstName(), dados.lastName(), dados.email(),encryptedPassword, dados.birth(),LocalDateTime.now());
        repository.save(newUser);

        // Construir a URI para o novo usuário
        var uri = uriComponentsBuilder.path("/users/{id_User}").buildAndExpand(newUser.getIdUsers()).toUri();

        // Retornar uma resposta 201 Created com a URI e o corpo do novo usuário
        return ResponseEntity.created(uri).body(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AutenticarDados dados) {
        try {
            var authenticationToken = new UsernamePasswordAuthenticationToken(dados.username(), dados.password());

            var authentication = manager.authenticate(authenticationToken);
            //Tratamento de erro caso as credenciais estejam erradas

            var tokenJWT = tokenService.generateToken((Users) authentication.getPrincipal());

            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));
        }catch (AuthenticationException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorValidation("Credenciais inválidas"));
        }
    }

    @PutMapping("/{idUser}")
    @Transactional
    public ResponseEntity updateUser (@PathVariable String idUser, @RequestBody @Validated DadosAtualizarUser dados) {
        var user = repository.findById(idUser);

        if (user.isPresent()) {
            user.get().atualizarUser(dados);
            repository.save(user.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{idUser}")
    @Transactional
    public ResponseEntity deleteUser (@PathVariable String idUser){
        repository.deleteById(idUser);
        return ResponseEntity.noContent().build();
    }
}
