import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CotizacionService } from './cotizacion.service';

@Controller('cotizacion')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  @Get('pdf')
  async generarPDF(
    @Query('clienteId') clienteId: string,
    @Res() res: Response,
  ) {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    const pdfBuffer = await this.cotizacionService.generarPDFCotizacion(clienteId);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=cotizacion-${clienteId}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }
}
