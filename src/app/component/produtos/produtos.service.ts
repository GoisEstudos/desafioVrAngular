import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produto } from './produto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  private readonly API = 'http://localhost:8080/produtos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API);
  }

  listarPorId(codigo: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.API}/${codigo}`);
  }

  adicionar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API, produto);
  }

  editar(produto: Produto): Observable<Produto> {
    return this.http.patch<Produto>(`${this.API}/${produto.codigo}`, produto);
  }

  excluir(codigo: string): Observable<Produto> {
    return this.http.delete<Produto>(`${this.API}/${codigo}`);
  }
}
