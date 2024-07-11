package ma.stage.website.services;

import ma.stage.website.idao.IDao;

import java.util.List;
import ma.stage.website.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import ma.stage.website.entities.*;

@org.springframework.stereotype.Service
public class UserService implements IDao<User> {

	@Autowired
	UserRepository userRepository;

	@Override
	public User create(User o) {
		return userRepository.save(o);
	}

	@Override
	public List<User> findAll() {
		return userRepository.findAll();
	}

	// public List<User> findByUser(User user){
	// return userRepository.findByUser(user);
	// }

	@Override
	public User update(User o) {
		return userRepository.save(o);
	}

	@Override
	public boolean delete(User o) {
		try {
			userRepository.delete(o);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public User findById(Long id) {
		return userRepository.findById(id).orElse(null);
	}

	@Override
	public User findById(long id) {
		// TODO Auto-generated method stub
		return null;
	}

	public User getUserById(Long id) {
		return userRepository.findById(id).orElse(null);
	}

}
