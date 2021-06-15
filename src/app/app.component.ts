import { Component, OnInit } from '@angular/core';
import { StorePolygonsService } from './core/storeLatLng.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TESTE'
  lat = 20.5937;
  lng = 78.9629;
  map: any
  pointList: any[] = [];
  drawingManager: any;
  selectedShape: any;
  selectedArea = 0;
  paths: any[][] = []
  id: any;

  idForm = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private storePolygonsService: StorePolygonsService, private matDialog: MatDialog) {}


  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = "some data";
    let dialogRef = this.matDialog.open(DialogBodyComponent, dialogConfig);
  }

  ngOnInit() {
    this.paths = [];
    this.setCurrentPosition();
    localStorage.setItem('isLoad', '')
  }

  onMapReady(map) {
    this.map = map;
    this.initDrawingManager(map);
  }

  initDrawingManager = (map: any) => {
    const self = this;
    const options: google.maps.drawing.DrawingManagerOptions  = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(
              paths.getAt(p),
              'set_at',
              () => {
                if (!event.overlay.drag) {
                  self.updatePointList(event.overlay.getPath());
                }
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'insert_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'remove_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
          }
          self.updatePointList(event.overlay.getPath());
          this.selectedShape = event.overlay;
          this.selectedShape.type = event.type;
        }
        // if (event.type !== google.maps.drawing.OverlayType.MARKER) {
        //   // Switch back to non-drawing mode after drawing a shape.
        //   self.drawingManager.setDrawingMode(null);
        //   // To hide:
        //   self.drawingManager.setOptions({
        //     drawingControl: false,
        //   });
        // }
      }
    );
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }

  }


  deleteSelectedShape() {
    this.pointList = [];
    this.paths = [];
    localStorage.setItem('isLoad', '')
    this.idForm.setValue('')
    window.location.reload()
    this.onMapReady(this.map)
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      // To show:
      this.drawingManager.setOptions({
        drawingControl: false,
      });
    }
  }

  deletePolygon(){
    this.storePolygonsService.deletePolygon(this.idForm.value).subscribe(resp => {
      this.deleteSelectedShape()
    })
  }

  findList(){
    if(this.idForm.valid){
      this.storePolygonsService.getPolygonsById(this.idForm.value).subscribe(resp => {
        console.log('1: ', resp)
        this.paths = resp['polygons']
        localStorage.setItem('isLoad', 'true')
      })
    }else{
    }
  }

  savePintList(){
    this.id = Number(localStorage.getItem('id'))
    let isLoad = localStorage.getItem('isLoad')
    if(!this.id){
      this.id = 1
    }else{
      if(isLoad){
        let id = this.idForm.value;
        const polygons ={
          id : id,
          polygons : this.paths
        }
        this.storePolygonsService.updatePolygon(id, polygons).subscribe(resp => {
          this.deleteSelectedShape();
        })
      }else{
        this.id = this.id + 1;
        const polygons ={
          id : this.id,
          polygons : this.paths
        }
        this.storePolygonsService.savePolygons(this.id, polygons).subscribe(polygons =>{
          this.selectedShape.setMap(null);
          this.deleteSelectedShape();
        },err =>{
          console.log("Erro: ", err)
        })
      }
    }
  }

  updatePointList(path) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(
        path.getAt(i).toJSON()
      );
    }
    this.selectedArea = google.maps.geometry.spherical.computeArea(
      path
    );
    this.paths.push(this.pointList)
  }
}
