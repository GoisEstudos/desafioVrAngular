import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-listar-clientes',
  imports: [RouterLink, CommonModule],
  templateUrl: './listar-clientes.component.html',
  styleUrl: './listar-clientes.component.css',
})
export class ListarClientesComponent {
  listarClientes: Cliente[] = [];
  clienteSelecionado: Cliente | null = null;

  constructor(private service: ClienteService) {}

  onDelete(codigo?: string) {
    if (codigo) {
      this.service.excluir(codigo).subscribe(() => {
        // Após excluir, remover o cliente da lista
        this.listarClientes = this.listarClientes.filter(
          (cliente) => cliente.codigo !== codigo
        );
      });
    }
  }

  onSelectCliente(cliente: Cliente) {
    if (this.clienteSelecionado?.codigo === cliente.codigo) {
      // Se o mesmo cliente for clicado, desmarcar
      this.clienteSelecionado = null;
    } else {
      // Caso contrário, marcar o cliente
      this.clienteSelecionado = cliente;
    }
  }

  ngOnInit() {
    this.service.listar().subscribe((listaCliente) => {
      this.listarClientes = listaCliente;
    });
  }
}
