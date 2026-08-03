package tests;

import com.microsoft.playwright.Locator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class TextSizeTests extends BaseTest {

    @Test
    public void testTextSizeChanges() {
        // Step 1: Select LARGE font size on the main screen
        // The text size control is a range input
        Locator fontSizeSlider = page.locator("#font-size");
        
        // Let's set it to a large value, e.g., 100
        fontSizeSlider.fill("100");
        
        // Enter 5 sentences
        page.locator("#script-input").fill("Sentence one.\nSentence two.\nSentence three.\nSentence four.\nSentence five.");
        
        // Start teleprompter
        page.locator("#start-btn").click();
        
        // Verify the font size is indeed large while it runs
        Locator prompterText = page.locator("#prompter-text");
        prompterText.waitFor();
        
        // We can check the computed style of the prompter text wrapper or the text itself
        String largeFontSizeStr = (String) page.evaluate("window.getComputedStyle(document.getElementById('prompter-text')).fontSize");
        // Computed font size returns pixels, e.g., "100px"
        int largeFontSize = Integer.parseInt(largeFontSizeStr.replace("px", ""));
        Assertions.assertTrue(largeFontSize >= 100, "Font size is not large enough, expected >= 100 but got " + largeFontSize);

        // Step 2: Go back / refresh and test SMALL font size
        page.navigate(APP_URL); // Reload the page
        
        // Set to a small value, e.g., 20
        page.locator("#font-size").fill("20");
        
        // Enter text again
        page.locator("#script-input").fill("Small text sentence one.\nSmall text sentence two.");
        
        // Start teleprompter
        page.locator("#start-btn").click();
        
        // Verify the font size is small
        page.locator("#prompter-text").waitFor();
        String smallFontSizeStr = (String) page.evaluate("window.getComputedStyle(document.getElementById('prompter-text')).fontSize");
        int smallFontSize = Integer.parseInt(smallFontSizeStr.replace("px", ""));
        Assertions.assertTrue(smallFontSize <= 30, "Font size is not small enough, expected <= 30 but got " + smallFontSize);
    }
}
