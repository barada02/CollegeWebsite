import mongoose from 'mongoose';
import dotenv from 'dotenv';
import School from '../models/School';
import Department from '../models/Department';
import Course from '../models/Course';
import Faculty from '../models/Faculty';
import { connectDB } from '../config/db';

// Load environment variables
dotenv.config();

// Sample data
const sampleSchools = [
  {
    name: 'School of Engineering',
    code: 'SOE',
    description: 'The School of Engineering is dedicated to providing world-class engineering education and fostering innovation through cutting-edge research. Our programs are designed to prepare students for successful careers in various engineering disciplines.',
    dean: 'Dr. Rajesh Kumar Sharma',
    contact: {
      email: 'dean.soe@excellenceuniversity.edu',
      phone: '+91-11-2345-6789',
      office: 'Engineering Block, Room 101'
    },
    establishedYear: 1985,
    accreditation: ['AICTE', 'NBA', 'NAAC A+'],
    image: '/images/schools/engineering.jpg',
    status: 'active'
  },
  {
    name: 'School of Management',
    code: 'SOM',
    description: 'The School of Management offers comprehensive business education programs that blend theoretical knowledge with practical application. We prepare future business leaders and entrepreneurs through innovative teaching methodologies.',
    dean: 'Dr. Priya Sharma',
    contact: {
      email: 'dean.som@excellenceuniversity.edu',
      phone: '+91-11-2345-6790',
      office: 'Management Block, Room 201'
    },
    establishedYear: 1992,
    accreditation: ['AICTE', 'NAAC A+', 'AACSB'],
    image: '/images/schools/management.jpg',
    status: 'active'
  },
  {
    name: 'School of Informatics',
    code: 'SOI',
    description: 'The School of Informatics focuses on computer applications, information technology, and emerging digital technologies. Our programs are designed to meet the evolving needs of the IT industry.',
    dean: 'Dr. Amit Verma',
    contact: {
      email: 'dean.soi@excellenceuniversity.edu',
      phone: '+91-11-2345-6791',
      office: 'IT Block, Room 301'
    },
    establishedYear: 1998,
    accreditation: ['AICTE', 'NAAC A+'],
    image: '/images/schools/informatics.jpg',
    status: 'active'
  }
];

