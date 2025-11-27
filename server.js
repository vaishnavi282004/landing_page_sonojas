const express    = require('express');
const path       = require('path');
const fs         = require('fs');
const cors       = require('cors');
const bodyParser = require('body-parser');
const ExcelJS    = require('exceljs');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Email configuration - Update with your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Info.sonojas@gmail.com',
    pass: 'your-app-password-here' // Use App Password from Google Account
  }
});

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

    // Send Email with Excel attachment
    const mailOptions = {
      from: 'Info.sonojas@gmail.com',
      to: 'Info.sonojas@gmail.com',
      subject: 'New Enquiry from Sonojas Landing Page',
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Qualification:</strong> ${qualification}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Specialization:</strong> ${specialization}</p>
        <p><strong>University:</strong> ${university}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      `,
      attachments: [
        {
          filename: 'inquiries.xlsx',
          path: EXCEL_FILE
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    // Send WhatsApp notification
    const whatsappMsg = `*New Enquiry from Sonojas*\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Qualification: ${qualification}\n` +
      `Course: ${course}\n` +
      `Specialization: ${specialization}\n` +
      `University: ${university}`;
    
    // Using WhatsApp Business API or third-party service (you'll need to set this up)
    // For now, logging the message
    console.log('WhatsApp Message to 7248855566:', whatsappMsg);

    res.json({ ok: true, message: 'Inquiry saved and notifications sent' });
  } catch (err) {
    console.error('Error processing inquiry:', err);
    res.status(500).json({ ok: false, error: 'Failed to process inquiry' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
