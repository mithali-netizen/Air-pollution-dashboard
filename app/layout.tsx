
// --- Removed metadata and viewport exports ---
// export const metadata: Metadata = { ... };
// export const viewport: Viewport = { ... };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footerVisible, setFooterVisible] = useState(false);

  // Trigger footer, PWAInstall & Analytics fade-in + slide-up after mount
  useEffect(() => {
    const timer = setTimeout(() => setFooterVisible(true), 100); // small delay
    return () => clearTimeout(timer);
  }, []);

  const animationClasses = footerVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-6";

  return (
    <html lang="en" className="dark">

      </body>
    </html>
  );
}
