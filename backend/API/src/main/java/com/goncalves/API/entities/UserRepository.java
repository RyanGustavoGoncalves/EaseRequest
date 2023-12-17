package com.goncalves.API.entities;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<Users ,String> {
}
