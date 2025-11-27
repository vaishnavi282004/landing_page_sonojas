const express    = require('express');
const path       = require('path');
const fs         = require('fs');
const cors       = require('cors');
const bodyParser = require('body-parser');
const ExcelJS    = require('exceljs');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const EXCEL_FILE = path.join(__dirname, 'inquiries.xlsx');
const CSV_FILE = path.join(__dirname, 'inquiries.csv');

/* Excel append only – no email */
async function appendToExcel(row) {
  const workbook = new ExcelJS.Workbook();
  let sheet;

  if (fs.existsSync(EXCEL_FILE)) {
    await workbook.xlsx.readFile(EXCEL_FILE);
    sheet = workbook.getWorksheet('Inquiries') || workbook.addWorksheet('Inquiries');
  } else {
    sheet = workbook.addWorksheet('Inquiries');
    sheet.addRow([
      'Timestamp',
      'Name',
      'Phone',
      'Email',
      'Qualification',
      'Course',
      'Specialization',
      'University'
    ]);
  }

  sheet.addRow([
    new Date().toISOString(),
    row.name || '',
    row.phone || '',
    row.email || '',
    row.qualification || '',
    row.course || '',
    row.specialization || '',
    row.university || ''
  ]);

  await workbook.xlsx.writeFile(EXCEL_FILE);
}

function appendToCsv(row) {
  const isNew = !fs.existsSync(CSV_FILE);
  const line = [
    new Date().toISOString(),
    row.name || '',
    row.phone || '',
    row.email || '',
    row.qualification || '',
    row.course || '',
    row.specialization || '',
    row.university || ''
  ].join(',') + '\n';

  if (isNew) {
    fs.writeFileSync(
      CSV_FILE,
      'Timestamp,Name,Phone,Email,Qualification,Course,Specialization,University\n' + line,
      'utf8'
    );
  } else {
    fs.appendFileSync(CSV_FILE, line, 'utf8');
  }
}

app.post('/api/inquiry', async (req, res) => {
  const { name, phone, email, qualification, course, specialization, university } = req.body || {};

  try {
    // Save to Excel and CSV
    await appendToExcel({ name, phone, email, qualification, course, specialization, university });
    appendToCsv({ name, phone, email, qualification, course, specialization, university });
    
    console.log('\n=================================');
    console.log('📝 NEW ENQUIRY RECEIVED!');
    console.log('=================================');
    console.log('Name:', name);
    console.log('Phone:', phone);
    console.log('Email:', email);
    console.log('Qualification:', qualification);
    console.log('Course:', course);
    console.log('Specialization:', specialization);
    console.log('University:', university);
    console.log('Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log('Excel & CSV files updated!');
    console.log('=================================\n');

    res.json({ ok: true, message: 'Inquiry saved successfully' });
  } catch (err) {
    console.error('Error processing inquiry:', err);
    res.status(500).json({ ok: false, error: 'Failed to process inquiry' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
