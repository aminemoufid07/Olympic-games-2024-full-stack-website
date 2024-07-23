package ma.stage.website.services;

import ma.stage.website.idao.IDao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.stage.website.repository.*;
import ma.stage.website.entities.*;

@Service
public class CommuniqueService implements IDao<Communique> {
	@Autowired
	CommuniqueRepository communiqueRepository;

	@Override
	public Communique create(Communique o) {
		return communiqueRepository.save(o);
	}

	@Override
	public List<Communique> findAll() {
		return communiqueRepository.findAll();
	}

	// public List<Communique> findByCategorie(Categorie categorie){
	// return communiqueRepository.findByCategorie(categorie);
	// }

	@Override
	public Communique update(Communique o) {
		return communiqueRepository.save(o);
	}

	@Override
	public boolean delete(Communique o) {
		try {
			communiqueRepository.delete(o);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public Communique findById(Long id) {
		return communiqueRepository.findById(id).orElse(null);
	}

	@Override
	public Communique findById(long id) {
		return null;
	}

	public Communique saveCommunique(Communique communique) {
		return communiqueRepository.save(communique);
	}

	public List<Communique> getAllCommuniques() {
		return communiqueRepository.findAll();
	}

}
