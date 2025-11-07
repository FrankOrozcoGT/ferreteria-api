import { Controller, Post, Body } from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  crearCliente(@Body() body: { nombre: string; email: string }) {
    if (!body.nombre || !body.email) {
      throw new Error('Nombre y email son requeridos');
    }
    return this.clientesService.crearCliente(body.nombre, body.email);
  }
}
