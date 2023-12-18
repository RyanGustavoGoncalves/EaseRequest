package com.goncalves.API.controller;

import com.goncalves.API.DTO.DadosAtualizarUser;
import com.goncalves.API.DTO.DadosListagemUser;
import com.goncalves.API.entities.UserRepository;
import com.goncalves.API.infra.security.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping
public class UserController {

    @Autowired
    UserRepository repository;


    @GetMapping
    public ResponseEntity<Page<DadosListagemUser>> getUsers(@PageableDefault(size = 10, sort = {"creationAccount"})Pageable paginacao){
        var page = repository.findAll(paginacao).map(DadosListagemUser::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{idUser}")
    public ResponseEntity getUserById(@PathVariable String idUser) {
        try {
            var user = repository.findById(idUser)
                    .orElseThrow(() -> new NotFoundException("ID não encontrado", idUser));
            return ResponseEntity.ok(user);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorNotFoundId(e.getMessage(), e.getId()));
        } catch (Exception e) {
            // Lidar com outras exceções aqui, se necessário
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Erro interno do servidor"));
        }
    }


    @PutMapping("/{idUser}")
    @Transactional
    public ResponseEntity updateUser(@PathVariable String idUser, @RequestBody @Validated DadosAtualizarUser dados) {
        try {
            var user = repository.findById(idUser)
                    .orElseThrow(() -> new NotFoundException("ID não encontrado", idUser));

            // Atualizar os dados do usuário
            user.atualizarUser(dados);

            // Não é necessário chamar repository.save() explicitamente, pois as alterações serão automaticamente sincronizadas com o banco de dados.

            return ResponseEntity.ok(user);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorNotFoundId(e.getMessage(), e.getId()));
        } catch (Exception e) {
            // Lidar com outras exceções aqui, se necessário
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Erro interno do servidor"));
        }
    }

    @DeleteMapping("/{idUser}")
    @Transactional
    public ResponseEntity deleteUser(@PathVariable String idUser) {
        if (repository.existsById(idUser)) {
            repository.deleteById(idUser);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorNotFoundId("ID não encontrado", idUser));
        }
    }
}
