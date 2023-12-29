package com.goncalves.API.DTO;

import com.goncalves.API.entities.request.Request;
import com.goncalves.API.entities.user.Users;

import java.time.LocalDateTime;

public record DadosListagemRequest(String id, String problem, String description, String priority, String status, LocalDateTime creationRequest, Users users) {

    public DadosListagemRequest (Request request){
        this(request.getIdRequest(), request.getProblem(), request.getDescription(),request.getPriority(), request.getStatus(), request.getCreationRequest(), request.getUser());
    }
}
