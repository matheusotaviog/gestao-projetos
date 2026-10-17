package jar.service;

import jar.dto.ConversaResponse;
import jar.dto.MensagemResponse;
import jar.entity.Conversa;
import jar.entity.Mensagem;
import jar.entity.Papel;
import jar.entity.Usuario;
import jar.repository.ConversaRepository;
import jar.repository.MensagemRepository;
import jar.repository.UsuarioRepository;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private static final DateTimeFormatter HORA = DateTimeFormatter.ofPattern("dd/MM HH:mm");

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ConversaRepository conversaRepository;

    @Autowired
    private MensagemRepository mensagemRepository;

    public List<ConversaResponse> listarConversas(String email) {
        Usuario eu = usuarioPorEmail(email);
        return conversaRepository.findByRecrutadorOrGestorOrderByCriadaEmDesc(eu, eu).stream()
            .map(c -> paraConversa(c, eu))
            .toList();
    }

    public ConversaResponse abrirConversa(String email, String usernameGestor) {
        Usuario recrutador = usuarioPorEmail(email);
        if (recrutador.getPapel() != Papel.RECRUTADOR) {
            throw new AccessDeniedException("Apenas recrutadores iniciam conversas");
        }
        Usuario gestor = usuarioRepository.findByUsername(usernameGestor == null ? "" : usernameGestor.toLowerCase());
        if (gestor == null || gestor.getPapel() != Papel.GESTOR) {
            throw new NoSuchElementException("Candidato não encontrado");
        }
        Conversa conversa = conversaRepository.findByRecrutadorAndGestor(recrutador, gestor)
            .orElseGet(() -> conversaRepository.save(new Conversa(recrutador, gestor)));
        return paraConversa(conversa, recrutador);
    }

    public List<MensagemResponse> listarMensagens(String email, Long conversaId) {
        Usuario eu = usuarioPorEmail(email);
        Conversa conversa = doParticipante(conversaId, eu);
        return mensagemRepository.findByConversaOrderByCriadaEmAsc(conversa).stream()
            .map(m -> paraMensagem(m, eu))
            .toList();
    }

    public MensagemResponse enviar(String email, Long conversaId, String texto) {
        Usuario eu = usuarioPorEmail(email);
        Conversa conversa = doParticipante(conversaId, eu);
        if (texto == null || texto.isBlank() || texto.length() > 2000) {
            throw new IllegalArgumentException("A mensagem deve ter de 1 a 2000 caracteres");
        }
        return paraMensagem(mensagemRepository.save(new Mensagem(conversa, eu, texto.trim())), eu);
    }

    private Usuario usuarioPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new NoSuchElementException("Usuário não encontrado");
        }
        return usuario;
    }

    private Conversa doParticipante(Long conversaId, Usuario eu) {
        Conversa conversa = conversaRepository.findById(conversaId)
            .orElseThrow(() -> new NoSuchElementException("Conversa não encontrada"));
        if (!conversa.getRecrutador().getId().equals(eu.getId()) && !conversa.getGestor().getId().equals(eu.getId())) {
            throw new AccessDeniedException("Você não participa desta conversa");
        }
        return conversa;
    }

    private ConversaResponse paraConversa(Conversa conversa, Usuario eu) {
        Usuario outro = conversa.getRecrutador().getId().equals(eu.getId()) ? conversa.getGestor() : conversa.getRecrutador();
        Mensagem ultima = mensagemRepository.findFirstByConversaOrderByCriadaEmDesc(conversa).orElse(null);
        return new ConversaResponse(
            conversa.getId(),
            outro.getNome(),
            outro.getUsername(),
            outro.getProfissao(),
            ultima == null ? null : ultima.getTexto(),
            ultima == null ? null : ultima.getCriadaEm().format(HORA)
        );
    }

    private MensagemResponse paraMensagem(Mensagem m, Usuario eu) {
        return new MensagemResponse(m.getId(), m.getRemetente().getId().equals(eu.getId()), m.getTexto(), m.getCriadaEm().format(HORA));
    }
}
