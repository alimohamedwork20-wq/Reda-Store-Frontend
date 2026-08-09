import React, { useEffect } from "react";
import "./About.css";
import PageTransition from "../../Components/Helper/PageTransition";
import Footer from "../../Components/Footer/Footer";

export default function About() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          } else {
            entry.target.classList.remove("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <PageTransition>
      <div className="about-modern-container">
        {/* 1. PREMIUM HERO SECTION */}
        <header
          className="brand-hero"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7)), url(${process.env.PUBLIC_URL}/img/pexels-siljeao-264851155-35560482.jpg)`,
          }}
        >
          <div className="hero-blur-glow"></div>
          <div className="hero-inner-content">
            <span className="brand-badge">تعرّف علينا</span>
            <h1>
              نعيد تعريف تجربة <br />
              <span>التسوق الرقمي</span>
            </h1>
            <p>
              منصة ذكية متكاملة، جُمعت بأحدث التقنيات لتمنحك رحلة تسوق آمنة،
              فائقة السرعة، وتلبي أدق تطلعاتك.
            </p>
            <div className="hero-stats-strip">
              <div className="strip-item">
                <strong>+10K</strong>
                <span>عميل نشط</span>
              </div>
              <div className="strip-divider"></div>
              <div className="strip-item">
                <strong>+5K</strong>
                <span>منتج أصلي</span>
              </div>
              <div className="strip-divider"></div>
              <div className="strip-item">
                <strong>99%</strong>
                <span>نسبة الرضا</span>
              </div>
            </div>
          </div>
        </header>

        {/* 2. OUR STORY & PHILOSOPHY */}
        <section className="story-philosophy-section reveal-on-scroll">
          <div className="story-grid">
            <div className="story-meta">
              <h2 className="section-subtitle-neon">
                Our Story and Philosophy
              </h2>
              <h3 style={{ color: "#217de6da" }}>
                نحن لا نبيع المنتجات، <br />
                بل نصنع تجربة موثوقة.
              </h3>
            </div>
            <div className="story-text-block">
              <p>
                بدأت فكرتنا من فجوة واضحة في السوق العربي: المستهلك يستحق تجربة
                تسوق تخلو من التعقيد، الشحن البطيء، أو المنتجات غير المضمونة.
                لذلك قمنا ببناء هذه المنصة من الصفر لتكون الإجابة الذكية لكل هذه
                التحديات.
              </p>
              <p>
                رؤيتنا لا تتوقف عند حدود التجارة الإلكترونية التقليدية، بل نتحرك
                باستمرار نحو دمج حلول الذكاء الاصطناعي والتصفح الانسيابي لنجعل
                من كل نقرة على منصتنا رحلة ممتعة وآمنة تماماً.
              </p>
            </div>
          </div>
        </section>

        {/* 3. CORE VALUES (GLASSMORPHISM CARDS) */}
        <section className="core-values-section reveal-on-scroll">
          <div className="section-header-center">
            <h2 className="section-subtitle-neon">Key Pillars</h2>
            <h3 style={{ color: "#217de6da" }}>
              المبادئ التي تحرك فريقنا يومياً
            </h3>
          </div>

          <div className="values-cards-grid">
            <div className="value-glass-card">
              <div className="card-icon-box">
                <i className="fa-solid fa-arrows-down-to-people"></i>
              </div>
              <h4 style={{ color: "#217de6da" }}>Our Mission and Goal</h4>
              <p>
                تمكين المتسوق العربي وتوفير تجربة مستخدم سلسة وعادلة تناسب
                احتياجات الجميع دون استثناء.
              </p>
            </div>
            <div className="value-glass-card">
              <div className="card-icon-box">
                <i className="fa-solid fa-eye"></i>
              </div>
              <h4 style={{ color: "#217de6da" }}>Our Future Vision</h4>
              <p>
                أن نصبح الواجهة التكنولوجية الأولى والمنصة الأكثر ابتكاراً
                وموثوقية في الشرق الأوسط.
              </p>
            </div>
            <div className="value-glass-card">
              <div className="card-icon-box">
                <i className="fa-solid fa-users"></i>
              </div>
              <h4 style={{ color: "#217de6da" }}>One-team spirit</h4>
              <p>
                نعمل ببيئة مرنة ومبدعة، حيث يتحول شغف المطورين والمهندسين إلى
                كود ومميزات تخدمك.
              </p>
            </div>
          </div>
        </section>

        {/* 4. PREMIUM FEATURES GRID */}
        <section className="premium-features-section reveal-on-scroll">
          <div className="section-header-center">
            <h2 className="section-subtitle-neon">What sets us apart</h2>
            <h3 style={{ color: "#217de6da" }}>لماذا يختارنا الآلاف؟</h3>
          </div>

          <div className="modern-features-grid">
            <div className="m-feature-card">
              <i className="fa-solid fa-file-shield"></i>
              <h5>Protection and absolute security</h5>
              <p>تشفير كامل لبياناتك وحلول دفع إلكتروني بمعايير أمان عالمية.</p>
            </div>
            <div className="m-feature-card">
              <i className="fa-solid fa-bolt"></i>
              <h5>Ultra-fast performance</h5>
              <p>
                تصفح ذكي وسريع بدون أي وقت انتظار بفضل بنيتنا البرمجية الحديثة.
              </p>
            </div>
            <div className="m-feature-card">
              <i className="fa-solid fa-truck-fast"></i>
              <h5>Smart Logistics</h5>
              <p>نظام شحن متطور يتتبع طلبك خطوة بخطوة ويصلك في وقت قياسي.</p>
            </div>
            <div className="m-feature-card">
              <i className="fa-solid fa-headset"></i>
              <h5>Real Technical Support</h5>
              <p>فريق كامل في خدمتك على مدار الساعة لحل أي مشكلة فوراً.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer></Footer>
    </PageTransition>
  );
}
