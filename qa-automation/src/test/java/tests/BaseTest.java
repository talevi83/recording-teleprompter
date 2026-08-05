package tests;

import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;

import java.util.Arrays;
import java.util.List;

public class BaseTest {
    protected static Playwright playwright;
    protected static Browser browser;
    protected static Process serverProcess;
    protected BrowserContext context;
    protected Page page;
    
    // The URL of the application to test
    protected final String APP_URL = "https://localhost:8090/";

    @BeforeAll
    static void launchBrowser() {
        // Start the application using start.bat/start.sh depending on OS
        try {
            String osName = System.getProperty("os.name").toLowerCase();
            ProcessBuilder pb;
            if (osName.contains("win")) {
                pb = new ProcessBuilder("cmd.exe", "/c", "start.bat");
            } else {
                pb = new ProcessBuilder("bash", "start.sh");
            }
            pb.directory(new java.io.File(".."));
            serverProcess = pb.start();
            
            // Wait for port 8090 to become active
            long startTime = System.currentTimeMillis();
            boolean serverReady = false;
            while (System.currentTimeMillis() - startTime < 10000) { // 10 seconds timeout
                try (java.net.Socket socket = new java.net.Socket("localhost", 8090)) {
                    serverReady = true;
                    break;
                } catch (java.io.IOException e) {
                    Thread.sleep(500);
                }
            }
            if (!serverReady) {
                System.err.println("Warning: Server did not start on port 8090 within 10 seconds.");
            }
        } catch (Exception e) {
            System.err.println("Failed to start application server: " + e.getMessage());
        }

        playwright = Playwright.create();
        // You can set headless = false to see the browser running during development
        browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
                .setHeadless(true)
                .setArgs(Arrays.asList("--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream")));
    }

    @AfterAll
    static void closeBrowser() {
        if (playwright != null) {
            playwright.close();
        }
        if (serverProcess != null) {
            // Terminate the process tree (including python server)
            serverProcess.descendants().forEach(ProcessHandle::destroyForcibly);
            serverProcess.destroyForcibly();
        }
    }

    @BeforeEach
    void createContextAndPage() {
        // Grant permissions for camera and microphone so the prompt doesn't block the test
        context = browser.newContext(new Browser.NewContextOptions()
                .setIgnoreHTTPSErrors(true)
                .setPermissions(Arrays.asList("camera", "microphone")));
        
        page = context.newPage();
        page.navigate(APP_URL);
    }

    @AfterEach
    void closeContext() {
        context.close();
    }
}
