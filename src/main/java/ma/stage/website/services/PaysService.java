package ma.stage.website.services;

import ma.stage.website.idao.IDao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.stage.website.repository.*;
import ma.stage.website.entities.*;

@Service
public class PaysService implements IDao<Pays> {
	@Autowired
	PaysRepository paysRepository;

	@Override
	public Pays create(Pays o) {
		return paysRepository.save(o);
	}

	@Override
	public List<Pays> findAll() {
		return paysRepository.findAll();
	}

	// public List<Pays> findByCategorie(Categorie categorie){
	// return paysRepository.findByCategorie(categorie);
	// }

	@Override
	public Pays update(Pays o) {
		return paysRepository.save(o);
	}

	@Override
	public boolean delete(Pays o) {
		try {
			paysRepository.delete(o);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public Pays findById(Long id) {
		return paysRepository.findById(id).orElse(null);
	}

	@Override
	public Pays findById(long id) {
		return null;
	}
	// public Optional<Pays> getPaysById(Long id) {
    //     return paysRepository.findById(id);
    // }
	public Pays savePays(Pays pays) {
		return paysRepository.save(pays);
	}

	public List<Pays> getAllPayss() {
		return paysRepository.findAll();
	}
	public Pays getPaysById(Long id) {
		return paysRepository.findById(id).orElse(null);
	}

}
