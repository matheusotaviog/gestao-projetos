package jar.service;

import java.io.IOException;
import java.net.InetAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;

@Service
public class PreviewService {

    private static final Pattern OG_IMAGE = Pattern.compile(
        "<meta[^>]+property=[\"']og:image[\"'][^>]*content=[\"']([^\"']+)[\"']",
        Pattern.CASE_INSENSITIVE
    );

    private final HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .followRedirects(HttpClient.Redirect.NORMAL)
        .build();

    public String buscarImagem(String link) {
        try {
            URI uri = URI.create(link);
            if (!linkPermitido(uri)) {
                return null;
            }

            HttpRequest request = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(5))
                .header("User-Agent", "Processos-Preview/1.0")
                .GET()
                .build();

            HttpResponse<String> resposta = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (resposta.statusCode() / 100 != 2) {
                return null;
            }

            Matcher matcher = OG_IMAGE.matcher(resposta.body());
            if (!matcher.find()) {
                return null;
            }
            return uri.resolve(matcher.group(1)).toString();
        } catch (IOException | IllegalArgumentException e) {
            return null;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return null;
        }
    }

    private boolean linkPermitido(URI uri) throws IOException {
        String esquema = uri.getScheme();
        if (!"http".equals(esquema) && !"https".equals(esquema)) {
            return false;
        }
        if (uri.getHost() == null) {
            return false;
        }
        InetAddress endereco = InetAddress.getByName(uri.getHost());
        return !(endereco.isLoopbackAddress()
            || endereco.isSiteLocalAddress()
            || endereco.isLinkLocalAddress()
            || endereco.isAnyLocalAddress());
    }
}
