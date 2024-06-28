declare namespace google.maps {
  export interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  export class Map {
    constructor(element: HTMLElement, options: any);
    setCenter(center: LatLngLiteral): void;
    getBounds(): LatLngBounds;
    addListener(eventName: string, handler: Function): void;
  }

  export class Marker {
    constructor(options: any);
  }

  export class LatLngBounds {
    extend(point: LatLngLiteral): void;
  }

  export namespace places {
    class SearchBox {
      constructor(input: HTMLInputElement);
      getPlaces(): Array<{ geometry: { location: LatLng } }>;
      setBounds(bounds: LatLngBounds): void;
      addListener(eventName: string, handler: Function): void;
    }

    class LatLng {
      lat(): number;
      lng(): number;
    }
  }
}  
