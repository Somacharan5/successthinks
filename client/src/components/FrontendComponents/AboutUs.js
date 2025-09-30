import React, { Suspense } from 'react';
import Preloader from '../sharedComponents/Preloader';

const Footer = React.lazy(() => import('../sharedComponents/Footer'));
const Navbar = React.lazy(() => import('../sharedComponents/Navbar'));

export default function AboutUs() {
    return (
        <Suspense fallback={Preloader}>
            <>
                <Navbar />
                <section className="page-title-area" id="about-us-header">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-sm-12">
                                <img
                                    src="https://res.cloudinary.com/dtqrvcvp8/image/upload/v1675778460/mn5uosaehaeuphpu5zb4.jpg"
                                    id="contact-form-image"
                                    alt=""
                                />
                            </div>
                            <div className="col-lg-6 contact-us-page-title col-sm-12 mt-5">
                                <h2>About Us</h2>
                                <p>
                                    Here&apos;s our story
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="about-area pd-top-150">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-8  col-sm-12">
                                <div className="thumb">
                                    <img
                                        src="https://res.cloudinary.com/dtqrvcvp8/image/upload/v1675778612/ep6gngufebsihmpwqtim.jpg"
                                        alt="img"
                                        id="about-me-image"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 mt-lg-0 mt-4 align-self-center">
                                <div className="about-inner">
                                    <div className="section-title">
                                        <h2>Our Story</h2>
                                        <p>
                                            Successthinks is a dream For every Student who
                                            wants Have Better Lifestyle, Better Opportunities, Better Jobs
                                            better future With 99% Successrate in careers in this world
                                            of high failures &amp; competition.
                                            This story Started When Owner Himself Got Rejected From the world
                                            to have better Opportunities as a student just because he belonged
                                            from middle class family.
                                            Then Successthinks idea struck in his Head of creating Such a lifestyle of Abundance
                                            having multiple Successpath depending on Student choices.
                                            &amp; here it is, A Dream Infrastructure fore every Student Becoming reality &amp; Successfully
                                            changing students life from past several years.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="about-area pd-top-150">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 mt-lg-0 mt-4 align-self-center">
                                <div className="about-inner">
                                    <div className="section-title">
                                        <h2>Our Mission</h2>
                                        <p>Now, Our mission to impact all the students those unfortune students
                                            who are compromising their dreams just because of their family conditions
                                            or Not having good luck in competetive examinations.
                                            Creating Abundant lifestyle for indian students by educating, Inspiring &amp; empowering
                                            individuals to fulfill their dreams &amp; make them the best
                                            versions of themselves.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-8  col-sm-12">
                                <div className="thumb">
                                    <img
                                        src="https://res.cloudinary.com/dtqrvcvp8/image/upload/v1675778509/ggd9golftdmjfvhfekyh.jpg"
                                        alt="img"
                                        id="about-me-image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="about-area pd-top-150">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-8  col-sm-12">
                                <div className="thumb">
                                    <img
                                        src="https://res.cloudinary.com/dtqrvcvp8/image/upload/v1675778582/tdbihxo9j4t63xmuvndw.jpg"
                                        alt="img"
                                        id="about-me-image"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 mt-lg-0 mt-4 align-self-center">
                                <div className="about-inner">
                                    <div className="section-title">
                                        <h2>Our Vision</h2>
                                        <p>
                                            Our Vision is to see Indian students doing Miracles having No Success stoping barriers.
                                            just because a person belongs from middle class it dosent mean he cannot become billionaire
                                            or President of Brand.
                                            In Simple, Impacting all the middle class Students to upraise their lifestyle to become successful in their careers.

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="about-area pd-top-150">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 mt-lg-0 mt-4 align-self-center">
                                <div className="about-inner">
                                    <div className="section-title">
                                        <h2>Who is Soma Charan</h2>
                                        <p>
                                            Soma charan is Chairman of successthinks, Built Multi Million Businesess Across the globe &amp; being Impacting Thousands
                                            of students to Have better Lifestyle with more Abundance. Honored as Certified Coach On Business growth.

                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-8  col-sm-12">
                                <div className="thumb">
                                    <img
                                        src="https://res.cloudinary.com/dtqrvcvp8/image/upload/v1675774698/u5q2klzwiqyrspdrszzl.jpg"
                                        alt="img"
                                        id="about-me-image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        </Suspense>
    );
}
