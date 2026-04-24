import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "@/app/providers";
import { AppRoutes } from "@/app/routes";

const App = () => (
  <Providers>
    <BrowserRouter>
      <AppRoutes />
      <Analytics />
    </BrowserRouter>
  </Providers>
);

export default App;
