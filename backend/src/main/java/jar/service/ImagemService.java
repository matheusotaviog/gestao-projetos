package jar.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImagemService {

    private static final Map<String, String> TIPOS = Map.of(
        "image/jpeg", "jpg",
        "image/png", "png",
        "image/webp", "webp"
    );
    private static final Pattern NOME_VALIDO = Pattern.compile("[a-f0-9-]{36}\\.(jpg|png|webp)");
    private static final long TAMANHO_MAXIMO = 5L * 1024 * 1024;

    private final Path pasta;

    public ImagemService(@Value("${app.uploads.dir}") String diretorio) throws IOException {
        this.pasta = Path.of(diretorio).toAbsolutePath().normalize();
        Files.createDirectories(pasta);
    }

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
        Files.copy(arquivo.getInputStream(), pasta.resolve(nome));
        return nome;
    }

    public Resource carregar(String nome) {
        if (!NOME_VALIDO.matcher(nome).matches()) {
            return null;
        }
        Resource recurso = new FileSystemResource(pasta.resolve(nome));
        return recurso.exists() ? recurso : null;
    }

    public void remover(String nome) throws IOException {
        if (nome != null && NOME_VALIDO.matcher(nome).matches()) {
            Files.deleteIfExists(pasta.resolve(nome));
        }
    }
}
