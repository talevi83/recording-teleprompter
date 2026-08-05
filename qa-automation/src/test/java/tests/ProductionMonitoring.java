package tests;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class ProductionMonitoring extends BaseTest {
    @Test
    public void testProductionMonitoring() {
        Response response = page.navigate(LIVE_URL);
        Assertions.assertEquals(response.status(), 200);

        page.reload();
        Assertions.assertEquals(response.status(), 200);
        page.close();
    }

    @Test
    public void testProductionWithoutSslError() {
        try (BrowserContext sslContext = browser.newContext(new Browser.NewContextOptions()
                .setIgnoreHTTPSErrors(false))) {
            Page sslPage = sslContext.newPage();
            Response response = sslPage.navigate(LIVE_URL);
            Assertions.assertEquals(200, response.status());
        }
    }

}
