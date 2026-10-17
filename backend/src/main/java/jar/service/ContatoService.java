package jar.service;

import jar.dto.ContatoRequest;
import jar.entity.Papel;
import jar.entity.Usuario;
import jar.repository.UsuarioRepository;
import java.time.LocalDate;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContatoService {

    private static final Logger log = LoggerFactory.getLogger(ContatoService.class);
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from:}")
    private String remetente;

    @Value("${app.contato.limite-diario:10}")
    private int limiteDiario;

    private final Map<String, Contagem> contagens = new ConcurrentHashMap<>();

    public void enviar(String username, String emailRecrutador, ContatoRequest dados) {
        if (dados.nome() == null || dados.nome().isBlank()) {
            throw new IllegalArgumentException("Informe seu nome");
        }
        if (dados.email() == null || !EMAIL.matcher(dados.email().trim()).matches()) {
            throw new IllegalArgumentException("Informe um e-mail válido para resposta");
        }
        if (dados.mensagem() == null || dados.mensagem().isBlank() || dados.mensagem().length() > 2000) {
            throw new IllegalArgumentException("A mensagem deve ter de 1 a 2000 caracteres");
        }

        Usuario candidato = usuarioRepository.findByUsername(username.toLowerCase());
        if (candidato == null || candidato.getPapel() != Papel.GESTOR) {
            throw new NoSuchElementException("Candidato não encontrado");
        }

        registrarEnvio(emailRecrutador);

        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom(remetente);
        email.setTo(candidato.getEmail());
        email.setReplyTo(dados.email().trim());
        email.setSubject("Contato pelo Mirrorwork: " + dados.nome().trim());
        email.setText(dados.mensagem().trim()
            + "\n\n---\nEnviado por " + dados.nome().trim() + " (" + dados.email().trim() + ") pelo Mirrorwork.");

        try {
            mailSender.send(email);
        } catch (MailException e) {
            log.error("Falha ao enviar e-mail de contato para {}", candidato.getUsername(), e);
            throw new IllegalStateException("Não foi possível enviar a mensagem agora. Tente novamente mais tarde.");
        }
    }

    private void registrarEnvio(String emailRecrutador) {
        Contagem atual = contagens.compute(emailRecrutador, (chave, antiga) ->
            antiga == null || !antiga.dia.equals(LocalDate.now()) ? new Contagem(LocalDate.now(), 1) : antiga.incrementar()
        );
        if (atual.quantidade > limiteDiario) {
            throw new IllegalStateException("Você atingiu o limite diário de mensagens. Tente amanhã.");
        }
    }

    private record Contagem(LocalDate dia, int quantidade) {
        Contagem incrementar() {
            return new Contagem(dia, quantidade + 1);
        }
    }
}
