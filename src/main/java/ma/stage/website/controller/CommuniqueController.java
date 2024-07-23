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
import ma.stage.website.repository.ActualiteRepository;
import ma.stage.website.repository.CommuniqueRepository;
import ma.stage.website.services.*;

@RestController
@RequestMapping("/api/v1/communiques")
public class CommuniqueController {
    @Autowired
    private CommuniqueService service;

    @GetMapping
    public List<Communique> findAllCommuniques() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        Communique communique = service.findById(id);
        if (communique == null) {
            return new ResponseEntity<Object>("Communique avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);

        } else {
            return ResponseEntity.ok(communique);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletCommunique(@PathVariable Long id) {
        Communique communique = service.findById(id);
        if (communique == null) {
            return new ResponseEntity<Object>("Communique avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);
        } else {
            service.delete(communique);
            return ResponseEntity.ok("communique avec id " + id + " suprime");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateCommunique(@PathVariable Long id, @RequestBody Communique newcommunique) {

        Communique oldCommunique = service.findById(id);
        if (oldCommunique == null) {
            return new ResponseEntity<Object>("communique avec id" + id + "nexiste pas ", HttpStatus.BAD_REQUEST);

        } else {
            newcommunique.setId(id);
            return ResponseEntity.ok(service.update(newcommunique));
        }
    }

    @PostMapping
    public Communique creatCommunique(@RequestBody Communique communique) {
        communique.setId(0L);
        return service.create(communique);
    }

    @Autowired
    private CommuniqueRepository communiqueRepository;

    @Autowired
    private CommuniqueService communiqueService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Communique> addCommunique(
            @RequestParam("titre") String titre,
            @RequestParam("contenu") String contenu,
            @RequestParam("image") MultipartFile image,
            @RequestParam("datePublication") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date datePublication) {

        try {

            Communique communique = new Communique();
            communique.setTitre(titre);
            communique.setContenu(contenu);
            communique.setImage(image.getBytes());
            communique.setDatePublication(datePublication);

            Communique savedCommunique = communiqueService.saveCommunique(communique);
            return new ResponseEntity<>(savedCommunique, HttpStatus.CREATED);

        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Communique> updateCommunique(
            @PathVariable Long id,
            @RequestParam("titre") String titre,
            @RequestParam("contenu") String contenu,

            @RequestParam("image") MultipartFile image,
            @RequestParam("datePublication") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date datePublication) {
        try {

            Communique communique = communiqueService.findById(id);

            communique.setTitre(titre);
            communique.setContenu(contenu);
            if (image != null && !image.isEmpty()) {
                communique.setImage(image.getBytes());
            }
            communique.setDatePublication(datePublication);

            Communique updatedCommunique = communiqueService.saveCommunique(communique);
            return new ResponseEntity<>(updatedCommunique, HttpStatus.OK);

        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
