import { Routes } from '@angular/router';
import { ListarClientesComponent } from './component/clientes/listar-clientes/listar-clientes.component';
import { HomeComponent } from './component/home/home.component';
import { AdicionarClienteComponent } from './component/clientes/adicionar-cliente/adicionar-cliente.component';
import { EditarClienteComponent } from './component/clientes/editar-cliente/editar-cliente.component';
import { ListarProdutosComponent } from './component/produtos/listar-produtos/listar-produtos.component';
import { AdicionarProdutoComponent } from './component/produtos/adicionar-produto/adicionar-produto.component';
import { EditarProdutoComponent } from './component/produtos/editar-produto/editar-produto.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'listarClientes',
    component: ListarClientesComponent,
  },
  {
    path: 'adicionarCliente',
    component: AdicionarClienteComponent,
  },
  {
    path: 'editarCliente/:codigo',
    component: EditarClienteComponent,
  },
  {
    path: 'listarProdutos',
    component: ListarProdutosComponent,
  },
  {
    path: 'adicionarProduto',
    component: AdicionarProdutoComponent,
  },
  {
    path: 'editarProduto/:codigo',
    component: EditarProdutoComponent,
  },
];
