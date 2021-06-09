import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class StorePolygonsService{
  constructor(private http: HttpClient){}

  public setStorePolygon(polygons){
    localStorage.setItem('polygon', JSON.stringify(polygons))

    return true
  }

  savePolygons(poligons): Observable<any>{
    return this.http.post('http://localhost:3000/api', poligons )
  }

  count(){
    return this.http.get('http://localhost:3000/api')
  }
}
