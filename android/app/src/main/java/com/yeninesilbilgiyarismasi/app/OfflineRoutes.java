package com.yeninesilbilgiyarismasi.app;

final class OfflineRoutes {
    private OfflineRoutes() {}

    static String assetForPath(String path) {
        if (path == null) return null;
        if (path.equals("/")) return "public/index.html";
        String normalized = path.endsWith("/") ? path.substring(0, path.length() - 1) : path;
        if (!normalized.matches("/(?:[a-z0-9-]+/)*[a-z0-9-]+")) return null;
        return "public" + normalized + ".html";
    }
}