const sampleDepartments = [
  // Engineering Departments
  {
    schoolCode: 'SOE',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    description: 'The Department of Computer Science & Engineering is at the forefront of technological innovation. We offer comprehensive programs covering software development, artificial intelligence, machine learning, and cybersecurity.',
    head: 'Dr. Vikram Singh',
    contact: {
      email: 'hod.cse@excellenceuniversity.edu',
      phone: '+91-11-2345-6792',
      office: 'Engineering Block, Room 301'
    },
    facilities: [
      'Advanced Programming Labs',
      'AI & ML Research Center',
      'Cybersecurity Lab',
      'Software Engineering Lab',
      'High-Performance Computing Center'
    ],
    achievements: [
      'Best Department Award 2023',
      'Excellence in Research 2022',
      '100% Placement Record',
      'Top Recruiters: Google, Microsoft, Amazon'
    ],
    image: '/images/departments/cse.jpg',
    status: 'active'
  },
  {
    schoolCode: 'SOE',
    name: 'Mechanical Engineering',
    code: 'MECH',
    description: 'The Department of Mechanical Engineering provides comprehensive education in design, manufacturing, thermal sciences, and automation. Our graduates are well-prepared for careers in automotive, aerospace, and manufacturing industries.',
    head: 'Dr. Suresh Patil',
    contact: {
      email: 'hod.mech@excellenceuniversity.edu',
      phone: '+91-11-2345-6793',
      office: 'Engineering Block, Room 401'
    },
    facilities: [
      'CAD/CAM Lab',
      'Manufacturing Lab',
      'Thermal Engineering Lab',
      'Robotics Lab',
      'Materials Testing Lab'
    ],
    achievements: [
      'Industry Partnership Excellence 2023',
      'Innovation in Design Award',
      'Best Placement Record in Core Companies'
    ],
    image: '/images/departments/mechanical.jpg',
    status: 'active'
  },
  {
    schoolCode: 'SOE',
    name: 'Electrical & Electronics Engineering',
    code: 'EEE',
    description: 'The Department of Electrical & Electronics Engineering covers power systems, electronics, control systems, and renewable energy. We prepare students for careers in power generation, electronics, and emerging energy technologies.',
    head: 'Dr. Meera Krishnan',
    contact: {
      email: 'hod.eee@excellenceuniversity.edu',
      phone: '+91-11-2345-6794',
      office: 'Engineering Block, Room 501'
    },
    facilities: [
      'Power Systems Lab',
      'Electronics Lab',
      'Control Systems Lab',
      'Renewable Energy Lab',
      'VLSI Design Lab'
    ],
    achievements: [
      'Excellence in Power Engineering 2023',
      'Research Innovation Award',
      'Industry Collaboration Excellence'
    ],
    image: '/images/departments/electrical.jpg',
    status: 'active'
  },
  {
    schoolCode: 'SOE',
    name: 'Information Technology',
    code: 'IT',
    description: 'The Department of Information Technology focuses on modern IT solutions, web technologies, mobile applications, and cloud computing. Our programs are industry-aligned and prepare students for IT careers.',
    head: 'Dr. Ravi Kumar',
    contact: {
      email: 'hod.it@excellenceuniversity.edu',
      phone: '+91-11-2345-6795',
      office: 'Engineering Block, Room 601'
    },
    facilities: [
      'Web Development Lab',
      'Mobile App Development Lab',
      'Cloud Computing Lab',
      'Network Security Lab',
      'Database Management Lab'
    ],
    achievements: [
      'Best IT Department 2023',
      'Excellence in Industry Connect',
      '95% Placement in Top IT Companies'
    ],
    image: '/images/departments/it.jpg',
    status: 'active'
  },
  // Management Department
  {
    schoolCode: 'SOM',
    name: 'Business Administration',
    code: 'BA',
    description: 'The Department of Business Administration offers comprehensive management education covering finance, marketing, human resources, and operations. We develop future business leaders and entrepreneurs.',
    head: 'Dr. Sunita Agarwal',
    contact: {
      email: 'hod.ba@excellenceuniversity.edu',
      phone: '+91-11-2345-6796',
      office: 'Management Block, Room 301'
    },
    facilities: [
      'Finance Lab',
      'Marketing Research Center',
      'HR Simulation Lab',
      'Entrepreneurship Cell',
      'Business Incubation Center'
    ],
    achievements: [
      'Best B-School Award 2023',
      'Excellence in Placements',
      'Top Corporate Partnerships',
      'Entrepreneurship Excellence Award'
    ],
    image: '/images/departments/business.jpg',
    status: 'active'
  },
  // Informatics Department
  {
    schoolCode: 'SOI',
    name: 'Computer Applications',
    code: 'CA',
    description: 'The Department of Computer Applications specializes in advanced computer applications, software development, and emerging technologies. Our programs bridge the gap between computer science theory and practical applications.',
    head: 'Dr. Neha Sharma',
    contact: {
      email: 'hod.ca@excellenceuniversity.edu',
      phone: '+91-11-2345-6797',
      office: 'IT Block, Room 401'
    },
    facilities: [
      'Advanced Programming Lab',
      'Data Science Lab',
      'Software Development Center',
      'AI Research Lab',
      'Innovation Hub'
    ],
    achievements: [
      'Excellence in Computer Applications 2023',
      'Top Placement Record',
      'Research Innovation Award',
      'Industry Recognition'
    ],
    image: '/images/departments/computer-applications.jpg',
    status: 'active'
  }
];

