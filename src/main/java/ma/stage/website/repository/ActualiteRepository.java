package ma.stage.website.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.stereotype.Repository;

import ma.stage.website.entities.Actualite;

@Repository
public interface ActualiteRepository extends JpaRepository<Actualite, Long> {
    @Query("SELECT a FROM Actualite a JOIN a.sport s WHERE s.id = :sportId")
    public List<Actualite> findByType(Long sportId);

}