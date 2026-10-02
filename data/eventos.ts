// ============================================================================
// ARCHIVO DE DATOS DE EVENTOS (data/eventos.ts)
// ============================================================================

export interface Evento {
  id: number;
  titulo: string;
  categoria: string;
  capacidad: string;
  precio: string;
  descripcion: string;
  imagen: string;
}

export const EVENTOS: Evento[] = [
  {
    id: 1,
    titulo: "Boda de Lujo en Jardín",
    categoria: "Bodas",
    capacidad: "200 personas",
    precio: "$45,000 MXN",
    descripcion: "Servicio integral con banquete de 3 tiempos, iluminación arquitectónica y pista de cristal.",
    imagen: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    titulo: "Convención Anual Corporativa",
    categoria: "Empresariales",
    capacidad: "500 personas",
    precio: "$85,000 MXN",
    descripcion: "Pantallas LED gigantes, audio profesional, catering continuo y registro digital.",
    imagen: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    titulo: "Gala de Graduación",
    categoria: "Graduaciones",
    capacidad: "350 personas",
    precio: "$60,000 MXN",
    descripcion: "DJ en vivo, photobooth 360°, cena gourmet y decoración temática.",
    imagen: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
  },
];