import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  getPublicStorageUrl,
  getSupabaseAdmin,
  isSupabaseConfigured,
  PRODUCT_IMAGES_BUCKET,
} from "@/lib/supabase/admin";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Solo se permiten imágenes" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La imagen no puede superar 5 MB" },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { error: "Formato de imagen no soportado" },
        { status: 400 }
      );
    }

    const filename = `${uuidv4()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.storage
        .from(PRODUCT_IMAGES_BUCKET)
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ url: getPublicStorageUrl(filename) });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch {
    return NextResponse.json(
      { error: "Error al subir la imagen" },
      { status: 500 }
    );
  }
}
