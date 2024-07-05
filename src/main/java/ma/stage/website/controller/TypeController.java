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
@RequestMapping("/api/v1/types")
public class TypeController {
    @Autowired
    private TypeService service;

    @GetMapping
    public List<Type> findAllTypes() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        Type type = service.findById(id);
        if (type == null) {
            return new ResponseEntity<Object>("Type avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);

        } else {
            return ResponseEntity.ok(type);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletType(@PathVariable Long id) {
        Type type = service.findById(id);
        if (type == null) {
            return new ResponseEntity<Object>("Type avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);
        } else {
            service.delete(type);
            return ResponseEntity.ok("type avec id " + id + " suprime");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateType(@PathVariable Long id, @RequestBody Type newtype) {

        Type oldType = service.findById(id);
        if (oldType == null) {
            return new ResponseEntity<Object>("type avec id" + id + "nexiste pas ", HttpStatus.BAD_REQUEST);

        } else {
            newtype.setId(id);
            return ResponseEntity.ok(service.update(newtype));
        }
    }
    


    @PostMapping
    public Type creatType(@RequestBody Type type) {
        type.setId(0L);
        return service.create(type);
    }
    

}
