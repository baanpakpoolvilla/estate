import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getProjectPromos, getContactSettings } from "@/lib/data";
import { isExternalImage } from "@/lib/image-utils";

export const metadata: Metadata = {
  title: "โครงการพูลวิลล่าหรู และโครงการใหม่",
  description:
    "โครงการพูลวิลล่าหรูและโครงการใหม่ที่คัดสรรสำหรับนักลงทุน โดย ท๊อปฟอร์ม อสังหาริมทรัพย์",
  openGraph: {
    title: "โครงการพูลวิลล่าหรู และโครงการใหม่ | ท๊อปฟอร์ม อสังหาริมทรัพย์",
    description:
      "โครงการพูลวิลล่าหรูและโครงการใหม่ที่คัดสรรสำหรับนักลงทุน",
  },
  alternates: { canonical: "/projects" },
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjectPromos>> = [];
  let contact: Awaited<ReturnType<typeof getContactSettings>> = null;
  try {
    [projects, contact] = await Promise.all([
      getProjectPromos(),
      getContactSettings(),
    ]);
  } catch {
    // DB error
  }

  const tel = contact?.phone?.replace(/\D/g, "") || "0812345678";

  return (
    <div className="w-full min-w-0">
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h1 className="font-bold text-xl sm:text-2xl md:text-3xl text-navy">
          โครงการพูลวิลล่าหรู และโครงการใหม่
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          โครงการที่เราคัดสรรสำหรับนักลงทุน เข้าถึงได้ผ่านเราเท่านั้น
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">ยังไม่มีโครงการในขณะนี้</p>
          <Link
            href="/villas"
            className="inline-block mt-4 px-6 py-3 rounded-xl bg-navy text-white font-medium text-sm hover:opacity-90"
          >
            ดูรายการพูลวิลล่าทั้งหมด
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:border-blue/20"
            >
              <div className="relative aspect-[21/10] bg-gradient-to-br from-navy via-blue/30 to-navy overflow-hidden">
                {project.imageUrl ? (
                  <Image src={project.imageUrl} alt={project.name} fill sizes="(max-width:640px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized={isExternalImage(project.imageUrl)} />
                ) : null}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue/40 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 text-white">
                  {project.badge && (
                    <span className="inline-block w-fit mb-2 px-2 py-1 rounded-lg bg-white/95 text-navy text-xs font-semibold">
                      {project.badge}
                    </span>
                  )}
                  <h2 className="font-bold text-lg md:text-xl text-white drop-shadow-sm">
                    {project.name}
                  </h2>
                  {project.tagline && (
                    <p className="text-white/90 text-sm mt-0.5">
                      {project.tagline}
                    </p>
                  )}
                  {project.location && (
                    <p className="text-white/80 text-xs mt-1">
                      {project.location}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-4 md:p-5 flex items-center justify-between">
                <p className="text-blue text-sm font-medium group-hover:underline">
                  ดูรายละเอียดโครงการ
                </p>
                <span className="text-blue text-sm">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA ติดต่อ */}
      <section className="mt-8 sm:mt-10 md:mt-12 bg-navy text-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8">
        <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-2">
          สนใจโครงการ?
        </h2>
        <p className="text-white/80 text-sm sm:text-base mb-4 sm:mb-5">
          ติดต่อทีมงานเพื่อรับข้อมูลเพิ่มเติม นัดชมโครงการ
          หรือปรึกษาเรื่องการลงทุน
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <a
            href={`tel:${tel}`}
            className="flex-1 flex items-center justify-center min-h-[48px] sm:min-h-[44px] py-3 text-center font-semibold rounded-xl bg-blue text-white active:opacity-90"
          >
            โทร {contact?.phone ?? "ติดต่อเรา"}
          </a>
          <Link
            href="/contact"
            className="flex-1 flex items-center justify-center min-h-[48px] sm:min-h-[44px] py-3 text-center font-semibold rounded-xl border border-white/50 text-white active:bg-white/10"
          >
            ช่องทางติดต่ออื่นๆ
          </Link>
        </div>
      </section>
    </div>
  );
}
