package ma.stage.website.idao;
import java.util.List;

	

	

public interface IDao <T> {
		
		T create (T o);
		boolean delete (T o);
		T update (T o);
		T findById(long id);
		List<T> findAll();
		

	}

