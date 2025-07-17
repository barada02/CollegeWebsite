# Contact Data Seeding Guide

This script will populate your contact collection with 25+ realistic contact records using Indian names for testing the Student Leads Management system.

## Features

### Generated Data Includes:
- **Names**: Authentic Indian first and last names
- **Emails**: Realistic email addresses with popular Indian domains
- **Phone Numbers**: Indian mobile numbers with proper formatting
- **Subjects**: 20 different inquiry types relevant to college admissions
- **Messages**: Realistic inquiry messages students might send
- **Status**: Random distribution across all status types (new, read, replied, archived)
- **Dates**: Random submission dates over the last 6 months

### Data Distribution:
- 25 contact records
- Mixed status distribution for testing filters
- Date range spanning 6 months for date filtering tests
- Various subjects for subject filtering tests
- Indian phone number formats

## How to Run

### Method 1: Using Batch File (Windows)
1. Make sure MongoDB is running
2. Navigate to the Server directory
3. Double-click `seed-contact-data.bat`
4. Follow the prompts

### Method 2: Using Node.js Directly
1. Open terminal in the Server directory
2. Run: `node scripts/seedContactData.js`

### Method 3: Using npm (if you add it to package.json)
Add this to your Server/package.json scripts section:
```json
"seed-contacts": "node scripts/seedContactData.js"
```
Then run: `npm run seed-contacts`

## Prerequisites

1. **MongoDB Running**: Ensure your MongoDB server is running
2. **Dependencies**: Make sure mongoose is installed in your Server directory
3. **Environment**: Update the MongoDB connection string in the script if needed

## What the Script Does

1. **Connects** to your MongoDB database
2. **Clears** existing contact data (optional - can be commented out)
3. **Generates** 25 realistic contact records
4. **Inserts** them into the contact collection
5. **Displays** a summary of inserted data

## Testing Scenarios

After running the script, you can test:

### Date Range Filtering:
- Filter by last week, last month, specific date ranges
- Data spans 6 months so you'll have records in different time periods

### Subject Filtering:
- Search for "admission", "fee", "placement", etc.
- 20 different subject types to test various keywords

### Status Filtering:
- Filter by new, read, replied, archived
- Random distribution ensures all statuses have records

### Combined Filtering:
- Test multiple filters together
- Date range + subject + status combinations

## Sample Data Preview

The script generates records like:
```
Name: Aarav Sharma
Email: aarav.sharma@gmail.com
Phone: +919876543210
Subject: Admission Information
Status: new
Date: Recent random date
Message: Realistic inquiry message
```

## Database Impact

- **Collection**: contact
- **Records**: 25 new records
- **Data Safety**: Script clears existing data by default (can be disabled)
- **Indexing**: Uses existing Contact model structure

## Troubleshooting

1. **Connection Error**: Check if MongoDB is running
2. **Permission Error**: Ensure write permissions to database
3. **Module Error**: Run `npm install` in Server directory
4. **Path Error**: Run script from Server directory

## Customization

You can modify the script to:
- Change number of records (modify the loop in generateContactData)
- Add more Indian names to the arrays
- Modify subjects or messages
- Change date range
- Adjust status distribution

The script is designed to create realistic test data that closely mimics actual student inquiries to properly test your filtering and reporting functionality.
