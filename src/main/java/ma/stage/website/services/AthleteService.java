package ma.stage.website.services;


import ma.stage.website.idao.IDao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.stage.website.repository.*;
import ma.stage.website.entities.*;

@Service
public class AthleteService implements IDao<Athlete> {
	@Autowired
	AthleteRepository athleteRepository;

	@Override
	public Athlete create(Athlete o) {
		return athleteRepository.save(o);
	}

	@Override
	public List<Athlete> findAll() {
		return athleteRepository.findAll();
	}

	// public List<Athlete> findByCategorie(Categorie categorie){
	// return athleteRepository.findByCategorie(categorie);
	// }

	@Override
	public Athlete update(Athlete o) {
		return athleteRepository.save(o);
	}

	@Override
	public boolean delete(Athlete o) {
		try {
			athleteRepository.delete(o);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public Athlete findById(Long id) {
		return athleteRepository.findById(id).orElse(null);
	}

	@Override
	public Athlete findById(long id) {
		return null;
	}

	// public List<Athlete> findByType(int typeId) {
	// 	return athleteRepository.findByType(typeId);
	// }

	public Athlete saveAthlete(Athlete athlete) {
		return athleteRepository.save(athlete);
	}

	public List<Athlete> getAllAthletes() {
		return athleteRepository.findAll();
	}

}
