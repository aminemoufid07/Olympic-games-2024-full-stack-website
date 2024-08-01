// package ma.stage.website.entities;

// import java.util.*;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Service;

// import ma.stage.website.services.SportService;

// @Service
// public class SportLoader implements CommandLineRunner {

// @Autowired
// private SportService sportService;

// @Override
// public void run(String... args) throws Exception {
// // Supprimer tous les sports existants
// sportService.deleteAllSports();

// // Liste des nouveaux sports
// List<Sport> sportList = Arrays.asList(
// new Sport("Basketball 3x3"),
// new Sport("Archery"),
// new Sport("Artistic gymnastics"),
// new Sport("Artistic swimming"),
// new Sport("Athletics"),
// new Sport("Badminton"),
// new Sport("Basketball"),
// new Sport("Beach Volleyball"),
// new Sport("BMX"),
// new Sport("Boxing"),
// new Sport("Breaking"),
// new Sport("Canoe/kayak slalom"),
// new Sport("Canoe/kayak sprint"),
// new Sport("Diving"),
// new Sport("Equestrian"),
// new Sport("Fencing"),
// new Sport("Football"),
// new Sport("Golf"),
// new Sport("Handball"),
// new Sport("Hockey"),
// new Sport("Judo"),
// new Sport("Marathon swimming"),
// new Sport("Modern pentathlon"),
// new Sport("Mountain bike"),
// new Sport("Rhythmic gymnastics"),
// new Sport("Road cycling"),
// new Sport("Rowing"),
// new Sport("Rugby sevens"),
// new Sport("Sailing"),
// new Sport("Shooting"),
// new Sport("Skateboarding"),
// new Sport("Sport climbing"),
// new Sport("Surfing"),
// new Sport("Swimming"),
// new Sport("Table tennis"),
// new Sport("Taekwondo"),
// new Sport("Tennis"),
// new Sport("Track cycling"),
// new Sport("Trampoline gymnastics"),
// new Sport("Triathlon"),
// new Sport("Volleyball"),
// new Sport("Water polo"),
// new Sport("Weightlifting"),
// new Sport("Wrestling"));

// // Ajouter les sports s'ils n'existent pas déjà
// for (Sport sport : sportList) {
// if (!sportService.existsByNom(sport.getNom())) {
// sportService.save(sport);
// }
// }
// }
// }