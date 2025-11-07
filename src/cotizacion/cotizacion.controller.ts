import { Controller, Get, Query } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';

@Controller('cotizacion')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  @Get('pdf')
  async generarPDF(@Query('clienteId') clienteId: string) {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    const pdfUrl = await this.cotizacionService.generarPDFCotizacion(clienteId);
    
    return {
      mensaje: 'PDF generado exitosamente',
      pdfUrl,
      clienteId,
    };
  }

  @Get('listado')
  listarCotizaciones(@Query('clienteId') clienteId: string) {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }

    const cotizaciones = this.cotizacionService.listarCotizaciones(clienteId);
    
    return {
      clienteId,
      total: cotizaciones.length,
      cotizaciones,
    };
  }
}


