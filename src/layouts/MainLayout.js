import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <div> {/* Umgebendes div ist wichtig */}
      <Header />
      <main style={{ padding: '20px' }}>{children}</main> {/* Padding für den Inhalt */}
      <Footer />
    </div>
  );
}
