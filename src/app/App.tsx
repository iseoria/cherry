import { Outlet, Link } from "react-router-dom";
export default function App() {
  return (
    <div style={{maxWidth:960, margin:"0 auto", padding:16}}>
      <header style={{display:"flex", gap:8}}>
        <strong>Baby Monitor</strong>
        <nav style={{display:"flex", gap:8}}>
          <Link to="/">Home</Link>
          <Link to="/nope">404</Link>
        </nav>
      </header>
      <main style={{marginTop:16}}><Outlet /></main>
    </div>
  );
}
