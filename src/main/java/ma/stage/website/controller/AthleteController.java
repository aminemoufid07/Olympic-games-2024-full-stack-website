package ma.stage.website.controller;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ma.stage.website.entities.*;
import ma.stage.website.repository.AthleteRepository;
import ma.stage.website.services.*;

@RestController
@RequestMapping("/api/v1/athlete")
public class AthleteController {
    @Autowired
    private AthleteService service;

    @GetMapping
    public List<Athlete> findAllAthletes() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        Athlete athlete = service.findById(id);
        if (athlete == null) {
            return new ResponseEntity<Object>("Athlete avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);

        } else {
            return ResponseEntity.ok(athlete);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletAthlete(@PathVariable Long id) {
        Athlete athlete = service.findById(id);
        if (athlete == null) {
            return new ResponseEntity<Object>("Athlete avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);
        } else {
            service.delete(athlete);
            return ResponseEntity.ok("athlete avec id " + id + " suprime");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateAthlete(@PathVariable Long id, @RequestBody Athlete newathlete) {

        Athlete oldAthlete = service.findById(id);
        if (oldAthlete == null) {
            return new ResponseEntity<Object>("athlete avec id" + id + "nexiste pas ", HttpStatus.BAD_REQUEST);

        } else {
            newathlete.setId(id);
            return ResponseEntity.ok(service.update(newathlete));
        }
    }

    @PostMapping
    public Athlete creatAthlete(@RequestBody Athlete athlete) {
        athlete.setId(0L);
        return service.create(athlete);
    }

    // @Autowired
    // private AthleteRepository athleteRepository;

    // @Autowired
    // private AthleteService athleteService;
    // @Autowired
    // private SportService sportService;
    // @Autowired
    // private PaysService paysService;

    // @PostMapping(consumes = "multipart/form-data")
    // public ResponseEntity<Athlete> addAthlete(
    // @RequestParam("nom") String nom,
    // @RequestParam("prenom") String prenom,
    // @RequestParam("sportId") Long sportId,
    // @RequestParam("paysId") Long paysId,
    // @RequestParam("photo") MultipartFile photo,
    // @RequestParam("medaille") String medaille,
    // @RequestParam("dateDeNaissance") @DateTimeFormat(iso =
    // DateTimeFormat.ISO.DATE) Date dateDeNaissance)
    // {

    // try {
    // Sport sport = sportService.getSportById(sportId);
    // Pays pays = paysService.getPaysById(paysId);
    // if (sport == null || pays == null) {
    // return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    // }

    // Athlete athlete = new Athlete();
    // athlete.setNom(nom);
    // athlete.setPrenom(prenom);
    // athlete.setSport(sport);
    // athlete.setPays(pays);
    // athlete.setPhoto(photo.getBytes());
    // // athlete.setDateDeNaissance(dateDeNaissance);

    // Athlete savedAthlete = athleteService.saveAthlete(athlete);
    // return new ResponseEntity<>(savedAthlete, HttpStatus.CREATED);

    // } catch (IOException e) {
    // return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    // }
    // }

    // @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    // public ResponseEntity<Athlete> updateAthlete(
    // @PathVariable Long id,
    // @RequestParam("titre") String titre,
    // @RequestParam("contenu") String contenu,
    // @RequestParam("sportId") Long sportId,
    // @RequestParam("image") MultipartFile image,
    // @RequestParam("datePublication") @DateTimeFormat(iso =
    // DateTimeFormat.ISO.DATE) Date datePublication) {
    // try {
    // Sport sport = sportService.getSportById(sportId);
    // if (sport == null) {
    // return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    // }

    // Athlete athlete = athleteService.findById(id);
    // if (athlete == null) {
    // return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    // }

    // athlete.setTitre(titre);
    // athlete.setContenu(contenu);
    // athlete.setSport(sport);
    // if (image != null && !image.isEmpty()) {
    // athlete.setImage(image.getBytes());
    // }
    // athlete.setDatePublication(datePublication);

    // Athlete updatedAthlete = athleteService.saveAthlete(athlete);
    // return new ResponseEntity<>(updatedAthlete, HttpStatus.OK);

    // } catch (IOException e) {
    // return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    // }
    // }

}
