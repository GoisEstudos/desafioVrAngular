import { Cliente } from '../clientes/cliente';
import { Produto } from '../produtos/produto';

export interface Venda {
  codigo: string;
  cliente: Cliente;
  itens: ItemVenda[];
  dataVenda: string; // Formato "dd/MM/yyyy HH:mm:ss"
  valorTotal: number;
}

export interface ItemVenda {
  codigo: string;
  produto: Produto;
  quantidade: number;
}
