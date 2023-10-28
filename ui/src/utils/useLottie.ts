import { useEffect, useRef } from "react";
import Lottie from "lottie-web";

// @ts-ignore
export function useLottie(animationData, replay) {
  const container = useRef(null);
  useEffect(() => {
    const animation = Lottie.loadAnimation({
      // @ts-ignore
      container: container.current,
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