const sampleCourses = [
  // B.Tech Courses
  {
    departmentCode: 'CSE',
    name: 'Bachelor of Technology in Computer Science & Engineering',
    shortName: 'B.Tech CSE',
    code: 'BTECHCSE',
    level: 'UG',
    degree: 'B.Tech',
    duration: { years: 4, semesters: 8 },
    totalCredits: 160,
    eligibility: {
      academicRequirement: '10+2 with Physics, Chemistry, Mathematics (PCM) with minimum 75% aggregate',
      entranceExam: ['JEE Main', 'University Entrance Test'],
      minimumPercentage: 75,
      ageLimit: { min: 17, max: 25 }
    },
    feeStructure: {
      admissionFee: 50000,
      semesterFee: 85000,
      totalFee: 730000,
      scholarships: ['Merit Scholarship', 'Need-based Financial Aid', 'Sports Scholarship']
    },
    careerProspects: [
      'Software Engineer',
      'Data Scientist',
      'AI/ML Engineer',
      'Cybersecurity Specialist',
      'System Architect',
      'Product Manager'
    ],
    placementStats: [
      {
        year: 2023,
        percentage: 96,
        averagePackage: 850000,
        highestPackage: 4500000,
        majorRecruiters: ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro']
      }
    ],
    accreditation: ['AICTE', 'NBA'],
    description: 'The B.Tech Computer Science & Engineering program provides comprehensive education in computer science fundamentals, programming, software engineering, and emerging technologies.',
    objectives: [
      'Develop strong programming and problem-solving skills',
      'Understand computer science fundamentals and theory',
      'Gain expertise in software development and engineering',
      'Learn emerging technologies like AI, ML, and cybersecurity'
    ],
    outcomes: [
      'Industry-ready software professionals',
      'Innovative problem solvers',
      'Technology leaders and entrepreneurs',
      'Research-oriented professionals'
    ],
    intake: 120,
    status: 'active',
    admissionOpen: true
  },
  {
    departmentCode: 'CSE',
    name: 'Bachelor of Technology in Computer Science & Engineering (Artificial Intelligence & Machine Learning)',
    shortName: 'B.Tech CSE (AI & ML)',
    code: 'BTECHCSEAIML',
    level: 'UG',
    degree: 'B.Tech',
    specialization: 'Artificial Intelligence & Machine Learning',
    duration: { years: 4, semesters: 8 },
    totalCredits: 164,
    eligibility: {
      academicRequirement: '10+2 with PCM with minimum 80% aggregate',
      entranceExam: ['JEE Main', 'University Entrance Test'],
      minimumPercentage: 80,
      ageLimit: { min: 17, max: 25 }
    },
    feeStructure: {
      admissionFee: 60000,
      semesterFee: 95000,
      totalFee: 820000,
      scholarships: ['Merit Scholarship', 'AI Excellence Scholarship']
    },
    careerProspects: [
      'AI/ML Engineer',
      'Data Scientist',
      'Research Scientist',
      'AI Product Manager',
      'Deep Learning Engineer',
      'Computer Vision Engineer'
    ],
    placementStats: [
      {
        year: 2023,
        percentage: 98,
        averagePackage: 1200000,
        highestPackage: 6000000,
        majorRecruiters: ['Google', 'Microsoft', 'NVIDIA', 'OpenAI', 'Meta', 'Tesla']
      }
    ],
    accreditation: ['AICTE', 'NBA'],
    description: 'Specialized program focusing on Artificial Intelligence and Machine Learning with hands-on experience in cutting-edge AI technologies.',
    intake: 60,
    status: 'active',
    admissionOpen: true
  },
  // M.Tech Courses
  {
    departmentCode: 'CSE',
    name: 'Master of Technology in Computer Science & Engineering',
    shortName: 'M.Tech CSE',
    code: 'MTECHCSE',
    level: 'PG',
    degree: 'M.Tech',
    duration: { years: 2, semesters: 4 },
    totalCredits: 64,
    eligibility: {
      academicRequirement: 'B.Tech/B.E. in CSE/IT or related field with minimum 60% aggregate',
      entranceExam: ['GATE', 'University Entrance Test'],
      minimumPercentage: 60,
      ageLimit: { min: 21, max: 28 }
    },
    feeStructure: {
      admissionFee: 40000,
      semesterFee: 70000,
      totalFee: 320000,
      scholarships: ['Research Assistantship', 'Merit Scholarship', 'GATE Scholarship']
    },
    careerProspects: [
      'Senior Software Engineer',
      'Research Scientist',
      'Technical Lead',
      'Solution Architect',
      'Academic Researcher'
    ],
    placementStats: [
      {
        year: 2023,
        percentage: 94,
        averagePackage: 1100000,
        highestPackage: 3800000,
        majorRecruiters: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Oracle', 'NVIDIA']
      }
    ],
    accreditation: ['AICTE', 'NBA'],
    description: 'The M.Tech Computer Science & Engineering program offers advanced study in computer science with focus on research and specialized technical skills development.',
    objectives: [
      'Develop advanced technical expertise',
      'Conduct research in computer science',
      'Master cutting-edge technologies',
      'Build innovation and problem-solving skills'
    ],
    outcomes: [
      'Research-oriented professionals',
      'Technical experts and architects',
      'Innovation leaders',
      'Academic and industry researchers'
    ],
    intake: 30,
    status: 'active',
    admissionOpen: true
  },
  // Other Engineering Courses
  {
    departmentCode: 'MECH',
    name: 'Bachelor of Technology in Mechanical Engineering',
    shortName: 'B.Tech Mechanical',
    code: 'BTECHMECH',
    level: 'UG',
    degree: 'B.Tech',
    duration: { years: 4, semesters: 8 },
    totalCredits: 160,
    eligibility: {
      academicRequirement: '10+2 with PCM with minimum 75% aggregate',
      entranceExam: ['JEE Main', 'University Entrance Test'],
      minimumPercentage: 75,
      ageLimit: { min: 17, max: 25 }
    },
    feeStructure: {
      admissionFee: 50000,
      semesterFee: 80000,
      totalFee: 690000,
      scholarships: ['Merit Scholarship', 'Sports Scholarship']
    },
    careerProspects: [
      'Mechanical Engineer',
      'Design Engineer',
      'Manufacturing Engineer',
      'Automotive Engineer',
      'Aerospace Engineer'
    ],
    placementStats: [
      {
        year: 2023,
        percentage: 92,
        averagePackage: 650000,
        highestPackage: 2500000,
        majorRecruiters: ['Tata Motors', 'Mahindra', 'L&T', 'Bajaj Auto', 'Hero MotoCorp']
      }
    ],
    accreditation: ['AICTE', 'NBA'],
    description: 'The B.Tech Mechanical Engineering program provides comprehensive education in design, manufacturing, thermal sciences, and automation. Our graduates are prepared for careers in automotive, aerospace, and manufacturing industries.',
    objectives: [
      'Develop strong engineering fundamentals',
      'Master design and manufacturing principles',
      'Understand thermal and fluid systems',
      'Learn automation and robotics'
    ],
    outcomes: [
      'Industry-ready mechanical engineers',
      'Design and manufacturing experts',
      'Innovation-driven professionals',
      'Technical leadership skills'
    ],
    intake: 120,
    status: 'active',
    admissionOpen: true
  },
  // Management Courses
  {
    departmentCode: 'BA',
    name: 'Bachelor of Business Administration',
    shortName: 'BBA',
    code: 'BBA',
    level: 'UG',
    degree: 'BBA',
    duration: { years: 3, semesters: 6 },
    totalCredits: 120,
    eligibility: {
      academicRequirement: '10+2 in any stream with minimum 60% aggregate',
      minimumPercentage: 60,
      ageLimit: { min: 17, max: 25 }
    },
    feeStructure: {
      admissionFee: 40000,
      semesterFee: 60000,
      totalFee: 400000,
      scholarships: ['Merit Scholarship', 'Need-based Financial Aid']
    },
    careerProspects: [
      'Business Analyst',
      'Marketing Executive',
      'HR Executive',
      'Operations Manager',
      'Entrepreneur'
    ],
    placementStats: [
      {
        year: 2023,
        percentage: 88,
        averagePackage: 450000,
        highestPackage: 1200000,
        majorRecruiters: ['Deloitte', 'EY', 'KPMG', 'Wipro', 'HCL', 'Accenture']
      }
    ],
    accreditation: ['AICTE', 'NAAC A+'],
    description: 'The BBA program provides comprehensive business education covering all aspects of modern management including finance, marketing, human resources, and operations.',
    objectives: [
      'Develop business acumen and leadership skills',
      'Understand core business functions',
      'Learn strategic thinking and analysis',
      'Build entrepreneurial mindset'
    ],
    outcomes: [
      'Business leaders and managers',
      'Strategic thinkers and analysts',
      'Entrepreneurs and innovators',
      'Industry-ready professionals'
    ],
    intake: 90,
    status: 'active',
    admissionOpen: true
  },
  {
    departmentCode: 'BA',
    name: 'Master of Business Administration',
    shortName: 'MBA',
    code: 'MBA',
    level: 'PG',
    degree: 'MBA',
    duration: { years: 2, semesters: 4 },
    totalCredits: 80,
    eligibility: {
      academicRequirement: 'Graduation in any discipline with minimum 50% aggregate',
      entranceExam: ['CAT', 'MAT', 'University Entrance Test'],
      minimumPercentage: 50,
      ageLimit: { min: 21, max: 30 }
    },
    feeStructure: {
      admissionFee: 50000,
      semesterFee: 120000,
      totalFee: 530000,
      scholarships: ['Merit Scholarship', 'Corporate Sponsorship']
    },
    careerProspects: [
      'Manager',
      'Business Consultant',
      'Investment Banker',
      'Marketing Manager',
      'Entrepreneur'
    ],
    placementStats: [
      {
        year: 2023,
        percentage: 95,
        averagePackage: 950000,
        highestPackage: 3500000,
        majorRecruiters: ['McKinsey', 'Deloitte', 'EY', 'KPMG', 'TCS', 'Accenture']
      }
    ],
    accreditation: ['AICTE', 'AACSB'],
    description: 'The MBA program offers advanced business education with specializations in various management domains. It prepares students for leadership roles in corporate and entrepreneurial environments.',
    objectives: [
      'Develop advanced management skills',
      'Learn strategic business planning',
      'Master analytical and decision-making abilities',
      'Build leadership and team management skills'
    ],
    outcomes: [
      'Senior management professionals',
      'Business strategists and consultants',
      'Successful entrepreneurs',
      'Industry leaders and executives'
    ],
    intake: 60,
    status: 'active',
    admissionOpen: true
  },
  // Computer Applications Courses
  {
    departmentCode: 'CA',
    name: 'Master of Computer Applications',
    shortName: 'MCA',
    code: 'MCA',
    level: 'PG',
    degree: 'MCA',
    duration: { years: 3, semesters: 6 },
    totalCredits: 120,
    eligibility: {
      academicRequirement: 'Graduation with Mathematics at 10+2 or graduation level with minimum 50% aggregate',
      entranceExam: ['University Entrance Test', 'State MCA CET'],
      minimumPercentage: 50,
      ageLimit: { min: 21, max: 28 }
    },
    feeStructure: {
      admissionFee: 45000,
      semesterFee: 70000,
      totalFee: 465000,
      scholarships: ['Merit Scholarship', 'Technical Excellence Award']
    },
    careerProspects: [
      'Software Developer',
      'System Analyst',
      'Web Developer',
      'Database Administrator',
      'IT Consultant'
    ],
    placementStats: [
      {
        year: 2023,
        percentage: 94,
        averagePackage: 650000,
        highestPackage: 2200000,
        majorRecruiters: ['TCS', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 'Cognizant']
      }
    ],
    accreditation: ['AICTE'],
    description: 'The MCA program specializes in advanced computer applications, software development, and emerging technologies. It bridges the gap between computer science theory and practical applications.',
    objectives: [
      'Master advanced programming concepts',
      'Develop software engineering skills',
      'Learn database and system design',
      'Understand emerging technologies'
    ],
    outcomes: [
      'Expert software developers',
      'System analysts and architects',
      'Technology consultants',
      'IT project managers'
    ],
    intake: 60,
    status: 'active',
    admissionOpen: true
  }
];

