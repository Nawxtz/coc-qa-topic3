// Creates the "report a missing award" Google Form for CoC QA Dashboard.
// How to run (once):
//   1. Open https://script.google.com and click "New project".
//   2. Delete the sample code, paste this whole file, save.
//   3. Pick createReportForm in the function list, click Run, allow the permissions.
//   4. Open View > Logs (or Execution log): copy the "Share link" into app.js CONFIG.reportUrl.
// Answers go to a private Google Sheet in your Drive. Check each answer before copying it
// into the awards sheet; nothing in the form reaches the website by itself.

function createReportForm() {
  const form = FormApp.create("แจ้งผลงานที่ยังไม่มีใน CoC QA Dashboard");
  form.setDescription(
    "ใช้แจ้งรางวัลหรือผลงานของนักศึกษาและอาจารย์วิทยาลัยการคอมพิวเตอร์ ม.อ. ภูเก็ต ที่ยังไม่มีในเว็บ " +
    "ผู้ดูแลจะตรวจข้อมูลก่อนเพิ่มลงเว็บ\nเว็บ: https://nawxtz.github.io/coc-qa-topic3/"
  );
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(true);
  form.setConfirmationMessage("ขอบคุณครับ ผู้ดูแลจะตรวจข้อมูลแล้วเพิ่มลงเว็บ");

  const url = FormApp.createTextValidation().requireTextIsUrl().setHelpText("ใส่ลิงก์ที่ขึ้นต้นด้วย https://").build();
  const email = FormApp.createTextValidation().requireTextIsEmail().setHelpText("รูปแบบอีเมลไม่ถูกต้อง").build();

  form.addTextItem().setTitle("ชื่อ-สกุลผู้ได้รับรางวัล")
    .setHelpText("ถ้ามีหลายคน ใส่ทุกชื่อ คั่นด้วยจุลภาค").setRequired(true);
  form.addMultipleChoiceItem().setTitle("ผู้ได้รับรางวัลเป็น")
    .setChoiceValues(["นักศึกษา", "อาจารย์", "ทั้งนักศึกษาและอาจารย์"]).setRequired(true);
  form.addCheckboxItem().setTitle("หลักสูตร")
    .setChoiceValues(["Comp", "DBiz", "DE", "MsComp"]).setRequired(true);
  form.addTextItem().setTitle("ชื่อผลงานหรือชื่อทีม").setRequired(true);
  form.addTextItem().setTitle("ชื่อรางวัล").setHelpText("เช่น รางวัลชนะเลิศ, รางวัลรองชนะเลิศอันดับ 1").setRequired(true);
  form.addMultipleChoiceItem().setTitle("ประเภท")
    .setChoiceValues(["การแข่งขัน", "รางวัลวิจัย", "นวัตกรรม", "แฮกกาธอน", "สตาร์ทอัพ", "อื่น ๆ"]).setRequired(true);
  form.addDateItem().setTitle("วันที่ได้รับรางวัล").setHelpText("ถ้าไม่ทราบวันที่ เว้นไว้ แล้วบอกปีในช่องหมายเหตุ");
  form.addMultipleChoiceItem().setTitle("ระดับ")
    .setChoiceValues(["ระดับชาติ", "ระดับนานาชาติ"]).setRequired(true);
  form.addTextItem().setTitle("ลิงก์ข่าวหรือหลักฐาน").setValidation(url).setRequired(true);
  form.addParagraphTextItem().setTitle("หมายเหตุ").setHelpText("ข้อมูลอื่นที่ผู้ดูแลควรรู้ (ไม่บังคับ)");
  form.addTextItem().setTitle("อีเมลผู้แจ้ง (ไม่บังคับ)").setHelpText("ใช้ติดต่อกลับเมื่อข้อมูลไม่ครบ").setValidation(email);

  // private answers sheet in the owner's Drive
  const sheet = SpreadsheetApp.create("คำตอบ แจ้งผลงาน CoC QA Dashboard");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  if (typeof form.setPublished === "function") form.setPublished(true);
  form.setAcceptingResponses(true);

  const share = form.getPublishedUrl();
  Logger.log("Share link (put in CONFIG.reportUrl): " + share);
  Logger.log("Edit form: " + form.getEditUrl());
  Logger.log("Answers sheet: " + sheet.getUrl());
}
