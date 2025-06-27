import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messenger | Chat-TFU",
  description: "Secure chat and P2P audio and video calls, all open-source.",
};

export default function MessengerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="w-full h-full">
      {children}
    </section>
  );
}
