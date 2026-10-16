package jar.repository;

import jar.entity.Papel;
import jar.entity.Usuario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);
    Usuario findByUsername(String username);
    List<Usuario> findByPapel(Papel papel);
}
