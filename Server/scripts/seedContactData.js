require('dotenv').config();
const mongoose = require('mongoose');

// Define Contact schema directly in the script since the model is in TypeScript
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  repliedAt: {
    type: Date
  },
  replyMessage: {
    type: String
  }
});

// Use the correct collection name 'contacts'
const Contact = mongoose.model('Contact', contactSchema, 'contacts');

// MongoDB connection string from .env file
const MONGODB_URI = process.env.MONGODB_URI;

// Indian names data
const indianNames = {
  firstNames: [
    'Aarav', 'Aadhya', 'Arjun', 'Ananya', 'Vivaan', 'Diya', 'Aditya', 'Kiara',
    'Vihaan', 'Saanvi', 'Aryan', 'Aahana', 'Sai', 'Ishaan', 'Kavya', 'Reyansh',
    'Myra', 'Atharv', 'Anika', 'Krishna', 'Advika', 'Ayaan', 'Ira', 'Kabir',
    'Riya', 'Yuvan', 'Sara', 'Om', 'Priya', 'Rudra', 'Jiya', 'Aadhav', 'Anvi',
    'Shivansh', 'Navya', 'Avyan', 'Pari', 'Vedant', 'Shanaya', 'Ayan'
  ],
  lastNames: [
    'Sharma', 'Verma', 'Gupta', 'Agarwal', 'Joshi', 'Patel', 'Singh', 'Kumar',
    'Mishra', 'Pandey', 'Tiwari', 'Yadav', 'Rajput', 'Chauhan', 'Jain', 'Bansal',
    'Agrawal', 'Malhotra', 'Kapoor', 'Chopra', 'Sinha', 'Mehta', 'Shah', 'Reddy',
    'Nair', 'Iyer', 'Menon', 'Pillai', 'Rao', 'Krishnan', 'Bhat', 'Hegde',
    'Kulkarni', 'Desai', 'Joshi', 'Bhatt', 'Trivedi', 'Saxena', 'Goel', 'Goyal'
  ]
};

const subjects = [
  'General Inquiry',
  'Admission Information',
  'Course Details',
  'Fee Structure',
  'Scholarship Information',
  'Placement Details',
  'Faculty Information',
  'Infrastructure Query',
  'Hostel Information',
  'Library Facilities',
  'Sports Facilities',
  'Research Opportunities',
  'Internship Programs',
  'Exchange Programs',
  'Alumni Network',
  'Campus Tour Request',
  'Document Verification',
  'Transfer Certificate',
  'Academic Calendar',
  'Examination Schedule'
];

const statuses = ['new', 'read', 'replied', 'archived'];

const sampleMessages = [
  'I want to know about the admission process for Computer Science Engineering.',
  'Could you please provide information about the fee structure for MBA program?',
  'I am interested in learning more about the placement statistics of your college.',
  'What are the eligibility criteria for the scholarship programs available?',
  'Can you share details about the hostel facilities and accommodation charges?',
  'I would like to know about the research opportunities available for undergraduate students.',
  'Please provide information about the faculty qualifications in the Mechanical Engineering department.',
  'What sports facilities are available on campus for students?',
  'I need information about the library timings and available resources.',
  'Could you tell me about the internship programs offered by the college?',
  'I want to know about the campus infrastructure and laboratory facilities.',
  'Please share details about the alumni network and their achievements.',
  'What are the requirements for getting a transfer certificate from another university?',
  'I am interested in the exchange programs with international universities.',
  'Can you provide the academic calendar for the current academic year?',
  'I want to schedule a campus tour. What is the procedure?',
  'Please provide information about the extracurricular activities and clubs.',
  'What are the career counseling services available for students?',
  'I need details about the online learning platforms used by the college.',
  'Could you share information about the college\'s accreditation and rankings?',
  'I want to know about the financial aid options available for students.',
  'Please provide details about the student support services.',
  'What are the industry partnerships and collaborations of the college?',
  'I am interested in the continuing education programs offered.',
  'Can you tell me about the campus safety and security measures?'
];

// Indian phone number prefixes
const phonePrefix = ['+91', '91', ''];
const phoneCodes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90', '89', '88', '87', '86', '85', '84', '83', '82', '81', '80'];

// Generate random date within last 6 months
function getRandomDate() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
  const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTime);
}

// Generate random phone number
function generatePhoneNumber() {
  const prefix = phonePrefix[Math.floor(Math.random() * phonePrefix.length)];
  const code = phoneCodes[Math.floor(Math.random() * phoneCodes.length)];
  const number = Math.floor(Math.random() * 90000000) + 10000000; // 8-digit number
  return `${prefix}${code}${number}`;
}

// Generate random email
function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com', 'yahoo.in'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const variations = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${Math.floor(Math.random() * 999)}@${domain}`,
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 99)}@${domain}`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

// Generate contact data
function generateContactData() {
  const contacts = [];
  
  for (let i = 0; i < 25; i++) {
    const firstName = indianNames.firstNames[Math.floor(Math.random() * indianNames.firstNames.length)];
    const lastName = indianNames.lastNames[Math.floor(Math.random() * indianNames.lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const contact = {
      name: fullName,
      email: generateEmail(firstName, lastName),
      phone: generatePhoneNumber(),
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      message: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      submittedAt: getRandomDate()
    };
    
    contacts.push(contact);
  }
  
  return contacts;
}

// Main function to seed the database
async function seedContactData() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]*@/, ':****@')); // Hide password
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    console.log('Database name:', mongoose.connection.db.databaseName);
    console.log('Using collection: contacts');
    
    // Clear existing contact data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing contact data...');
    const deleteResult = await Contact.deleteMany({});
    console.log(`Existing data cleared. Deleted ${deleteResult.deletedCount} records.`);
    
    // Generate and insert new contact data
    console.log('Generating contact data...');
    const contactData = generateContactData();
    
    console.log('Inserting contact data into database...');
    const insertedContacts = await Contact.insertMany(contactData);
    
    console.log(`Successfully inserted ${insertedContacts.length} contact records!`);
    
    // Verify the insertion
    const totalCount = await Contact.countDocuments();
    console.log(`Total documents in contacts collection: ${totalCount}`);
    
    // Display summary
    const statusCounts = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n--- Data Summary ---');
    console.log(`Total contacts: ${insertedContacts.length}`);
    console.log('Status distribution:');
    statusCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}`);
    });
    
    // Display date range
    const dateRange = await Contact.aggregate([
      {
        $group: {
          _id: null,
          minDate: { $min: '$submittedAt' },
          maxDate: { $max: '$submittedAt' }
        }
      }
    ]);
    
    if (dateRange.length > 0) {
      console.log(`Date range: ${dateRange[0].minDate.toDateString()} to ${dateRange[0].maxDate.toDateString()}`);
    }
    
    console.log('\n--- Sample Records ---');
    const sampleRecords = await Contact.find({}).limit(3);
    sampleRecords.forEach((record, index) => {
      console.log(`${index + 1}. ${record.name} (${record.email})`);
      console.log(`   Subject: ${record.subject}`);
      console.log(`   Status: ${record.status}`);
      console.log(`   Date: ${record.submittedAt.toDateString()}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error seeding contact data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

// Run the script
if (require.main === module) {
  seedContactData();
}

module.exports = { seedContactData, generateContactData };
