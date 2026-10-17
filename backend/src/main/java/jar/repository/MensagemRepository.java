package jar.repository;

import jar.entity.Conversa;
import jar.entity.Mensagem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    List<Mensagem> findByConversaOrderByCriadaEmAsc(Conversa conversa);
    Optional<Mensagem> findFirstByConversaOrderByCriadaEmDesc(Conversa conversa);
}
