import { Controller, Get, Query, Header } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @Header('Content-Type', 'application/json')
  buscarProductos(
    @Query('categoria') categoria?: string,
    @Query('marca') marca?: string,
    @Query('precioMin') precioMin?: string,
    @Query('precioMax') precioMax?: string,
    @Query('buscar') buscar?: string,
  ) {
    return this.productosService.buscarProductos({
      categoria,
      marca,
      precioMin: precioMin ? parseFloat(precioMin) : undefined,
      precioMax: precioMax ? parseFloat(precioMax) : undefined,
      buscar,
    });
  }
}
