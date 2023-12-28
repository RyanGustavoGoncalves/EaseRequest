package com.goncalves.API.DTO;

import com.goncalves.API.entities.user.Users;

import java.time.LocalDateTime;

public record DadosAtualizarRequest(String problem,
                                    String priority,
                                    String status,
                                    LocalDateTime creationRequest,
                                    Users users) {
}
