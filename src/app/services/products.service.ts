import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import { catchError, retry, retryWhen, map } from 'rxjs/operators';
import {throwError, zip} from 'rxjs';

import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model';
import { environment } from './../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.API_URL}/api/products`
  // Para usar con el proxy:
  // private apiUrl = '/api/products'

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit !== undefined && offset !== undefined) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiUrl, { params })
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }

  getProduct(id:string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === HttpStatusCode.Conflict) {
          return throwError('Algo esta fallando con el servidor');
        }
        if(error.status === HttpStatusCode.NotFound) {
          return throwError('El producto no existe');
        }
        if(error.status === HttpStatusCode.Unauthorized) {
          return throwError('No estas autorizado');
        }
        return throwError('Ups algo salio mal');
      })
    );
  }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiUrl}`, {
      params: {limit, offset}
    })
  }

  fetchReadAndUpdate(id: string, dto:UpdateProductDTO) {
    return zip (
      this.getProduct(id),
      this.update(id, dto)
    );
  }

  create(product:CreateProductDTO) {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id:string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id:string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
