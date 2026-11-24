import { PublicHeader, PublicFooter } from "@/components/public-chrome";
import { PublicFrame } from "@/components/public/public-frame";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicFrame header={<PublicHeader />} footer={<PublicFooter />}>{children}</PublicFrame>;
}
