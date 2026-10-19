package jar.service;

import jar.entity.Arquivo;
import jar.repository.ArquivoRepository;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImagemService {

    private static final Map<String, String> TIPOS = Map.of(
        "image/jpeg", "jpg",
        "image/png", "png",
        "image/webp", "webp"
    );
    private static final Map<String, String> MIME = Map.of(
        "jpg", "image/jpeg",
        "png", "image/png",
        "webp", "image/webp"
    );
    private static final Pattern NOME_VALIDO = Pattern.compile("[a-f0-9-]{36}\\.(jpg|png|webp)");
    private static final long TAMANHO_MAXIMO = 5L * 1024 * 1024;

    @Autowired
    private ArquivoRepository repository;

    public String salvar(MultipartFile arquivo) throws IOException {
        if (arquivo.isEmpty()) {
            throw new IllegalArgumentException("Envie uma imagem");
        }
        if (arquivo.getSize() > TAMANHO_MAXIMO) {
            throw new IllegalArgumentException("A imagem deve ter até 5 MB");
        }
        String extensao = TIPOS.get(arquivo.getContentType());
        if (extensao == null) {
            throw new IllegalArgumentException("Formatos aceitos: JPG, PNG ou WEBP");
        }
        String nome = UUID.randomUUID() + "." + extensao;
        repository.save(new Arquivo(nome, MIME.get(extensao), arquivo.getBytes()));
        return nome;
    }

    public Optional<Arquivo> carregar(String nome) {
        if (nome == null || !NOME_VALIDO.matcher(nome).matches()) {
            return Optional.empty();
        }
        return repository.findById(nome);
    }

    public void remover(String nome) {
        if (nome != null && NOME_VALIDO.matcher(nome).matches()) {
            repository.deleteById(nome);
        }
    }
}
