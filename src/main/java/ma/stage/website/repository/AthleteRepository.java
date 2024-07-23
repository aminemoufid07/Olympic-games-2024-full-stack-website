package ma.stage.website.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ma.stage.website.entities.*;

@Repository
public interface AthleteRepository extends JpaRepository<Athlete, Long> {
    
}
