package com.yeninesilbilgiyarismasi.app;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import android.os.Bundle;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Capacitor's SPA fallback otherwise serves Turkish index.html for /en.
        bridge.setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String path = request.getUrl().getPath();
                if (!request.isForMainFrame() || !"localhost".equals(request.getUrl().getHost())) {
                    return super.shouldInterceptRequest(view, request);
                }
                String asset = OfflineRoutes.assetForPath(path);
                if (asset == null) return super.shouldInterceptRequest(view, request);
                int status = 200;
                InputStream stream;
                try {
                    stream = getAssets().open(asset);
                } catch (IOException missing) {
                    status = 404;
                    try {
                        stream = getAssets().open(path.startsWith("/en/") ? "public/en/404.html" : "public/404.html");
                    } catch (IOException fallbackMissing) {
                        return super.shouldInterceptRequest(view, request);
                    }
                }
                return new WebResourceResponse("text/html", "UTF-8", status,
                    status == 200 ? "OK" : "Not Found", Collections.emptyMap(),
                    bridge.getLocalServer().getJavaScriptInjectedStream(stream));
            }
        });
    }
}
