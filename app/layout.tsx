import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Youth Empowerment Platform",
  description: "Community empowerment, contributions, projects and MLM system",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}