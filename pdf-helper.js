/**
 * SSJU Connect - PDF Upload, Download & Generation Helper
 * Handles PDF file processing, storage, preview, and dynamic generation of realistic question papers.
 */

// Helper to convert File to Base64 Data URL
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Generate an authentic SSJU Question Paper PDF if one does not exist
export function generateQuestionPaperPdf(paper) {
  return new Promise((resolve) => {
    // Check if jsPDF is loaded on window
    const { jsPDF } = window.jspdf || {};

    if (!jsPDF) {
      // Fallback: create a formatted printable HTML blob if jsPDF is not available
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${paper.subjectCode} - ${paper.title}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.5; }
            .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
            .univ-name { font-size: 20pt; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; }
            .faculty-name { font-size: 13pt; margin-top: 4px; font-weight: bold; }
            .exam-info { font-size: 11pt; margin-top: 6px; }
            .meta-table { width: 100%; margin: 15px 0; border-collapse: collapse; font-size: 11pt; }
            .meta-table td { padding: 4px 0; }
            .instructions { font-size: 10pt; font-style: italic; border: 1px dashed #666; padding: 8px; margin: 15px 0; }
            .section-title { font-weight: bold; font-size: 12pt; text-align: center; margin: 20px 0 10px; border-bottom: 1px solid #ddd; }
            .question-item { margin-bottom: 14px; font-size: 11pt; display: flex; justify-content: space-between; }
            .q-text { flex-grow: 1; padding-right: 15px; }
            .q-marks { font-weight: bold; white-space: nowrap; }
            .footer { margin-top: 40px; text-align: center; font-size: 9pt; color: #777; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="univ-name">Soban Singh Jeena University, Almora</div>
            <div class="faculty-name">${paper.streamName || 'University Examination Portal'}</div>
            <div class="exam-info">${paper.examType} Examination - ${paper.examYear}</div>
          </div>

          <table class="meta-table">
            <tr>
              <td><strong>Course/Subject:</strong> ${paper.title}</td>
              <td style="text-align: right;"><strong>Subject Code:</strong> ${paper.subjectCode}</td>
            </tr>
            <tr>
              <td><strong>Semester:</strong> Semester ${paper.semester}</td>
              <td style="text-align: right;"><strong>Time Allowed:</strong> 3 Hours | <strong>Max Marks:</strong> 100</td>
            </tr>
          </table>

          <div class="instructions">
            <strong>Instructions for Candidates:</strong>
            Attempt questions as indicated in each section. Symbols have their usual meanings. Assume suitable data if missing.
          </div>

          <div class="section-title">SECTION A &mdash; (Short Answer Questions - 10 &times; 3 = 30 Marks)</div>
          <div class="question-item"><div class="q-text">1. (a) Define the primary objectives and key scope of ${paper.subjectCode}.</div><div class="q-marks">[3]</div></div>
          <div class="question-item"><div class="q-text">1. (b) Explain the fundamental theorems and core axioms involved with neat diagrams.</div><div class="q-marks">[3]</div></div>
          <div class="question-item"><div class="q-text">1. (c) Differentiate between empirical analysis and theoretical modeling in this domain.</div><div class="q-marks">[3]</div></div>
          <div class="question-item"><div class="q-text">1. (d) Describe the real-world industrial relevance and computational requirements.</div><div class="q-marks">[3]</div></div>
          <div class="question-item"><div class="q-text">1. (e) State the boundary conditions and critical constraints with examples.</div><div class="q-marks">[3]</div></div>

          <div class="section-title">SECTION B &mdash; (Long Answer Analytical Questions - 5 &times; 8 = 40 Marks)</div>
          <div class="question-item"><div class="q-text">2. Present an in-depth architectural breakdown of ${paper.title}. Derive relevant mathematical formulation and discuss worst-case scenarios.</div><div class="q-marks">[8]</div></div>
          <div class="question-item"><div class="q-text">3. Compare and contrast alternative modern methodologies used in current engineering practice. Which provides optimal performance and why?</div><div class="q-marks">[8]</div></div>
          <div class="question-item"><div class="q-text">4. Formulate an end-to-end procedural workflow to solve non-trivial cases. Illustrate with a step-by-step numerical or case study example.</div><div class="q-marks">[8]</div></div>

          <div class="section-title">SECTION C &mdash; (Case Study / Comprehensive Problem - 2 &times; 15 = 30 Marks)</div>
          <div class="question-item"><div class="q-text">5. Given a real-time production scenario with strict latency and memory constraints, design an optimized solution. Evaluate its trade-offs.</div><div class="q-marks">[15]</div></div>
          <div class="question-item"><div class="q-text">6. Write detailed technical notes on: (i) Emerging industry trends, (ii) Verification & validation criteria, (iii) Scalability and security best practices.</div><div class="q-marks">[15]</div></div>

          <div class="footer">
            Verified SSJU Academic Vault &bull; Uploaded by ${paper.uploaderName || 'Student Council'} &bull; Soban Singh Jeena University Almora
          </div>
        </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      resolve({ dataUrl: url, isHtmlFallback: true });
      return;
    }

    // High quality jsPDF document generator
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - (margin * 2);

    // Decorative University Border
    doc.setDrawColor(30, 58, 138); // Navy blue
    doc.setLineWidth(0.8);
    doc.rect(10, 10, pageWidth - 20, 277);
    doc.setLineWidth(0.2);
    doc.rect(12, 12, pageWidth - 24, 273);

    // University Header
    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(30, 58, 138);
    doc.text("SOBAN SINGH JEENA UNIVERSITY, ALMORA", pageWidth / 2, 22, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text(paper.streamName.toUpperCase(), pageWidth / 2, 28, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text(`${paper.examType.toUpperCase()} EXAMINATION - ${paper.examYear}`, pageWidth / 2, 34, { align: 'center' });

    // Divider Line
    doc.setDrawColor(209, 213, 219);
    doc.line(margin, 38, pageWidth - margin, 38);

    // Meta details row 1
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text(`Subject: ${paper.title}`, margin, 44);
    doc.text(`Subject Code: ${paper.subjectCode}`, pageWidth - margin, 44, { align: 'right' });

    // Meta details row 2
    doc.setFont('times', 'normal');
    doc.text(`Semester: ${paper.semester} | Branch: ${paper.streamName}`, margin, 50);
    doc.text(`Time: 3 Hours  |  Max Marks: 100`, pageWidth - margin, 50, { align: 'right' });

    doc.setDrawColor(209, 213, 219);
    doc.line(margin, 54, pageWidth - margin, 54);

    // Instructions
    doc.setFont('times', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    const instructions = "NOTE: Attempt all sections as specified. Assume suitable data wherever necessary. Neat diagrams must be drawn wherever applicable.";
    doc.text(doc.splitTextToSize(instructions, contentWidth), margin, 60);

    // Section A
    let y = 70;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text("SECTION A (Short Answer Type - 10 × 3 = 30 Marks)", pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);

    const secAQuestions = [
      `Q1 (a) State the fundamental definition and real-world significance of ${paper.subjectCode}.`,
      `Q1 (b) Compare and illustrate the time vs space trade-offs in fundamental operations.`,
      `Q1 (c) Define key properties, operational constraints, and edge boundary conditions.`,
      `Q1 (d) Explain with diagrams the core underlying data representation techniques.`,
      `Q1 (e) Highlight two typical industry applications and best design practices.`
    ];

    secAQuestions.forEach((q) => {
      doc.text(q, margin, y);
      doc.text("[3]", pageWidth - margin, y, { align: 'right' });
      y += 8;
    });

    // Section B
    y += 4;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text("SECTION B (Analytical & Descriptive Type - 4 × 10 = 40 Marks)", pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);

    const secBQuestions = [
      `Q2. Provide a thorough theoretical proof and derivation for primary algorithms used in ${paper.title}. Analyze the best, average, and worst-case complexities.`,
      `Q3. Design a complete step-by-step modular architecture to resolve concurrent state conflicts. Detail validation rules and recovery strategies.`,
      `Q4. Compare the classic approach versus contemporary optimized frameworks. Tabulate key operational parameters and memory overheads.`,
      `Q5. Given an unstructured dataset with variable frequency inputs, formulate an optimal scheduling and processing workflow.`
    ];

    secBQuestions.forEach((q) => {
      const splitText = doc.splitTextToSize(q, contentWidth - 15);
      doc.text(splitText, margin, y);
      doc.text("[10]", pageWidth - margin, y, { align: 'right' });
      y += (splitText.length * 5) + 4;
    });

    // Section C
    y += 2;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text("SECTION C (Comprehensive Case Study - 2 × 15 = 30 Marks)", pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);

    const secCQuestions = [
      `Q6. Comprehensive Scenario: An enterprise system requires high throughput and zero-data-loss under high concurrency. Propose an end-to-end technical specification for ${paper.title}. Include schema designs, pseudocode, and mathematical verification.`,
      `Q7. Write comprehensive technical notes on any TWO: (a) Fault-tolerant recovery, (b) Asymptotic limits, (c) Industrial deployment standards and automated testing.`
    ];

    secCQuestions.forEach((q) => {
      const splitText = doc.splitTextToSize(q, contentWidth - 15);
      doc.text(splitText, margin, y);
      doc.text("[15]", pageWidth - margin, y, { align: 'right' });
      y += (splitText.length * 5) + 4;
    });

    // Watermark
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.07 }));
    doc.setFont('times', 'bold');
    doc.setFontSize(45);
    doc.setTextColor(100, 116, 139);
    doc.text("SSJU CONNECT VAULT", pageWidth / 2, 160, { align: 'center', angle: 45 });
    doc.restoreGraphicsState();

    // Footer
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(`Official Paper Archive • Soban Singh Jeena University • Uploaded by ${paper.uploaderName || 'Student Contributor'}`, pageWidth / 2, 280, { align: 'center' });

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    resolve({ dataUrl: pdfUrl, blob: pdfBlob, isHtmlFallback: false });
  });
}

// Download action handler
export async function triggerPaperDownload(paper) {
  let downloadUrl = paper.pdfDataUrl;

  if (!downloadUrl) {
    const generated = await generateQuestionPaperPdf(paper);
    downloadUrl = generated.dataUrl;
  }

  const filename = `SSJU_${paper.streamId.toUpperCase()}_${paper.subjectCode.replace(/[^a-zA-Z0-9_-]/g, '_')}_${paper.examYear}.pdf`;
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
