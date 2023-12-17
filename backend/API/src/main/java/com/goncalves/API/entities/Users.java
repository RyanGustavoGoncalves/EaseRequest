package com.goncalves.API.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "users")
public class Users {

    @Id
    private String idUsers;
    private String firstName;
    private String lastName;
    private String email;
    private String birth;
    private LocalDateTime creationAccount;


    public Users(String firstName, String lastName, String email, String birth, LocalDateTime creationAccount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.birth = birth;
        this.creationAccount = creationAccount;
    }
}
