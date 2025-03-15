import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from './cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly API = 'http://localhost:8080/clientes';

  constructor(private http: HttpClient) {}

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API);
  }

  listarPorId(codigo: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.API}/${codigo}`);
  }

  adicionar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.API, cliente);
  }

  editar(cliente: Cliente): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.API}/${cliente.codigo}`, cliente);
  }

  excluir(codigo: string) {
    return this.http.delete<Cliente>(`${this.API}/${codigo}`);
  }
}
