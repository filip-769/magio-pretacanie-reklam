package com.telekom.magiogo;

import android.text.TextUtils;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

public final class AdMetadataResponseInterceptor {
    public static WebResourceResponse intercept(WebResourceRequest request) {
        String url = request.getUrl().toString();
        if (!url.contains("/schedules/ads") || !"GET".equals(request.getMethod())) return null;

        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setConnectTimeout(15000);
            connection.setReadTimeout(15000);
            for (Map.Entry<String, String> header : request.getRequestHeaders().entrySet()) {
                connection.setRequestProperty(header.getKey(), header.getValue());
            }
            String cookies = CookieManager.getInstance().getCookie(url);
            if (cookies != null) connection.setRequestProperty("Cookie", cookies);
            connection.setRequestProperty("Accept-Encoding", "identity");
            if (connection.getResponseCode() != 200) return null;

            String body;
            try (InputStream input = connection.getInputStream();
                 ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                byte[] buffer = new byte[4096];
                int length;
                while ((length = input.read(buffer)) != -1) output.write(buffer, 0, length);
                body = new JSONObject(output.toString("UTF-8"))
                        .put("adSkipPolicy", "FULLY_SKIPPABLE")
                        .put("gracePeriodInSeconds", 0)
                        .toString();
            }

            Map<String, String> headers = new HashMap<>();
            for (Map.Entry<String, List<String>> header : connection.getHeaderFields().entrySet()) {
                String name = header.getKey();
                if (name == null || name.equalsIgnoreCase("Content-Length") ||
                    name.equalsIgnoreCase("Content-Encoding") || name.equalsIgnoreCase("Transfer-Encoding")) {
                    continue;
                }
                headers.put(name, TextUtils.join(", ", header.getValue()));
            }
            return new WebResourceResponse("application/json", "UTF-8", 200, "OK", headers,
                    new ByteArrayInputStream(body.getBytes(StandardCharsets.UTF_8)));
        } catch (IOException | JSONException error) {
            Log.w("MagioAds", "Could not rewrite ad metadata", error);
            return null;
        } finally {
            if (connection != null) connection.disconnect();
        }
    }
}