const sampleFaculty = [
  // CSE Faculty
  {
    departmentCode: 'CSE',
    name: 'Dr. Vikram Singh',
    designation: 'Professor',
    qualification: ['Ph.D. Computer Science - IIT Delhi', 'M.Tech CSE - IIT Bombay', 'B.Tech CSE - Delhi University'],
    experience: 18,
    email: 'vikram.singh@excellenceuniversity.edu',
    phone: '+91-11-2345-6800',
    office: 'Engineering Block, Room 301',
    specialization: ['Machine Learning', 'Artificial Intelligence', 'Data Mining', 'Computer Vision'],
    researchInterests: ['Deep Learning', 'Natural Language Processing', 'Computer Vision', 'AI Ethics'],
    publications: [
      {
        title: 'Advanced Machine Learning Techniques for Computer Vision',
        journal: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
        year: 2023,
        url: 'https://doi.org/10.1109/example'
      },
      {
        title: 'Deep Learning Applications in Natural Language Processing',
        journal: 'ACM Computing Surveys',
        year: 2022,
        url: 'https://doi.org/10.1145/example'
      }
    ],
    awards: [
      'Best Researcher Award 2023 - Excellence University',
      'Outstanding Faculty Award 2022',
      'Research Excellence Award - IEEE Delhi Section'
    ],
    biography: 'Dr. Vikram Singh is a distinguished professor and researcher in the field of Computer Science with over 18 years of academic and research experience. He has published over 50 research papers in top-tier international journals and conferences.',
    image: '/images/faculty/vikram-singh.jpg',
    status: 'active'
  },
  {
    departmentCode: 'CSE',
    name: 'Dr. Priya Kumari',
    designation: 'Associate Professor',
    qualification: ['Ph.D. Computer Science - IIT Kanpur', 'M.Tech IT - IIIT Hyderabad', 'B.Tech CSE - NIT Trichy'],
    experience: 12,
    email: 'priya.kumari@excellenceuniversity.edu',
    phone: '+91-11-2345-6801',
    office: 'Engineering Block, Room 302',
    specialization: ['Cybersecurity', 'Network Security', 'Cryptography', 'Blockchain'],
    researchInterests: ['Information Security', 'Blockchain Technology', 'IoT Security', 'Privacy Preservation'],
    publications: [
      {
        title: 'Blockchain-based Security Framework for IoT Networks',
        journal: 'IEEE Internet of Things Journal',
        year: 2023,
        url: 'https://doi.org/10.1109/example2'
      }
    ],
    awards: [
      'Excellence in Teaching Award 2022',
      'Young Researcher Award 2021'
    ],
    biography: 'Dr. Priya Kumari is an expert in cybersecurity and blockchain technology with extensive research experience in network security and cryptographic protocols.',
    status: 'active'
  },
  {
    departmentCode: 'CSE',
    name: 'Prof. Rajesh Verma',
    designation: 'Assistant Professor',
    qualification: ['M.Tech CSE - IIT Roorkee', 'B.Tech CSE - UPTU'],
    experience: 8,
    email: 'rajesh.verma@excellenceuniversity.edu',
    phone: '+91-11-2345-6802',
    office: 'Engineering Block, Room 303',
    specialization: ['Software Engineering', 'Web Development', 'Database Systems', 'Cloud Computing'],
    researchInterests: ['Software Architecture', 'Microservices', 'DevOps', 'Cloud Technologies'],
    biography: 'Prof. Rajesh Verma brings industry and academic experience in software development and cloud technologies. He has worked with leading IT companies before joining academia.',
    status: 'active'
  },
  // Mechanical Engineering Faculty
  {
    departmentCode: 'MECH',
    name: 'Dr. Suresh Patil',
    designation: 'Professor',
    qualification: ['Ph.D. Mechanical Engineering - IIT Delhi', 'M.Tech Manufacturing - IIT Kanpur', 'B.Tech Mechanical - VJTI Mumbai'],
    experience: 20,
    email: 'suresh.patil@excellenceuniversity.edu',
    phone: '+91-11-2345-6803',
    office: 'Engineering Block, Room 401',
    specialization: ['Manufacturing Engineering', 'CAD/CAM', 'Robotics', 'Automation'],
    researchInterests: ['Industry 4.0', 'Smart Manufacturing', 'Robotics', 'Additive Manufacturing'],
    biography: 'Dr. Suresh Patil is a renowned expert in manufacturing engineering with extensive experience in automation and robotics.',
    status: 'active'
  },
  // Management Faculty
  {
    departmentCode: 'BA',
    name: 'Dr. Sunita Agarwal',
    designation: 'Professor',
    qualification: ['Ph.D. Management - IIM Ahmedabad', 'MBA Finance - IIM Bangalore', 'B.Com - Delhi University'],
    experience: 16,
    email: 'sunita.agarwal@excellenceuniversity.edu',
    phone: '+91-11-2345-6804',
    office: 'Management Block, Room 301',
    specialization: ['Finance', 'Investment Banking', 'Corporate Finance', 'Financial Markets'],
    researchInterests: ['Behavioral Finance', 'Financial Risk Management', 'Corporate Governance'],
    biography: 'Dr. Sunita Agarwal is a distinguished professor with extensive experience in finance and investment banking.',
    status: 'active'
  },
  // Computer Applications Faculty
  {
    departmentCode: 'CA',
    name: 'Dr. Neha Sharma',
    designation: 'Associate Professor',
    qualification: ['Ph.D. Computer Applications - JNU Delhi', 'MCA - IGNOU', 'B.Sc Computer Science - Delhi University'],
    experience: 14,
    email: 'neha.sharma@excellenceuniversity.edu',
    phone: '+91-11-2345-6805',
    office: 'IT Block, Room 401',
    specialization: ['Data Science', 'Big Data Analytics', 'Python Programming', 'Machine Learning'],
    researchInterests: ['Data Analytics', 'Business Intelligence', 'Predictive Modeling'],
    biography: 'Dr. Neha Sharma specializes in data science and analytics with extensive experience in applying data science techniques to solve real-world problems.',
    status: 'active'
  }
];

