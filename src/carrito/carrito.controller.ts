import { Controller, Post, Get, Body, Query, Header } from '@nestjs/common';
import { CarritoService } from './carrito.service';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post('agregar')
  @Header('Content-Type', 'application/json')
  agregarProducto(
    @Body() body: { clienteId: string; productoId: string; cantidad: number },
  ) {
    if (!body.clienteId || !body.productoId || !body.cantidad) {
      throw new Error('clienteId, productoId y cantidad son requeridos');
    }
    if (body.cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    return this.carritoService.agregarProducto(
      body.clienteId,
      body.productoId,
      body.cantidad,
    );
  }

  @Get()
  @Header('Content-Type', 'application/json')
  obtenerCarrito(@Query('clienteId') clienteId: string) {
    if (!clienteId) {
      throw new Error('clienteId es requerido');
    }
    return this.carritoService.obtenerCarrito(clienteId);
  }
}
