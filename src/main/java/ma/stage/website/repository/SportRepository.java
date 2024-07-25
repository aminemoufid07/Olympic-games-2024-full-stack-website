package ma.stage.website.repository;




import ma.stage.website.entities.*;


import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;




@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
    boolean existsByNom(String nom);
}

