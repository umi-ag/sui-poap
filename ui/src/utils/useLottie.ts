import { useEffect, useRef } from "react";
import Lottie from "lottie-web";

export function useLottie(animationData: any, replay: any) {
  const container = useRef(null);
  useEffect(() => {
    const animation = Lottie.loadAnimation({
      container: (container as any).current,
      renderer: "svg",
      loop: replay,
      autoplay: true,
      animationData: animationData,
    });

    return () => {
      animation.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { container };
}
