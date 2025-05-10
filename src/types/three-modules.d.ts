
declare module 'three/examples/jsm/geometries/TextGeometry' {
  import { BufferGeometry, Font } from 'three';
  
  export interface TextGeometryParameters {
    font: Font;
    size?: number;
    height?: number;
    curveSegments?: number;
    bevelEnabled?: boolean;
    bevelThickness?: number;
    bevelSize?: number;
    bevelOffset?: number;
    bevelSegments?: number;
  }
  
  export class TextGeometry extends BufferGeometry {
    constructor(text: string, parameters: TextGeometryParameters);
  }
}

declare module 'three/examples/jsm/loaders/FontLoader' {
  import { Loader, Font } from 'three';
  
  export class FontLoader extends Loader {
    constructor(manager?: import('three').LoadingManager);
    load(
      url: string,
      onLoad?: (font: Font) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (err: unknown) => void
    ): void;
    parse(json: any): Font;
  }
}
