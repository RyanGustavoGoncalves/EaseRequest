package com.goncalves.API.entities.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository extends MongoRepository<Users ,String> {
    UserDetails findByUsername(String username);
}
