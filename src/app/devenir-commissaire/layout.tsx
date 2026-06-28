import AssistantWidget from "@/components/assistant/AssistantWidget";

export default function ApprendreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AssistantWidget />
    </>
  );
}
