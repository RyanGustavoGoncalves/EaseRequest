package com.goncalves.API.infra.security;


import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.data.mongodb.UncategorizedMongoDbException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Manipulador de exceções para lidar com erros comuns na aplicação.
 */
@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ErrorHandling {

    /**
     * Manipula exceções de EntityNotFoundException, retornando um ResponseEntity com status 404.
     *
     * @return ResponseEntity com status 404 (Not Found).
     */
    @ExceptionHandler(UncategorizedMongoDbException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity tratarErro404() {
        return ResponseEntity.notFound().build();
    }

    /**
     * Manipula exceções de ConstraintViolationException, retornando um ResponseEntity com status 400
     * e uma lista de erros de validação.
     *
     * @param ex A exceção de ConstraintViolationException.
     * @return ResponseEntity com status 400 (Bad Request) e uma lista de erros de validação.
     */

    /**
     * Classe interna (record) que representa dados de erro de validação.
     */
    private record DadosErroValidacao(String campo, String mensagem) {
        // Construtor do record para inicialização dos campos.
        public DadosErroValidacao(String campo, String mensagem) {
            this.campo = campo;
            this.mensagem = mensagem;
        }
    }
}

