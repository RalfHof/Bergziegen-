import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

export default function MainLayout({ children }) {
    return (
        <html>
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}