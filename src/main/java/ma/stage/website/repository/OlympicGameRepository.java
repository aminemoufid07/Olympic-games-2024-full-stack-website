package ma.stage.website.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.stage.website.entities.OlympicGame;

@Repository
public interface OlympicGameRepository extends JpaRepository<OlympicGame, Long> {
	
}