// Seeding functions
async function seedSchools() {
  console.log('🏫 Seeding Schools...');
  try {
    await School.deleteMany({}); // Clear existing data
    const schools = await School.insertMany(sampleSchools);
    console.log(`✅ Successfully created ${schools.length} schools`);
    return schools;
  } catch (error) {
    console.error('❌ Error seeding schools:', error);
    throw error;
  }
}

async function seedDepartments(schools: any[]) {
  console.log('🏢 Seeding Departments...');
  try {
    await Department.deleteMany({}); // Clear existing data
    
    const departmentsToCreate = sampleDepartments.map(dept => {
      const school = schools.find(s => s.code === dept.schoolCode);
      return {
        ...dept,
        schoolId: school._id
      };
    });

    const departments = await Department.insertMany(departmentsToCreate);
    console.log(`✅ Successfully created ${departments.length} departments`);
    return departments;
  } catch (error) {
    console.error('❌ Error seeding departments:', error);
    throw error;
  }
}

async function seedCourses(schools: any[], departments: any[]) {
  console.log('📚 Seeding Courses...');
  try {
    await Course.deleteMany({}); // Clear existing data
    
    const coursesToCreate = sampleCourses.map(course => {
      const department = departments.find(d => d.code === course.departmentCode);
      const school = schools.find(s => s._id.equals(department.schoolId));
      
      return {
        ...course,
        departmentId: department._id,
        schoolId: school._id,
        curriculum: [
          {
            semester: 1,
            subjects: [
              { code: 'CS101', name: 'Programming Fundamentals', credits: 4, type: 'core' },
              { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, type: 'core' },
              { code: 'PH101', name: 'Engineering Physics', credits: 4, type: 'core' },
              { code: 'CH101', name: 'Engineering Chemistry', credits: 4, type: 'core' },
              { code: 'EG101', name: 'Engineering Graphics', credits: 2, type: 'core' }
            ]
          },
          {
            semester: 2,
            subjects: [
              { code: 'CS102', name: 'Data Structures', credits: 4, type: 'core' },
              { code: 'MA102', name: 'Engineering Mathematics II', credits: 4, type: 'core' },
              { code: 'CS103', name: 'Computer Organization', credits: 4, type: 'core' },
              { code: 'EC101', name: 'Digital Electronics', credits: 4, type: 'core' },
              { code: 'EG102', name: 'Workshop Practice', credits: 2, type: 'core' }
            ]
          }
        ]
      };
    });

    const courses = await Course.insertMany(coursesToCreate);
    console.log(`✅ Successfully created ${courses.length} courses`);
    return courses;
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    throw error;
  }
}

