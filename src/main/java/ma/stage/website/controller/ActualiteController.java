package ma.stage.website.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import ma.stage.website.repository.ActualiteRepository;
import ma.stage.website.services.*;

@RestController
@RequestMapping("/api/v1/actualites")
public class ActualiteController {
    @Autowired
    private ActualiteService service;

    @GetMapping
    public List<Actualite> findAllActualites() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        Actualite actualite = service.findById(id);
        if (actualite == null) {
            return new ResponseEntity<>("Actualite avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);
        } else {
            return ResponseEntity.ok(actualite);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletActualite(@PathVariable Long id) {
        Actualite actualite = service.findById(id);
        if (actualite == null) {
            return new ResponseEntity<>("Actualite avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);
        } else {
            service.delete(actualite);
            return ResponseEntity.ok("actualite avec id " + id + " suprime");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateActualite(@PathVariable Long id, @RequestBody Actualite newactualite) {
        Actualite oldActualite = service.findById(id);
        if (oldActualite == null) {
            return new ResponseEntity<>("actualite avec id" + id + "nexiste pas ", HttpStatus.BAD_REQUEST);
        } else {
            newactualite.setId(id);
            return ResponseEntity.ok(service.update(newactualite));
        }
    }

    @PostMapping
    public Actualite creatActualite(@RequestBody Actualite actualite) {
        actualite.setId(0L);
        return service.create(actualite);
    }

    @GetMapping("/sportId/{sportId}")
    public List<Actualite> findByType(@PathVariable int sportId) {
        return service.findByType(sportId);
    }

    // @GetMapping("/filterByDate")
    // public List<Actualite> findByDateProductionBetween(
    // @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateDebut,
    // @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateFin) {
    // return service.findByDateProductionBetween(dateDebut, dateFin);
    // }
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        Actualite actualite = actualiteRepository.findById(id)
                .orElseThrow(()  -> new ResourceNotFoundException("Actualite not found"));

        byte[] image = actualite.getImage();
        if (image == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG); // Changez le sport MIME si votre image n'est pas JPEG

        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }

    @Autowired
    private ActualiteRepository actualiteRepository;

    @Autowired
    private ActualiteService actualiteService;
    @Autowired
    private SportService sportService;

        @PostMapping(consumes = "multipart/form-data")
        public ResponseEntity<Actualite> addActualite(
                @RequestParam("titre") String titre,
                @RequestParam("contenu") String contenu,
                @RequestParam("sportId") Long sportId,
                @RequestParam("image") MultipartFile image,
                @RequestParam("datePublication") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date datePublication) {

            try {
                Sport sport = sportService.getSportById(sportId);
                if (sport == null) {
                    return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
                }

                Actualite actualite = new Actualite();
                actualite.setTitre(titre);
                actualite.setContenu(contenu);
                actualite.setSport(sport);
                actualite.setImage(image.getBytes());
                actualite.setDatePublication(datePublication);

                Actualite savedActualite = actualiteService.saveActualite(actualite);
                return new ResponseEntity<>(savedActualite, HttpStatus.CREATED);

            } catch (IOException e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        @PutMapping(value = "/{id}", consumes = "multipart/form-data")
        public ResponseEntity<Actualite> updateActualite(
                @PathVariable Long id,
                @RequestParam("titre") String titre,
                @RequestParam("contenu") String contenu,
                @RequestParam("sportId") Long sportId,
                @RequestParam("image") MultipartFile image,
                @RequestParam("datePublication") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date datePublication) {
            try {
                Sport sport = sportService.getSportById(sportId);
                if (sport == null) {
                    return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
                }

                Actualite actualite = actualiteService.findById(id);
                if (actualite == null) {
                    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
                }

                actualite.setTitre(titre);
                actualite.setContenu(contenu);
                actualite.setSport(sport);
                if (image != null && !image.isEmpty()) {
                    actualite.setImage(image.getBytes());
                }
                actualite.setDatePublication(datePublication);

                Actualite updatedActualite = actualiteService.saveActualite(actualite);
                return new ResponseEntity<>(updatedActualite, HttpStatus.OK);

            } catch (IOException e) {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    }
