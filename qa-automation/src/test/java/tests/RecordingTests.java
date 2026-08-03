package tests;

import com.microsoft.playwright.Download;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.options.WaitForSelectorState;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.nio.file.Path;
import java.nio.file.Paths;

public class RecordingTests extends BaseTest {

    @Test
    public void testVideoAndAudioRecording() {
        // 2.1 Enter text and start
        page.locator("#script-input").fill("Testing video and audio recording.\nSecond sentence.");
        
        // Mode is Video + Audio by default
        page.locator("#start-btn").click();

        // Check countdown - the countdown logic is in the app, usually it shows 3..2..1 on screen
        // In the provided index.html, there's no explicit countdown element shown in the HTML statically,
        // it might be added dynamically. For this test, we verify the recording starts.
        
        // Wait for recording indicator to appear (starts automatically after 3-second countdown)
        Locator recIndicator = page.locator("#rec-indicator");
        recIndicator.waitFor(new Locator.WaitForOptions().setTimeout(5000));
        Assertions.assertTrue(recIndicator.isVisible(), "Recording indicator is not visible, recording didn't start");

        // The text should be running (we can verify play-pause button state if possible, or just assume if rec started, it's running)
        Locator prompterText = page.locator("#prompter-text");
        Assertions.assertTrue(prompterText.isVisible(), "Prompter text is not visible");
    }

    @Test
    public void testAudioOnlyRecordingAndSave() {
        // Change recording mode to Audio Only
        page.locator("#record-mode-select").selectOption("audio");
        
        // Enter text
        page.locator("#script-input").fill("Testing audio only recording and downloading.");
        
        // Start
        page.locator("#start-btn").click();

        // Wait for recording indicator to exist and have the 'hidden' class removed (starts automatically after countdown)
        Locator recIndicator = page.locator("#rec-indicator:not(.hidden)");
        recIndicator.waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.ATTACHED).setTimeout(5000));
        Assertions.assertFalse(recIndicator.getAttribute("class").contains("hidden"), "Recording indicator should not have class 'hidden'");

        // Wait a couple of seconds to record something
        page.waitForTimeout(2000);

        // Click stop recording to open the download overlay
        page.locator("#record-btn").click();

        // In Playwright, to handle downloads, we need to wait for the download event
        // which starts when clicking the dynamic download link in the overlay
        Download download = page.waitForDownload(() -> {
            page.locator("a[download]").click();
        });

        // Verify the file was saved
        Assertions.assertNotNull(download, "Download did not start after stopping recording");
        
        // Save the downloaded file to a specific path
        Path destination = Paths.get("target/downloads/" + download.suggestedFilename());
        download.saveAs(destination);
        
        Assertions.assertTrue(destination.toFile().exists(), "Saved file does not exist on disk");
        Assertions.assertTrue(destination.toFile().length() > 0, "Saved file is empty");
    }
}
