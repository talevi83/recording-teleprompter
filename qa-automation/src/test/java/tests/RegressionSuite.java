package tests;

import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;

@Suite
@SelectClasses({
    LanguageTests.class,
    RecordingTests.class,
    TextSizeTests.class
})
public class RegressionSuite {
    // This class remains empty. It only serves as a holder for the annotations.
}
