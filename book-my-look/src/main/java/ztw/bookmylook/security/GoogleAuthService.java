package ztw.bookmylook.security;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {
    @Value("{spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    public void validateToken(String token) {
        GoogleIdTokenVerifier verifier =
                new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                        new GsonFactory()).setAudience(Collections.singletonList(clientId))
                        .build();
    }
}
