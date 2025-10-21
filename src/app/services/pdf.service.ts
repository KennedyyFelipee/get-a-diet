import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { User } from 'src/app/@types/index.'; 

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  private safeText(v: any): string {
    return v === null || v === undefined ? '' : String(v);
  }

  private formatDate(d: Date = new Date()): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }


  async generateDietPdf(user: User): Promise<void> {
    if (!user) throw new Error('Usuário inválido');
    if (!user.diet) throw new Error('Usuário sem dieta ativa');


    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    const margin = 40;
    const usableW = pageW - margin * 2;
    let y = 60;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text("H'Life — Plano Nutricional", margin, y);

    doc.setFontSize(11);
    y += 20;

    const userName = this.safeText(user.name);
    doc.text(`Nome: ${userName}`, margin, y);
    doc.text(`Data: ${this.formatDate()}`, pageW - margin - 120, y);

    y += 18;
    doc.setFontSize(13);
    doc.text(`Dieta: ${this.safeText(user.diet.title ?? '')}`, margin, y);
    y += 14;

    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 18;

    const meals = Array.isArray(user.diet.meals) ? user.diet.meals : [];
    for (const meal of meals) {
      if (y > pageH - 120) {
        doc.addPage();
        y = 60;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(this.safeText(meal.title ?? 'Refeição'), margin, y);

      doc.setFont('helvetica', 'normal');
      y += 14;

      const items = Array.isArray(meal.items) ? meal.items : [];
      for (const item of items) {
        const name = this.safeText(item.name);
        const qty = item.quantity !== undefined && item.quantity !== null ? String(item.quantity) : '';
        const unit = this.safeText(item.unit);
        const desc = this.safeText(item.description);

        const left = `• ${name}${qty ? ' — ' + qty : ''}${unit ? ' ' + unit : ''}`;
        const line = desc ? `${left} (${desc})` : left;

        const lines = doc.splitTextToSize(line, usableW);
        doc.setFontSize(10);
        for (const ln of lines) {
          if (y > pageH - 100) {
            doc.addPage();
            y = 60;
          }
          doc.text(ln, margin, y);
          y += 12;
        }
        y += 4;
      }

      y += 8; 
    }

    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      const footerY = pageH - 30;
      doc.setFontSize(9);
      doc.text(`Emitido por H'Life • ${this.formatDate()}`, margin, footerY);
      doc.text(`${p}/${pageCount}`, pageW - margin - 20, footerY);
    }

    const safeTitle = (user.diet.title ?? 'dieta').replace(/\s+/g, '_');
    const fileName = `${userName.replace(/\s+/g, '_')}_dieta_${safeTitle}_${this.formatDate().replace(/\//g, '-')}.pdf`;

    doc.save(fileName);
  }
}
