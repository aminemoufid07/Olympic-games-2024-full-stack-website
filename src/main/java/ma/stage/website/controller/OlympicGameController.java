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
@RequestMapping("/api/v1/olympicGames")
public class OlympicGameController {
    @Autowired
    private OlympicGameService service;

    @GetMapping
    public List<OlympicGame> findAllOlympicGames() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        OlympicGame olympicGame = service.findById(id);
        if (olympicGame == null) {
            return new ResponseEntity<Object>("OlympicGame avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);

        } else {
            return ResponseEntity.ok(olympicGame);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletOlympicGame(@PathVariable Long id) {
        OlympicGame olympicGame = service.findById(id);
        if (olympicGame == null) {
            return new ResponseEntity<Object>("OlympicGame avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);
        } else {
            service.delete(olympicGame);
            return ResponseEntity.ok("olympicGame avec id " + id + " suprime");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateOlympicGame(@PathVariable Long id, @RequestBody OlympicGame newolympicGame) {

        OlympicGame oldOlympicGame = service.findById(id);
        if (oldOlympicGame == null) {
            return new ResponseEntity<Object>("olympicGame avec id" + id + "nexiste pas ", HttpStatus.BAD_REQUEST);

        } else {
            newolympicGame.setId(id);
            return ResponseEntity.ok(service.update(newolympicGame));
        }
    }
    


    @PostMapping
    public OlympicGame creatOlympicGame(@RequestBody OlympicGame olympicGame) {
        olympicGame.setId(0L);
        return service.create(olympicGame);
    }
    

}

