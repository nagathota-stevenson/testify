import CardBento from "./components/CardsBento";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./context/AuthContext";
import { NotificationsProvider } from "./context/NotificationContext";

export default function Home() {
  return (
    <AuthProvider>
      <main className="bg-blk1">
        <section className="bg-blk1 w-screen h-screen flex items-center justify-center pt-24 pb-24">
          <CardBento
            filterByType="all"
            filterByUserId=""
            homePage={true}
            filterByCurrentUser={false}
          />
        </section>
      </main>
    </AuthProvider>
  );
}
