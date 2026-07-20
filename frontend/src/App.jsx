import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { userService } from "./features/customer/services/userService";

function App() {
  useEffect(() => {
    const init = async () => {
      try {
        await userService.createSession();
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);
  return <AppRoutes />;
}

export default App;
