package com.goncalves.API.DTO;

import com.goncalves.API.entities.request.Request;

import java.time.LocalDateTime;

public record DadosListagemRequest(String id, String problem, String priority, String status, LocalDateTime creationRequest) {

    public DadosListagemRequest (Request request){
        this(request.getIdRequest(), request.getProblem(), request.getPriority(), request.getStatus(), request.getCreationRequest());
    }
}
