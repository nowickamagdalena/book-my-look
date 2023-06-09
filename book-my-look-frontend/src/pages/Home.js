import heroImage from '../images/hero-image.jpg';
import service1 from '../images/service-1.jpg';
import service2 from '../images/service-2.jpg';
import service3 from '../images/service-3.jpg';
import service4 from '../images/service-4.jpg';
import service5 from '../images/service-5.jpg';
import service6 from '../images/service-6.jpg';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home">
            <div className="hero">
                <img src={heroImage} alt="Beauty Salon" />
                <div className="hero-content">
                    <h2>Welcome to Our Beauty Salon</h2>
                    <p>Discover a world of beauty and relaxation</p>
                </div>
            </div>
            <section className="services" id="services">
                <h2>Our Services</h2>
                <div className="services-grid">
                    <div className="service">
                        <img src={service1} alt="Facial" />
                        <h3>Facial</h3>
                        <div className="service-buttons">
                            <Link to="/book-visit">
                                <button className="btn-pink">Book Visit</button>
                            </Link>
                            <Link to="/full-offer">
                                <button className="btn-pink">See Full Offer</button>
                            </Link>
                        </div>
                    </div>
                    <div className="service">
                        <img src={service2} alt="Massage" />
                        <h3>Massage</h3>
                        <div className="service-buttons">
                            <Link to="/book-visit">
                                <button className="btn-pink">Book Visit</button>
                            </Link>
                            <Link to="/full-offer">
                                <button className="btn-pink">See Full Offer</button>
                            </Link>
                        </div>
                    </div>
                    <div className="service">
                        <img src={service3} alt="Manicure" />
                        <h3>Manicure</h3>
                        <div className="service-buttons">
                            <Link to="/book-visit">
                                <button className="btn-pink">Book Visit</button>
                            </Link>
                            <Link to="/full-offer">
                                <button className="btn-pink">See Full Offer</button>
                            </Link>
                        </div>
                    </div>
                    <div className="service">
                        <img src={service4} alt="Henna" />
                        <h3>Henna</h3>
                        <div className="service-buttons">
                            <Link to="/book-visit">
                                <button className="btn-pink">Book Visit</button>
                            </Link>
                            <Link to="/full-offer">
                                <button className="btn-pink">See Full Offer</button>
                            </Link>
                        </div>
                    </div>
                    <div className="service">
                        <img src={service5} alt="Manicure" />
                        <h3>Manicure</h3>
                        <div className="service-buttons">
                            <Link to="/book-visit">
                                <button className="btn-pink">Book Visit</button>
                            </Link>
                            <Link to="/full-offer">
                                <button className="btn-pink">See Full Offer</button>
                            </Link>
                        </div>
                    </div>
                    <div className="service">
                        <img src={service6} alt="Botox" />
                        <h3>Botox</h3>
                        <div className="service-buttons">
                            <Link to="/book-visit">
                                <button className="btn-pink">Book Visit</button>
                            </Link>
                            <Link to="/full-offer">
                                <button className="btn-pink">See Full Offer</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;