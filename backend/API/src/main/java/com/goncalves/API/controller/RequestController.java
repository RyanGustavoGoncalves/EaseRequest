package com.goncalves.API.controller;

import com.goncalves.API.DTO.DadosAtualizarRequest;
import com.goncalves.API.DTO.DadosFinishRequest;
import com.goncalves.API.DTO.DadosListagemRequest;
import com.goncalves.API.DTO.DadosNewRequest;
import com.goncalves.API.entities.request.Request;
import com.goncalves.API.entities.request.RequestRepository;
import com.goncalves.API.entities.user.UserRepository;
import com.goncalves.API.entities.user.Users;
import com.goncalves.API.infra.security.ErrorNotFoundId;
import com.goncalves.API.infra.security.ErrorResponse;
import com.goncalves.API.infra.security.NotFoundException;
import com.goncalves.API.infra.security.UnauthorizedException;
import com.goncalves.API.service.EmailService;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/request")
public class RequestController {

    @Autowired
    private RequestRepository repository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public ResponseEntity<Page<DadosListagemRequest>> getRequest(@PageableDefault(size = 10, sort = {"creationRequest"}) Pageable paginacao){
        var page = repository.findAll(paginacao).map(DadosListagemRequest::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("user")
    public ResponseEntity getUserRequest(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size) {
        try {
            Users user = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (user == null) {
                throw new UnauthorizedException("Usuário não autenticado");
            }

            List<Request> userRequests = repository.findByUser(user);

            int start = page * size;
            int end = Math.min((page + 1) * size, userRequests.size());

            if (start >= userRequests.size()) {
                // Se o índice de início estiver além do tamanho da lista, não há mais dados
                return ResponseEntity.ok(Collections.emptyList()); // ou outra resposta apropriada
            }

            List<DadosListagemRequest> mappedRequests = userRequests.subList(start, end).stream()
                    .map(DadosListagemRequest::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(mappedRequests);
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            // Lidar com outras exceções não previstas
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Erro interno do servidor"));
        }
    }

    @GetMapping("/{idRequest}")
    public ResponseEntity selectRequest(@PathVariable String idRequest) {
        try {
            if (idRequest == null) {
                throw new NotFoundException("ID não encontrado", idRequest);
            }

            var optionalRequest = repository.findById(idRequest).map(DadosListagemRequest::new);

            return optionalRequest
                    .map(request -> ResponseEntity.ok(request))
                    .orElse(ResponseEntity.notFound().build());
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorNotFoundId(e.getMessage(), e.getId()));
        } catch (Exception e) {
            // Lidar com outras exceções não previstas
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Erro interno do servidor"));
        }
    }

    @PostMapping
    @Transactional
    public ResponseEntity postRequest(@RequestBody @Validated DadosNewRequest dados) {
        try {
            Users user = (Users) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Request newRequest = new Request(
                    dados.problem(),
                    dados.priority(),
                    dados.description(),
                    dados.status(),
                    dados.creationRequest(),
                    user
            );

            Request savedRequest = repository.save(newRequest);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
        } catch (ValidationException e) {
            // Lidar com exceções de validação (por exemplo, campos inválidos)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            // Lidar com outras exceções não previstas
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Erro interno do servidor"));
        }
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

    @DeleteMapping("/{idRequest}")
    public ResponseEntity deleteRequest (@PathVariable String idRequest){
        if(idRequest == null)return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorNotFoundId("ID não encontrado!", idRequest));
        try {
            repository.deleteById(idRequest);
            return ResponseEntity.noContent().build();
        }catch (NotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorNotFoundId(e.getMessage(), e.getId()));
        }
    }

    @PostMapping("finish-request")
    public ResponseEntity finishRequest (@RequestBody @Validated DadosFinishRequest dados) {
        try {
            emailService.enviarEmail(dados.email(), "Request completed", "Hello " + dados.username() + "! Your ID request " + dados.id() + " has been completed successfully!");
            return ResponseEntity.ok("Email enviado! para o email:" + dados.email());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao enviar email.");
        }
    }
}
