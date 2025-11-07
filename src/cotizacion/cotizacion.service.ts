import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { ClientesService } from '../clientes/clientes.service';
import { CarritoService } from '../carrito/carrito.service';

@Injectable()
export class CotizacionService {
  private readonly publicDir = path.join(process.cwd(), 'public', 'pdfs');

  constructor(
    private readonly clientesService: ClientesService,
    private readonly carritoService: CarritoService,
  ) {
    if (!fs.existsSync(this.publicDir)) {
      fs.mkdirSync(this.publicDir, { recursive: true });
    }
  }

  async generarPDFCotizacion(clienteId: string): Promise<string> {
    const cliente = this.clientesService.obtenerCliente(clienteId);
    if (!cliente) {
      throw new Error('Cliente no existe');
    }

    const carrito = this.carritoService.obtenerCarrito(clienteId);
    if (carrito.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const filename = `cotizacion-${clienteId}-${Date.now()}.pdf`;
    const filePath = path.join(this.publicDir, filename);
    
    await this.crearPDF(cliente, carrito, filePath);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/pdfs/${filename}`;
  }

  private async crearPDF(cliente: any, carrito: any, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // Encabezado
      doc.fontSize(20).text('COTIZACIÓN DE FERRETERÍA', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, { align: 'right' });
      doc.moveDown();

      // Datos del cliente
      doc.fontSize(14).text('Datos del Cliente:', { underline: true });
      doc.fontSize(11).text(`Cliente ID: ${cliente.id}`);
      doc.text(`Nombre: ${cliente.nombre}`);
      doc.text(`Email: ${cliente.email}`);
      doc.moveDown();

      // Línea separadora
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Tabla de productos
      doc.fontSize(14).text('Productos:', { underline: true });
      doc.moveDown(0.5);

      // Encabezados de tabla
      const tableTop = doc.y;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Producto', 50, tableTop, { width: 200, continued: false });
      doc.text('Cantidad', 270, tableTop, { width: 70, align: 'center' });
      doc.text('Precio Unit.', 350, tableTop, { width: 80, align: 'right' });
      doc.text('Subtotal', 450, tableTop, { width: 100, align: 'right' });

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // Items
      let yPosition = tableTop + 25;
      doc.font('Helvetica');

      carrito.items.forEach((item) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }

        doc.text(item.nombre, 50, yPosition, { width: 200 });
        doc.text(item.cantidad.toString(), 270, yPosition, { width: 70, align: 'center' });
        doc.text(`$${item.precioUnitario.toFixed(2)}`, 350, yPosition, { width: 80, align: 'right' });
        doc.text(`$${item.subtotal.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });

        yPosition += 25;
      });

      // Línea antes del total
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 15;

      // Total
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('TOTAL:', 350, yPosition, { width: 80, align: 'right' });
      doc.text(`$${carrito.total.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });

      // Pie de página
      doc.moveDown(3);
      doc.fontSize(9).font('Helvetica').text(
        'Esta cotización tiene una validez de 30 días.',
        { align: 'center' }
      );
      doc.text('Gracias por su preferencia.', { align: 'center' });

      doc.end();

      writeStream.on('finish', () => resolve());
      writeStream.on('error', reject);
    });
  }
}
