package com.labrepair.labrepair.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.labrepair.labrepair.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByEmployeeCode(String employeeCode);
    boolean existsByEmployeeCode(String employeeCode);
}
