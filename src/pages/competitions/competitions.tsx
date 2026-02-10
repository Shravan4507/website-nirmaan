import ChromaGrid from '../../components/chroma-grid/ChromaGrid'
import { COMPETITIONS_DATA } from '../../data/competitions'
import './competitions.css'

function Competitions() {
    const flagshipCompetitions = COMPETITIONS_DATA.filter(item => item.isFlagship);
    const regularCompetitions = COMPETITIONS_DATA.filter(item => !item.isFlagship && !item.isExhibition);
    const exhibitionItems = COMPETITIONS_DATA.filter(item => item.isExhibition);

    return (
        <main className="competitions-page">
            <header className="competitions-header">
                <div className="header-glow"></div>
                <h1>Arena of Excellence</h1>
                <p>Push your limits, showcase your skills, and claim glory. Nirmaan '26 presents the most prestigious technical and gaming arena of the year.</p>
            </header>

            <section className="competition-section flagship-section">
                <div className="section-header">
                    <span className="section-label">Premier Events</span>
                    <h2>Flagship Competitions</h2>
                    <div className="section-desc">Combined Prize Pool of ₹2,00,000+</div>
                    <div className="section-line"></div>
                </div>
                <div className="competitions-container">
                    <ChromaGrid
                        items={flagshipCompetitions}
                        radius={400}
                        damping={0.5}
                        fadeOut={0.8}
                        columns={2}
                    />
                </div>
            </section>

            <section className="competition-section arena-section">
                <div className="section-header">
                    <span className="section-label">The Main Event Arena</span>
                    <h2>Technical & Combat Challenges</h2>
                    <div className="section-desc">Combined Prize Pool of ₹65,000+</div>
                    <div className="section-line"></div>
                </div>
                <div className="competitions-container">
                    <ChromaGrid
                        items={regularCompetitions}
                        radius={400}
                        damping={0.5}
                        fadeOut={0.8}
                        columns={3}
                    />
                </div>
            </section>

            <section className="competition-section branding-section">
                <div className="section-header">
                    <span className="section-label">Innovation Showcase</span>
                    <h2>Exhibitions & Branding</h2>
                    <div className="section-desc">Non-competitive creative showcases</div>
                    <div className="section-line"></div>
                </div>
                <div className="competitions-container">
                    <ChromaGrid
                        items={exhibitionItems}
                        radius={400}
                        damping={0.5}
                        fadeOut={0.8}
                        columns={1}
                    />
                </div>
            </section>
        </main>
    )
}

export default Competitions
