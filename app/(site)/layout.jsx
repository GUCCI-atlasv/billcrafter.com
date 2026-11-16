import RootShell, { sharedMetadata, sharedViewport } from "@/components/RootShell";

export const metadata = sharedMetadata;
export const viewport = sharedViewport;

export default function SiteLayout({ children }) {
  return <RootShell lang="en">{children}</RootShell>;
}
