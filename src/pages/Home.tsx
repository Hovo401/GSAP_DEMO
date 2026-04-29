import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const textToAnimate =
    "Мы создаем будущее веба, пиксель за пикселем. Внимание к деталям и плавность анимаций — наш приоритет.";

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Полная ширина всех слайдов
      const totalWidth = container.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxScroll = totalWidth - viewportWidth;

      gsap.to(container, {
        x: () => -maxScroll,
        ease: "none",
        scrollTrigger: {
          trigger: horizontalRef.current,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          start: "top top",
          end: () => `+=${maxScroll}`, // Теперь прокрутка идёт ровно на всю ширину контейнера
        },
      });
    },
    { scope: mainRef },
  );

  return (
    <>
      {/* Глобальный запрет горизонтального скролла */}
      <style>{`
        html, body {
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
      `}</style>
      <div ref={mainRef} className="bg-zinc-950 text-white overflow-x-hidden">
        <section className="h-screen flex items-center justify-center bg-zinc-900">
          <div className="text-center">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 italic uppercase">
              Creative <span className="text-red-600">Developer</span>
            </h1>
            <p className="text-2xl text-zinc-400 font-light">
              — скролль ниже для магии ↓
            </p>
          </div>
        </section>

        <section className="text-section min-h-[80vh] flex items-center justify-center px-6 py-20">
          <div className="max-w-5xl">
            <p className="text-3xl md:text-6xl font-bold leading-[1.1] tracking-tight">
              {textToAnimate.split("").map((char, i) => (
                <span key={i} className="char inline-block whitespace-pre">
                  {char}
                </span>
              ))}
            </p>
          </div>
        </section>

        <div ref={horizontalRef} className="h-screen overflow-hidden relative">
          <div
            ref={containerRef}
            className="flex h-screen w-max will-change-transform"
          >
            <div className="w-screen h-full shrink-0 flex items-center justify-center text-6xl md:text-9xl font-black bg-red-600 shadow-2xl">
              1 — ВЛЕВО
            </div>
            <div className="w-screen h-full shrink-0 flex items-center justify-center text-6xl md:text-9xl font-black bg-blue-700 shadow-2xl">
              2 — КРУТО
            </div>
            <div className="w-screen h-full shrink-0 flex items-center justify-center text-6xl md:text-9xl font-black bg-teal-600 shadow-2xl">
              3 — GSAP
            </div>
            <div className="w-screen h-full shrink-0 flex items-center justify-center text-6xl md:text-9xl font-black bg-orange-500 shadow-2xl">
              4 — ГОТОВО 🔥
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
