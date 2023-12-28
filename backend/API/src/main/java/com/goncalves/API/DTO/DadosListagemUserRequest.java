package com.goncalves.API.DTO;

import com.goncalves.API.entities.request.Request;
import com.goncalves.API.entities.user.Users;

public record DadosListagemUserRequest(String idRequest,String problem, String priority, String status) {

    public DadosListagemUserRequest (Request request){
        this(request.getIdRequest(), request.getProblem(), request.getPriority(), request.getStatus());
    }
}
