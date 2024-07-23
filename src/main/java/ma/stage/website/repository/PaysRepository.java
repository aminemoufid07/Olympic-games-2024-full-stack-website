package ma.stage.website.repository;

import org.hibernate.mapping.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ma.stage.website.entities.Pays;

@Repository

public interface PaysRepository extends JpaRepository<Pays, Long> {
    

}