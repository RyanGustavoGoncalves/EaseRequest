package com.goncalves.API.entities.request;

import com.goncalves.API.DTO.DadosNewRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "request")
public class Request {
    @Id
    private String idRequest;
    private String problem;
    private String priority;
    private String status;

    public Request(String problem, String priority, String status) {
        this.problem = problem;
        this.priority = priority;
        this.status = status;
    }


}
