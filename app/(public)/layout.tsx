import "../../styles/animate.css";
import "../../styles/LineIcons.css";
import "../../styles/tiny-slider.css";
import "../../styles/footer.css";
import "../../styles/main.css";
import Header from "../../components/common/header";
import NavBarSession from "../../components/index/nav-bar-session";
import Footer from "../../components/common/footer";
import FloatingButton from "../../components/common/floating-button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <NavBarSession />
      {children}
      <Footer />
      <FloatingButton />
    </>
  );
}
