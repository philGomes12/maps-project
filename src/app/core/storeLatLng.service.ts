import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class StorePolygonsService{
  constructor(){}

  public setStorePolygon(polygons){
    localStorage.setItem('polygon', JSON.stringify(polygons))
    return true
  }
}
