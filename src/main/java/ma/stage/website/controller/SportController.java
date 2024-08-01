package ma.stage.website.controller;



import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import ma.stage.website.entities.*;
import ma.stage.website.services.*;


@RestController
@RequestMapping("/api/v1/sports")
public class SportController {
    @Autowired
    private SportService service;

    @GetMapping
    public List<Sport> findAllSports() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        Sport sport = service.findById(id);
        if (sport == null) {
            return new ResponseEntity<Object>("Sport avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);

        } else {
            return ResponseEntity.ok(sport);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletSport(@PathVariable Long id) {
        Sport sport = service.findById(id);
        if (sport == null) {
            return new ResponseEntity<Object>("Sport avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);
        } else {
            service.delete(sport);
            return ResponseEntity.ok("sport avec id " + id + " suprime");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateSport(@PathVariable Long id, @RequestBody Sport newsport) {

        Sport oldSport = service.findById(id);
        if (oldSport == null) {
            return new ResponseEntity<Object>("sport avec id" + id + "nexiste pas ", HttpStatus.BAD_REQUEST);

        } else {
            newsport.setId(id);
            return ResponseEntity.ok(service.update(newsport));
        }
    }
    


    @PostMapping
    public Sport creatSport(@RequestBody Sport sport) {
        sport.setId(0L);
        return service.create(sport);
    }
    

}
