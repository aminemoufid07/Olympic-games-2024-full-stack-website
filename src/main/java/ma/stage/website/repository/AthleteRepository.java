package ma.stage.website.repository;

import java.util.List;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import ma.stage.website.entities.*;

@Repository
public interface AthleteRepository extends JpaRepository<Athlete, Long> {
    List<Athlete> findBySportId(Long sportId);
    List<Athlete> findByPaysId(Long paysId);
    List<Athlete> findByNomContaining(String nom);
    List<Athlete> findBySportIdAndPaysId(Long sportId, Long paysId);
    List<Athlete> findBySportIdAndNomContaining(Long sportId, String nom);
    List<Athlete> findByPaysIdAndNomContaining(Long paysId, String nom);
    List<Athlete> findBySportIdAndPaysIdAndNomContaining(Long sportId, Long paysId, String nom);

}
