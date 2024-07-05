package ma.stage.website.entities;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Type implements Serializable{
@Id
@GeneratedValue(strategy=GenerationType.IDENTITY)
Long id ;
String nom ;

public Type() {
}

public Long getId() {
    return id;
}
public void setId(Long id) {
    this.id = id;
}
public String getNom() {
    return nom;
}
public void setNom(String nom) {
    this.nom = nom;
}





}
