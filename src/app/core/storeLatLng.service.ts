import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class StorePolygonsService{
  constructor(private http: HttpClient){}

  savePolygons(id: any, polygons: any): Observable<any>{
    localStorage.setItem('id', id)
    return this.http.post('http://localhost:3000/api', polygons )
  }

  getPolygonsById(id: any){
    return this.http.get(`http://localhost:3000/api/${id}`)
  }

  updatePolygon(id: any, polygons){
    return this.http.put(`http://localhost:3000/api/${id}`, polygons)
  }

  deletePolygon(id: any){
    return this.http.delete(`http://localhost:3000/api/${id}`)
  }
}
