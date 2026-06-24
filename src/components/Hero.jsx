import back from '../assets/back.png';

export default function Hero({ setPage }) {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <span className="blob blob-1"></span>
        <span className="blob blob-2"></span>
        <span className="blob blob-3"></span>
        <span className="blob blob-4"></span>
        <span className="blob blob-5"></span>
        <span className="blob blob-6"></span>
        <span className="blob blob-7"></span>
      </div>

      <div className="hero-container">
        <div className="hero-left">
          <div className="badge">Gratuit pour les pharmacies</div>
          
          <h1>
            Toutes les promotions laboratoires,
            <br />
            <span className="gradient-text handwriting">enfin au même endroit.</span>
          </h1>
          
          <p className="hero-description">
            Gagnez du temps et améliorez votre marge en consultant gratuitement les dernières offres à destination des officines, sans chercher dans vos emails, puis contactez directement les laboratoires.
          </p>
          
          <div className="hero-proofs">
            <div className="proof-item">
              <span className="proof-icon">✓</span>
              <span>Offres centralisées</span>
            </div>
            <div className="proof-item">
              <span className="proof-icon">✓</span>
              <span>Accès rapide</span>
            </div>
            <div className="proof-item">
              <span className="proof-icon">✓</span>
              <span>Sans inscription</span>
            </div>
          </div>
        </div>
        
        <div className="hero-right">
          <img 
            src={back} 
            alt="PharmaPromo dashboard showing promotions" 
            className="hero-image"
          />
        </div>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');

        .hero {
          padding: 80px 24px;
          background: #F7FAFF;
          min-height: 600px;
          display: flex;
          align-items: center;
          overflow: hidden;
          position: relative;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(2px);
          opacity: 0.55;
          will-change: transform;
        }

        .blob-1 {
          width: 340px;
          height: 340px;
          top: -80px;
          left: 6%;
          background: radial-gradient(circle at 35% 35%, rgba(135, 206, 235, 0.55), rgba(135, 206, 235, 0) 70%);
          animation: float-a 19s ease-in-out infinite;
        }

        .blob-2 {
          width: 260px;
          height: 260px;
          top: 55%;
          left: 2%;
          background: radial-gradient(circle at 35% 35%, rgba(36, 184, 169, 0.45), rgba(36, 184, 169, 0) 70%);
          animation: float-b 22s ease-in-out infinite;
        }

        .blob-3 {
          width: 300px;
          height: 300px;
          top: -60px;
          right: 12%;
          background: radial-gradient(circle at 35% 35%, rgba(94, 234, 196, 0.4), rgba(94, 234, 196, 0) 70%);
          animation: float-c 17s ease-in-out infinite;
        }

        .blob-4 {
          width: 220px;
          height: 220px;
          bottom: -60px;
          right: 8%;
          background: radial-gradient(circle at 35% 35%, rgba(125, 211, 252, 0.5), rgba(125, 211, 252, 0) 70%);
          animation: float-d 20s ease-in-out infinite;
        }

        .blob-5 {
          width: 140px;
          height: 140px;
          top: 20%;
          left: 35%;
          background: radial-gradient(circle at 35% 35%, rgba(255, 95, 143, 0.2), rgba(255, 95, 143, 0) 70%);
          animation: float-e 15s ease-in-out infinite;
          opacity: 0.3;
        }

        .blob-6 {
          width: 100px;
          height: 100px;
          bottom: 25%;
          right: 35%;
          background: radial-gradient(circle at 35% 35%, rgba(11, 69, 217, 0.15), rgba(11, 69, 217, 0) 70%);
          animation: float-f 18s ease-in-out infinite;
          opacity: 0.25;
        }

        .blob-7 {
          width: 80px;
          height: 80px;
          top: 45%;
          right: 5%;
          background: radial-gradient(circle at 35% 35%, rgba(36, 184, 169, 0.2), rgba(36, 184, 169, 0) 70%);
          animation: float-g 14s ease-in-out infinite;
          opacity: 0.2;
        }

        @keyframes float-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(35px, 40px) scale(1.08); }
        }

        @keyframes float-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -35px) scale(1.06); }
        }

        @keyframes float-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-38px, 28px) scale(0.94); }
        }

        @keyframes float-d {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(28px, -32px) scale(1.09); }
        }

        @keyframes float-e {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -25px) scale(1.12); }
        }

        @keyframes float-f {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-18px, 22px) scale(0.92); }
        }

        @keyframes float-g {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -20px) scale(1.15); }
        }

        @media (prefers-reduced-motion: reduce) {
          .blob {
            animation: none !important;
          }
        }
        
        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 45% 55%;
          gap: 60px;
          align-items: center;
          width: 100%;
          position: relative;
          z-index: 1;
        }
        
        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .badge {
          display: inline-block;
          background: rgba(36, 184, 169, 0.12);
          color: #24B8A9;
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3px;
          width: fit-content;
        }
        
        h1 {
          font-size: 52px;
          line-height: 1.12;
          color: #061B5B;
          margin: 0;
          font-weight: 700;
        }
        
        .handwriting {
          font-family: 'Caveat', cursive;
          font-weight: 700;
          font-size: 56px;
          letter-spacing: -0.01em;
          background: linear-gradient(135deg, #24B8A9 0%, #0B45D9 50%, #FF5F8F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          line-height: 1.15;
          margin-top: 4px;
        }
        
        .hero-description {
          font-size: 18px;
          line-height: 1.7;
          color: #667399;
          margin: 0;
          max-width: 700px;
        }
        
        .hero-proofs {
          display: flex;
          gap: 32px;
          margin-top: 8px;
          padding-top: 24px;
          border-top: 1px solid #E4EAF7;
        }
        
        .proof-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #07194A;
          font-size: 15px;
          font-weight: 500;
        }
        
        .proof-icon {
          font-size: 18px;
          color: #24B8A9;
          font-weight: 700;
        }
        
        .hero-right {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        
        .hero-image {
          width: 100%;
          height: auto;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(11, 69, 217, 0.12);
          transition: transform 0.3s ease;
          transform: scale(1.05);
          max-width: 100%;
          object-fit: contain;
        }
        
        .hero-image:hover {
          transform: scale(1.07);
        }
        
        @media (max-width: 1024px) {
          .hero-container {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          
          .hero-left {
            order: 1;
          }
          
          .hero-right {
            order: 2;
          }
          
          h1 {
            font-size: 42px;
          }

          .handwriting {
            font-size: 46px;
          }
          
          .hero-description {
            font-size: 17px;
          }
          
          .hero-image {
            transform: scale(1);
            max-width: 600px;
          }
          
          .hero-image:hover {
            transform: scale(1.02);
          }

          .blob-1 {
            width: 240px;
            height: 240px;
          }
          .blob-2 {
            width: 180px;
            height: 180px;
          }
          .blob-3 {
            width: 200px;
            height: 200px;
          }
          .blob-4 {
            width: 160px;
            height: 160px;
          }
          .blob-5 {
            width: 100px;
            height: 100px;
          }
          .blob-6 {
            width: 80px;
            height: 80px;
          }
          .blob-7 {
            width: 60px;
            height: 60px;
          }
        }
        
        @media (max-width: 640px) {
          .hero {
            padding: 48px 20px;
            min-height: auto;
          }
          
          h1 {
            font-size: 32px;
          }

          .handwriting {
            font-size: 34px;
          }
          
          .hero-description {
            font-size: 16px;
            line-height: 1.6;
          }
          
          .hero-proofs {
            flex-direction: column;
            gap: 12px;
          }
          
          .hero-image {
            max-width: 100%;
            border-radius: 16px;
          }

          .blob-1 {
            width: 160px;
            height: 160px;
          }
          .blob-2 {
            width: 120px;
            height: 120px;
          }
          .blob-3 {
            width: 140px;
            height: 140px;
          }
          .blob-4 {
            width: 100px;
            height: 100px;
          }
          .blob-5 {
            width: 70px;
            height: 70px;
          }
          .blob-6 {
            width: 60px;
            height: 60px;
          }
          .blob-7 {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </section>
  );
}