export type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  precio: string;
  cantidad: number;
  vendidos: number;
  imagen: string;
};

const productosBase = [
  { id: '#0001', nombre: 'hojas', categoria: 'papel', precio: '$ 1,241', cantidad: 50, vendidos: 320 },
  { id: '#0002', nombre: 'cuaderno', categoria: 'papel', precio: '$ 850', cantidad: 30, vendidos: 290 },
  { id: '#0003', nombre: 'lapiz', categoria: 'escritura', precio: '$ 120', cantidad: 120, vendidos: 210 },
  { id: '#0004', nombre: 'carpeta', categoria: 'oficina', precio: '$ 320', cantidad: 45, vendidos: 250 },
  { id: '#0005', nombre: 'resaltador', categoria: 'escritura', precio: '$ 95', cantidad: 80, vendidos: 240 },
  { id: '#0006', nombre: 'pegamento', categoria: 'oficina', precio: '$ 60', cantidad: 22, vendidos: 275 },
  { id: '#0007', nombre: 'grapadora', categoria: 'oficina', precio: '$ 210', cantidad: 18, vendidos: 260 },
  { id: '#0008', nombre: 'tijeras', categoria: 'oficina', precio: '$ 145', cantidad: 26, vendidos: 245 },
  { id: '#0009', nombre: 'regla', categoria: 'escritura', precio: '$ 55', cantidad: 60, vendidos: 190 },
  { id: '#0010', nombre: 'block', categoria: 'papel', precio: '$ 240', cantidad: 40, vendidos: 180 },
  { id: '#0011', nombre: 'marcador', categoria: 'escritura', precio: '$ 110', cantidad: 75, vendidos: 205 },
  { id: '#0012', nombre: 'sobre', categoria: 'papel', precio: '$ 30', cantidad: 150, vendidos: 140 },
  { id: '#0013', nombre: 'archivador', categoria: 'oficina', precio: '$ 390', cantidad: 14, vendidos: 280 },
  { id: '#0014', nombre: 'perforadora', categoria: 'oficina', precio: '$ 275', cantidad: 12, vendidos: 300 },
  { id: '#0015', nombre: 'nota adhesiva', categoria: 'papel', precio: '$ 75', cantidad: 90, vendidos: 170 },
  { id: '#0016', nombre: 'corrector', categoria: 'escritura', precio: '$ 88', cantidad: 48, vendidos: 195 },
  { id: '#0017', nombre: 'clip', categoria: 'oficina', precio: '$ 25', cantidad: 300, vendidos: 110 },
  { id: '#0018', nombre: 'goma', categoria: 'escritura', precio: '$ 40', cantidad: 100, vendidos: 160 },
  { id: '#0019', nombre: 'cinta', categoria: 'oficina', precio: '$ 130', cantidad: 34, vendidos: 230 },
  { id: '#0020', nombre: 'portaminas', categoria: 'escritura', precio: '$ 180', cantidad: 24, vendidos: 255 },
];

export const productosIniciales: Producto[] = productosBase.map((producto) => ({
  ...producto,
  imagen: `https://picsum.photos/seed/${producto.id.replace('#', '')}/120/80`,
}));
