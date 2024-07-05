package ma.stage.website.services;

import ma.stage.website.idao.IDao;

import java.util.List;
import ma.stage.website.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.stage.website.entities.*;

@Service
public class TypeService implements IDao<Type> {

	@Autowired
	TypeRepository typeRepository;

	@Override
	public Type create(Type o) {
		return typeRepository.save(o);
	}

	@Override
	public List<Type> findAll() {
		return typeRepository.findAll();
	}

	// public List<Type> findByType(Type type){
	// return typeRepository.findByType(type);
	// }

	@Override
	public Type update(Type o) {
		return typeRepository.save(o);
	}

	@Override
	public boolean delete(Type o) {
		try {
			typeRepository.delete(o);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public Type findById(Long id) {
		return typeRepository.findById(id).orElse(null);
	}

	@Override
	public Type findById(long id) {
		// TODO Auto-generated method stub
		return null;
	}

	public Type getTypeById(Long id) {
		return typeRepository.findById(id).orElse(null);
	}

}
