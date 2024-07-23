package ma.stage.website.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import ma.stage.website.entities.*;
public interface CommuniqueRepository extends JpaRepository<Communique,Long> {
    
}
