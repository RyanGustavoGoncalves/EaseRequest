package com.goncalves.API.entities.request;

import com.goncalves.API.entities.user.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RequestRepository extends MongoRepository<Request, String> {
    List<Request> findByUser(Users user);
}
