import { Injectable } from '@nestjs/common';
import productosData from '../data/productos.json';

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  marca: string;
  descripcion: string;
}

interface FiltrosBusqueda {
  categoria?: string;
  marca?: string;
  precioMin?: number;
  precioMax?: number;
  buscar?: string;
}

@Injectable()
export class ProductosService {
  private productos: Producto[] = Array.isArray(productosData) 
    ? productosData 
    : (productosData as any).default || [];

  buscarProductos(filtros: FiltrosBusqueda): Producto[] {
    let resultados = [...this.productos];

    if (filtros.categoria) {
      const cat = filtros.categoria;
      resultados = resultados.filter(
        (p) => p.categoria.toLowerCase() === cat.toLowerCase(),
      );
    }

    if (filtros.marca) {
      const marc = filtros.marca;
      resultados = resultados.filter(
        (p) => p.marca.toLowerCase() === marc.toLowerCase(),
      );
    }

    if (filtros.precioMin !== undefined) {
      const min = filtros.precioMin;
      resultados = resultados.filter((p) => p.precio >= min);
    }

    if (filtros.precioMax !== undefined) {
      const max = filtros.precioMax;
      resultados = resultados.filter((p) => p.precio <= max);
    }

    if (filtros.buscar) {
      const busqueda = filtros.buscar.toLowerCase();
      resultados = resultados.filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda) ||
          p.descripcion.toLowerCase().includes(busqueda),
      );
    }

    return resultados;
  }

  obtenerProductoPorId(productoId: string): Producto | undefined {
    return this.productos.find((p) => p.id === productoId);
  }
}
