import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";

import ThemeProvider from "./theme/ThemeProvider";
import "./theme/themeStyles.css";


export const metadata = {
  title: "BookStore",
  description: "Modern Ecommerce Book Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Providers>
            <Header />

            {children}

            <Footer />

            <ToastContainer position="top-right" />
          </Providers>
        </ThemeProvider>

      </body>
    </html>
  );
}