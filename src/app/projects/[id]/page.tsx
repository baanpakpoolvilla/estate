import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectDetail, getContactSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const project = await getProjectDetail(id);
    if (!project) return { title: "ไม่พบโครงการ" };
    return {
      title: `${project.name} | โครงการพูลวิลล่า`,
      description: project.tagline ?? project.description?.slice(0, 160) ?? "",
      openGraph: {
        title: project.name,
        description: project.tagline ?? "",
        images: project.imageUrl ? [project.imageUrl] : undefined,
      },
    };
  } catch {
    return { title: "โครงการพูลวิลล่า" };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  let project: Awaited<ReturnType<typeof getProjectDetail>> = null;
  let contact: Awaited<ReturnType<typeof getContactSettings>> = null;
  try {
    [project, contact] = await Promise.all([
      getProjectDetail(id),
      getContactSettings(),
    ]);
  } catch {
    // DB error
  }
  if (!project) notFound();

  const tel = contact?.phone?.replace(/\D/g, "") || "0812345678";

  return (
    <div className="w-full min-w-0">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/projects" className="hover:text-navy">
          โครงการทั้งหมด
        </Link>
        <span className="mx-2">/</span>
        <span className="text-navy font-medium">{project.name}</span>
      </nav>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-navy via-blue/30 to-navy aspect-[21/9] sm:aspect-[21/8]">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:p-8">
          {project.badge && (
            <span className="inline-block w-fit mb-2 px-3 py-1 rounded-lg bg-white/95 text-navy text-xs font-semibold">
              {project.badge}
            </span>
          )}
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-sm">
            {project.name}
          </h1>
          {project.tagline && (
            <p className="text-white/90 text-sm sm:text-base md:text-lg mt-1">
              {project.tagline}
            </p>
          )}
          {project.location && (
            <p className="text-white/70 text-xs sm:text-sm mt-1">
              {project.location}
            </p>
          )}
        </div>
      </div>

      {/* Highlights */}
      {project.highlights.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {project.highlights.map((h, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center"
            >
              <p className="text-gray-500 text-xs">{h.label}</p>
              <p className="text-navy font-bold text-lg sm:text-xl mt-1">
                {h.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Video */}
      {project.videoId && (
        <section className="mt-6 sm:mt-8">
          <h2 className="font-bold text-lg sm:text-xl text-navy mb-3">
            วิดีโอโครงการ
          </h2>
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-sm">
            <iframe
              src={`https://www.youtube.com/embed/${project.videoId}?rel=0`}
              title={`วิดีโอ ${project.name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </section>
      )}

      {/* Description */}
      {project.description && (
        <section className="mt-6 sm:mt-8">
          <h2 className="font-bold text-lg sm:text-xl text-navy mb-3">
            รายละเอียดโครงการ
          </h2>
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {project.description}
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="mt-6 sm:mt-8">
          <h2 className="font-bold text-lg sm:text-xl text-navy mb-3">
            ภาพโครงการ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {project.gallery.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm"
              >
                <img
                  src={img.imageUrl}
                  alt={img.label || `ภาพ ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {img.label && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/70 to-transparent p-3">
                    <p className="text-white text-xs sm:text-sm font-medium">
                      {img.label}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mt-8 sm:mt-10 bg-navy text-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
        <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-2">
          สนใจโครงการ {project.name}?
        </h2>
        <p className="text-white/80 text-sm sm:text-base mb-4">
          ติดต่อทีมงานเพื่อรับข้อมูลเพิ่มเติม นัดชมโครงการ
          หรือปรึกษาเรื่องการลงทุน
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <a
            href={`tel:${tel}`}
            className="flex-1 flex items-center justify-center min-h-[48px] py-3 text-center font-semibold rounded-xl bg-blue text-white active:opacity-90"
          >
            โทร {contact?.phone ?? "ติดต่อเรา"}
          </a>
          <Link
            href="/contact"
            className="flex-1 flex items-center justify-center min-h-[48px] py-3 text-center font-semibold rounded-xl border border-white/50 text-white active:bg-white/10"
          >
            ช่องทางติดต่ออื่นๆ
          </Link>
        </div>
      </section>
    </div>
  );
}
