package com.goncalves.API.controller;

import com.goncalves.API.DTO.DadosAtualizarRequest;
import com.goncalves.API.DTO.DadosListagemRequest;
import com.goncalves.API.DTO.DadosListagemUserRequest;
import com.goncalves.API.DTO.DadosNewRequest;
import com.goncalves.API.entities.request.Request;
import com.goncalves.API.entities.request.RequestRepository;
import com.goncalves.API.entities.user.UserRepository;
import com.goncalves.API.entities.user.Users;
import com.goncalves.API.infra.security.ErrorNotFoundId;
import com.goncalves.API.infra.security.ErrorResponse;
import com.goncalves.API.infra.security.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/request")
public class RequestController {

    @Autowired
    private RequestRepository repository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<DadosListagemRequest>> getRequest(@PageableDefault(size = 10, sort = {"id"}) Pageable paginacao){
        var page = repository.findAll(paginacao).map(DadosListagemRequest::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("user")
    public ResponseEntity getUserRequest() {
        Users user = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Supondo que sua entidade Request tenha um campo chamado 'user'
        List<Request> userRequests = repository.findByUser(user);

        // Mapeando para DadosListagemRequest se necessário
        List<DadosListagemRequest> mappedRequests = userRequests.stream()
                .map(DadosListagemRequest::new)
                .collect(Collectors.toList());

//        System.out.println(mappedRequests);
        return ResponseEntity.ok(mappedRequests);
    }

    @GetMapping("/{idRequest}")
    public ResponseEntity selectRequest(@PathVariable String idRequest) {
        var optionalRequest = repository.findById(idRequest).map(DadosListagemRequest::new);

        return optionalRequest
                .map(request -> ResponseEntity.ok(request))
                .orElse(ResponseEntity.notFound().build());
    }



    @PostMapping
    @Transactional
    public ResponseEntity postRequest (@RequestBody @Validated DadosNewRequest dados){

        Users user = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Request newRequest = new Request(
                dados.problem(),
                dados.priority(),
                dados.status(),
                dados.creationRequest(),
                user
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(newRequest));
    }

    @PutMapping("/{idRequest}")
    @Transactional
    public ResponseEntity updateStatus(@PathVariable String idRequest, @RequestBody @Validated DadosAtualizarRequest dados) {
        try {
            var request = repository.findById(idRequest)
                    .orElseThrow(() -> new NotFoundException("ID não encontrado", idRequest));

            // Atualizar os dados do usuário
            request.atualizarRequest(dados);

            // Chamar repository.save() explicitamente para sincronizar as alterações com o banco de dados
            repository.save(request);

            return ResponseEntity.ok(new DadosNewRequest(request));
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorNotFoundId(e.getMessage(), e.getId()));
        } catch (Exception e) {
            // Lidar com outras exceções aqui, se necessário
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Erro interno do servidor"));
        }
    }


}
