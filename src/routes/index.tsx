import { createFileRoute } from "@tanstack/react-router";
import { Flow } from "@/components/anniversary/Flow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Letter from Toad" },
      { name: "description", content: "A little letter, with a puzzle inside." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Flow />;
}
