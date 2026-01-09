import { ReactQueryProvider } from "@/providers/react-query-provider";
import Home from "@/pages/Home";
import { AuthProvider } from "@/providers/auth-provider";

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;
