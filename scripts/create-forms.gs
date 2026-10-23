/**
 * Creates the two League forms and links them to the TSL Records sheet.
 *
 * Run once, signed in as thestatesmenleague@gmail.com:
 *   1. Go to script.google.com and click "New project".
 *   2. Delete the sample code, paste this whole file, click Save.
 *   3. Pick "createForms" in the function menu and click Run. Approve the permissions.
 *   4. Open "Execution log" and copy the two form links.
 *
 * Running it again creates a second copy of each form, so run it once.
 */

var RECORDS_SHEET_ID = '1EvUEneXKvcr_2vHvWvYIL4VFPdxJpXN-wujg3uqrbe8';
var LEAGUE_FOLDER_ID = '1QgBc35XnFxSZhfPVYqd-5vmhlbLNM4rP';

var CHAPTERS = [
  'LASU Chapter',
  'UNILAG Chapter',
  'UNIDEL/DELSU Chapter',
  'UNIJOS Chapter',
  'PLASU Chapter',
  'WUKARI Chapter'
];

var GROUPS = ['Writers and Publishers', 'Content Makers', 'Campus Politics'];

var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function createForms() {
  var ss = SpreadsheetApp.openById(RECORDS_SHEET_ID);
  var folder = DriveApp.getFolderById(LEAGUE_FOLDER_ID);

  var registration = createRegistrationForm_();
  linkToSheet_(registration, ss, 'Applications', folder);

  var report = createChapterReportForm_();
  linkToSheet_(report, ss, 'Chapter reports', folder);

  Logger.log('Registration form (share this): ' + registration.getPublishedUrl());
  Logger.log('Chapter report form (share this): ' + report.getPublishedUrl());
  Logger.log('Registration form (edit): ' + registration.getEditUrl());
  Logger.log('Chapter report form (edit): ' + report.getEditUrl());
}

function createRegistrationForm_() {
  var form = FormApp.create('The Statesmen League: Registration');
  form.setDescription(
    'This form takes about five minutes. We ask for some personal background and two short ' +
    'written responses. Take your time with the written section. It is the part we read most carefully.'
  );
  form.setCollectEmail(true);
  form.setConfirmationMessage(
    'Thank you. Someone from the Founding Council will be in touch. We review applications as they come in.'
  );

  form.addTextItem().setTitle('Full name').setRequired(true);
  form.addTextItem().setTitle('Phone number (WhatsApp)').setRequired(true);
  form.addTextItem().setTitle('Institution').setHelpText('Your university, polytechnic or college.').setRequired(true);
  form.addTextItem().setTitle('Course and level').setHelpText('For example: Political Science, 300 level.').setRequired(true);
  form.addTextItem().setTitle('State of residence').setRequired(true);
  form.addMultipleChoiceItem()
    .setTitle('Functional group')
    .setHelpText('Choose the group that fits your gifts best.')
    .setChoiceValues(GROUPS)
    .setRequired(true);
  form.addCheckboxItem()
    .setTitle('Which days could you attend a chapter meeting?')
    .setChoiceValues(DAYS)
    .setRequired(true);

  form.addPageBreakItem().setTitle('Written responses');
  form.addParagraphTextItem()
    .setTitle('Why do you want to join The Statesmen League?')
    .setRequired(true);
  form.addParagraphTextItem()
    .setTitle('What does it mean for character to precede competence in public life?')
    .setRequired(true);

  return form;
}

function createChapterReportForm_() {
  var form = FormApp.create('The Statesmen League: Chapter report');
  form.setDescription('For Chapter Leaders. Submit one report after each chapter meeting.');
  form.setCollectEmail(true);
  form.setConfirmationMessage('Report received. Thank you.');

  form.addListItem().setTitle('Chapter').setChoiceValues(CHAPTERS).setRequired(true);
  form.addTextItem().setTitle('Chapter Leader').setRequired(true);
  form.addDateItem().setTitle('Meeting date').setRequired(true);

  var attendance = FormApp.createTextValidation()
    .requireWholeNumber()
    .setHelpText('Enter a number.')
    .build();
  form.addTextItem().setTitle('Attendance').setHelpText('How many members attended?')
    .setValidation(attendance).setRequired(true);

  form.addTextItem().setTitle('Lecture topic').setRequired(true);
  form.addParagraphTextItem().setTitle('Discussion summary').setRequired(true);
  form.addParagraphTextItem().setTitle('Questions raised').setRequired(false);
  form.addParagraphTextItem().setTitle('Project progress').setRequired(false);

  return form;
}

// Sends responses to a new tab in TSL Records, names the tab, and files the form in the League folder.
function linkToSheet_(form, ss, tabName, folder) {
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();

  // The placeholder tab made before the form existed is replaced if it is still empty.
  var existing = ss.getSheetByName(tabName);
  if (existing && existing.getLastRow() <= 1) {
    ss.deleteSheet(existing);
  }

  var formId = form.getId();
  var sheets = SpreadsheetApp.openById(ss.getId()).getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var url = sheets[i].getFormUrl();
    if (url && url.indexOf(formId) !== -1) {
      sheets[i].setName(tabName);
      break;
    }
  }

  DriveApp.getFileById(formId).moveTo(folder);
}
