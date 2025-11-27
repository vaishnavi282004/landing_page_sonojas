const ExcelJS = require('exceljs');
const path = require('path');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, phone, email, qualification, course, specialization, university } = data;

    // Log the inquiry (in production, you'd save to a database or send email)
    console.log('New Inquiry:', {
      name,
      phone,
      email,
      qualification,
      course,
      specialization,
      university,
      timestamp: new Date().toISOString()
    });

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        ok: true, 
        message: 'Inquiry saved successfully',
        data: {
          name,
          phone,
          email,
          course,
          university,
          timestamp: new Date().toISOString()
        }
      })
    };
  } catch (error) {
    console.error('Error processing inquiry:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ ok: false, error: 'Failed to process inquiry' })
    };
  }
};
