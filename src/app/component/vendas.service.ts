import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Venda } from './vendas/venda';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VendasService {
  private readonly API = 'http://localhost:8080/vendas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.API);
  }

  listarPorId(codigo: string): Observable<Venda> {
    return this.http.get<Venda>(`${this.API}/${codigo}`);
  }

  adicionar(venda: Venda): Observable<Venda> {
    return this.http.post<Venda>(this.API, venda);
  }

  editar(venda: Venda): Observable<Venda> {
    return this.http.patch<Venda>(`${this.API}/${venda.codigo}`, venda);
  }

  excluir(codigo: string): Observable<Venda> {
    return this.http.delete<Venda>(`${this.API}/${codigo}`);
  }
}