async function seedFaculty(schools: any[], departments: any[]) {
  console.log('👨‍🏫 Seeding Faculty...');
  try {
    await Faculty.deleteMany({}); // Clear existing data
    
    const facultyToCreate = sampleFaculty.map(faculty => {
      const department = departments.find(d => d.code === faculty.departmentCode);
      const school = schools.find(s => s._id.equals(department.schoolId));
      
      return {
        ...faculty,
        departmentId: department._id,
        schoolId: school._id
      };
    });

    const faculty = await Faculty.insertMany(facultyToCreate);
    
    // Update departments with faculty references
    for (const facultyMember of faculty) {
      await Department.findByIdAndUpdate(
        facultyMember.departmentId,
        { $push: { faculty: facultyMember._id } }
      );
    }
    
    console.log(`✅ Successfully created ${faculty.length} faculty members`);
    return faculty;
  } catch (error) {
    console.error('❌ Error seeding faculty:', error);
    throw error;
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('📊 Connecting to database...');
    
    // Connect to database
    await connectDB();
    
    // Seed data in order (maintaining relationships)
    const schools = await seedSchools();
    const departments = await seedDepartments(schools);
    const courses = await seedCourses(schools, departments);
    const faculty = await seedFaculty(schools, departments);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📈 Summary:`);
    console.log(`   - Schools: ${schools.length}`);
    console.log(`   - Departments: ${departments.length}`);
    console.log(`   - Courses: ${courses.length}`);
    console.log(`   - Faculty: ${faculty.length}`);
    
  } catch (error) {
    console.error('💥 Database seeding failed:', error);
  } finally {
    // Close database connection
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
