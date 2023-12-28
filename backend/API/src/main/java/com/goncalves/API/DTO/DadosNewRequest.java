package com.goncalves.API.DTO;

import com.goncalves.API.entities.request.Request;
import com.goncalves.API.entities.user.Users;

import java.time.LocalDateTime;

public record DadosNewRequest(String problem,
                              String priority,
                              String status,
                              LocalDateTime creationRequest,
                              Users user) {

    public DadosNewRequest (Request request){
        this(request.getIdRequest(), request.getProblem(), request.getStatus(),LocalDateTime.now(), request.getUser());
    }
}
