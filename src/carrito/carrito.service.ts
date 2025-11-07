import { Injectable } from '@nestjs/common';
import { ClientesService } from '../clientes/clientes.service';
import { ProductosService } from '../productos/productos.service';

export interface ItemCarrito {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  nombre: string;
}

export interface Carrito {
  clienteId: string;
  items: ItemCarrito[];
  total: number;
}

@Injectable()
export class CarritoService {
  private carritos: Map<string, ItemCarrito[]> = new Map();

  constructor(
    private readonly clientesService: ClientesService,
    private readonly productosService: ProductosService,
  ) {}

  agregarProducto(
    clienteId: string,
    productoId: string,
    cantidad: number,
  ): { mensaje: string; carrito: Carrito } {
    if (!this.clientesService.validarCliente(clienteId)) {
      throw new Error('Cliente no existe');
    }

    const producto = this.productosService.obtenerProductoPorId(productoId);
    if (!producto) {
      throw new Error('Producto no existe');
    }

    if (producto.stock < cantidad) {
      throw new Error('Stock insuficiente');
    }

    let items = this.carritos.get(clienteId) || [];
    const itemExistente = items.find((i) => i.productoId === productoId);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
    } else {
      items.push({
        productoId: producto.id,
        cantidad,
        precioUnitario: producto.precio,
        subtotal: producto.precio * cantidad,
        nombre: producto.nombre,
      });
    }

    this.carritos.set(clienteId, items);

    return {
      mensaje: 'Producto agregado al carrito',
      carrito: this.obtenerCarrito(clienteId),
    };
  }

  obtenerCarrito(clienteId: string): Carrito {
    if (!this.clientesService.validarCliente(clienteId)) {
      throw new Error('Cliente no existe');
    }

    const items = this.carritos.get(clienteId) || [];
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      clienteId,
      items,
      total,
    };
  }
}
