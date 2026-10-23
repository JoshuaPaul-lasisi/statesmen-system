# statesmen-system
System for The Statesmen League 

## Website

`site/` holds the five-page public website (Home, About, Formation, Chapters, Join). It is plain static HTML and CSS with no build step: open `site/index.html` in a browser, or deploy the `site/` folder to any static host.

The Join page embeds the registration Google Form. `scripts/create-forms.gs` is the Apps Script that created the registration and chapter report forms; it has already been run, so do not run it again.

## Members area and records

`site/members.html` links to the League's Google Drive folders (The Statesmen Library, each chapter folder, Statesmen Founders). Drive controls who can open each folder, so access is managed by sharing folders in Drive, not in the site code.

Registrations and chapter reports are kept in the "TSL Records" Google Sheet inside the "The Statesmen League" Drive folder. It has three tabs: Members, Chapter reports and Chapters.
