import { Routes } from '@angular/router';
import { ListarClientesComponent } from './component/clientes/listar-clientes/listar-clientes.component';
import { HomeComponent } from './component/home/home.component';
import { AdicionarClienteComponent } from './component/clientes/adicionar-cliente/adicionar-cliente.component';
import { EditarClienteComponent } from './component/clientes/editar-cliente/editar-cliente.component';

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
];
