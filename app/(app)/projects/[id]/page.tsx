import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground">
        {project.projectName}
      </h1>

      <p className="mt-2 text-sm text-muted">{project.description}</p>
    </div>
  );
}
