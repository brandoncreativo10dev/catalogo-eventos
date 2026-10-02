import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { mensaje } = await request.json();

    if (!mensaje) {
      return NextResponse.json({ error: 'El mensaje es requerido' }, { status: 400 });
    }

    // 1. Obtener la lista de eventos activos desde Supabase para nutrir el contexto de la IA
    const { data: eventos, error: dbError } = await supabase
      .from('eventos')
      .select('titulo, slug, categoria, descripcion_corta, precio_base, capacidad_min, capacidad_max')
      .eq('activo', true);

    if (dbError) {
      console.error('Error al consultar Supabase:', dbError);
    }

    // 2. Formatear la lista de paquetes disponibles para el prompt
    const listaEventos = eventos || [];
    const catalogoTexto = listaEventos.length > 0
      ? listaEventos.map((e) => 
          `- ${e.titulo} (Categoría: ${e.categoria}, Precio desde: $${e.precio_base} MXN, Capacidad: ${e.capacidad_min}-${e.capacidad_max} personas, Slug: /eventos/${e.slug}): ${e.descripcion_corta}`
        ).join('\n')
      : 'No hay paquetes activos en el catálogo en este momento.';

    const promptSistema = `
Eres el asistente virtual experto de "EventosPro", una plataforma de eventos Dark Premium.
Tu objetivo es recomendar de forma entusiasta, profesional, amable y breve el paquete más adecuado del catálogo según la solicitud del usuario.

Catálogo de paquetes disponibles actualmente:
${catalogoTexto}

Instrucciones para tus respuestas:
1. Responde de manera concisa (máximo 2 a 3 oraciones).
2. Recomienda el paquete (o paquetes) que mejor se adecue a la cantidad de personas, tipo de evento o presupuesto indicado por el cliente.
3. Resalta el nombre del paquete en **negritas**.
4. Si no encuentras un paquete exacto, sugiere el más cercano amablemente.
    `;

    const apiKey = process.env.GEMINI_API_KEY;

    // 3. Respuesta de respaldo si aún no se ha configurado la API Key
    if (!apiKey) {
      const mensajeLower = mensaje.toLowerCase();
      let recomendado = listaEventos[0] || { titulo: 'Paquete Especial', capacidad_min: 50, capacidad_max: 200, precio_base: 20000 };

      if (mensajeLower.includes('boda') || mensajeLower.includes('casament')) {
        recomendado = listaEventos.find(e => e.categoria.toLowerCase().includes('boda')) || recomendado;
      } else if (mensajeLower.includes('gradua') || mensajeLower.includes('escuela')) {
        recomendado = listaEventos.find(e => e.categoria.toLowerCase().includes('gradua')) || recomendado;
      } else if (mensajeLower.includes('empresa') || mensajeLower.includes('corpora')) {
        recomendado = listaEventos.find(e => e.categoria.toLowerCase().includes('empresa')) || recomendado;
      }

      return NextResponse.json({
        respuesta: `¡Hola! Con gusto te ayudo. Basado en lo que buscas, te sugiero el paquete **${recomendado.titulo}** (ideal para ${recomendado.capacidad_min}-${recomendado.capacidad_max} personas con precio desde $${Number(recomendado.precio_base).toLocaleString('es-MX')} MXN).`
      });
    }

    // 4. Petición a la API de Google Gemini (Flash 1.5/2.0)
  const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
      {
          role: 'user',
          parts: [{ text: `${promptSistema}\n\nPregunta del cliente: ${mensaje}` }]
     }
         ]
       })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Error desde la API de Gemini:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Error al comunicarse con Gemini' },
        { status: response.status }
      );
    }

    const respuestaTexto = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo obtener una recomendación en este momento.';

    return NextResponse.json({ respuesta: respuestaTexto });

  } catch (error: any) {
    console.error('Error interno en /api/chat-ia:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}