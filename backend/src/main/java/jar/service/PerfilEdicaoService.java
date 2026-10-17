package jar.service;

import jar.catalogo.Profissoes;
import jar.dto.PerfilEdicaoRequest;
import jar.dto.PerfilPessoal;
import jar.entity.Papel;
import jar.entity.Usuario;
import jar.repository.UsuarioRepository;
import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PerfilEdicaoService {

    private static final Pattern URL = Pattern.compile("^https?://\\S+$");

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ImagemService imagemService;

    public PerfilPessoal obter(String email) {
        return PerfilPessoal.de(porEmail(email));
    }

    public PerfilPessoal atualizar(String email, PerfilEdicaoRequest dados) {
        Usuario usuario = porEmail(email);

        String nome = limpar(dados.nome());
        if (nome == null) {
            throw new IllegalArgumentException("Informe seu nome");
        }
        String bio = limpar(dados.bio());
        if (bio != null && bio.length() > 500) {
            throw new IllegalArgumentException("A bio deve ter até 500 caracteres");
        }
        String profissao = limpar(dados.profissao());
        if (profissao != null && !Profissoes.existe(profissao)) {
            throw new IllegalArgumentException("Profissão desconhecida: " + profissao);
        }
        if (usuario.getPapel() == Papel.GESTOR && profissao == null) {
            throw new IllegalArgumentException("Informe sua profissão");
        }

        usuario.setNome(nome);
        usuario.setBio(bio);
        usuario.setProfissao(profissao);
        usuario.setCidade(limitar(limpar(dados.cidade()), 80));
        usuario.setEmpresa(limitar(limpar(dados.empresa()), 120));
        usuario.setGithub(url(dados.github(), "GitHub"));
        usuario.setLinkedin(url(dados.linkedin(), "LinkedIn"));
        usuario.setSite(url(dados.site(), "Site"));

        return PerfilPessoal.de(usuarioRepository.save(usuario));
    }

    public PerfilPessoal trocarAvatar(String email, MultipartFile arquivo) throws IOException {
        Usuario usuario = porEmail(email);
        String antigo = nomeDoArquivo(usuario.getAvatar());
        String novo = imagemService.salvar(arquivo);
        usuario.setAvatar("/api/arquivos/" + novo);
        PerfilPessoal salvo = PerfilPessoal.de(usuarioRepository.save(usuario));
        imagemService.remover(antigo);
        return salvo;
    }

    private Usuario porEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new NoSuchElementException("Usuário não encontrado");
        }
        return usuario;
    }

    private String url(String valor, String rotulo) {
        String limpo = limpar(valor);
        if (limpo == null) return null;
        if (!URL.matcher(limpo).matches() || limpo.length() > 2048) {
            throw new IllegalArgumentException(rotulo + " deve começar com http:// ou https://");
        }
        return limpo;
    }

    private String limitar(String valor, int maximo) {
        if (valor != null && valor.length() > maximo) {
            throw new IllegalArgumentException("Texto longo demais (máximo " + maximo + " caracteres)");
        }
        return valor;
    }

    private String limpar(String valor) {
        if (valor == null) return null;
        String limpo = valor.trim();
        return limpo.isEmpty() ? null : limpo;
    }

    private String nomeDoArquivo(String caminho) {
        return caminho == null ? null : caminho.substring(caminho.lastIndexOf('/') + 1);
    }
}
