package com.goncalves.API.DTO;

import com.goncalves.API.entities.user.Users;

public record DadosAtualizarUser(String username,
                                 String firstName,
                                 String lastName,
                                 String email,
                                 String password,
                                 String birth) {

}
