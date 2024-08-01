package ma.stage.website.services;

import ma.stage.website.idao.IDao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.stage.website.repository.*;
import ma.stage.website.entities.*;

@Service
public class ActualiteService implements IDao<Actualite> {
	@Autowired
	ActualiteRepository actualiteRepository;

	@Override
	public Actualite create(Actualite o) {
		return actualiteRepository.save(o);
	}

	@Override
	public List<Actualite> findAll() {
		return actualiteRepository.findAll();
	}

	// public List<Actualite> findByCategorie(Categorie categorie){
	// return actualiteRepository.findByCategorie(categorie);
	// }

	@Override
	public Actualite update(Actualite o) {
		return actualiteRepository.save(o);
	}

	@Override
	public boolean delete(Actualite o) {
		try {
			actualiteRepository.delete(o);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public Actualite findById(Long id) {
		return actualiteRepository.findById(id).orElse(null);
	}

	@Override
	public Actualite findById(long id) {
		return null;
	}

	public List<Actualite> findByType(long sportId) {
		return actualiteRepository.findByType(sportId);
	}

	public Actualite saveActualite(Actualite actualite) {
		return actualiteRepository.save(actualite);
	}

	public List<Actualite> getAllActualites() {
		return actualiteRepository.findAll();
	}

}
