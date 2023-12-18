package com.goncalves.API.DTO;

import java.time.LocalDateTime;

public record AutenticarDados(String username,
                              String firstName,
                              String lastName,
                              String email,
                              String password,
                              String birth,
                              LocalDateTime creationAccount) {
}
