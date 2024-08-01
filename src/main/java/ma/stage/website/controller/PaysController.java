package ma.stage.website.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

import io.swagger.v3.oas.models.media.MediaType;
import ma.stage.website.entities.*;
import ma.stage.website.services.*;

@RestController
@RequestMapping("/api/v1/pays")
public class PaysController {
    @Autowired
    private PaysService service;

    @GetMapping
    public List<Pays> findAllPayss() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        Pays pays = service.findById(id);
        if (pays == null) {
            return new ResponseEntity<Object>("Pays avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);

        } else {
            return ResponseEntity.ok(pays);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletPays(@PathVariable Long id) {
        Pays pays = service.findById(id);
        if (pays == null) {
            return new ResponseEntity<Object>("Pays avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);
        } else {
            service.delete(pays);
            return ResponseEntity.ok("pays avec id " + id + " suprime");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updatePays(@PathVariable Long id, @RequestBody Pays newpays) {

        Pays oldPays = service.findById(id);
        if (oldPays == null) {
            return new ResponseEntity<Object>("pays avec id" + id + "nexiste pas ", HttpStatus.BAD_REQUEST);

        } else {
            newpays.setId(id);
            return ResponseEntity.ok(service.update(newpays));
        }
    }

    @PostMapping
    public Pays creatPays(@RequestBody Pays pays) {
        pays.setId(0L);
        return service.create(pays);
    }

    @Autowired
    private PaysService paysService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Pays> addPays(
            @RequestParam("nom") String nom,
            @RequestParam("image") MultipartFile image) {

        try {
            Pays pays = new Pays();
            pays.setNom(nom);
            if (image != null && !image.isEmpty()) {
                pays.setImage(image.getBytes());
            }

            Pays savedPays = paysService.savePays(pays);
            return new ResponseEntity<>(savedPays, HttpStatus.CREATED);

        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Pays> updatePays(
            @PathVariable Long id,
            @RequestParam("nom") String nom,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            Pays existingPays = paysService.findById(id);
            if (existingPays == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }

            existingPays.setNom(nom);
            if (image != null && !image.isEmpty()) {
                existingPays.setImage(image.getBytes());
            }

            Pays updatedPays = paysService.savePays(existingPays);
            return new ResponseEntity<>(updatedPays, HttpStatus.OK);

        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
