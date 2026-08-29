export type Gender = "Hombre" | "Mujer" | "Unisex";

export type Product = {
  id: string;
  year: string;
  description: string;
  gender: Gender;
  size: string;
  barcode: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  year: string;
  description: string;
  gender: Gender;
  size: string;
  imageUrl?: string | null;
};
