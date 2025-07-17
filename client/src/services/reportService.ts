import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ContactSubmission } from './contactApi';

interface FilterOptions {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  subject: string;
  status: string;
  leadStatus: string;
}

export class ReportService {
  /**
   * Generate and download Excel report
   */
  static generateExcelReport(leads: ContactSubmission[], filters: FilterOptions): void {
    try {
      // Prepare data for Excel
      const excelData = leads.map((lead, index) => ({
        'Sr. No.': index + 1,
        'Date': new Date(lead.submittedAt).toLocaleDateString('en-US'),
        'Time': new Date(lead.submittedAt).toLocaleTimeString('en-US'),
        'Name': lead.name,
        'Email': lead.email,
        'Phone': lead.phone || 'N/A',
        'Subject': lead.subject,
        'Message': lead.message,
        'Status': lead.status.toUpperCase(),
        'Priority': this.getLeadPriority(lead).toUpperCase(),
        'Reply/Notes': lead.adminNotes || 'No reply/notes',
        'Replied Date': lead.repliedAt 
          ? new Date(lead.repliedAt).toLocaleDateString('en-US')
          : 'Not replied'
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 8 },   // Sr. No.
        { wch: 12 },  // Date
        { wch: 10 },  // Time
        { wch: 20 },  // Name
        { wch: 25 },  // Email
        { wch: 15 },  // Phone
        { wch: 30 },  // Subject
        { wch: 50 },  // Message
        { wch: 10 },  // Status
        { wch: 10 },  // Priority
        { wch: 40 },  // Reply/Notes
        { wch: 15 }   // Replied Date
      ];
      worksheet['!cols'] = columnWidths;

      // Add the worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Leads');

      // Create a summary sheet
      const summaryData = this.generateSummaryData(leads, filters);
      const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `student-leads-report-${timestamp}.xlsx`;

      // Save the file
      XLSX.writeFile(workbook, filename);

      console.log('Excel report generated successfully:', filename);
    } catch (error) {
      console.error('Error generating Excel report:', error);
      throw new Error('Failed to generate Excel report');
    }
  }

  /**
   * Generate and download PDF report
   */
  static generatePDFReport(leads: ContactSubmission[], filters: FilterOptions): void {
    try {
      // Create new PDF document
      const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
      
      // Add title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Student Leads Report', 20, 20);

      // Add generation date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

      // Add filter information
      let yPosition = 40;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Filters Applied:', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      if (filters.dateRange.startDate && filters.dateRange.endDate) {
        doc.text(`Date Range: ${filters.dateRange.startDate} to ${filters.dateRange.endDate}`, 20, yPosition);
        yPosition += 8;
      }
      
      if (filters.subject) {
        doc.text(`Subject Filter: ${filters.subject}`, 20, yPosition);
        yPosition += 8;
      }
      
      if (filters.status) {
        doc.text(`Status Filter: ${filters.status.toUpperCase()}`, 20, yPosition);
        yPosition += 8;
      }

      yPosition += 10;

      // Add summary statistics
      const stats = this.calculateStats(leads);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary Statistics:', 20, yPosition);
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Leads: ${stats.totalLeads}`, 20, yPosition);
      doc.text(`New Leads: ${stats.newLeads}`, 80, yPosition);
      doc.text(`Potential Students: ${stats.potentialStudents}`, 140, yPosition);
      doc.text(`Conversion Rate: ${stats.conversionRate}%`, 220, yPosition);

      yPosition += 20;

      // Prepare table data
      const tableHeaders = [
        'Date',
        'Name',
        'Email',
        'Subject',
        'Status',
        'Priority',
        'Reply Status'
      ];

      const tableData = leads.map(lead => [
        new Date(lead.submittedAt).toLocaleDateString('en-US'),
        lead.name,
        lead.email,
        lead.subject.length > 25 ? lead.subject.substring(0, 25) + '...' : lead.subject,
        lead.status.toUpperCase(),
        this.getLeadPriority(lead).toUpperCase(),
        lead.repliedAt ? 'Replied' : 'Pending'
      ]);

      // Add table using autoTable plugin
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: yPosition,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 25 },  // Date
          1: { cellWidth: 35 },  // Name
          2: { cellWidth: 50 },  // Email
          3: { cellWidth: 70 },  // Subject
          4: { cellWidth: 20 },  // Status
          5: { cellWidth: 20 },  // Priority
          6: { cellWidth: 25 },  // Reply Status
        },
        margin: { left: 20, right: 20 },
      });

      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - 40,
          doc.internal.pageSize.getHeight() - 10
        );
        doc.text(
          'College Administration - Student Leads Report',
          20,
          doc.internal.pageSize.getHeight() - 10
        );
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `student-leads-report-${timestamp}.pdf`;

      // Save the PDF
      doc.save(filename);

      console.log('PDF report generated successfully:', filename);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  /**
   * Generate CSV report
   */
  static generateCSVReport(leads: ContactSubmission[]): void {
    try {
      const headers = [
        'Sr. No.',
        'Date',
        'Time',
        'Name',
        'Email',
        'Phone',
        'Subject',
        'Message',
        'Status',
        'Priority',
        'Reply/Notes',
        'Replied Date'
      ];

      const csvContent = [
        headers.join(','),
        ...leads.map((lead, index) => [
          index + 1,
          `"${new Date(lead.submittedAt).toLocaleDateString('en-US')}"`,
          `"${new Date(lead.submittedAt).toLocaleTimeString('en-US')}"`,
          `"${lead.name}"`,
          lead.email,
          `"${lead.phone || 'N/A'}"`,
          `"${lead.subject.replace(/"/g, '""')}"`, // Escape quotes in subject
          `"${lead.message.replace(/"/g, '""')}"`, // Escape quotes in message
          lead.status.toUpperCase(),
          this.getLeadPriority(lead).toUpperCase(),
          `"${(lead.adminNotes || 'No reply/notes').replace(/"/g, '""')}"`,
          lead.repliedAt 
            ? `"${new Date(lead.repliedAt).toLocaleDateString('en-US')}"` 
            : 'Not replied'
        ].join(','))
      ].join('\n');

      // Add BOM for proper Excel encoding
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.href = url;
      link.download = `student-leads-report-${timestamp}.csv`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(url);

      console.log('CSV report generated successfully');
    } catch (error) {
      console.error('Error generating CSV report:', error);
      throw new Error('Failed to generate CSV report');
    }
  }

  /**
   * Get lead priority based on content analysis
   */
  private static getLeadPriority(lead: ContactSubmission): 'high' | 'medium' | 'low' {
    const subject = lead.subject.toLowerCase();
    const message = lead.message.toLowerCase();
    
    const highPriorityKeywords = [
      'admission', 'enrollment', 'apply', 'application', 'program', 'course', 
      'fee', 'fees', 'scholarship', 'deadline', 'urgent', 'immediate'
    ];
    
    const mediumPriorityKeywords = [
      'information', 'details', 'about', 'inquiry', 'question', 'help',
      'guidance', 'counseling', 'career', 'placement'
    ];
    
    const hasHighPriority = highPriorityKeywords.some(keyword => 
      subject.includes(keyword) || message.includes(keyword)
    );
    
    const hasMediumPriority = mediumPriorityKeywords.some(keyword => 
      subject.includes(keyword) || message.includes(keyword)
    );
    
    if (hasHighPriority) return 'high';
    if (hasMediumPriority) return 'medium';
    return 'low';
  }

  /**
   * Calculate statistics for the leads
   */
  private static calculateStats(leads: ContactSubmission[]) {
    const total = leads.length;
    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const replied = leads.filter(lead => lead.status === 'replied').length;
    
    const potentialStudents = leads.filter(lead => 
      lead.adminNotes && 
      (lead.adminNotes.toLowerCase().includes('admission') ||
       lead.adminNotes.toLowerCase().includes('enrollment') ||
       lead.adminNotes.toLowerCase().includes('student') ||
       lead.adminNotes.toLowerCase().includes('course'))
    ).length;
    
    const conversionRate = total > 0 ? (potentialStudents / total) * 100 : 0;
    
    return {
      totalLeads: total,
      newLeads,
      replied,
      potentialStudents,
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  }

  /**
   * Generate summary data for Excel report
   */
  private static generateSummaryData(leads: ContactSubmission[], filters: FilterOptions) {
    const stats = this.calculateStats(leads);
    
    const priorityBreakdown = {
      high: leads.filter(lead => this.getLeadPriority(lead) === 'high').length,
      medium: leads.filter(lead => this.getLeadPriority(lead) === 'medium').length,
      low: leads.filter(lead => this.getLeadPriority(lead) === 'low').length
    };

    const statusBreakdown = {
      new: leads.filter(lead => lead.status === 'new').length,
      read: leads.filter(lead => lead.status === 'read').length,
      replied: leads.filter(lead => lead.status === 'replied').length,
      archived: leads.filter(lead => lead.status === 'archived').length
    };

    return [
      { 'Metric': 'Report Generation Date', 'Value': new Date().toLocaleString() },
      { 'Metric': '', 'Value': '' },
      { 'Metric': 'FILTER INFORMATION', 'Value': '' },
      { 'Metric': 'Date Range', 'Value': filters.dateRange.startDate && filters.dateRange.endDate 
          ? `${filters.dateRange.startDate} to ${filters.dateRange.endDate}` 
          : 'All dates' },
      { 'Metric': 'Subject Filter', 'Value': filters.subject || 'All subjects' },
      { 'Metric': 'Status Filter', 'Value': filters.status || 'All statuses' },
      { 'Metric': '', 'Value': '' },
      { 'Metric': 'SUMMARY STATISTICS', 'Value': '' },
      { 'Metric': 'Total Leads', 'Value': stats.totalLeads },
      { 'Metric': 'New Leads', 'Value': stats.newLeads },
      { 'Metric': 'Potential Students', 'Value': stats.potentialStudents },
      { 'Metric': 'Conversion Rate', 'Value': `${stats.conversionRate}%` },
      { 'Metric': '', 'Value': '' },
      { 'Metric': 'PRIORITY BREAKDOWN', 'Value': '' },
      { 'Metric': 'High Priority', 'Value': priorityBreakdown.high },
      { 'Metric': 'Medium Priority', 'Value': priorityBreakdown.medium },
      { 'Metric': 'Low Priority', 'Value': priorityBreakdown.low },
      { 'Metric': '', 'Value': '' },
      { 'Metric': 'STATUS BREAKDOWN', 'Value': '' },
      { 'Metric': 'New', 'Value': statusBreakdown.new },
      { 'Metric': 'Read', 'Value': statusBreakdown.read },
      { 'Metric': 'Replied', 'Value': statusBreakdown.replied },
      { 'Metric': 'Archived', 'Value': statusBreakdown.archived }
    ];
  }
}

export default ReportService;
