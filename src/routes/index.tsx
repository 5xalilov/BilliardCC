import { createFileRoute } from "@tanstack/react-router";
import { ClubApp } from "@/components/club/app";

export const Route = createFileRoute("/")({
  ssr: false,
  component: ClubApp,
});
