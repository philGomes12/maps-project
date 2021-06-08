import { Component, OnInit } from '@angular/core';
import { StorePolygonsService } from './core/storeLatLng.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TESTE'
  lat = 20.5937;
  lng = 78.9629;
  pointList: any[] = [];
  drawingManager: any;
  selectedShape: any;
  selectedArea = 0;
  paths: any[][] = []

  constructor(private storePolygonsService: StorePolygonsService) {}

  ngOnInit() {
    this.paths = [];
    this.setCurrentPosition();
  }

  onMapReady(map) {
    let x = JSON.parse(localStorage.getItem('polygon'))
    if(x !== '' || x !== null || x !== undefined){
      this.paths = x;
    }
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
    localStorage.clear()
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.pointList = [];
      // To show:
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
  }

  updatePointList(path) {
    let x = JSON.parse(localStorage.getItem('polygon'))
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
    this.storePolygonsService.setStorePolygon(this.paths);
  }
}
