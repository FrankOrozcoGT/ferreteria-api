import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  fechaCreacion: string;
}

@Injectable()
export class ClientesService {
  private clientes: Map<string, Cliente> = new Map();

  crearCliente(nombre: string, email: string): { clienteId: string } {
    const clienteId = uuidv4();
    const cliente: Cliente = {
      id: clienteId,
      nombre,
      email,
      fechaCreacion: new Date().toISOString(),
    };
    
    this.clientes.set(clienteId, cliente);
    return { clienteId };
  }

  obtenerCliente(clienteId: string): Cliente | undefined {
    return this.clientes.get(clienteId);
  }

  validarCliente(clienteId: string): boolean {
    return this.clientes.has(clienteId);
  }

  listarClientes(): Cliente[] {
    return Array.from(this.clientes.values());
  }
}
