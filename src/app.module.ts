import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';
import { CarritoModule } from './carrito/carrito.module';
import { CotizacionModule } from './cotizacion/cotizacion.module';

@Module({
  imports: [ClientesModule, ProductosModule, CarritoModule, CotizacionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
