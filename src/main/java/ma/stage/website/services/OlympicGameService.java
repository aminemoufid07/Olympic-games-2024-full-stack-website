package ma.stage.website.services;

import ma.stage.website.idao.IDao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.stage.website.repository.*;
import ma.stage.website.entities.*;

@Service
public class OlympicGameService implements IDao<OlympicGame> {
	@Autowired
	OlympicGameRepository olympicGameRepository;

	// @Override
	// public OlympicGame create(OlympicGame o) {
	// return olympicGameRepository.save(o);
	// }

	@Override
	public List<OlympicGame> findAll() {
		return olympicGameRepository.findAll();
	}

	// public List<OlympicGame> findByCategorie(Categorie categorie){
	// return olympicGameRepository.findByCategorie(categorie);
	// }

	@Override
	public OlympicGame update(OlympicGame o) {
		return olympicGameRepository.save(o);
	}

	@Override
	public boolean delete(OlympicGame o) {
		try {
			olympicGameRepository.delete(o);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public OlympicGame findById(Long id) {
		return olympicGameRepository.findById(id).orElse(null);
	}

	@Override
	public OlympicGame findById(long id) {
		return null;
	}

	public OlympicGame saveOlympicGame(OlympicGame olympicGame) {
		return olympicGameRepository.save(olympicGame);
	}

	public List<OlympicGame> getAllOlympicGames() {
		return olympicGameRepository.findAll();
	}

	@Autowired
	private SportRepository sportRepository;

	public OlympicGame create(OlympicGame olympicGame) {
		// Vérifier la longueur de 'nom'
		if (olympicGame.getNom().length() > 255) {
			throw new IllegalArgumentException("La longueur du nom ne peut pas dépasser 255 caractères.");
		}

		// Vérifiez si le sport existe déjà dans la base de données
		Sport sport = olympicGame.getSport();
		if (sport.getId() == null || sportRepository.findById(sport.getId()).isEmpty()) {
			// Si le sport n'existe pas, le sauvegarder
			sport = sportRepository.save(sport);
		}
		olympicGame.setSport(sport);
		return olympicGameRepository.save(olympicGame);
	}

}
