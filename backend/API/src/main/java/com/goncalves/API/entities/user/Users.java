package com.goncalves.API.entities.user;

import com.goncalves.API.DTO.DadosAtualizarUser;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import static com.goncalves.API.entities.user.UserRole.USER;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "users")
public class Users implements UserDetails {

    @Id
    private String idUsers;

    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String birth;
    private LocalDateTime creationAccount;
    private UserRole role;


    public Users(String username,String firstName, String lastName, String email,String password, String birth, LocalDateTime creationAccount, UserRole role) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.birth = birth;
        this.creationAccount = creationAccount;
        this.role = role;
    }

    public void atualizarUser(DadosAtualizarUser dados) {
        if (dados.username() != null && !dados.username().isEmpty()) {
            this.username = dados.username();
        }
        if (dados.firstName() != null && !dados.firstName().isEmpty()) {
            this.firstName = dados.firstName();
        }
        if (dados.lastName() != null && !dados.lastName().isEmpty()) {
            this.lastName = dados.lastName();
        }
        if (dados.email() != null && !dados.email().isEmpty()) {
            this.email = dados.email();
        }
      /*  if (dados.password() != null && !dados.password().isEmpty()) {
            // Somente atualize a senha se ela não estiver em branco
            String encryptedPassword = new BCryptPasswordEncoder().encode(dados.password());
            this.password = encryptedPassword;
        }*/
        if (dados.birth() != null && !dados.birth().isEmpty()) {
            this.birth = dados.birth();
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(this.role == UserRole.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return username;
    }
    @Override
    public String getPassword(){
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
