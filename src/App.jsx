import { ReactQueryProvider } from "@/providers/react-query-provider";
import Home from "@/pages/Home";

// TODO: Implement Login Auth Flow, Auth Guard

function App() {
  return (
    <ReactQueryProvider>
      <Home />
    </ReactQueryProvider>
  );
}

export default App;
