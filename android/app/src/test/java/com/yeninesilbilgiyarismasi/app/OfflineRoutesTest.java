package com.yeninesilbilgiyarismasi.app;

import org.junit.Test;
import static org.junit.Assert.*;

public class OfflineRoutesTest {
    @Test public void languageAndGuidePathsStaySeparate() {
        assertEquals("public/index.html", OfflineRoutes.assetForPath("/"));
        assertEquals("public/en.html", OfflineRoutes.assetForPath("/en"));
        assertEquals("public/en.html", OfflineRoutes.assetForPath("/en/"));
        assertEquals("public/en/space-trivia-quiz.html", OfflineRoutes.assetForPath("/en/space-trivia-quiz"));
        assertEquals("public/kolay-bilgi-yarismasi.html", OfflineRoutes.assetForPath("/kolay-bilgi-yarismasi/"));
    }
    @Test public void traversalAndAssetsAreNotRewritten() {
        assertNull(OfflineRoutes.assetForPath("/../index"));
        assertNull(OfflineRoutes.assetForPath("//en"));
        assertNull(OfflineRoutes.assetForPath("/en.html"));
        assertNull(OfflineRoutes.assetForPath("/_next/static/chunks/a.js"));
        assertNull(OfflineRoutes.assetForPath(null));
    }
}
