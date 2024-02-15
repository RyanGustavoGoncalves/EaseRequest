package com.goncalves.API.entities.request;

import com.goncalves.API.DTO.DadosAtualizarRequest;
import com.goncalves.API.entities.user.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "request")
public class Request {
    @Id
    private String idRequest;
    private String problem;
    private String description;
    private String priority;
    private String status;
    private LocalDateTime creationRequest;

    @DBRef
    private Users user;


    public Request(String problem, String priority,String description ,String status, LocalDateTime creationRequest ,Users user){
        this.problem = problem;
        this.priority = priority;
        this.description = description;
        this.status = status;
        this.user = user;
        this.creationRequest = LocalDateTime.now();
    }

    public void atualizarRequest (DadosAtualizarRequest dados){
        if (dados.problem() != null){
            this.problem = dados.problem();
        }
        if (dados.description() != null){
            this.description = dados.description();
        }
        if (dados.priority() != null){
            this.priority = dados.priority();
        }
        if(dados.status() != null){
            this.status = dados.status();
        }
        if (dados.creationRequest() == null) {
            this.creationRequest = LocalDateTime.now();
        }
    }

}
