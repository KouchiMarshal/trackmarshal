import PublicFooter from "@/components/layout/public-footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PublicFooter />
    </>
  );
}
