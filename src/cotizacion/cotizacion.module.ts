import { Module } from '@nestjs/common';
import { CotizacionController } from './cotizacion.controller';
import { CotizacionService } from './cotizacion.service';
import { ClientesModule } from '../clientes/clientes.module';
import { CarritoModule } from '../carrito/carrito.module';

@Module({
  imports: [ClientesModule, CarritoModule],
  controllers: [CotizacionController],
  providers: [CotizacionService],
})
export class CotizacionModule {}
