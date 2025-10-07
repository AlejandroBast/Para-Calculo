// Tipos mínimos para el paquete 'vaul' usado por Drawer
declare module 'vaul' {
  import * as React from 'react'

  export const Drawer: {
    Root: React.FC<any>
    Trigger: React.FC<any>
    Portal: React.FC<any>
    Close: React.FC<any>
    Overlay: React.FC<any>
    Content: React.FC<any>
    Title: React.FC<any>
    Description: React.FC<any>
  }

  export default Drawer
}
