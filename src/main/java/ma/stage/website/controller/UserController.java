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
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping
    public List<User> findAllUsers() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        User user = service.findById(id);
        if (user == null) {
            return new ResponseEntity<Object>("User avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);

        } else {
            return ResponseEntity.ok(user);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletUser(@PathVariable Long id) {
        User user = service.findById(id);
        if (user == null) {
            return new ResponseEntity<Object>("User avec Id " + id + " nexiste pas", HttpStatus.BAD_REQUEST);
        } else {
            service.delete(user);
            return ResponseEntity.ok("user avec id " + id + " suprime");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUser(@PathVariable Long id, @RequestBody User newuser) {

        User oldUser = service.findById(id);
        if (oldUser == null) {
            return new ResponseEntity<Object>("user avec id" + id + "nexiste pas ", HttpStatus.BAD_REQUEST);

        } else {
            newuser.setId(id);
            return ResponseEntity.ok(service.update(newuser));
        }
    }

    @PostMapping
    public User creatUser(@RequestBody User user) {
        user.setId(0L);
        return service.create(user);
    }

}
