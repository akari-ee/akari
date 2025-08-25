import { useEffect } from "react";

const useServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
            }
          );
          console.log("Service worker registered: ", registration);

          await navigator.serviceWorker.ready;
          console.log("Service worker is ready");

          await registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                  console.log("New service worker installed!");
                  // TODO: 기존 캐시 제거 등 후처리
                }
              });
            }
          });
        } catch (error) {
          console.error("Service worker registration failed: ", error);
        }
      };

      registerServiceWorker();
    }
  }, []);
};

export { useServiceWorker as initServiceWorker };
