export type Product = {
  id: string;
  codSistema: string;
  codLocal: string;
  codigoBarra: string;
  clase: string;
  descripcion: string;
  marca: string;
  color: string;
  talla: string;
  unidadMedida: string;
  precioVenta: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  codSistema: string;
  codLocal: string;
  codigoBarra: string;
  clase: string;
  descripcion: string;
  marca: string;
  color: string;
  talla: string;
  unidadMedida: string;
  precioVenta: number;
};
