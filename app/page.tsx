"use client";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./context/AuthContext";
import CardBentoAll from "./components/CardsBentoAll";

export default function Home() {
  return (
    <AuthProvider>
      <main className="bg-blk1">
        <NavBar />
        <section className="bg-blk1 w-screen h-screen flex items-center justify-center pt-24 pb-24">
          <CardBentoAll collectionName="all" homePage={true} />
        </section>
      </main>
    </AuthProvider>
  );
}
