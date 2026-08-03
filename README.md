# Recording Teleprompter 🎥🎙️

A fully local, privacy-first, responsive Teleprompter web application with built-in video and audio recording capabilities.

*Created by Tal Levi*

## Features

- **Completely Local & Secure**: Everything runs locally in your browser. No data is sent to the cloud.
- **Video & Audio Recording**: Record high-quality video or choose "Audio Only" mode. Files are saved directly to your device (supports mobile and iOS!).
- **Smart Auto-Record UX**: A seamless recording flow with a 3-second countdown before auto-scrolling starts.
- **Practice Mode**: Rehearse your script without triggering the camera or saving files.
- **Multi-Language Support**: Full UI translation and Right-to-Left (RTL)/Left-to-Right (LTR) support for English, Hebrew, and Arabic.
- **Physical Prompter Support**: Mirror text horizontally or flip vertically for use with physical teleprompter glass/mirrors.
- **Mobile Friendly**: Fully responsive design with touch-and-drag scrolling for mobile devices and tablets.
- **Customizable**: Adjust text size, scroll speed, line height, and margins on the fly.
- **Easy Launch**: Simple 1-click launcher scripts for Windows, Mac, and Linux that automatically check for Python and generate self-signed SSL certificates.

## How to Run

1. Make sure you have **Python 3** installed on your computer.
2. Clone or download this repository.
3. Run the application:
   - **Windows:** Double-click the `start.bat` file.
   - **Mac / Linux:** Open a terminal and run `./start.sh` (make sure it's executable: `chmod +x start.sh`).
4. A local server will start, missing certificates will be generated automatically, and your default web browser will open at `https://localhost:8090`.

*Note: You must accept the self-signed SSL certificate warning in your browser to allow camera/microphone access on localhost.*

---

# טלפרומפטר הקלטות 🎥🎙️

אפליקציית טלפרומפטר מקומית, מאובטחת ורספונסיבית, עם יכולות הקלטת וידאו ואודיו מובנות.

*נוצר ע"י טל לוי (Tal Levi)*

## פיצ'רים מרכזיים

- **לוקאלי ומאובטח לחלוטין**: הכל רץ ישירות בדפדפן שלך. אף מידע לא נשלח לענן.
- **הקלטת וידאו וקול**: יכולת הקלטת וידאו באיכות גבוהה, או בחירה במצב "קול בלבד". הקבצים נשמרים ישירות למכשיר שלך (כולל תמיכה מלאה ב-iOS וסלולר!).
- **הקלטה חכמה ואוטומטית**: התחלת הקלטה חלקה עם ספירה לאחור של 3 שניות לאחריה הטקסט מתחיל לרוץ אוטומטית.
- **מצב אימון (Practice Mode)**: אפשרות לתרגל את הטקסט ללא הפעלת המצלמה או שמירת קבצים.
- **תמיכה בריבוי שפות**: תרגום מלא של הממשק ותמיכה ביישור טקסט (RTL/LTR) לעברית, אנגלית וערבית.
- **מותאם לפרומפטר פיזי**: תמיכה בהיפוך טקסט אופקי ואנכי לשימוש מול זכוכית/מראה של טלפרומפטר פיזי.
- **מותאם למובייל**: עיצוב רספונסיבי לחלוטין התומך בגלילת מגע (Touch) נוחה במכשירים ניידים וטאבלטים.
- **התאמה אישית מלאה**: שליטה בזמן אמת על גודל הטקסט, מהירות הגלילה, מרווח השורות והשוליים.
- **הפעלה בקליק**: קבצי הפעלה פשוטים ל-Windows, Mac ו-Linux שבודקים אוטומטית התקנת Python ומייצרים תעודות SSL לפי הצורך.

## איך מפעילים?

1. ודאו שמותקן אצלכם **Python 3** במחשב.
2. הורידו את הפרויקט או בצעו לו Clone.
3. הפעילו את האפליקציה:
   - **ב-Windows:** לחצו לחיצה כפולה על הקובץ `start.bat`.
   - **ב-Mac / Linux:** פתחו טרמינל והריצו את `./start.sh` (ודאו שיש לו הרשאות ריצה עם `chmod +x start.sh`).
4. שרת מקומי ירוץ ברקע, תעודות אבטחה חסרות ייווצרו אוטומטית, והדפדפן ייפתח אוטומטית בכתובת `https://localhost:8090`.

*הערה: יש לאשר את אזהרת האבטחה (SSL) בדפדפן, מכיוון שהגישה למצלמה ולמיקרופון מחייבת חיבור מאובטח (HTTPS) גם בשרת מקומי.*
