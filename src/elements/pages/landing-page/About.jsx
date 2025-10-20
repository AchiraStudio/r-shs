import '../css/about.css'
function About() {
    return(
        <section className="about" id="about">
            <div className="floating-shape shape-1" />
                <div className="floating-shape shape-2" />
                <div className="floating-shape shape-3" />
            <div className="about-container">
                <div className="about-header">
                <h2 className="responsive-glitch" data-text="SMA Regina Pacis Bogor">
                    SMA Regina Pacis Bogor
                </h2>
                <div className="header-line" />
                </div>
                <div className="about-content">
                    <div className="glass-card vision-card">
                        <div className="card-corner" />
                        <div className="card-content">
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24">
                            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z M13,7h-2v6h2V7z M13,15h-2v2h2V15z" />
                            </svg>
                        </div>
                        <h3 className="card-title">Visi</h3>
                        <p className="card-text">
                            Menjadi Sekolah Menengah Atas bereputasi akademik unggul untuk
                            menghasilkan lulusan yang berbudaya Indonesia dan berwawasan global
                            dengan berlandaskan semangat FMM: Belas Kasih, Rendah Hati,
                            Integritas, Damai, dan Kepemimpinan yang melayani.
                        </p>
                        </div>
                    </div>
                    <div className="glass-card mission-card">
                        <div className="card-corner" />
                        <div className="card-content">
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24">
                            <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8 S16.41,20,12,20z M11,7h2v2h-2V7z M11,11h2v6h-2V11z" />
                            </svg>
                        </div>
                        <h3 className="card-title">Misi</h3>
                        <ul className="mission-list">
                            <li>
                            <span className="mission-number">01</span> Menyelenggarakan proses
                            pendidikan sekolah menengah atas yang unggul agar peserta didik
                            memiliki kemampuan akademis yang berkualitas.
                            </li>
                            <li>
                            <span className="mission-number">02</span> Mengembangkan
                            aspek-aspek kepribadian peserta didik dengan pendidikan karakter
                            berlandaskan semangat FMM.
                            </li>
                            <li>
                            <span className="mission-number">03</span> Menyelenggarakan
                            pembelajaran yang berwawasan global dengan menggunakan media
                            pembelajaran berbasis teknologi informasi dan berkomunikasi dalam
                            bahasa Inggris.
                            </li>
                            <li>
                            <span className="mission-number">04</span> Membina bakat dan
                            keterampilan peserta didik di bidang non akademik dengan berbagai
                            program ekstrakurikuler, kecintaan pada lingkungan hidup, budaya
                            Indonesia, dan kemampuan berorganisasi.
                            </li>
                            <li>
                            <span className="mission-number">05</span> Membangun kerjasama
                            dengan pihak-pihak yang memperhatikan pengembangan pendidikan
                            sekolah lanjutan dan dunia industri.
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About