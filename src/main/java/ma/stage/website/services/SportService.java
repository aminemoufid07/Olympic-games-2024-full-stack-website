package ma.stage.website.services;

import ma.stage.website.idao.IDao;

import java.util.List;
import ma.stage.website.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.stage.website.entities.*;

@Service
public class SportService implements IDao<Sport> {

	@Autowired
	SportRepository sportRepository;

	@Override
	public Sport create(Sport o) {
		return sportRepository.save(o);
	}

	@Override
	public List<Sport> findAll() {
		return sportRepository.findAll();
	}

	// public List<Sport> findBySport(Sport sport){
	// return sportRepository.findBySport(sport);
	// }

	@Override
	public Sport update(Sport o) {
		return sportRepository.save(o);
	}

	@Override
	public boolean delete(Sport o) {
		try {
			sportRepository.delete(o);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public Sport findById(Long id) {
		return sportRepository.findById(id).orElse(null);
	}

	@Override
	public Sport findById(long id) {
		// TODO Auto-generated method stub
		return null;
	}

	public Sport getSportById(Long id) {
		return sportRepository.findById(id).orElse(null);
	}

}
