package ma.stage.website.entities;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.TemporalType;

@Entity
public class Actualite implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sport_id")
    private Sport sport;
    String titre;
    @Temporal(TemporalType.DATE)
    private Date datePublication;
    @Lob
    @Column(length = 100000)
    String contenu;
    @ManyToMany
    private java.util.Collection<Pays> pays;
    @Lob
    @Column(length = 100000000)
    private byte[] image;

    public Actualite() {
        super();
    }

    public Sport getSport() {
        return sport;
    }

    public void setSport(Sport sport) {
        this.sport = sport;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public Date getDatePublication() {
        return datePublication;
    }

    public void setDatePublication(Date datePublication) {
        this.datePublication = datePublication;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Actualite [sport=" + sport + ", titre=" + titre + ", datePublication=" + datePublication + ", contenu="
                + contenu + ", image=" + Arrays.toString(image) + "]";
    }

    public java.util.Collection<Pays> getPays() {
        return pays;
    }

    public void setPays(java.util.Collection<Pays> pays) {
        this.pays = pays;
    }

}
